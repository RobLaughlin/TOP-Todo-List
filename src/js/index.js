import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { ProjectMap, Project, Todo } from "./Todos";

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

let defaultProject = new Project("Default");
let defaultTodo = new Todo("Default Todo");
defaultProject.add(defaultTodo);

let projects = new ProjectMap([defaultProject], "projectSelected");
console.log(projects);