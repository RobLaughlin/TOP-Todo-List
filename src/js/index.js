import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { Project, Todo } from "./Todos";
import { projectSidebarTemplate, todoSidebarTemplate } from "./Sidebar";

function searchBarFocused(e) {
    e.preventDefault();

    let searchBar = e.target.parentElement;
    searchBar.classList.add("focused");
}

function searchBarUnFocused(e) {
    e.preventDefault();

    let searchBar = e.target.parentElement;
    searchBar.classList.remove("focused");
}

// Implement search bar event listeners
const searchInput = document.getElementsByClassName("search")[0];
searchInput.addEventListener("focusin", searchBarFocused);
searchInput.addEventListener("focusout", searchBarUnFocused);

// Create default project
let defaultProject = new Project("Default");
let sampleTodo = new Todo("Sample Todo");
defaultProject.add(sampleTodo);

let projects = [defaultProject];

// Inject projects and todos
projects.forEach(project => {
    let itemContainer = document.createElement("div");
    itemContainer.classList.add("itemContainer");

    // Generate project html
    let projectTemplate = document.createElement("template");
    projectTemplate.innerHTML = projectSidebarTemplate(project);
    const projectNode = projectTemplate.content.querySelector("div");
    itemContainer.appendChild(projectNode);

    // Generate todo html
    const todosHtml = project.todos.map(todoSidebarTemplate);
    todosHtml.forEach(todoHtml => {
        let todoTemplate = document.createElement("template");
        todoTemplate.innerHTML = todoHtml;
        const todoNode = todoTemplate.content.querySelector("div");
        itemContainer.appendChild(todoNode);
    });

    // Inject html
    let sidebar = document.getElementsByClassName("sidebar")[0];
    sidebar.appendChild(itemContainer);
});