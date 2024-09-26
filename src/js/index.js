import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

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

const searchInput = document.getElementsByClassName("search")[0];
searchInput.addEventListener("focusin", searchBarFocused);
searchInput.addEventListener("focusout", searchBarUnFocused);