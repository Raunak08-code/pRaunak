import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Container,
  Activity,
  BellRing,
  Braces,
  Cpu,
  Database,
  Eye,
  Gauge,
  Github,
  Layers3,
  Minus,
  Server,
  Terminal,
  Workflow,
  type LucideIcon,
  Plus,
} from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";
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
  if (project.id === "glassbox") return <GlassBoxCaseStudy project={project} />;

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

const glassboxCategories = ["DevOps", "SRE", "Observability", "Infrastructure Monitoring"];

const glassboxFlow = [
  { title: "Linux host", detail: "System and process activity", icon: Server },
  { title: "Python monitoring engine", detail: "psutil · process · Docker SDK", icon: Workflow },
  { title: "Prometheus exporter", detail: "HTTP :8000 · CPU / memory / disk gauges", icon: Activity },
  { title: "Prometheus", detail: "5-second scrape · PromQL", icon: Gauge },
  { title: "Grafana", detail: "Dashboards backed by Prometheus", icon: Eye },
];

const glassboxBranches = [
  { title: "PostgreSQL", detail: "Agent writes CPU, memory, disk, and network byte metrics.", icon: Database },
  { title: "Rich terminal", detail: "Live system health, top processes, and Docker container information.", icon: Terminal },
  { title: "Threshold alerts", detail: "In-process checks write warnings to the application logger.", icon: BellRing },
];

const glassboxSteps = [
  ["Telemetry collection", "The monitoring engine collects CPU utilization, memory usage, disk usage, disk availability, and network I/O statistics through psutil."],
  ["Process inspection", "Active processes are inspected for PID, name, CPU, memory, and status. The terminal view highlights the five highest CPU consumers."],
  ["Container monitoring", "The Docker SDK connects to the Docker Engine and retrieves running container status, memory use, and CPU utilization."],
  ["Metrics export", "The Prometheus client exposes CPU, memory, and disk usage as Gauge metrics through the HTTP endpoint on port 8000."],
  ["Metrics scraping", "Prometheus scrapes the GlassBox exporter every five seconds, making those metrics available to query with PromQL."],
  ["Visualization", "Grafana dashboards visualize infrastructure metrics using the Prometheus data source documented by the project."],
  ["Historical persistence", "The agent writes CPU, memory, disk, bytes sent, and bytes received to PostgreSQL."],
  ["Threshold-based alerting", "The in-process alert manager logs warnings above 80% CPU, above 85% memory, or when less than 10% disk space remains."],
  ["Live terminal observability", "A Rich-powered terminal dashboard presents system metrics, top processes, and Docker container statistics."],
];

const glassboxTechGroups: { name: string; items: { name: string; icon: LucideIcon }[] }[] = [
  { name: "Core Engineering", items: [{ name: "Python", icon: Braces }, { name: "psutil", icon: Gauge }, { name: "Rich", icon: Terminal }] },
  { name: "Observability", items: [{ name: "Prometheus", icon: Activity }, { name: "Prometheus Client", icon: Activity }, { name: "Grafana", icon: Eye }, { name: "PromQL", icon: Braces }] },
  { name: "Infrastructure", items: [{ name: "Docker", icon: Container }, { name: "Docker Compose", icon: Layers3 }, { name: "Docker SDK", icon: Container }] },
  { name: "Data Persistence", items: [{ name: "PostgreSQL", icon: Database }, { name: "psycopg2", icon: Database }] },
  { name: "Operations", items: [{ name: "Linux", icon: Server }, { name: "Application Logging", icon: Terminal }, { name: "Threshold Alerts", icon: BellRing }] },
];

const glassboxFeatures = [
  ["System resource monitoring", "Continuous CPU, memory, disk, and network telemetry collection.", Cpu],
  ["Process-level monitoring", "Resource analysis for active processes and identification of high-usage processes.", Activity],
  ["Container observability", "Visibility into running Docker containers and their resource consumption.", Container],
  ["Real-time terminal dashboard", "A live operational overview rendered with Rich.", Terminal],
  ["Prometheus metrics export", "Infrastructure gauges exposed through a scrape-compatible endpoint.", Gauge],
  ["Grafana visualization", "Dashboards for CPU, memory, and infrastructure metrics.", Eye],
  ["Historical data persistence", "PostgreSQL integration for storing system telemetry.", Database],
  ["Threshold-based alerting", "CPU, memory, and disk availability thresholds generate operational warnings.", BellRing],
  ["Containerized deployment", "Multi-container services are orchestrated with Docker Compose.", Layers3],
] satisfies [string, string, LucideIcon][];

