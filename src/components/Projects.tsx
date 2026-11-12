import { useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Container,
  Activity,
  CircleAlert,
  CircleCheck,
  ClipboardList,
  BellRing,
  Braces,
  Cpu,
  Database,
  Eye,
  FileText,
  Filter,
  Gauge,
  Github,
  Inbox,
  Layers3,
  Mail,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
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
  if (project.id === "corvina") return <CorvinaCaseStudy project={project} />;

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

const corvinaMethodology: { title: string; detail: string; icon: LucideIcon }[] = [
  { title: "Frame the task", detail: "Reduce repetitive email handling while retaining a predictable, reviewable workflow.", icon: ClipboardList },
  { title: "Separate responsibilities", detail: "Keep retrieval, parsing, intent rules, templates, sending, and API orchestration in distinct modules.", icon: Layers3 },
  { title: "Expose an API", detail: "Use FastAPI for a health endpoint and an explicit endpoint that triggers email processing.", icon: Braces },
  { title: "Classify and respond", detail: "Normalize message text, match keywords, then choose a response template from JSON rules.", icon: Filter },
  { title: "Connect mail protocols", detail: "Retrieve through IMAP over SSL and deliver replies using SMTP with STARTTLS.", icon: Mail },
  { title: "Report outcomes", detail: "Log processing and return per-sender sent or failed status from the API.", icon: CircleCheck },
];

const corvinaArchitecture = [
  { title: "Mailbox", detail: "Unread messages", icon: Mail },
  { title: "IMAP reader", detail: "SSL · RFC822", icon: Inbox },
  { title: "Parser", detail: "Decode · normalize", icon: FileText },
  { title: "Rule engine", detail: "Keyword intent", icon: Filter },
  { title: "Text template", detail: "JSON mapping", icon: ClipboardList },
  { title: "SMTP sender", detail: "STARTTLS", icon: Send },
];

const corvinaWorkflow = [
  ["Trigger processing", "A caller invokes GET /process-emails on the FastAPI service; the endpoint starts a synchronous processing run."],
  ["Fetch unread mail", "The reader connects to the configured IMAP host over SSL, selects INBOX, and searches for UNSEEN messages."],
  ["Decode message fields", "The reader decodes the subject and sender. For multipart mail it extracts text/plain content and skips parts marked as attachments; a simple non-multipart body is decoded directly."],
  ["Normalize and classify", "The parser lowercases and strips punctuation, then checks for keywords associated with job, meeting, leave, support, or information requests."],
  ["Choose a response", "The rule engine loads config/rules.json and reads the selected text template. Unmapped intents fall back to the general template."],
  ["Skip self-sent messages", "Before sending, the API compares the sender with EMAIL_USER to avoid replying to the configured account itself."],
  ["Deliver the reply", "The sender builds a plain-text MIME message and attempts SMTP delivery to Gmail on port 587 with STARTTLS."],
  ["Return processing status", "The API returns totals and a sent/failed status for processed senders. A human approval step is not implemented."],
] as const;

const corvinaTechnologies: { category: string; items: { name: string; detail: string; icon: LucideIcon }[] }[] = [
  { category: "Backend", items: [
    { name: "Python", detail: "Email processing and application logic", icon: Braces },
    { name: "FastAPI", detail: "HTTP endpoints and orchestration", icon: Workflow },
    { name: "Uvicorn", detail: "ASGI server", icon: Server },
  ] },
  { category: "Email protocols", items: [
    { name: "IMAP over SSL", detail: "Unread mailbox retrieval", icon: Inbox },
    { name: "SMTP + STARTTLS", detail: "Outgoing mail delivery", icon: Send },
    { name: "Python email", detail: "RFC822 parsing and MIMEText messages", icon: Mail },
  ] },
  { category: "Intent and responses", items: [
    { name: "Keyword rules", detail: "Deterministic text matching", icon: Filter },
    { name: "JSON configuration", detail: "Intent-to-template mapping", icon: Braces },
    { name: "Text templates", detail: "Fixed reply content", icon: FileText },
  ] },
  { category: "Configuration and operations", items: [
    { name: "python-dotenv", detail: "Load local environment settings", icon: Settings },
    { name: "Python logging", detail: "Timestamped file logs", icon: ClipboardList },
    { name: "Docker", detail: "Python 3.12 container image", icon: Container },
  ] },
];

const corvinaCapabilities: [string, string, LucideIcon][] = [
  ["Unread mail retrieval", "Searches the selected IMAP inbox for UNSEEN messages and fetches RFC822 content.", Inbox],
  ["Message parsing", "Decodes the subject and sender and extracts available text/plain bodies, ignoring attachments.", FileText],
  ["Keyword intent matching", "Uses explicit string checks to classify job, meeting, leave, support, information, or general messages.", Filter],
  ["Template-based replies", "Loads fixed text responses from templates/ using a JSON intent map with a general fallback.", ClipboardList],
  ["API-triggered processing", "Exposes a health endpoint and GET /process-emails, which returns totals and per-sender outcomes.", Braces],
  ["Mail delivery and self-check", "Attempts SMTP delivery and skips messages whose sender matches EMAIL_USER.", Send],
];

const corvinaDecisions = [
  ["Python standard mail libraries", "imaplib, smtplib, email parsing, and MIMEText cover the current protocol and message tasks without an additional mail SDK."],
  ["FastAPI as the trigger surface", "A small HTTP API exposes health and processing operations; processing remains synchronous within the request."],
  ["Rules and templates", "JSON rules and text files keep classification and reply wording inspectable and easy to edit, at the cost of limited context awareness."],
  ["Environment-based credentials", "Email account values are read from environment variables and a .env.example documents expected settings."],
  ["Automatic sending after trigger", "The endpoint sends replies without an approval queue. This keeps the implementation simple but does not provide a human review checkpoint."],
];

const corvinaConsiderations = [
  ["Intent labels and rules can diverge", "The parser returns leave_request and request_info, while rules.json maps leave and has no request_info entry. Those intents therefore use the general fallback; align the names and add focused tests."],
  ["Mailbox state and delivery recovery", "The reader searches UNSEEN and fetches messages with RFC822, which IMAP defines as BODY[] and which implicitly sets \\Seen. That can mark a message read before SMTP delivery succeeds. The source has no explicit acknowledge-after-send, UID tracking, retry, or durable processing history."],
  ["Mail configuration is partly hardcoded", "The example lists SMTP_SERVER and SMTP_PORT, but the sender currently uses smtp.gmail.com:587 directly. Read the configured values consistently and validate them at startup."],
  ["Failure handling is basic", "IMAP exceptions are logged and return an empty list; SMTP exceptions return false. The code has no retry loop or durable processing queue."],
  ["Container port declarations differ", "The Dockerfile exposes 8080, while its Uvicorn command listens on 8000. Align the container and deployment port configuration."],
  ["Processing endpoint has side effects", "GET /process-emails can send external messages and has no authentication in this source. Use an authenticated POST operation and add rate limits before exposing it broadly."],
];

const corvinaRoadmap = [
  { phase: "01", title: "Foundation · implemented", items: ["FastAPI health and processing endpoints", "IMAP retrieval and SMTP delivery", "Keyword rules and file-based response templates"] },
  { phase: "02", title: "Intelligence and integration · planned", items: ["Optional model-backed response drafts", "Improved message classification", "Configurable response behavior", "Protocol and parsing tests"] },
  { phase: "03", title: "Controlled automation · exploratory", items: ["Human approval before sending", "Idempotent processing and durable history", "Authentication, rate limits, and monitoring", "Background processing and additional mail providers"] },
];

function CorvinaSection({
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
    <section className={`corvina-section ${className}`}>
      <div className="corvina-section-heading">
        <p>{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function CorvinaCaseStudy({ project }: { project: ProjectItem }) {
  return (
    <article className="project-detail-page corvina-case-study">
      <div className="project-detail-shell corvina-shell">
        <a href="#/project" className="project-back-link">
          <ArrowLeft aria-hidden="true" /> Back to My Work
        </a>

        <header className="corvina-hero">
          <p className="project-detail-kicker">Selected work · Engineering case study</p>
          <h1>CORVINA</h1>
          <p className="corvina-tagline">Intelligent Email Assistance, Engineered for Productivity.</p>
          <div className="corvina-categories">
            {["Email Automation", "Backend Engineering", "FastAPI", "IMAP · SMTP"].map((item) => <span key={item}>{item}</span>)}
          </div>
          <p className="corvina-lede">CORVINA explores how email protocols, backend APIs, and automated response selection can reduce repetitive communication work.</p>
          <p className="corvina-lede">In the supplied implementation, response selection is deterministic: the parser matches keywords and the rule engine loads a fixed text template. The repository contains no AI provider, model SDK, or prompt implementation, so model-generated replies are described as a possible next step—not a current feature.</p>
          <ProjectLinks project={project} />
          <div className="corvina-implementation-note"><CircleAlert aria-hidden="true" /><p><strong>Implementation note</strong> The project is framed as an AI email assistant, but this source version uses keyword rules and static templates rather than AI inference.</p></div>
        </header>

        <CorvinaSection eyebrow="01 / Purpose" title="Engineering the Intent Behind Every Email">
          <div className="corvina-ideology-copy">
            <p>Email remains an important communication system, yet repetitive messages consume time and attention. CORVINA starts from the principle that automation should reduce routine work without hiding how a response was selected.</p>
            <p>It treats a reply as a small processing pipeline: retrieve a message, normalize its content, detect a rule-based intent, select a response template, and deliver the result. The current implementation sends the selected template automatically after the API is triggered; it does not include a user approval step.</p>
            <p>The project is a practical exploration of extending familiar email infrastructure with modular backend automation. Its current rule-based design also provides a clear baseline for evaluating more contextual, AI-assisted drafts later.</p>
          </div>
          <div className="corvina-philosophy-grid">
            <article><Inbox aria-hidden="true" /><h3>Context Before Automation</h3><p>The current parser normalizes message text and checks explicit keywords. Replies are fixed templates, so they are not yet personalized from the full message context.</p></article>
            <article><ShieldCheck aria-hidden="true" /><h3>Human Judgment Over Blind Automation</h3><p>Today, the triggered endpoint sends automatically without human review. Approval and draft review are important future controls, not implemented behavior.</p></article>
            <article><Workflow aria-hidden="true" /><h3>Engineering for Practical Utility</h3><p>Use existing mail protocols, a focused FastAPI service, editable rules, and readable templates to keep the current workflow understandable.</p></article>
          </div>
        </CorvinaSection>

        <CorvinaSection eyebrow="02 / Approach" title="From Communication Problem to Automated Workflow">
          <ol className="corvina-methodology">
            {corvinaMethodology.map(({ title, detail, icon: Icon }, index) => <li key={title}><span className="corvina-method-number">0{index + 1}</span><div className="corvina-method-card"><Icon aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></div></li>)}
          </ol>
          <p className="corvina-validation-note"><strong>Validation in the supplied repository:</strong> the README lists scenarios such as internship, meeting, empty-body, SMTP-failure, and no-unread-mail cases. The ZIP does not include an automated test suite, so these are documented scenarios rather than verified automated tests.</p>
        </CorvinaSection>

        <CorvinaSection eyebrow="03 / System design" title="Inside the System">
          <p className="corvina-section-intro">A caller triggers a synchronous FastAPI operation. The service then reads messages, applies deterministic rules, sends replies, and returns a processing summary. No database, queue, authentication layer, or model service appears in this repository.</p>
          <div className="corvina-architecture" aria-label="CORVINA current architecture">
            {corvinaArchitecture.map(({ title, detail, icon: Icon }, index) => <div className="corvina-architecture-step" key={title}><div className="corvina-architecture-card"><span className="corvina-architecture-index">0{index + 1}</span><Icon aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></div>{index < corvinaArchitecture.length - 1 && <span className="corvina-architecture-arrow" aria-hidden="true">→</span>}</div>)}
          </div>
          <div className="corvina-api-return"><Braces aria-hidden="true" /><div><h3>FastAPI request and result</h3><p><code>GET /</code> returns a health message. <code>GET /process-emails</code> triggers the pipeline and returns total, success, failure, and per-sender status fields.</p></div></div>
          <div className="corvina-architecture-footnote"><strong>Current boundaries:</strong> IMAP retrieval and SMTP sending are present; response generation is template-based. There is no model provider, persistence database, queue, or approval interface in the supplied source.</div>
        </CorvinaSection>

        <CorvinaSection eyebrow="04 / Runtime" title="The Journey of an Email">
          <ol className="corvina-workflow">
            {corvinaWorkflow.map(([title, detail], index) => <li key={title}><span className="corvina-workflow-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{detail}</p></div></li>)}
          </ol>
        </CorvinaSection>

        <CorvinaSection eyebrow="05 / Technology" title="Technologies Behind CORVINA">
          <div className="corvina-tech-grid">
            {corvinaTechnologies.map((group) => <article className="corvina-tech-card" key={group.category}><h3>{group.category}</h3><ul>{group.items.map(({ name, detail, icon: Icon }) => <li key={name}><Icon aria-hidden="true" /><div><strong>{name}</strong><span>{detail}</span></div></li>)}</ul></article>)}
          </div>
          <div className="corvina-ai-note"><Sparkles aria-hidden="true" /><p><strong>AI status:</strong> no provider, model, SDK, prompt, or model-output handler is present in this ZIP. AI-assisted drafting remains a potential extension.</p></div>
        </CorvinaSection>

        <CorvinaSection eyebrow="06 / Capabilities" title="What CORVINA Can Do">
          <div className="corvina-capabilities">
            {corvinaCapabilities.map(([title, detail, Icon]) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{detail}</p></article>)}
          </div>
        </CorvinaSection>

        <CorvinaSection eyebrow="07 / Rationale" title="Decisions Behind the Design">
          <div className="corvina-decisions"><div className="corvina-decision-header"><span>Engineering decision</span><span>Technical rationale and trade-off</span></div>{corvinaDecisions.map(([decision, rationale]) => <article key={decision}><h3>{decision}</h3><p>{rationale}</p></article>)}</div>
        </CorvinaSection>

        <CorvinaSection eyebrow="08 / Operational awareness" title="Designed with Operational Awareness">
          <div className="corvina-security-layout">
            <article className="corvina-security-card"><ShieldCheck aria-hidden="true" /><h3>Present in the source</h3><ul><li>Account credentials are read from environment variables; .env.example documents expected names.</li><li>IMAP connections use IMAP4_SSL.</li><li>SMTP sends use STARTTLS before login.</li><li>The API skips a message when its sender matches EMAIL_USER.</li><li>The logger writes timestamped records to logs/app.log.</li></ul></article>
            <article className="corvina-security-card corvina-security-gaps"><CircleAlert aria-hidden="true" /><h3>Not implemented / needs attention</h3><ul><li>No OAuth flow, API authentication, or rate limiting is present.</li><li>The processing endpoint sends mail automatically; no approval gate is implemented.</li><li>SMTP host and port are hardcoded despite example environment settings.</li><li>No durable idempotency, retry queue, or message history store is included.</li><li>The code does not establish end-to-end encryption or production security.</li></ul></article>
          </div>
        </CorvinaSection>

        <CorvinaSection eyebrow="09 / Technical considerations" title="Challenges That Shape the System">
          <p className="corvina-section-intro">These are implementation findings and engineering considerations visible in the source, not claims of undocumented production incidents.</p>
          <div className="corvina-considerations">{corvinaConsiderations.map(([title, detail]) => <article key={title}><CircleAlert aria-hidden="true" /><div><h3>{title}</h3><p>{detail}</p></div></article>)}</div>
        </CorvinaSection>

        <CorvinaSection eyebrow="10 / Planned" title="Where CORVINA Can Evolve">
          <div className="corvina-roadmap">{corvinaRoadmap.map(({ phase, title, items }) => <article key={phase}><span className="corvina-roadmap-phase">Phase {phase}</span><h3>{title}</h3><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div>
        </CorvinaSection>

        <section className="corvina-summary">
          <p className="corvina-summary-kicker">More Than an Email Responder</p>
          <h2>A foundation for practical, human-centered automation.</h2>
          <p>CORVINA is an exploration of email automation at the intersection of backend engineering and communication infrastructure. Its current implementation combines protocol-based retrieval, rule-based intent selection, template responses, and API-driven delivery; a model-backed, approval-aware workflow remains future work.</p>
          <div className="corvina-summary-meta"><span>Project <strong>CORVINA</strong></span><span>Category <strong>Email automation</strong></span><span>Current stack <strong>Python · FastAPI · IMAP · SMTP · Docker</strong></span></div>
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
