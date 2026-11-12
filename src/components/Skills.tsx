import {
  Activity,
  BellRing,
  Braces,
  Cloud,
  Code2,
  Container,
  Database,
  Eye,
  GitBranch,
  Gauge,
  Network,
  Server,
  Terminal,
  TestTube2,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const skillGroups = [
  {
    category: "Programming Languages",
    skills: ["C++", "Go", "Python"],
  },
  {
    category: "DevOps & Cloud",
    skills: [
      "AWS (EC2, S3, ECR)",
      "Docker",
      "Kubernetes",
      "Terraform",
      "GitHub Actions",
      "CI/CD",
    ],
  },
  {
    category: "Monitoring & Reliability",
    skills: [
      "Prometheus",
      "Grafana",
      "AlertManager",
      "Nginx",
      "Logging",
      "Observability",
    ],
  },
  {
    category: "Systems & Tools",
    skills: [
      "Linux",
      "Git & GitHub",
      "JIRA",
      "Operating Systems",
      "Computer Networks",
      "Database",
      "PostgreSQL",
      "REST APIs",
      "FastAPI",
      "DSA",
    ],
  },
  {
    category: "Automation & Testing",
    skills: ["Scripting", "Load Testing (Locust)", "JSON", "Gemini API"],
  },
];

const skillIcons: Record<string, LucideIcon> = {
  "C++": Code2,
  Go: Code2,
  Python: Code2,
  "AWS (EC2, S3, ECR)": Cloud,
  Docker: Container,
  Kubernetes: Network,
  Terraform: Workflow,
  "GitHub Actions": GitBranch,
  "CI/CD": Workflow,
  Prometheus: Activity,
  Grafana: Gauge,
  AlertManager: BellRing,
  Nginx: Server,
  Logging: Terminal,
  Observability: Eye,
  Linux: Terminal,
  "Git & GitHub": GitBranch,
  JIRA: Workflow,
  "Operating Systems": Server,
  "Computer Networks": Network,
  Database: Database,
  PostgreSQL: Database,
  "REST APIs": Braces,
  FastAPI: Braces,
  DSA: Code2,
  Scripting: Terminal,
  "Load Testing (Locust)": TestTube2,
  JSON: Braces,
  "Gemini API": Braces,
};

export default function Skills() {
  return (
    <section id="skills" className="skills-column">
      <p className="edu-skill-kicker">Tools &amp; technologies</p>
      <h2>SKILLS</h2>
      <div className="skill-rows">
        {skillGroups.map((group) => (
          <article key={group.category} className="skill-row">
            <h3>{group.category}</h3>
            <ul>
              {group.skills.map((skill) => {
                const Icon = skillIcons[skill] ?? Code2;
                return (
                  <li key={skill}>
                    <Icon aria-hidden="true" />
                    <span>{skill}</span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
