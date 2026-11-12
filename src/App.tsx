import { useEffect, useLayoutEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { ArrowUp, Github, Instagram, Linkedin } from "lucide-react";
import About from "./components/About";
import Blogs from "./components/Blogs";
import Contact from "./components/Contact";
import Education from "./components/Education";
import Navbar from "./components/Navbar";
import Projects, { PROJECT_RETURN_SCROLL_KEY } from "./components/Projects";
import { resumeData } from "./data";

type SectionPage = "about" | "edu-skill" | "project" | "blogs-extra" | "contact";
type Page = "home" | "portfolio" | `project/${string}`;

const getPageFromHash = (): Page => {
  const hash = window.location.hash;
  const page = hash.replace(/^#\/?/, "");
  if (page.startsWith("project/")) {
    const projectId = page.slice("project/".length);
    if (resumeData.projects.some((project) => project.id === projectId)) {
      return `project/${projectId}`;
    }
    return "portfolio";
  }

  return [
    "",
    "landing",
    "about",
    "edu-skill",
    "education",
    "skills",
    "project",
    "projects",
    "blogs-extra",
    "blogs",
    "contact",
  ].includes(page)
    ? page
      ? "portfolio"
      : "home"
    : "home";
};

const getSectionPageFromHash = (): SectionPage => {
  const page = window.location.hash.replace(/^#\/?/, "");
  if (page === "edu-skill" || page === "education" || page === "skills") {
    return "edu-skill";
  }
  if (page === "project" || page === "projects") return "project";
  if (page === "blogs-extra" || page === "blogs") return "blogs-extra";
  if (page === "contact") return "contact";
  return "about";
};

const getSectionTargetFromHash = (): string | null => {
  const page = window.location.hash.replace(/^#\/?/, "");
  if (page === "landing") return "landing";
  if (page === "about") return "about";
  if (["edu-skill", "education", "skills"].includes(page)) return "education";
  if (["project", "projects"].includes(page)) return "projects";
  if (["blogs-extra", "blogs"].includes(page)) return "blogs";
  if (page === "contact") return "contact";
  return null;
};

function LandingPage() {
  return (
    <section id="landing" className="landing-hero" aria-label="Landing page">
      <section className="landing-intro" aria-labelledby="landing-name">
        <p className="landing-eyebrow">Cloud · DevOps · Platform Engineering</p>
        <h1 id="landing-name">RAUNAK<br />PANDEY</h1>
        <span className="landing-rule" aria-hidden="true" />
        <nav className="landing-socials" aria-label="Social profiles">
          <a href={resumeData.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <Instagram aria-hidden="true" />
          </a>
          <a href={resumeData.github} target="_blank" rel="noreferrer" aria-label="GitHub">
            <Github aria-hidden="true" />
          </a>
          <a href={resumeData.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <Linkedin aria-hidden="true" />
          </a>
        </nav>
      </section>

      <div className="landing-portrait-wrap">
        <img
          className="landing-portrait"
          src="/raunak-cutout.png"
          alt="Portrait of Raunak Pandey"
        />
      </div>

      <section className="landing-copy" aria-labelledby="landing-role">
        <p className="landing-eyebrow">Introducing</p>
        <h2 id="landing-role">DevOps &amp; Cloud Infrastructure Engineer.</h2>
        <p>
          I build and automate cloud infrastructure, engineering reliable,
          scalable systems that simplify software deployment and operations.
        </p>
        <p>
          My mission is to make infrastructure smarter, resilient, and built for
          continuous innovation.
        </p>
        <a className="landing-story-link" href="#about">
          My Story <span aria-hidden="true">→</span>
        </a>
      </section>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <a className="site-footer-brand" href="#landing" aria-label="Raunak Pandey landing page">
          <span className="site-footer-logo" aria-hidden="true">R</span>
          <span>
            <strong>Raunak</strong>
            <small>© {new Date().getFullYear()}</small>
          </span>
        </a>
        <a href="#landing" className="site-footer-top">
          Move to Top
          <ArrowUp aria-hidden="true" className="h-4 w-4" />
        </a>
      </div>
    </footer>
  );
}

function BlogsPage() {
  return <Blogs />;
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);
  const [activeSection, setActiveSection] = useState<SectionPage>(
    getSectionPageFromHash,
  );

  useEffect(() => {
    const handleHashChange = () => {
      const nextPage = getPageFromHash();
      setPage(nextPage);
      setActiveSection(getSectionPageFromHash());
      if (nextPage === "portfolio" && page === "portfolio") {
        requestAnimationFrame(() => {
          document.getElementById(getSectionTargetFromHash() ?? "")?.scrollIntoView({ behavior: "smooth" });
        });
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [page]);

  useLayoutEffect(() => {
    if (page !== "portfolio") return;
    const hash = window.location.hash.replace(/^#\/?/, "");
    const returnScroll = sessionStorage.getItem(PROJECT_RETURN_SCROLL_KEY);
    if (
      (hash === "project" || hash === "projects") &&
      returnScroll !== null
    ) {
      document
        .getElementById("app-content")
        ?.scrollTo(0, Number(returnScroll));
      sessionStorage.removeItem(PROJECT_RETURN_SCROLL_KEY);
      return;
    }

    const targetId = getSectionTargetFromHash();
    if (targetId) document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
  }, [page]);

  useEffect(() => {
    if (page.startsWith("project/")) return;

    const sections = [
      { id: "about", page: "about" },
      { id: "education", page: "edu-skill" },
      { id: "projects", page: "project" },
      { id: "blogs", page: "blogs-extra" },
      { id: "contact", page: "contact" },
    ] as const;
    const scrollContainer = document.getElementById("app-content");
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        const currentSection = visibleSections[0]?.target.id;
        const activePage = sections.find(({ id }) => id === currentSection)?.page;
        if (activePage) setActiveSection(activePage);
      },
      {
        root: scrollContainer,
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach(({ id }) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [page]);

  if (page.startsWith("project/")) {
    return (
      <div className="ink-indigo min-h-screen bg-[var(--ink-black)] text-[var(--cloud-white)]">
        <Navbar activePage="project" />
        <main id="app-content" className="app-content">
          <Projects projectId={page.slice("project/".length)} />
        </main>
        <Analytics />
      </div>
    );
  }

  return (
    <div className="ink-indigo min-h-screen bg-[var(--ink-black)] text-[var(--cloud-white)] selection:bg-[var(--midnight-indigo)] selection:text-[var(--cloud-white)]">
      <Navbar activePage={activeSection} />
      <main id="app-content" className="app-content">
        <LandingPage />
        <About />
        <Education />
        <Projects />
        <BlogsPage />
        <Contact />
        <SiteFooter />
      </main>
      <Analytics />
    </div>
  );
}
