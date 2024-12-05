import sanitizeHtml from "sanitize-html";

export const note = (todo) => {
    return `
    <div class="note">
        <div class="title">
            <span class="text">${sanitizeHtml(todo.title)}</span>
        </div>
        <div class="body">
            <div class="priority textContainer">
                <span class="text">Priority: ${sanitizeHtml(todo.priority)}</span>
            </div>
            <div class="date textContainer">
                <span class="text">${sanitizeHtml(todo.dueDate.toDateString())}</span>
            </div>
            <div class="description textContainer">
                <span class="text">${sanitizeHtml(todo.description)}</span>
            </div>
            <div class="notes textContainer">
                <span class="text">${sanitizeHtml(todo.notes)}</span>
            </div>
        </div>
    </div>
    `;
};