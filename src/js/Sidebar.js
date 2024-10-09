import folder from "../icons/folder.svg";
import minusBox from "../icons/minus-box.svg";
import note from "../icons/note.svg";
import sanitizeHtml from "sanitize-html";
import PubSub from "./PubSub";
import { v4 as uuidv4 } from 'uuid';
import { Project, Todo } from "./Todos";

export const PROJECTS_CHANGED_EVENT = "projectsChanged";
export const PROJECT_CHANGED_EVENT = "projectChanged";
export const TODO_CHANGED_EVENT = "todoChanged";

/**
 * Event that gets triggered when the projects array gets changed
 * @param {Project[]} projects The array of projects that was changed
 */
function projectsChanged(projects) {
    renderSidebar(projects);
}
PubSub.subscribe(PROJECTS_CHANGED_EVENT, projectsChanged);

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
 * The event called when a project is removed
 * @param {Event} e The removal icon click event for projects
 * @param {Project[]} projects The array of projects in the sidebar
 */
function projectRemoved(e, projects) {
    let clickedProject = e.target.parentElement;
    let clickedItemContainer = clickedProject.parentElement;
    const UUID = clickedProject.dataset.uuid;
    console.log(projects);
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        if (project.uuid === UUID) {
            projects.splice(i, 1);
            clickedItemContainer.remove();
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
    console.log(project);
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
 * 
 * @param {Project} project
 * @returns Sanitized Project HTML to inject into sidebar
 */
export const projectSidebarTemplate = project => {
    return `
        <div class="item project" data-uuid=${sanitizeHtml(project.uuid)}>
            <img src="${folder}" alt="Folder icon" class="icon">
            <span class="text">${sanitizeHtml(project.name)}</span>
            <img src="${minusBox}" alt="Minus box icon, click to remove project" class="icon removeProjectIcon">
        </div>
    `;
}

/**
 * 
 * @param {Todo} todo
 * @returns Sanitized Todo HTML to inject into sidebar
 */
export const todoSidebarTemplate = todo => {
    return `
        <div class="item todo" data-uuid=${sanitizeHtml(todo.uuid)}>
            <img src="${note}" alt="Note icon for to-do" class="icon">
            <span class="text">${sanitizeHtml(todo.title)}</span>
            <img src="${minusBox}" alt="Minus box icon, click to remove to-do under selected project" class="icon removeProjectIcon">
        </div>
    `;
}

/**
 * Generate project HTML from an array of projects and injects them in order into the sidebar component.
 * Injects the HTML into the div elements with the .sidebar class.
 * @param {Project[]} projects The array of projects to be rendered to the sidebar 
 */
export const renderSidebar = (projects) => {
    let sidebars = document.querySelectorAll(".sidebar");

    // Clear old sidebar data
    let sidebarItems = document.querySelectorAll(".sidebar .itemContainer");
    sidebarItems.forEach(item => {
        item.remove();
    });

    // Inject projects and todos
    for (let p = 0; p < projects.length; p++) {
        let project = projects[p];
        let itemContainer = document.createElement("div");
        itemContainer.classList.add("itemContainer");

        // Generate project html
        let projectTemplate = document.createElement("template");
        projectTemplate.innerHTML = projectSidebarTemplate(project, p);
        let projectNode = projectTemplate.content.querySelector("div");
        let removeProjectBtn = projectNode.querySelector(".removeProjectIcon");
        removeProjectBtn.addEventListener("click", e => {
            projectRemoved(e, projects);
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

        // Inject html
        sidebars.forEach(sidebar => {
            sidebar.appendChild(itemContainer);
        });
    }
}

export const createTestProjects = (numProjects, numTodos) => {
    let projects = []
    for (let i = 0; i < numProjects; i++) {
        let project = new Project(`Project ${i}`, [], PROJECT_CHANGED_EVENT);
        for (let j = 0; j < numTodos; j++) {
            project.add(new Todo(`Todo ${j}`, "description", new Date(), j, "notes", TODO_CHANGED_EVENT));
        }
        projects.push(project);
    }
    return projects;
};