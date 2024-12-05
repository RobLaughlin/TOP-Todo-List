import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/note.css";
import "./../css/index.css";

import { createSidebar } from "./Sidebar/Sidebar.component";
import { createTestProjects } from "./Sidebar/Sidebar.test";
import { createNoteContainer } from "./Note/Note.component";
import PubSub from "./PubSub";

const NUM_TEST_PROJECTS = 5;
const NUM_TODOS_PER_TEST_PROJECT = 4;

function renderTodos(noteContainer, todos) {
    noteContainer.render(noteContainerRoot, todos);
};

// Create test projects
let {projects, selected} = createTestProjects(NUM_TEST_PROJECTS, NUM_TODOS_PER_TEST_PROJECT);

let sidebarNode = createSidebar(projects);
sidebarNode.render();

for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    project.addChangeListener(_ => {
        sidebarNode.render();
        const selectedUUID = sidebarNode.currentProject();
        for (let j = 0; j < projects.length; j++) {
            const project = projects[j];
            if (project.uuid === selectedUUID) {
                renderTodos(noteContainer, project.todos);
                break;
            }
        }
        
    });
}

const noteContainerRoot = document.querySelector(".todos > .noteContainer");
let noteContainer = createNoteContainer();
noteContainer.render(noteContainerRoot, projects[0].todos);

PubSub.subscribe("projectSelected", selectedUUID => {
    for (let i = 0; i < projects.length; i++) {
        let project = projects[i];
        if (project.uuid === selectedUUID) {
            noteContainer.render(noteContainerRoot, project.todos);
            break;
        }
    }
});