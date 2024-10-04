import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { Project, Todo } from "./Todos";
import { renderSidebar } from "./Sidebar";

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

function removeTodoIconClicked(e) {
    const todoItem = e.target.parentElement.remove();
    e.target.parentElement.remove();
}

function removeProjectIconClicked(e) {
    const itemContainer = e.target.parentElement.parentElement;
    itemContainer.remove();
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
renderSidebar(projects);