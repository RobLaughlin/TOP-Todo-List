import folder from "../../icons/folder.svg";
import minusBox from "../../icons/minus-box.svg";
import note from "../../icons/note.svg";
import magnify from "../../icons/magnify.svg";
import plus from "../../icons/plus.svg";
import pencil from "../../icons/pencil.svg";

import sanitizeHtml from "sanitize-html";

/**
 * @module Sidebar/Template
 */

/**
 * The sidebar template
 * @returns Template to generate the sidebar component HTML
 */
export const sidebar = () => {
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
export const project = project => {
    return `
        <div class="item project" data-uuid=${sanitizeHtml(project.uuid)}>
            <img src="${folder}" alt="Folder icon" class="folder icon">
            <span class="text">${sanitizeHtml(project.name)}</span>
            <img src="${pencil}" alt="Edit icon, click to edit this project" class="icon editProjectIcon">
            <img src="${minusBox}" alt="Minus box icon, click to remove project" class="icon removeProjectIcon">
        </div>
    `;
}

/**
 * The todo template
 * @param {Todo} todo
 * @returns Sanitized Todo HTML to inject into sidebar
 */
export const todo = todo => {
    return `
        <div class="item todo invisible" data-uuid=${sanitizeHtml(todo.uuid)}>
            <img src="${note}" alt="Note icon for to-do" class="icon">
            <span class="text">${sanitizeHtml(todo.title)}</span>
            <img src="${pencil}" alt="Edit icon, click to edit this todo" class="icon editTodoIcon">
            <img src="${minusBox}" alt="Minus box icon, click to remove to-do under selected project" class="icon removeProjectIcon">
        </div>
    `;
}

/**
 * The template for adding todos
 * @returns The add todo item HTML
 */
export const addTodo = () => {
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
export const addTodoModal  = () => {
    return `
        <div class="addTodoModalContainer invisible">
            <dialog class="addTodoModal">
                <form method="dialog" id="AddTodoForm" autocomplete="off">
                    <div class="formRow" id="TodoTitleContainer">
                        <label for="TodoTitle" class="required-field">Title:</label>
                        <input type="text" id="TodoTitle" name="TodoTitle" placeholder="Todo Title" required/>
                    </div>
                    <div class="formRow" id="TodoDateContainer">
                        <label for="TodoDate" class="required-field">Due Date:</label>
                        <input type="date" id="TodoDate" name="TodoDate" required/>
                    </div>
                    <div class="formRow" id="TodoPriorityContainer">
                        <label for="TodoPriority" class="required-field">Priority:</label>
                        <input type="number" id="TodoPriority" name="TodoPriority" required value="0"/>
                    </div>
                    <div class="formRow" id="TodoDescriptionContainer">
                        <textarea id="TodoDescription" name="TodoDescription" placeholder="Description of todo goes here"></textarea>
                    </div>
                    <div class="formRow" id="TodoNotesContainer">
                        <textarea id="TodoNotes" name="TodoNotes" placeholder="Todo notes goes here"></textarea>
                    </div>
                    <div class="formRow" id="AddTodoBtnContainer">
                        <button id="AddTodoBtn" name="AddTodoBtn" onSubmit="return confirm('U sure?')">Add Todo</button>
                    </div>
                    <div class="formRow" id="TodoCloseBtnContainer">
                        <button id="TodoCloseBtn" name="TodoCloseBtn" formnovalidate>Close</button>
                    </div>
                </form>  
            </dialog>
        </div>
    `
}

/**
 * The template for adding projects
 * @returns The add project item HTML
 */
export const addProject = () => {
    return `
        <div class="itemContainer">
            <div class="item addProjectContainer">
                <input type="text" class="addProjectTextbox" placeholder="Project Name" />
                <img src="${plus}" alt="Plus icon, click to add a new project" class="icon">
            </div>
        </div>
    `;
}