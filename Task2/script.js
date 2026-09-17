// ===============================
// GET HTML ELEMENTS
// ===============================

const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const priorityInput = document.getElementById("priorityInput");
const dateInput = document.getElementById("dateInput");

const addBtn = document.getElementById("addBtn");

const taskList = document.getElementById("taskList");

const errorMessage = document.getElementById("errorMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");
const categoryFilter = document.getElementById("categoryFilter");

const emptyMessage = document.getElementById("emptyMessage");

const themeBtn = document.getElementById("themeBtn");


// ===============================
// TASK ARRAY
// ===============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let editId = null;


// ===============================
// DISPLAY TASKS
// ===============================

function displayTasks() {

    taskList.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();

    let filterValue = filterInput.value;

    let categoryValue = categoryFilter.value;


    let filteredTasks = tasks.filter(function(task) {

        // Search filter
        let matchesSearch =
            task.title.toLowerCase().includes(searchText);


        // Status filter
        let matchesStatus = true;

        if (filterValue === "completed") {

            matchesStatus = task.completed === true;

        }

        else if (filterValue === "pending") {

            matchesStatus = task.completed === false;

        }


        // Category filter
        let matchesCategory =
            categoryValue === "all" ||
            task.category === categoryValue;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesCategory
        );

    });


    // Show empty message
    if (filteredTasks.length === 0) {

        emptyMessage.style.display = "block";

    }

    else {

        emptyMessage.style.display = "none";

    }


    // Create task cards
    filteredTasks.forEach(function(task) {

        let taskCard = document.createElement("div");

        taskCard.className = "task-card";


        if (task.completed) {

            taskCard.classList.add("completed");

        }


        let priorityClass = "";

        if (task.priority === "Low") {

            priorityClass = "priority-low";

        }

        else if (task.priority === "Medium") {

            priorityClass = "priority-medium";

        }

        else {

            priorityClass = "priority-high";

        }


        taskCard.innerHTML = `

            <div class="task-info">

                <div class="task-title">
                    ${escapeHTML(task.title)}
                </div>

                <div class="task-details">

                    <span class="badge category">
                        ${escapeHTML(task.category)}
                    </span>

                    <span class="badge ${priorityClass}">
                        ${escapeHTML(task.priority)}
                    </span>

                    ${
                        task.date
                        ?
                        `<span class="badge due-date">
                            📅 ${task.date}
                        </span>`
                        :
                        ""
                    }

                </div>

            </div>


            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTask(${task.id})"
                >
                    ${task.completed ? "↩ Pending" : "✓ Complete"}
                </button>

                <button
                    class="edit-btn"
                    onclick="editTask(${task.id})"
                >
                    ✏ Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(${task.id})"
                >
                    🗑 Delete
                </button>

            </div>

        `;


        taskList.appendChild(taskCard);

    });


    updateStatistics();

}


// ===============================
// ADD TASK
// ===============================

addBtn.addEventListener("click", function() {

    let title = taskInput.value.trim();

    let category = categoryInput.value;

    let priority = priorityInput.value;

    let date = dateInput.value;


    // Validation
    if (title === "") {

        errorMessage.textContent =
            "Please enter a task.";

        taskInput.focus();

        return;

    }


    if (title.length < 3) {

        errorMessage.textContent =
            "Task must contain at least 3 characters.";

        taskInput.focus();

        return;

    }


    errorMessage.textContent = "";


    // EDIT TASK
    if (editId !== null) {

        tasks = tasks.map(function(task) {

            if (task.id === editId) {

                return {

                    id: task.id,

                    title: title,

                    category: category,

                    priority: priority,

                    date: date,

                    completed: task.completed

                };

            }

            return task;

        });


        editId = null;

        addBtn.textContent = "+ Add Task";

    }


    // ADD NEW TASK
    else {

        let newTask = {

            id: Date.now(),

            title: title,

            category: category,

            priority: priority,

            date: date,

            completed: false

        };


        tasks.push(newTask);

    }


    saveTasks();

    clearInputs();

    displayTasks();

});


// ===============================
// CLEAR INPUTS
// ===============================

function clearInputs() {

    taskInput.value = "";

    categoryInput.value = "General";

    priorityInput.value = "Medium";

    dateInput.value = "";

}


// ===============================
// COMPLETE / PENDING
// ===============================

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {

            task.completed = !task.completed;

        }

        return task;

    });


    saveTasks();

    displayTasks();

}


// ===============================
// EDIT TASK
// ===============================

function editTask(id) {

    let task = tasks.find(function(task) {

        return task.id === id;

    });


    if (!task) {

        return;

    }


    taskInput.value = task.title;

    categoryInput.value = task.category;

    priorityInput.value = task.priority;

    dateInput.value = task.date;


    editId = id;

    addBtn.textContent = "Update Task";


    taskInput.focus();

}


// ===============================
// DELETE TASK
// ===============================

function deleteTask(id) {

    let confirmation =
        confirm("Are you sure you want to delete this task?");


    if (!confirmation) {

        return;

    }


    tasks = tasks.filter(function(task) {

        return task.id !== id;

    });


    saveTasks();

    displayTasks();

}


// ===============================
// SAVE TASKS TO LOCAL STORAGE
// ===============================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// ===============================
// UPDATE STATISTICS
// ===============================

function updateStatistics() {

    let total = tasks.length;


    let completed = tasks.filter(function(task) {

        return task.completed === true;

    }).length;


    let pending = tasks.filter(function(task) {

        return task.completed === false;

    }).length;


    totalTasks.textContent = total;

    completedTasks.textContent = completed;

    pendingTasks.textContent = pending;

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    displayTasks
);


// ===============================
// STATUS FILTER
// ===============================

filterInput.addEventListener(
    "change",
    displayTasks
);


// ===============================
// CATEGORY FILTER
// ===============================

categoryFilter.addEventListener(
    "change",
    displayTasks
);


// ===============================
// ENTER KEY
// ===============================

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addBtn.click();

        }

    }
);


// ===============================
// DARK MODE
// ===============================

themeBtn.addEventListener(
    "click",
    function() {

        document.body.classList.toggle("dark");


        if (document.body.classList.contains("dark")) {

            themeBtn.textContent = "☀️ Light Mode";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

        else {

            themeBtn.textContent = "🌙 Dark Mode";

            localStorage.setItem(
                "theme",
                "light"
            );

        }

    }
);


// ===============================
// LOAD DARK MODE
// ===============================

let savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️ Light Mode";

}


// ===============================
// SECURITY FUNCTION
// ===============================

function escapeHTML(text) {

    let div = document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


// ===============================
// INITIAL DISPLAY
// ===============================

displayTasks();