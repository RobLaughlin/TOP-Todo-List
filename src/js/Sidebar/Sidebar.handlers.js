/**
 * @module Sidebar/EventHandler
 */

import sanitizeHtml from "sanitize-html";
import { Project, Todo } from "../Todos";
import { note } from "../Note/Note.templates";
import PubSub from "../PubSub";

/**
 * Event handler for selecting a project
 * @param {?string} uuid The uuid of the selected project
 * @param {Project[]} projects The array of projects to run through and find the list of todos to update
 */
export function projectSelected(uuid) {
    // Remove current selection if it exists
    let currentSelectedProject = document.querySelector(".itemContainer > .item.project.selected");
    if (currentSelectedProject !== null) {
        currentSelectedProject.classList.remove("selected");
    }
    
    // Enable new selection
    if (uuid !== null) {
        let selectedProject = document.querySelector(`.sidebar .item.project[data-uuid="${uuid}"]`);
        selectedProject.classList.add("selected");
        PubSub.publish("projectSelected", uuid);
    }
}

/**
 * The event handler for when a project is clicked
 * @param {Event} e The click event for clicking a project 
 * @param {Object} sidebar The entire sidebar component
 */
export function projectClicked(e, sidebar) {
    let target = null;
    if (e.target === e.currentTarget) {
        target = e.target;
    }
    else if (e.target.classList.contains("text")) {
        target = e.target.parentElement;
    }
    else {
        return;
    }
    
    let selectedUUID = target.dataset.uuid;
    sidebar.select(selectedUUID, () => {projectSelected(selectedUUID)});
}

/**
 * The event called when a project is removed
 * @param {Event} e The removal icon click event for projects
 * @param {Project[]} projects The array of projects in the sidebar
 */
export function projectRemoved(e, sidebar) {
    let projects = sidebar.projects;
    let clickedProject = e.target.parentElement;
    let clickedItemContainer = clickedProject.parentElement;
    const UUID = clickedProject.dataset.uuid;
    
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        
        if (project.uuid === UUID) {
            if (!confirm(`Are you sure you want to remove ${project.name}?`)) {
                return;
            }
            projects.splice(i, 1);
            clickedItemContainer.remove();

            // Select next project if 
            // (1) selected project was removed and 
            // (2) a next project is available.
            // Selects the first project available if the removed selected project 
            if (sidebar.currentProject() === project.uuid && projects.length > 0) {
                const nextProjectIdx = i % projects.length;
                const nextProjectUUID = projects[nextProjectIdx].uuid;
                sidebar.select(nextProjectUUID, projectSelected);
            }
            break;
        }
    }
}

/**
 * The event called when a todo is removed
 * @param {Event} e The removal icon click event for todos
 * @param {Project} project The project containing the todo being removed
 */
export function todoRemoved(e, project) {
    let clickedTodo = e.target.parentElement;
    const UUID = clickedTodo.dataset.uuid;

    for (let i = 0; i < project.size(); i++) {
        const todo = project.get(i);
        if (todo.uuid === UUID) {
            if (!confirm(`Are you sure you want to remove ${todo.title} in ${project.name}?`)) {
                return;
            }
            project.remove(i);
            clickedTodo.remove();
            break;
        }
    }
}

/**
 * The event called when a folder icon is clicked on a project
 * @param {Event} e The folder icon click event for projects
 */
export function folderBtnClicked(sidebar, projects, e) {
    const projectId = e.target.parentElement.dataset.uuid;
    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];
        if (project.uuid === projectId) {
            project.opened ? project.close() : project.open();
            break;
        }
    }

    sidebar.render();
}

/**
 * The event called when the search bar on the sidebar is focused
 * @param {Event} e Focused event for the search bar
 */
export function searchBarFocused(e) {
    e.preventDefault();

    let searchBar = e.target.parentElement;
    searchBar.classList.add("focused");
}

/**
 * The event called when the search bar on the sidebar is unfocused
 * @param {Event} e Unfocused event for the search bar 
 */
export function searchBarUnFocused(e) {
    e.preventDefault();

    let searchBar = e.target.parentElement;
    searchBar.classList.remove("focused");
}

/**
 * Event handler for when the add Todo button
 * @param {string} projectUUID The UUID of the corresponding project
 */
export function addTodoBtnClicked(e, projectUUID, edit=false) {
    let dialog = document.getElementsByClassName("addTodoModal")[0];

    // Set default date to today's date
    let dateInputField = dialog.querySelector("#TodoDate");
    dateInputField.valueAsDate = new Date();

    let addTodoBtn = dialog.querySelector("#AddTodoBtn");
    if (edit) {
        addTodoBtn.textContent = "Edit Todo";
        dialog.dataset['todo_clicked_uuid'] = e.target.parentElement.dataset['uuid'];
    }
    else {
        addTodoBtn.textContent = "Add Todo";
    }

    dialog.show();

    // Make backdrop visible
    let backdrop = dialog.parentElement;
    backdrop.classList.remove("invisible");

    // Give the dialog the project UUID until form/dialog is submitted/closed.
    dialog.dataset['project_uuid'] = projectUUID;
}

/**
 * Event handler for submitting the add todo form
 * @param {Event} e The click event for the add todo submit button 
 */
