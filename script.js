// ========================================
// HABIT TRACKER
// Author: PIRKOJI VENKATESH
// ========================================


// LocalStorage key
const STORAGE_KEY = "habitTrackerData";


// Get HTML elements
const habitInput = document.getElementById("habitInput");
const addHabitBtn = document.getElementById("addHabitBtn");
const habitList = document.getElementById("habitList");
const emptyMessage = document.getElementById("emptyMessage");

const totalHabits = document.getElementById("totalHabits");
const completedToday = document.getElementById("completedToday");
const bestStreak = document.getElementById("bestStreak");

const progressText = document.getElementById("progressText");
const weeklyView = document.getElementById("weeklyView");
const currentDate = document.getElementById("currentDate");


// ========================================
// LOAD DATA
// ========================================

let habits = loadHabits();


// ========================================
// DATE FUNCTIONS
// ========================================

function getDateKey(date) {

    const year = date.getFullYear();

    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function formatDate(date) {

    return date.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// ========================================
// LOCAL STORAGE
// ========================================

function loadHabits() {

    const savedData = localStorage.getItem(STORAGE_KEY);

    if (!savedData) {
        return [];
    }

    try {
        return JSON.parse(savedData);
    }

    catch (error) {

        console.error(
            "Error loading habits:",
            error
        );

        return [];
    }
}


function saveHabits() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(habits)
    );

}


// ========================================
// ADD HABIT
// ========================================

function addHabit() {

    const habitName =
        habitInput.value.trim();


    // Don't allow empty habit
    if (habitName === "") {

        alert("Please enter a habit.");

        return;
    }


    // Create new habit
    const newHabit = {

        id: Date.now(),

        name: habitName,

        completed: {}

    };


    habits.push(newHabit);


    // Clear input
    habitInput.value = "";


    saveHabits();

    render();
}


// Button click
addHabitBtn.addEventListener(
    "click",
    addHabit
);


// Enter key
habitInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            addHabit();

        }

    }
);


// ========================================
// TOGGLE HABIT
// ========================================

function toggleHabit(id) {

    const habit = habits.find(
        function (item) {
            return item.id === id;
        }
    );


    if (!habit) {
        return;
    }


    const today = getDateKey(
        new Date()
    );


    // Toggle completion
    if (habit.completed[today]) {

        delete habit.completed[today];

    }

    else {

        habit.completed[today] = true;

    }


    saveHabits();

    render();
}


// ========================================
// DELETE HABIT
// ========================================

function deleteHabit(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this habit?"
    );


    if (!confirmDelete) {
        return;
    }


    habits = habits.filter(
        function (habit) {
            return habit.id !== id;
        }
    );


    saveHabits();

    render();
}


// ========================================
// CALCULATE CURRENT STREAK
// ========================================

function calculateStreak(habit) {

    let streak = 0;

    const date = new Date();


    while (true) {

        const key = getDateKey(date);


        if (habit.completed[key]) {

            streak++;

            date.setDate(
                date.getDate() - 1
            );

        }

        else {

            break;

        }

    }


    return streak;
}


// ========================================
// RENDER HABITS
// ========================================

function renderHabits() {

    habitList.innerHTML = "";


    if (habits.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }


    emptyMessage.style.display = "none";


    const today = getDateKey(
        new Date()
    );


    habits.forEach(
        function (habit) {

            const card =
                document.createElement("div");


            card.className = "habit-card";


            // Check completed
            if (habit.completed[today]) {

                card.classList.add(
                    "completed"
                );

            }


            // Check button
            const checkButton =
                document.createElement("button");

            checkButton.className =
                "check-button";

            checkButton.title =
                "Mark habit complete";


            checkButton.addEventListener(
                "click",
                function () {

                    toggleHabit(habit.id);

                }
            );


            // Habit name
            const name =
                document.createElement("div");

            name.className =
                "habit-name";

            name.textContent =
                habit.name;


            // Streak
            const streak =
                document.createElement("div");

            streak.className =
                "streak";

            streak.textContent =
                `🔥 ${calculateStreak(habit)} day streak`;


            // Delete button
            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "delete-button";

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function () {

                    deleteHabit(habit.id);

                }
            );


            // Add elements
            card.appendChild(checkButton);

            card.appendChild(name);

            card.appendChild(streak);

            card.appendChild(deleteButton);


            habitList.appendChild(card);

        }
    );
}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStatistics() {

    const today = getDateKey(
        new Date()
    );


    const total = habits.length;


    const completed =
        habits.filter(
            function (habit) {

                return habit.completed[today];

            }
        ).length;


    let highestStreak = 0;


    habits.forEach(
        function (habit) {

            const streak =
                calculateStreak(habit);


            if (streak > highestStreak) {

                highestStreak = streak;

            }

        }
    );


    totalHabits.textContent =
        total;


    completedToday.textContent =
        completed;


    bestStreak.textContent =
        highestStreak;


    let percentage = 0;


    if (total > 0) {

        percentage =
            Math.round(
                (completed / total) * 100
            );

    }


    progressText.textContent =
        `${percentage}% complete`;
}


// ========================================
// WEEKLY VIEW
// ========================================

function renderWeeklyView() {

    weeklyView.innerHTML = "";


    const today = new Date();


    // Show last 7 days
    for (
        let i = 6;
        i >= 0;
        i--
    ) {

        const date = new Date(today);


        date.setDate(
            today.getDate() - i
        );


        const dateKey =
            getDateKey(date);


        const completedCount =
            habits.filter(
                function (habit) {

                    return habit.completed[
                        dateKey
                    ];

                }
            ).length;


        const total =
            habits.length;


        const dayCard =
            document.createElement("div");


        dayCard.className =
            "day-card";


        const dayName =
            document.createElement("div");

        dayName.className =
            "day-name";

        dayName.textContent =
            date.toLocaleDateString(
                "en-IN",
                {
                    weekday: "short"
                }
            );


        const dayDate =
            document.createElement("div");

        dayDate.className =
            "day-date";

        dayDate.textContent =
            date.toLocaleDateString(
                "en-IN",
                {
                    day: "numeric",
                    month: "short"
                }
            );


        const circle =
            document.createElement("div");

        circle.className =
            "progress-circle";


        // Circle becomes active
        // only when all habits are complete
        if (
            total > 0 &&
            completedCount === total
        ) {

            circle.classList.add(
                "completed"
            );

        }


        const count =
            document.createElement("div");

        count.className =
            "day-count";

        count.textContent =
            `${completedCount}/${total}`;


        dayCard.appendChild(dayName);

        dayCard.appendChild(dayDate);

        dayCard.appendChild(circle);

        dayCard.appendChild(count);


        weeklyView.appendChild(
            dayCard
        );

    }

}


// ========================================
// DISPLAY CURRENT DATE
// ========================================

function displayCurrentDate() {

    currentDate.textContent =
        formatDate(new Date());

}


// ========================================
// MAIN RENDER FUNCTION
// ========================================

function render() {

    displayCurrentDate();

    renderHabits();

    updateStatistics();

    renderWeeklyView();

}


// ========================================
// START APPLICATION
// ========================================

render();