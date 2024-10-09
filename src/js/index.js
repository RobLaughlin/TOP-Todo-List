import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { Project, Todo } from "./Todos";
import { renderSidebar, createTestProjects } from "./Sidebar";

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

// Create test projects
let projects = createTestProjects(5, 5);
console.log(projects);
renderSidebar(projects);