export function addTodoSubmitClicked(sidebar, projects, e) {
    e.preventDefault();

    // Check if form is valid
    let dialog = document.getElementsByClassName("addTodoModal")[0];
    let form = dialog.querySelector("form");
    form.reportValidity();

    if (form.checkValidity()) {
        const data = new FormData(form);
        let entries = new Map();

        data.entries().forEach(([id, data]) => {
            entries.set(id, sanitizeHtml(data));
        });

        const title = entries.get("TodoTitle");
        const [year, month, day] = entries.get("TodoDate").split("-");
        const date = new Date(year, month, day);
        const priority = parseInt(entries.get("TodoPriority"));
        const desc = entries.get("TodoDescription");
        const notes = entries.get("TodoNotes");

        const todo = new Todo(title, desc, date, priority, notes);
        const projectId = dialog.dataset.project_uuid;

        for (let i = 0; i < projects.length; i++) {
            let project = projects[i];
            if (project.uuid === projectId) {
                if ("todo_clicked_uuid" in dialog.dataset) {
                    // Edit todo
                    const todoClickedUUID = dialog.dataset["todo_clicked_uuid"];

                    for (let j = 0; j < project.size(); j++) {
                        let todoToEdit = project.get(j);
                        if (todoToEdit.uuid === todoClickedUUID) {
                            todoToEdit.title = todo.title;
                            todoToEdit.description = todo.description;
                            todoToEdit.dueDate = todo.dueDate;
                            todoToEdit.priority = todo.priority;
                            todoToEdit.notes = todo.notes;
                            break;
                        }
                    }

                }
                else {
                    // Add the todo
                    project.add(todo);
                }
                break;
            }
        }

        // sidebar.render();
        if ('todo_clicked_uuid' in dialog.dataset) {
            delete dialog.dataset['todo_clicked_uuid'];
        }
        
        let backdrop = dialog.parentElement;
        backdrop.classList.toggle("invisible");

        delete dialog.dataset["project_uuid"];
        dialog.close();
    }
}

/**
 * Event handler for closing the add todo form
 * @param {Event} e The click event for the add todo close button 
 */
export function addTodoCloseClicked(e) {
    e.preventDefault();
    let dialog = document.getElementsByClassName("addTodoModal")[0];
    dialog.parentElement.classList.toggle("invisible");
    delete dialog.dataset["project_uuid"];

    if ('todo_clicked_uuid' in dialog.dataset) {
        delete dialog.dataset['todo_clicked_uuid'];
    }

    dialog.close();
}

/**
 * Event handler for adding a new project
 * @param {Object} sidebar The sidebar component
 * @param {Project[]} projects The array of projects to be rendered
 * @param {Event} e The event called when the add project button is clicked
 */
export function addProjectBtnClicked(sidebar, projects, e) {
    const addProjectContainer = e.target.parentElement;
    const projectName = addProjectContainer.querySelector(".addProjectTextbox").value;

    if (projectName === "" || projectName === undefined || projectName === null) {
        alert("Project name must be non-empty.");
        return;
    }

    projects.push(new Project(projectName));
    sidebar.render();
}

/**
 * Event handler for editing the proejct button
 * @param {string} projectName The current name of the corresponding project
 * @param {string} projectUUID The UUID of the corresponding project to edit
 */
export function editProjectBtnClicked(projectName, projectUUID) {
    let dialog = document.getElementsByClassName("editProjectModal")[0];
    dialog.show();

    // Make backdrop visible
    let backdrop = dialog.parentElement;
    backdrop.classList.remove("invisible");

    // Give the dialog the project UUID until form/dialog is submitted/closed.
    dialog.dataset['project_uuid'] = projectUUID;

    let projectTitleTxtbox = dialog.querySelector("#ProjectTitleTextbox");
    projectTitleTxtbox.value = sanitizeHtml(projectName);
}

/**
 * Event handler for clicking the close button on the edit project modal
 * @param {Event} e  
 */
export function editProjectCloseBtnClicked(e) {
    e.preventDefault();
    let dialog = document.getElementsByClassName("editProjectModal")[0];

    dialog.parentElement.classList.toggle("invisible");
    delete dialog.dataset["project_uuid"];
    dialog.close();
}

/**
 * Event handler for clicking the save button on the edit project modal
 * @param {Project[]} projects The array of projects contained in the sidebar 
 */
export function editProjectSaveBtnClicked(e, projects) {
    e.preventDefault();

    let dialog = document.getElementsByClassName("editProjectModal")[0];
    const projectUUID = dialog.dataset['project_uuid'];
    const title = dialog.querySelector("#ProjectTitleTextbox").value;

    let form = dialog.querySelector("form");
    form.reportValidity();

    if (!form.checkValidity()) {
        return;
    }

    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];
        if (project.uuid === projectUUID) {
            project.name = sanitizeHtml(title);
            break;
        }
    }

    dialog.parentElement.classList.toggle("invisible");
    delete dialog.dataset["project_uuid"];
    dialog.close();
}

/**
 * Event handler for key presses on the search bar
 * @param {Object} sidebar The sidebar component 
 * @param {Event} e The event called when a key on the search bar is pressed 
 */
export function searchKeyPressed(sidebar, e) {
    const searchKey = sanitizeHtml(e.target.value);
    sidebar.setSearchKey(searchKey);
    sidebar.render();
}

export function editTodoBtnClicked(todo, projectUUID, e) {
    addTodoBtnClicked(e, projectUUID, true);
    let form = document.querySelector("#AddTodoForm");
    let titleInput = form.querySelector("#TodoTitle");
    let dueDateInput = form.querySelector("#TodoDate");
    let priorityInput = form.querySelector("#TodoPriority");
    let descriptionInput = form.querySelector("#TodoDescription");
    let notesInput = form.querySelector("#TodoNotes");

    titleInput.value = todo.title;
    dueDateInput.value = todo.dueDate;
    priorityInput.value = todo.priority;
    descriptionInput.value = todo.description;
    notesInput.value = todo.notes;
}