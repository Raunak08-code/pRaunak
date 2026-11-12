import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { resumeData } from "../data";
import Learning from "./Learning";
import RoadAhead from "./RoadAhead";

type AboutPanel = "learning" | "road-ahead" | "certifications" | null;

const offerings = [
  {
    title: "DevOps Practices",
    description:
      "I connect source control, CI/CD, infrastructure monitoring, and continuous improvement to help teams deliver software consistently.",
  },
  {
    title: "Containerization with Docker",
    description:
      "I build portable environments with Docker and Compose, connecting services securely across multi-container setups.",
  },
  {
    title: "Kubernetes Orchestration",
    description:
      "I use Kubernetes to orchestrate workloads, manage deployments and scaling, and improve availability across clusters.",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "I work with AWS, Azure, and other cloud services for compute, storage, networking, and scalable infrastructure.",
  },
  {
    title: "Automation with IaC & Ansible",
    description:
      "I use Infrastructure as Code and Ansible to make provisioning and server configuration repeatable and maintainable.",
  },
  {
    title: "Problem Solving",
    description:
      "I have solved 120+ DSA problems on LeetCode, focusing on efficient algorithms and maintainable code.",
  },
];

const actionItems = [
  ["learning", "Currently Learning"],
  ["road-ahead", "Road Ahead"],
  ["certifications", "Certifications & Activities"],
  ["contact", "Get in Touch"],
] as const;

export default function About() {
  const [activePanel, setActivePanel] = useState<AboutPanel>(null);
  const aboutScrollY = useRef(0);
  const detailPageRef = useRef<HTMLDivElement>(null);
  const hadActivePanel = useRef(false);

  useLayoutEffect(() => {
    if (activePanel) {
      detailPageRef.current?.scrollTo(0, 0);
      hadActivePanel.current = true;
      return;
    }

    if (hadActivePanel.current) {
      const scrollContainer = document.getElementById("app-content");
      if (scrollContainer) scrollContainer.scrollTop = aboutScrollY.current;
      else window.scrollTo(0, aboutScrollY.current);
      hadActivePanel.current = false;
    }
  }, [activePanel]);

  useEffect(() => {
    if (!activePanel) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActivePanel(null);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [activePanel]);

  if (activePanel) {
    const panelTitles = {
      learning: "Currently Learning",
      "road-ahead": "Road Ahead",
      certifications: "Certifications and Activities",
    } as const;

    return (
      <div
        ref={detailPageRef}
        className="about-detail-page"
        role="dialog"
        aria-modal="true"
        aria-label={panelTitles[activePanel]}
      >
        <div className="about-detail-toolbar">
          <button
            type="button"
            className="about-detail-close"
            onClick={() => setActivePanel(null)}
            aria-label="Back to About"
          >
            <ArrowLeft aria-hidden="true" />
            <span>Back to About</span>
          </button>
        </div>
        {activePanel === "learning" && <Learning />}
        {activePanel === "road-ahead" && <RoadAhead />}
        {activePanel === "certifications" && (
          <section className="about-panel-content">
            <p className="about-kicker">Credentials &amp; community</p>
            <h1>Certifications &amp; Activities</h1>
            <div className="about-panel-list">
              {[...resumeData.certificationsList, ...resumeData.extraActivities].map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  }

  return (
    <section id="about" className="about-page">
      <header className="about-heading">
        <p className="about-kicker">About me</p>
        <h1>An Engineer on a Mission.</h1>
      </header>

      <div className="about-layout">
        <div className="about-left-column">
          <div className="about-intro">
            <p>
              I build cloud-native platforms and automation systems that make
              software infrastructure more reliable, observable, and scalable.
            </p>
            <p>
              From GlassBox, an observability platform monitoring system health,
              to NorthStar, a DevOps analytics platform bringing development
              activity, build history, and delivery insights together, I explore
              ways to make infrastructure and software workflows easier to
              understand and improve.
            </p>
            <p>
              GlassBox combines metrics, dashboards, and multi-container
              monitoring. NorthStar is evolving toward a broader view of
              development and engineering delivery insights.
            </p>
            <p>
              My mission is to engineer infrastructure that empowers developers
              to build, deploy, and operate software with confidence.
            </p>
          </div>

          <div className="about-action-list" aria-label="More about Raunak">
            {actionItems.map(([panel, label]) => panel === "contact" ? (
              <a
                key={panel}
                href="#contact"
                className="about-action-pill"
                onClick={(event) => {
                  event.preventDefault();
                  window.location.hash = "#contact";
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {label}<span aria-hidden="true">↗</span>
              </a>
            ) : (
              <button
                key={panel}
                type="button"
                className="about-action-pill"
                onClick={() => {
                  aboutScrollY.current =
                    document.getElementById("app-content")?.scrollTop ??
                    window.scrollY;
                  setActivePanel(panel);
                }}
              >
                {label}<span aria-hidden="true">↗</span>
              </button>
            ))}
          </div>
        </div>

        <section className="about-offerings" aria-labelledby="about-offerings-title">
          <p className="about-kicker">Capabilities</p>
          <h2 id="about-offerings-title">What I Do</h2>
          <div className="about-offerings-grid">
            {offerings.map((offering, index) => (
              <article className="about-offering" key={offering.title}>
                <span className="about-offering-number">0{index + 1}</span>
                <div>
                  <h3>{offering.title}</h3>
                  <p>{offering.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

    </section>
  );
}
