import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { createSidebar } from "./Sidebar/Sidebar.component";
import { createTestProjects } from "./Sidebar/Sidebar.test";

// Create test projects
let {projects, selected} = createTestProjects(5, 5);

let sidebarNode = createSidebar(projects);
sidebarNode.render();

projects[0].addChangeListener(project => {
    // sidebarNode = createSidebar(projects);
    sidebarNode.render();
});
projects[0].remove(0);
projects[0].remove(0);
// console.log(projects[0]);