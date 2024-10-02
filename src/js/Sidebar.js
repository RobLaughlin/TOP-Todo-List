import folder from "../icons/folder.svg";
import minusBox from "../icons/minus-box.svg";
import note from "../icons/note.svg";
import sanitizeHtml from "sanitize-html";

/**
 * 
 * @param {Project} project 
 * @returns Sanitized Project HTML to inject into sidebar
 */
export const projectSidebarTemplate = (project) => {
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
 * @param {string} projectUUID 
 * @returns Sanitized Todo HTML to inject into sidebar
 */
export const todoSidebarTemplate = (todo) => {
    return `
        <div class="item todo">
            <img src="${note}" alt="Note icon for to-do" class="icon">
            <span class="text">${sanitizeHtml(todo.title)}</span>
            <img src="${minusBox}" alt="Minus box icon, click to remove to-do under selected project" class="icon removeProjectIcon">
        </div>
    `;
}