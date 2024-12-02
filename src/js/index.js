import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/note.css";
import "./../css/index.css";

import { createSidebar } from "./Sidebar/Sidebar.component";
import { createTestProjects } from "./Sidebar/Sidebar.test";
import { sidebar } from "./Sidebar/Sidebar.templates";

const NUM_TEST_PROJECTS = 5;
const NUM_TODOS_PER_TEST_PROJECT = 4;

// Create test projects
let {projects, selected} = createTestProjects(NUM_TEST_PROJECTS, NUM_TODOS_PER_TEST_PROJECT);

let sidebarNode = createSidebar(projects);
sidebarNode.render();

for (let i = 0; i < projects.length; i++) {
    let project = projects[i];
    project.addChangeListener(_ => {
        sidebarNode.render();
    });
}