const glassboxGallery = [
  ["Architecture.png", "System architecture reference"],
  ["terminal_dashboard.png", "Live terminal dashboard"],
  ["grafan_dashboard.png", "Grafana observability dashboard"],
  ["grafana_CPU_penel.png", "CPU monitoring panel"],
  ["grafana_memory_penel.png", "Memory monitoring panel"],
  ["prometheus_target.png", "Prometheus target verification"],
  ["promethus_CPU_query.png", "CPU metrics query"],
  ["prometheus_Memory_query.png", "Memory metrics query"],
  ["prometheus_disk_query.png", "Disk metrics query"],
  ["postgres_table.png", "PostgreSQL metrics persistence"],
  ["docker_ps.png", "Multi-container deployment"],
];

const glassboxDecisions = [
  ["Modular architecture", "System metrics, process monitoring, Docker monitoring, exporting, alerting, persistence, and dashboard rendering are separated into dedicated modules."],
  ["Containerized service integration", "Docker Compose networking connects the monitoring agent with PostgreSQL, Prometheus, and Grafana services."],
  ["Continuous metrics collection", "A repeating monitoring cycle collects and records observations at a configurable interval."],
  ["Resource thresholds", "Explicit CPU, memory, and disk-availability thresholds generate operational warnings."],
  ["Historical persistence", "A relational database preserves monitoring observations beyond the live terminal display."],
];

const glassboxRoadmap = [
  "Kubernetes cluster monitoring", "Distributed tracing integration", "Log aggregation pipeline",
  "Anomaly detection", "Historical analytics dashboards", "Service health APIs",
  "Slack and email alert notifications",
];

