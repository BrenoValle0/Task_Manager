// variables
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const dateInput = document.getElementById("dateInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

let tasks =[];
// create tasks with all buttons (e.g done, edit and delete)
function createTaskElement(task){
        // create li
        const li = document.createElement("li");
        if (task.completed) {
            li.classList.add("completed");
        }


        // form elements
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        const titleElem = document.createElement("h3");
        titleElem.textContent = task.title;

        const descriptionElem = document.createElement("p");
        descriptionElem.textContent = `Description: ${task.description}`;

        const dateElem = document.createElement("p");
        dateElem.textContent = `Due: ${task.dueDate || "N/A"}`;

        const priorityElem = document.createElement("p");
        priorityElem.textContent = `Priority: ${task.priority}`;

        //append form elements to task content div
        taskContent.appendChild(titleElem);
        taskContent.appendChild(descriptionElem);
        taskContent.appendChild(dateElem);
        taskContent.appendChild(priorityElem);

        // done button
        const doneBtn = document.createElement("button");
        doneBtn.textContent = "Done";
        doneBtn.classList.add("done-btn");

        doneBtn.addEventListener("click", function(){
            task.completed = !task.completed;
            // update storage
            saveTasksToFile();
            renderTaskList();
        });

        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", function(){
            li.remove();
            // update storage
            tasks = tasks.filter(t => t !== task);
            saveTasksToFile();
            renderTaskList();
        });

        // edit button
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.classList.add("edit-btn");

        editBtn.addEventListener("click", function(){

            // Input fields for editing
            const titleInputEdit = document.createElement("input");
            titleInputEdit.type = "text";
            titleInputEdit.classList.add("edit-field");
            titleInputEdit.value = task.title;

            const descriptionInputEdit = document.createElement("input");
            descriptionInputEdit.type = "text";
            descriptionInputEdit.classList.add("edit-field");
            descriptionInputEdit.value = task.description;

            const dateInputEdit = document.createElement("input");
            dateInputEdit.type = "date";
            dateInputEdit.classList.add("edit-field");
            dateInputEdit.value = task.dueDate;

            const priorityInputEdit = document.createElement("select");
            priorityInputEdit.classList.add("edit-field");
            ["Low", "Medium", "High"].forEach(level => {
                const option = document.createElement("option");
                option.value = level;
                option.textContent = level;
                if (level === task.priority) option.selected = true;
                priorityInputEdit.appendChild(option);
            });

            // Replace display elements with inputs
            taskContent.replaceChild(titleInputEdit, titleElem);
            taskContent.replaceChild(descriptionInputEdit, descriptionElem);
            taskContent.replaceChild(dateInputEdit, dateElem);
            taskContent.replaceChild(priorityInputEdit, priorityElem);

            // save button
            const saveBtn = document.createElement("button");
            saveBtn.textContent = "Save";
            saveBtn.classList.add("edit-btn");

            saveBtn.addEventListener("click", function(){
                // update task array info to save on storage
                task.title = titleInputEdit.value;
                task.description = descriptionInputEdit.value;
                task.dueDate = dateInputEdit.value;
                task.priority = priorityInputEdit.value;

                // update original display elements
                titleElem.textContent = task.title;
                descriptionElem.textContent = `Description: ${task.description}`;
                dateElem.textContent =`Due: ${task.dueDate || "N/A"}`;
                priorityElem.textContent = `Priority: ${task.priority}`;

                // Replace inputs with updated text elements
                taskContent.replaceChild(titleElem, titleInputEdit);
                taskContent.replaceChild(descriptionElem, descriptionInputEdit);
                taskContent.replaceChild(dateElem, dateInputEdit);
                taskContent.replaceChild(priorityElem, priorityInputEdit);

                // change save button to edit button
                formButtons.replaceChild(editBtn, saveBtn);
            });

            // Swap Edit to Save button
            formButtons.replaceChild(saveBtn, editBtn);

    });

    const formButtons = document.createElement("div");
        formButtons.classList.add("task-buttons");
        formButtons.appendChild(doneBtn);
        formButtons.appendChild(editBtn);
        formButtons.appendChild(deleteBtn);

        // add html elements to li
        li.appendChild(taskContent);
        li.appendChild(formButtons);

        return li;
    }

// Apply filter and sorting
function renderTaskList() {
  taskList.innerHTML = ""; // clear current list

  let filteredTasks = tasks.slice(); // copy

  // Apply filter
  const filterValue = filterSelect.value;
  if (filterValue === "completed") {
    filteredTasks = filteredTasks.filter(t => t.completed);
  } else if (filterValue === "pending") {
    filteredTasks = filteredTasks.filter(t => !t.completed);
  } else if (["low", "medium", "high"].includes(filterValue)) {
    filteredTasks = filteredTasks.filter(t => t.priority.toLowerCase() === filterValue);
  }

  // Apply sort
  const sortValue = sortSelect.value;
  if (sortValue === "title") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortValue === "dueDate") {
    filteredTasks.sort((a, b) => (a.dueDate || "").localeCompare(b.dueDate || ""));
  } else if (sortValue === "priority") {
    const priorityOrder = { "High": 1, "Medium": 2, "Low": 3 };
    filteredTasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  // Render each task
  filteredTasks.forEach(task => {
    const taskItem = createTaskElement(task);
    taskList.appendChild(taskItem);
  });
}

// update task list if filter is changed
filterSelect.addEventListener("change", () => {
    renderTaskList();
    saveFilterSettings();
});

// update task list if sort is changed
sortSelect.addEventListener("change", () => {
    renderTaskList();
    saveFilterSettings();
});


// add task
addBtn.addEventListener("click", function(){
    const task = {
    title: titleInput.value,
    description: descInput.value,
    dueDate: dateInput.value,
    priority: priorityInput.value,
    status: "pending"
    };

    if(task.title !== "") {
        // add li to ul taskList
        const taskItem = createTaskElement(task);
        taskList.appendChild(taskItem);
        tasks.push(task);
        saveTasksToFile(); // save to json file

        // sets form to no value
        titleInput.value = "";
        descInput.value = "";
        dateInput.value = "";
        priorityInput.value = "pending";
    };
});

// Save tasks data in json file
function saveTasksToFile() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveFilterSettings() {
    localStorage.setItem("filter", filterSelect.value);
    localStorage.setItem("sort", sortSelect.value);
}

function loadFilterSettings() {
    const filter = localStorage.getItem("filter");
    const sort = localStorage.getItem("sort");

    if (filter) filterSelect.value = filter;
    if (sort) sortSelect.value = sort;
}


// load task data from json file
function loadTasksFromFile() {
    const stored = localStorage.getItem("tasks");
    if (stored) {
        tasks = JSON.parse(stored);
        renderTaskList();
    }
}

// Load tasks when the page loads
loadTasksFromFile();
loadFilterSettings();
renderTaskList();

            