import Todo from "../Todos";

export const createNote = (Todo) => {

    function render(root) {
        root.innerHTML = "";
        // root.appendChild(note);
    }

    let component = (function() {
        return {
            render
        };
    })();

    return component;
}