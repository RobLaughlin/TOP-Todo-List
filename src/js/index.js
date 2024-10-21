import "./../css/sidebar.css";
import "./../css/todos.css";
import "./../css/index.css";

import { createSidebar, createTestProjects } from "./Sidebar";

// Create test projects
let {projects, selected} = createTestProjects(5, 5);

let root = document.getElementsByClassName("sidebar")[0];
let sidebarNode = createSidebar(projects);
sidebarNode.render();