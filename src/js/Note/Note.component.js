import { note } from "./Note.templates";

export const createNoteContainer = () => {
    function clear(root) {
        root.innerHTML = "";
    }

    function render(root, todos) {
        clear(root);
        todos.forEach(todo => {
            let noteTemplate = document.createElement("template");
            noteTemplate.innerHTML = note(todo);
            let noteNode = noteTemplate.content.querySelector("div");
            root.appendChild(noteNode);
        });
        // root.appendChild(note);
    }

    let component = (function() {
        return {
            render,
            clear
        };
    })();

    return component;
}