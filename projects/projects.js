import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON("../lib/projects.json");

const projectsContainer = document.querySelector(".projects");

const projectsTitle = document.querySelector(".projects-title");
projectsTitle.textContent = `${projects.length} Projects`;

let colors = d3.scaleOrdinal([
  "oklch(90% 0.06 0)",
  "oklch(80% 0.10 0)",
  "oklch(70% 0.14 0)",
  "oklch(60% 0.16 0)",
  "oklch(50% 0.16 0)",
  "oklch(40% 0.14 0)",
]);

let query = "";
let selectedYear = null;

function filterByQuery(projectsGiven) {
  return projectsGiven.filter((project) => {
    let values = Object.values(project).join("\n").toLowerCase();
    return values.includes(query.toLowerCase());
  });
}

function updatePage() {
  let searchedProjects = filterByQuery(projects);

  if (!searchedProjects.some((project) => project.year === selectedYear)) {
    selectedYear = null;
  }

  let visibleProjects =
    selectedYear === null
      ? searchedProjects
      : searchedProjects.filter((project) => project.year === selectedYear);

  renderProjects(visibleProjects, projectsContainer, "h2");
  renderPieChart(searchedProjects);
}

function renderPieChart(projectsGiven) {
  let rolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  rolledData.sort((a, b) => d3.descending(a[0], b[0]));

  let data = rolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(data);
  let arcs = arcData.map((d) => arcGenerator(d));

  let svg = d3.select("#projects-pie-plot");
  svg.selectAll("path").remove();

  let legend = d3.select(".legend");
  legend.selectAll("li").remove();

  arcs.forEach((arc, i) => {
    let year = data[i].label;

    svg
      .append("path")
      .attr("d", arc)
      .attr("fill", colors(year))
      .attr("class", year === selectedYear ? "selected" : "")
      .on("click", () => {
        selectedYear = selectedYear === year ? null : year;
        updatePage();
      });
  });

  data.forEach((d) => {
    legend
      .append("li")
      .attr("style", `--color:${colors(d.label)}`)
      .attr("class", d.label === selectedYear ? "legend-item selected" : "legend-item")
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

updatePage();

let searchInput = document.querySelector(".searchBar");

searchInput.addEventListener("change", (event) => {
  query = event.target.value;
  updatePage();
});