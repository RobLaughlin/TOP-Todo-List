import folder from "../icons/folder.svg";
import minusBox from "../icons/minus-box.svg";
import note from "../icons/note.svg";
import sanitizeHtml from "sanitize-html";
import PubSub from "./PubSub";
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
 * 
 * @param {Project} project 
 * @returns Sanitized Project HTML to inject into sidebar
 */
export const projectSidebarTemplate = project => {
    return `
        <div class="item project">
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
        <div class="item todo">
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
        removeProjectBtn.addEventListener("click", () => {
            projects.splice(p);
            PubSub.publish("projectsChanged", projects);
        });
        itemContainer.appendChild(projectNode);

        // Generate todo html
        for (let t = 0; t < project.todos.length; t++) {
            let todoHtml = todoSidebarTemplate(project.todos[t], t);
            let todoTemplate = document.createElement("template");
            todoTemplate.innerHTML = todoHtml;
            let todoNode = todoTemplate.content.querySelector("div");
            let removeTodoBtn = todoNode.querySelector(".removeProjectIcon");
            removeTodoBtn.addEventListener("click", () => {
                project.remove(t);
                PubSub.publish("projectsChanged", projects);
            });
            itemContainer.appendChild(todoNode);
        } 

        // Inject html
        sidebars.forEach(sidebar => {
            sidebar.appendChild(itemContainer);
        });
    }
}