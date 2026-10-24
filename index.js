import { fetchJSON, renderProjects, fetchGitHubData } from "./global.js";

const projects = await fetchJSON("./lib/projects.json");
const latestProjects = projects.slice(0, 3);

const projectsContainer = document.querySelector(".projects");
renderProjects(latestProjects, projectsContainer, "h2");

const githubData = await fetchGitHubData("xuan0035");

const profileStats = document.querySelector("#profile-stats");

if (profileStats) {
  profileStats.innerHTML = `
    <dl>
      <dt>Public Repos</dt><dd>${githubData.public_repos}</dd>
      <dt>Member Since</dt><dd>${new Date(githubData.created_at).getFullYear()}</dd>
      <dt>Location</dt><dd>${githubData.location || "Not set"}</dd>
    </dl>
  `;
}