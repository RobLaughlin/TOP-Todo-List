/**
 * @module Sidebar/EventHandler
 */

import sanitizeHtml from "sanitize-html";
import { Todo } from "../Todos";


/**
 * Event handler for selecting a project
 * @param {?string} uuid The uuid of the selected project
 */
export function projectSelected(uuid) {
    // Remove current selection if it exists
    let currentSelectedProject = document.querySelector(".itemContainer > .item.project.selected");
    if (currentSelectedProject !== null) {
        currentSelectedProject.classList.remove("selected");
    }
    
    // Enable new selection
    if (uuid !== null) {
        let selectedProject = document.querySelector(`.sidebar .item.project[data-uuid="${uuid}"]`)
        selectedProject.classList.add("selected");
    }
}

/**
 * The event handler for when a project is clicked
 * @param {Event} e The click event for clicking a project 
 * @param {Object} sidebar The entire sidebar component
 * @returns 
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
    sidebar.select(selectedUUID, projectSelected);
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
    console.log(projectId);
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
export function addTodoBtnClicked(projectUUID) {
    let dialog = document.getElementsByClassName("addTodoModal")[0];

    // Set default date to today's date
    let dateInputField = dialog.querySelector("#TodoDate");
    dateInputField.valueAsDate = new Date();

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
                project.add(todo);
                console.log(todo);
                console.log(todo.dueDate);
                break;
            }
        }

        sidebar.render();

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
    dialog.close();
}