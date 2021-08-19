const DateTime = luxon.DateTime;
const Time = new Date();

const habitList = document.getElementById("habit-list");
const dateElement = document.getElementById("date");
const dayElement = document.getElementById("day");
const targetElement = document.getElementById("target");

const windowElement = document.getElementById("window");
const addElement = document.getElementById("add-habit");

const titleInputElement = document.getElementById("title-input");
const descriptionInputElement = document.getElementById("description-input");
const frequencyInputElement = document.getElementById("frequency-input");
const weeklyInputElement = document.getElementById("weekly-input");

const allHabitsElement = document.getElementById("all-btn");

const date = DateTime.now().toFormat("MMM dd, yyyy");
dateElement.innerHTML = date;

const day = DateTime.now().toFormat("cccc");
dayElement.innerHTML = day;

const currentDay = Time.getDate();

let testday;

if (currentDay != localStorage.getItem("date")) {
	handleNewDay();
}

let habits;

habits =
	localStorage.getItem("habits") != null
		? JSON.parse(localStorage.getItem("habits"))
		: [];

function render() {
	renderHabits();
	renderTarget();
}

function saveHabits() {
	localStorage.setItem("habits", JSON.stringify(habits));
}

function handleNewDay() {
	localStorage.setItem("date", currentDay);

	for (let i = 0; i < habits.length; i++) {
		let habit = habits[i];
		habit.frequencyTally++;
		habit.completed = false;
		console.log(
			habit.title,
			":",
			habit.frequencyTally % habit.frequency,
			habit.frequencyTally % habit.frequency == 0
		);
	}

	if (testday < 7) {
		testday++;
	} else {
		testday = 1;
	}

	console.log("DAY:", testday);
	render();
	saveHabits();
}

function renderHabits() {
	habitList.innerHTML = "";

	// If showing all habits
	let displayAll = allHabitsElement.classList.contains("selected");

	if (displayAll) {
		for (let i = 0; i < habits.length; i++) {
			let habit = habits[i];
			habitList.innerHTML += `<div id="${habit.id}" class="habit ${
				habit.completed ? "checked" : ""
			}"><div ondblclick="removeHabit(this)" class="checkbox grow"></div><div class="title">${
				habit.title
			}</div></div>`;
		}
	} else {
		let dailyHabits = habits.filter(
			(habit) => habit.frequencyTally % habit.frequency == 0 && !habit.weekly
		);

		let weeklyHabits = habits.filter((habit) => habit.weekly);

		// render daily habbits
		for (let i = 0; i < dailyHabits.length; i++) {
			let habit = dailyHabits[i];

			habitList.innerHTML += `<div id="${habit.id}" class="habit ${
				habit.completed ? "checked" : ""
			}"><div ondblclick="removeHabit(this)" onclick="toggleHabit(this)" class="checkbox grow"></div><div class="title">${
				habit.title
			}</div></div>`;
		}

		// render weekly habbits
		for (let i = 0; i < weeklyHabits.length; i++) {
			let habit = weeklyHabits[i];
			let weekday = Time.getDay();

			if (testday == habit.frequency || weekday == habit.frequency) {
				habitList.innerHTML += `<div id="${habit.id}" class="habit ${
					habit.completed ? "checked" : ""
				}"><div ondblclick="removeHabit(this)" onclick="toggleHabit(this)" class="checkbox grow"></div><div class="title">${
					habit.title
				}</div></div>`;
			}
		}
	}
}

function renderTarget() {
	let habitNumber = habitList.children.length;
	let completedNumber = habits.filter(
		(habit) => habit.completed == true
	).length;

	targetElement.innerHTML = `${completedNumber}/${habitNumber}`;
}

function getHabitFromId(id) {
	return habits.filter((habit) => habit.id == id)[0];
}

function toggleHabit(e) {
	let parent = e.parentElement;
	let habit = getHabitFromId(parent.id);

	habit.completed = !habit.completed;
	parent.classList.toggle("checked");
	renderTarget();
	saveHabits();
}

function hideWindow() {
	windowElement.classList.add("hide");

	weeklyInputElement.value = false;
	titleInputElement.value = "";
	descriptionInputElement.value = "";
	frequencyInputElement.value = 1;
}

function showWindow() {
	windowElement.classList.remove("hide");
	titleInputElement.focus();
}

function addHabit() {
	let habit = {
		title: titleInputElement.value,
		weekly: weeklyInputElement.value == "true" ? true : false, // daily or weekly
		frequency: parseInt(frequencyInputElement.value), // every other day, third day, every day etc
		description: descriptionInputElement.value,
		completed: false, // completed for day, resets daily
		frequencyTally: 0, // every day increament by one
		id: Date.now(), // Date.now()
	};

	habits.push(habit);
	render();

	hideWindow();
	saveHabits();
}

function removeHabit(e) {
	let habitObject = getHabitFromId(e.parentElement.id);
	let index = habits.findIndex((habit) => habit.id == habitObject.id);
	habits.splice(index, 1);
	render();
	saveHabits();
}

document.getElementById("popup").addEventListener("keyup", (e) => {
	if (e.keyCode == 13 && titleInputElement.value.trim() != "") {
		addHabit();
	}
});

function toggleAll() {
	allHabitsElement.classList.toggle("selected");
	render();
}

window.onbeforeunload = saveHabits();

render();
