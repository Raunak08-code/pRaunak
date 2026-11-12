import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Container,
  Github,
  Minus,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import type { ProjectItem } from "../types";
import { resumeData } from "../data";

export const PROJECT_RETURN_SCROLL_KEY = "portfolio-project-return-scroll";

type ProjectLink = {
  label: string;
  href: string;
};

function getProjectLinks(project: ProjectItem): ProjectLink[] {
  const links: ProjectLink[] = [];
  const githubHref = project.github ?? resumeData.github;
  if (githubHref) links.push({ label: "GitHub", href: githubHref });
  const docker = project.docker ?? resumeData.dockerHub;
  if (docker) links.push({ label: "Docker Hub", href: docker });
  if (project.live) links.push({ label: "Live Site", href: project.live });
  if (project.report) links.push({ label: "Project Report", href: project.report });
  return links;
}

function ProjectLinks({ project }: { project: ProjectItem }) {
  return (
    <div className="project-detail-links">
      {getProjectLinks(project).map(({ label, href }) => (
        <a key={label} href={href} target="_blank" rel="noreferrer">
          {label === "GitHub" ? (
            <Github aria-hidden="true" />
          ) : label === "Docker Hub" ? (
            <Container aria-hidden="true" />
          ) : (
            <ArrowUpRight aria-hidden="true" />
          )}
          {label}
          {label !== "GitHub" && label !== "Docker Hub" && (
            <ArrowUpRight aria-hidden="true" className="project-link-external" />
          )}
        </a>
      ))}
    </div>
  );
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const [minimized, setMinimized] = useState(false);
  const githubHref = project.github ?? resumeData.github;
  const dockerHref = project.docker ?? resumeData.dockerHub;

  const rememberScrollPosition = () => {
    const scrollTop = document.getElementById("app-content")?.scrollTop ?? window.scrollY;
    sessionStorage.setItem(PROJECT_RETURN_SCROLL_KEY, String(scrollTop));
  };

  return (
    <motion.article
      id={`project-card-${project.id}`}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.3 }}
      className={`project-card${minimized ? " is-minimized" : ""}`}
    >
      <header className="project-card-heading">
        <div>
          <h2>{project.title}</h2>
          <p>{project.subtitle}</p>
          {project.status === "In Development" && (
            <span className="project-status">In Development</span>
          )}
        </div>
        <button
          type="button"
          className="project-minimize"
          aria-label={`${minimized ? "Expand" : "Minimize"} ${project.title} card`}
          aria-expanded={!minimized}
          onClick={() => setMinimized((value) => !value)}
        >
          {minimized ? <Plus aria-hidden="true" /> : <Minus aria-hidden="true" />}
        </button>
      </header>

      {!minimized && (
        <>
          <p className="project-card-description">{project.description[0]}</p>
          <div className="project-card-footer">
            <div className="project-card-links">
              {githubHref && (
                <a href={githubHref} target="_blank" rel="noreferrer" aria-label={`${project.title} on GitHub`}>
                  <Github aria-hidden="true" />
                </a>
              )}
              {dockerHref && (
                <a href={dockerHref} target="_blank" rel="noreferrer" aria-label={`${project.title} on Docker Hub`}>
                  <Container aria-hidden="true" />
                </a>
              )}
            </div>
            <a
              href={`#/project/${project.id}`}
              className="project-read-more"
              onClick={rememberScrollPosition}
            >
              Read More <span aria-hidden="true">→</span>
            </a>
          </div>
        </>
      )}
    </motion.article>
  );
}

function ProjectDetail({ project }: { project: ProjectItem }) {
  const supportingDetails = project.description.slice(1);

  return (
    <section className="project-detail-page">
      <div className="project-detail-shell">
        <a href="#/project" className="project-back-link">
          <ArrowLeft aria-hidden="true" />
          Back to My Work
        </a>

        <header className="project-detail-heading">
          <p className="project-detail-kicker">Selected work</p>
          <h1>{project.title}</h1>
          <p className="project-detail-tagline">{project.subtitle}</p>
          {project.status === "In Development" && (
            <span className="project-status">In Development</span>
          )}
        </header>

        <div className="project-detail-grid">
          <section aria-labelledby="project-overview-title">
            <h2 id="project-overview-title">Overview</h2>
            <p className="project-overview-text">{project.description[0]}</p>
            {supportingDetails.length > 0 && (
              <div className="project-detail-notes">
                {supportingDetails.map((detail) => (
                  <p key={detail}>{detail}</p>
                ))}
              </div>
            )}
          </section>

          <section className="project-stack-section" aria-labelledby="project-stack-title">
            <h2 id="project-stack-title">Tech Stack</h2>
            <ul className="project-stack-list">
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
            <h2 className="project-resource-title">Project Links</h2>
            <ProjectLinks project={project} />
          </section>
        </div>
      </div>
    </section>
  );
}

export default function Projects({ projectId }: { projectId?: string }) {
  if (projectId) {
    const project = resumeData.projects.find(({ id }) => id === projectId);
    if (project) return <ProjectDetail project={project} />;
  }

  return (
    <section id="projects" className="projects-page">
      <div className="projects-shell">
        <header className="projects-heading">
          <p className="project-detail-kicker">Selected work</p>
          <h1>My Work</h1>
        </header>
        <div className="projects-grid">
          {resumeData.projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
