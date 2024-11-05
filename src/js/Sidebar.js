import folder from "../icons/folder.svg";
import minusBox from "../icons/minus-box.svg";
import note from "../icons/note.svg";
import magnify from "../icons/magnify.svg";
import plus from "../icons/plus.svg";

import sanitizeHtml from "sanitize-html";
import PubSub from "./PubSub";
import { Project, Todo } from "./Todos";

export const PROJECTS_CHANGED_EVENT = "projectsChanged";
export const PROJECT_CHANGED_EVENT = "projectChanged";
export const TODO_CHANGED_EVENT = "todoChanged";
export const PROJECT_SELECTED_EVENT = "projectSelected";

/**
 * @module Sidebar/EventHandler
 */

/**
 * Event that gets triggered when a project gets changed
 * @param {Project} project The project that was changed
 */
function projectChanged(project) {

}
PubSub.subscribe(PROJECT_CHANGED_EVENT, projectChanged);

/**
 * Event that gets triggered when a todo gets changed
 * @param {Todo} todo The todo that was changed
 */
function todoChanged(todo) {

}
PubSub.subscribe(TODO_CHANGED_EVENT, todoChanged);

/**
 * Event handler for selecting a project
 * @param {?string} uuid The uuid of the selected project
 */
function projectSelected(uuid) {
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
PubSub.subscribe(PROJECT_SELECTED_EVENT, projectSelected);

/**
 * 
 * @param {Event} e The click event for clicking a project 
 * @param {Object} sidebar The entire sidebar component
 * @returns 
 */
function projectClicked(e, sidebar) {
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
    sidebar.select(selectedUUID);
}

/**
 * The event called when a project is removed
 * @param {Event} e The removal icon click event for projects
 * @param {Project[]} projects The array of projects in the sidebar
 */
function projectRemoved(e, sidebar) {
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
                sidebar.select(nextProjectUUID);
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
function todoRemoved(e, project) {
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
function folderBtnClicked(e) {
    let projectContainer = e.target.parentElement.parentElement;
    let todos = projectContainer.querySelectorAll(".todo");
    todos.forEach(todo => {
        todo.classList.toggle("invisible");
    });
}

/**
 * The event called when the search bar on the sidebar is focused
 * @param {Event} e Focused event for the search bar
 */
function searchBarFocused(e) {
    e.preventDefault();

    let searchBar = e.target.parentElement;
    searchBar.classList.add("focused");
}

/**
 * The event called when the search bar on the sidebar is unfocused
 * @param {Event} e Unfocused event for the search bar 
 */
function searchBarUnFocused(e) {
    e.preventDefault();

    let searchBar = e.target.parentElement;
    searchBar.classList.remove("focused");
}

/**
 * Event handler for adding todos
 */
function addTodoBtnClicked(projectUUID) {
    let dialog = document.getElementsByClassName("addTodoModal")[0];
    dialog.show();

    // Dialog container
    let dialogContainer = dialog.parentElement;
    dialogContainer.classList.toggle("invisible");
    dialogContainer.dataset['project_uuid'] = projectUUID;
}

/**
 * Event handler for submitting the add todo form
 * @param {Event} e The click event for the add todo submit button 
 */
function addTodoSubmitClicked(e) {
    e.preventDefault();
    let dialog = document.getElementsByClassName("addTodoModal")[0];
    dialog.parentElement.classList.toggle("invisible");
    delete dialog.parentElement.dataset["project_uuid"];
    dialog.close();
}

/**
 * Event handler for closing the add todo form
 * @param {Event} e The click event for the add todo close button 
 */
function addTodoCloseClicked(e) {
    e.preventDefault();
    let dialog = document.getElementsByClassName("addTodoModal")[0];
    dialog.parentElement.classList.toggle("invisible");
    delete dialog.parentElement.dataset["project_uuid"];
    dialog.close();
}

/**
 * @module Sidebar/Template
 */

/**
 * The sidebar template
 * @returns Template to generate the sidebar component HTML
 */
const sidebarTemplate = () => {
    return `
        <div class="sidebar">
            <div class="titleContainer">
                <h1 class="title">Projects</h1>
            </div>
            <div class="searchContainer">
                <div class="searchBar">
                    <img src="${magnify}" alt="Magnifying glass icon" class="icon">
                    <input type="search" placeholder="Search" class="search">
                </div>
            </div>
        </div>
    `;
}

/**
 * The project template
 * @param {Project} project
 * @returns Sanitized Project HTML to inject into sidebar
 */
const projectSidebarTemplate = project => {
    return `
        <div class="item project" data-uuid=${sanitizeHtml(project.uuid)}>
            <img src="${folder}" alt="Folder icon" class="folder icon">
            <span class="text">${sanitizeHtml(project.name)}</span>
            <img src="${minusBox}" alt="Minus box icon, click to remove project" class="icon removeProjectIcon">
        </div>
    `;
}

/**
 * The todo template
 * @param {Todo} todo
 * @returns Sanitized Todo HTML to inject into sidebar
 */
const todoSidebarTemplate = todo => {
    return `
        <div class="item todo invisible" data-uuid=${sanitizeHtml(todo.uuid)}>
            <img src="${note}" alt="Note icon for to-do" class="icon">
            <span class="text">${sanitizeHtml(todo.title)}</span>
            <img src="${minusBox}" alt="Minus box icon, click to remove to-do under selected project" class="icon removeProjectIcon">
        </div>
    `;
}

/**
 * The template for adding todos
 * @returns The add todo item HTML
 */
const addTodoTemplate = () => {
    return `
        <div class="item addTodoContainer todo invisible">
            <span class="text">Add Todo</span>
            <img src="${plus}" alt="Plus icon, click to add a new to-do" class="icon">
        </div>
    `;
}

/**
 * Add todo modal template
 * @returns The add todo modal HTML
 */
const addTodoModalTemplate  = () => {
    return `
        <div class="addTodoModalContainer invisible">
            <dialog class="addTodoModal">
                <form method="dialog" id="AddTodoForm">
                    <div class="formRow" id="TodoTitleContainer">
                        <label for="TodoTitle" class="required-field">Title:</label>
                        <input type="text" id="TodoTitle" placeholder="Todo Title" required/>
                    </div>
                    <div class="formRow" id="TodoDateContainer">
                        <label for="TodoDate" class="required-field">Due Date:</label>
                        <input type="date" id="TodoDate" required/>
                    </div>
                    <div class="formRow" id="TodoPriorityContainer">
                        <label for="TodoPriority" class="required-field">Priority:</label>
                        <input type="number" id="TodoPriority" required/>
                    </div>
                    <div class="formRow" id="TodoDescriptionContainer">
                        <textarea id="TodoDescription" placeholder="Description of todo goes here"></textarea>
                    </div>
                    <div class="formRow" id="TodoNotesContainer">
                        <textarea id="TodoNotes" placeholder="Todo notes goes here"></textarea>
                    </div>
                    <div class="formRow" id="AddTodoBtnContainer">
                        <button id="AddTodoBtn">Add Todo</button>
                    </div>
                    <div class="formRow" id="TodoCloseBtnContainer">
                        <button id="TodoCloseBtn">Close</button>
                    </div>
                </form>  
            </dialog>
        </div>
    `
}

/**
 * @module Sidebar/Test
 */

/**
 * Generates a number of projects and todos to use as test data
 * @param {number} numProjects The number of projects to generate 
 * @param {number} numTodos The number of todos to generate within each project
 * @returns {Project[]} The array of test projects generated
 */
export const createTestProjects = (numProjects, numTodos) => {
    let projects = []
    for (let i = 0; i < numProjects; i++) {
        let project = new Project(`Project ${i}`, [], PROJECT_CHANGED_EVENT);
        for (let j = 0; j < numTodos; j++) {
            project.add(new Todo(`Todo ${j}`, "description", new Date(), j, "notes", TODO_CHANGED_EVENT));
        }
        projects.push(project);
    }

    const selected = numProjects >= 1 ? projects[0].uuid : null;
    return { projects, selected };
};

/**
 * @module Sidebar
*/

/**
 * Creates the main sidebar component
 * @function
 * @param {Project[]} projects The array of projects to be loaded into the sidebar 
 * @returns {Object} The sidebar component
 */
export const createSidebar = (projects) => {
    /**
     * @member {?string} selected The UUID of the selected project
     * @private
     */
    let selected = projects.length > 0 ? projects[0].uuid : null;

    /**
     * Selects a project from the sidebar based on project UUID
     * @method select
     * @param {?string} uuid The UUID of the project to be selected
     * @returns {Project} The project selected
     */
    function select(uuid) {
        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];
            if (project.uuid === uuid) {
                selected = uuid;
                PubSub.publish(PROJECT_SELECTED_EVENT, uuid);
                return project;
            }
        }

        throw new Error(`Project UUID ${uuid} not found.`);      
    };

    /**
     * Generates sidebar HTML
     * @method html
     * @returns {string} The sidebar HTML string
     */
    function html() {
        let sidebarTemplateNode = document.createElement("template");
        sidebarTemplateNode.innerHTML = sidebarTemplate();
        let sidebarNode = sidebarTemplateNode.content.querySelector("div");
        
        // Implement add todo modal
        let addTodoModalTemplateNode = document.createElement("template");
        addTodoModalTemplateNode.innerHTML = addTodoModalTemplate();

        // Implement behaviour for the add todo modal submit button
        let addTodoModalNode = addTodoModalTemplateNode.content.querySelector("div");
        let addTodoBtn = addTodoModalNode.querySelector("#AddTodoBtn");
        addTodoBtn.addEventListener("click", addTodoSubmitClicked);

        // Implement behaviour for the close button in the todo modal
        let closeBtn = addTodoModalNode.querySelector("#TodoCloseBtn");
        closeBtn.addEventListener("click", addTodoCloseClicked);
        
        sidebarNode.appendChild(addTodoModalNode);

        // Implement search bar behaviour
        let searchInput = sidebarNode.querySelector(".search");
        searchInput.addEventListener("focusin", searchBarFocused);
        searchInput.addEventListener("focusout", searchBarUnFocused);

        // Inject projects and todos
        for (let p = 0; p < projects.length; p++) {
            let project = projects[p];
    
            let itemContainer = document.createElement("div");
            itemContainer.classList.add("itemContainer");
    
            // Generate project html
            let projectTemplate = document.createElement("template");
            projectTemplate.innerHTML = projectSidebarTemplate(project, p);
            let projectNode = projectTemplate.content.querySelector("div");
    
            // Make sure correct project is selected
            if (project.uuid === selected) {
                projectNode.classList.add("selected");
            }
            
            // Add project selection behaviour
            projectNode.addEventListener("click", (e, self=this) => {projectClicked(e, self)});

            // Add folder button click event handler
            let folderBtn = projectNode.querySelector(".folder.icon");
            folderBtn.addEventListener("click", folderBtnClicked);
    
            // Add remove button click event handler
            let removeProjectBtn = projectNode.querySelector(".removeProjectIcon");
            removeProjectBtn.addEventListener("click", e => {
                projectRemoved(e, this);
            });
            itemContainer.appendChild(projectNode);
    
            // Generate todo html
            for (let t = 0; t < project.todos.length; t++) {
                let todoHtml = todoSidebarTemplate(project.todos[t], t);
                let todoTemplate = document.createElement("template");
                todoTemplate.innerHTML = todoHtml;
                let todoNode = todoTemplate.content.querySelector("div");
                let removeTodoBtn = todoNode.querySelector(".removeProjectIcon");
                removeTodoBtn.addEventListener("click", e => {
                    todoRemoved(e, project);
                });
                itemContainer.appendChild(todoNode);
            }

            // Append add todo item to end of todos
            let addTodoItem = document.createElement("template");
            addTodoItem.innerHTML = addTodoTemplate();
            addTodoItem = addTodoItem.content.querySelector("div");
            
            // Implement add todo behaviour
            let plusIcon = addTodoItem.getElementsByClassName("icon")[0];
            plusIcon.addEventListener("click", () => {addTodoBtnClicked(project.uuid)});

            itemContainer.appendChild(addTodoItem);
            sidebarNode.appendChild(itemContainer);
        }

        return sidebarNode;
    };

    /**
     * Replaces the given root node with the sidebar component HTML
     * @method render
     */
    function render() {
        let root = document.getElementsByClassName("sidebar")[0];
        root.replaceWith(this.html());
    };

    /**
     * Gets the UUID of the current selected project
     * @returns {?string} The UUID of the selected project
     */
    function currentProject() {
        return selected;
    }

    return (() => {
        return {
            projects,
            select,
            html,
            render,
            currentProject
        };
    })();
};

