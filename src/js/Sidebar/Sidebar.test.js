import { Project, Todo } from "../Todos";

/**
 * @module Sidebar/Test
 */

/**
 * Generates a number of projects and todos to use as test data
 * @param {number} numProjects The number of projects to generate 
 * @param {number} numTodos The number of todos to generate within each project
 * @returns {Project[]} The array of test projects generated
 */
export const createTestProjects = (numProjects, numTodos) => {
    let projects = []
    for (let i = 0; i < numProjects; i++) {
        let project = new Project(`Project ${i}`, []);
        for (let j = 0; j < numTodos; j++) {
            project.add(new Todo(`Project ${i} - Todo ${j}`, "description - Deserunt mollit ea nostrud minim aliquip ex laboris labore labore.", new Date(), j, "notes - Laboris aute velit ipsum exercitation sint dolor ad."));
        }
        projects.push(project);
    }

    const selected = numProjects >= 1 ? projects[0].uuid : null;
    return { projects, selected };
};