function CaseStudySection({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glassbox-section ${className}`}>
      <div className="glassbox-section-heading">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function GlassBoxCaseStudy({ project }: { project: ProjectItem }) {
  return (
    <article className="project-detail-page glassbox-case-study">
      <div className="project-detail-shell glassbox-shell">
        <a href="#/project" className="project-back-link">
          <ArrowLeft aria-hidden="true" /> Back to My Work
        </a>

        <header className="glassbox-hero">
          <p className="project-detail-kicker">Selected work · Technical case study</p>
          <h1>GlassBox</h1>
          <p className="glassbox-hero-tagline">Real-Time Infrastructure Observability &amp; Monitoring Platform</p>
          <div className="glassbox-category-list" aria-label="Project categories">
            {glassboxCategories.map((category) => <span key={category}>{category}</span>)}
          </div>
          <p className="glassbox-hero-description">
            GlassBox is a containerized observability platform engineered to provide real-time visibility into system health, process activity, Docker containers, and infrastructure telemetry.
          </p>
          <p className="glassbox-hero-description">
            Built using Python, Prometheus, Grafana, Docker, and PostgreSQL, GlassBox combines live terminal monitoring, metrics collection, visualization, historical persistence, and threshold-based alerting into a unified monitoring pipeline.
          </p>
          <ProjectLinks project={project} />
        </header>

        <CaseStudySection eyebrow="01 / Principles" title="Engineering Ideology">
          <div className="glassbox-ideology">
            <div>
              <p>GlassBox was built around the idea that infrastructure should not operate as a black box.</p>
              <p>The platform focuses on transforming raw system activity into meaningful operational visibility. Rather than relying on isolated monitoring commands, GlassBox integrates metrics collection, telemetry exposure, visualization, historical storage, and alerting into a connected observability workflow.</p>
            </div>
            <ul className="glassbox-principles">
              {["Visibility over assumptions", "Continuous monitoring over occasional inspection", "Metrics-driven operational decisions", "Modular monitoring components", "Reproducible deployment through containerization", "Early identification of resource pressure", "Simplifying infrastructure diagnostics"].map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </CaseStudySection>

        <CaseStudySection eyebrow="02 / System design" title="Architecture" className="glassbox-architecture-section">
          <p className="glassbox-section-intro">The monitoring agent fans telemetry out to separate persistence, terminal, and alerting paths. Prometheus scrapes the agent’s HTTP exporter, and Grafana visualizes the Prometheus data source.</p>
          <div className="glassbox-flow" aria-label="GlassBox metrics architecture">
            {glassboxFlow.map(({ title, detail, icon: Icon }, index) => (
              <div className="glassbox-flow-step" key={title}>
                <div className="glassbox-flow-card"><Icon aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></div>
                {index < glassboxFlow.length - 1 && <span className="glassbox-flow-arrow" aria-hidden="true">→</span>}
              </div>
            ))}
          </div>
          <div className="glassbox-branch-label"><span>Monitoring engine also feeds</span></div>
          <div className="glassbox-branches">
            {glassboxBranches.map(({ title, detail, icon: Icon }) => <article className="glassbox-branch-card" key={title}><Icon aria-hidden="true" /><div><h3>{title}</h3><p>{detail}</p></div></article>)}
          </div>
          <figure className="glassbox-reference-architecture">
            <img src="/projects/glassbox/Architecture.png" alt="Architecture diagram included with the GlassBox repository" loading="lazy" />
            <figcaption>Repository architecture sketch. The flow above reflects the service connections in the Compose and application configuration; the sketch’s PostgreSQL placement is not a Grafana data-source connection.</figcaption>
          </figure>
        </CaseStudySection>

        <CaseStudySection eyebrow="03 / Data path" title="How GlassBox Works">
          <ol className="glassbox-steps">
            {glassboxSteps.map(([title, detail], index) => <li key={title}><span className="glassbox-step-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}
          </ol>
        </CaseStudySection>

        <CaseStudySection eyebrow="04 / Tools" title="Technology Stack">
          <div className="glassbox-tech-grid">
            {glassboxTechGroups.map((group) => <article className="glassbox-tech-card" key={group.name}><h3>{group.name}</h3><ul>{group.items.map(({ name, icon: Icon }) => <li key={name}><Icon aria-hidden="true" /><span>{name}</span></li>)}</ul></article>)}
          </div>
        </CaseStudySection>

        <CaseStudySection eyebrow="05 / Capabilities" title="Key Engineering Features">
          <div className="glassbox-feature-grid">
            {glassboxFeatures.map(([title, detail, Icon]) => <article className="glassbox-feature-card" key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
        </CaseStudySection>

        <CaseStudySection eyebrow="06 / In the repository" title="Implementation Showcase">
          <div className="glassbox-gallery">
            {glassboxGallery.map(([filename, caption]) => <figure className="glassbox-gallery-card" key={filename}><a href={`/projects/glassbox/${filename}`} target="_blank" rel="noreferrer"><img src={`/projects/glassbox/${filename}`} alt={caption} loading="lazy" /></a><figcaption><span>{caption}</span><code>{filename}</code></figcaption></figure>)}
          </div>
        </CaseStudySection>

        <CaseStudySection eyebrow="07 / Implementation choices" title="Engineering Challenges &amp; Decisions">
          <div className="glassbox-decision-list">{glassboxDecisions.map(([title, detail], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
        </CaseStudySection>

        <CaseStudySection eyebrow="08 / Planned" title="Future Roadmap">
          <p className="glassbox-section-intro">These are planned improvements, not features in the current implementation.</p>
          <ul className="glassbox-roadmap">{glassboxRoadmap.map((item) => <li key={item}><span aria-hidden="true">↗</span>{item}<small>Planned</small></li>)}</ul>
        </CaseStudySection>

        <section className="glassbox-closing-summary">
          <p>In summary</p>
          <h2>From raw signals to operational visibility.</h2>
          <p>GlassBox demonstrates the engineering of a complete observability workflow — from infrastructure telemetry collection to metrics exposure, visualization, persistence, and alerting. It brings together core DevOps and SRE concepts into a modular, containerized monitoring platform.</p>
          <ProjectLinks project={project} />
        </section>
      </div>
    </article>
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
