import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from "../global.js";

const projects = await fetchJSON("../lib/projects.json");

const projectsContainer = document.querySelector(".projects");

renderProjects(projects, projectsContainer, "h2");

const projectsTitle = document.querySelector(".projects-title");
projectsTitle.textContent = `${projects.length} Projects`;

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);

let rolledData = d3.rollups(
  projects,
  (v) => v.length,
  (d) => d.year,
);

rolledData.sort((a, b) => d3.descending(a[0], b[0]));

let data = rolledData.map(([year, count]) => {
  return { value: count, label: year };
});

let sliceGenerator = d3.pie().value((d) => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));

let colors = d3.scaleOrdinal([
  "oklch(90% 0.06 0)",
  "oklch(80% 0.10 0)",
  "oklch(70% 0.14 0)",
  "oklch(60% 0.16 0)",
  "oklch(50% 0.16 0)",
  "oklch(40% 0.14 0)",
]);

arcs.forEach((arc, idx) => {
  d3.select("#projects-pie-plot")
    .append("path")
    .attr("d", arc)
    .attr("fill", colors(idx));
});

let legend = d3.select(".legend");

data.forEach((d, idx) => {
  legend
    .append("li")
    .attr("style", `--color:${colors(idx)}`)
    .attr("class", "legend-item")
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});