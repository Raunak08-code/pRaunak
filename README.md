# Raunak Pandey — DevOps & Cloud Portfolio

Personal portfolio for my work and learning in DevOps, cloud infrastructure, automation, and observability.

- **Live portfolio:** [raunak-dev-ops-portfolio.vercel.app](https://raunak-dev-ops-portfolio.vercel.app/)
- **Source:** [Raunak08-code/Raunak-DevOps--portfolio](https://github.com/Raunak08-code/Raunak-DevOps--portfolio)
- **Docker Hub:** [raunak08 repositories](https://hub.docker.com/repositories/raunak08)

## What the Portfolio Shows

The site is a responsive, single-page portfolio with hash-based section navigation:

- **Landing:** introduction, portrait, and social profiles.
- **About:** engineering focus and capabilities, with dedicated Currently Learning, Road Ahead, and Certifications & Activities views. Each view has a back control that restores the About scroll position.
- **Edu-Skill:** education history and grouped technical skills.
- **Work:** project cards and detail views. GlassBox has an expanded observability case study with architecture, implementation steps, technology stack, and screenshots from its repository.
- **Blog:** article cards that open the complete article content.
- **Connect:** phone, email, and social contact links, followed by the portfolio footer.

The fixed navigation, section links, browser history, detail views, and return controls work without a full page reload. Layouts adapt to desktop and mobile screens.

## DevOps Work Featured Here

### GlassBox — Observability and Monitoring

GlassBox is a containerized monitoring project built with Python, Docker Compose, Prometheus, Grafana, and PostgreSQL. Its case study documents the implemented telemetry path: collecting system, process, and Docker container metrics; exposing CPU, memory, and disk gauges to Prometheus; visualizing Prometheus metrics in Grafana; persisting system measurements to PostgreSQL; and logging threshold warnings. The page includes screenshots of the terminal dashboard, Prometheus, Grafana, PostgreSQL, and Docker deployment.

### Portfolio Delivery — Docker, GitHub Actions, Docker Hub, and AWS

This portfolio is packaged in a Docker image. GitHub Actions runs a Node 22 build on pushes to `main`, `dev`, and `feature/*`, and on pull requests. A separate workflow builds and publishes Docker images to Docker Hub when code is pushed to `main`, tagging the image as `latest` and with the commit SHA. Docker Hub credentials are read from GitHub Actions secrets.

The project also documents running the container on AWS EC2 and routing public HTTP traffic through Nginx to the application container. The EC2 deployment steps are in the runbooks below; the Docker publishing workflow does not automatically deploy to EC2.

### Other Project Work

- **CORVINA:** containerized Python/FastAPI email automation with SMTP/IMAP integration, retry handling, and GitHub Actions delivery workflows.
- **NorthStar (in development):** a DevOps analytics platform intended to bring development activity, build history, deployment metrics, and engineering delivery insights together.
- **DARR STUDIOS (in development):** an independent game development studio project.

The skills section also lists tools and areas I am learning, including Kubernetes, Terraform, CI/CD, AWS services, Prometheus, and Grafana. These are presented as skills and learning areas, not claims that each is deployed in production.

## Technology

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Motion, Lucide
- **Containers and delivery:** Docker, GitHub Actions, Docker Hub, Git, GitHub
- **Cloud and operations:** AWS EC2, Nginx, Linux, SSH
- **Observability project:** Python, psutil, Prometheus, PromQL, Grafana, PostgreSQL

## Run Locally

Requirements: Node.js 22 and npm.

```bash
git clone https://github.com/Raunak08-code/Raunak-DevOps--portfolio.git
cd Raunak-DevOps--portfolio
npm ci
npm run dev
```

The development server is available at `http://localhost:3000`.

### Project Checks

```bash
npm run lint   # TypeScript check (tsc --noEmit)
npm run build  # Production asset build
```

The GitHub Actions CI workflow currently runs `npm ci` and `npm run build`.

## Run in Docker

```bash
docker build -t raunak-devops-portfolio .
docker run --rm -p 3000:3000 raunak-devops-portfolio
```

The current Docker image builds the site and starts the Vite server on port 3000.

## CI and Image Publishing

```text
Push / Pull Request
        ↓
GitHub Actions CI (npm ci → npm run build)

Push to main
        ↓
GitHub Actions Docker workflow
        ↓
Docker build and publish
        ↓
Docker Hub: latest + commit SHA
```

The image-publishing workflow expects `DOCKER_USERNAME` and `DOCKER_TOKEN` in the repository’s GitHub Actions secrets.

## Deployment Runbooks

- [AWS EC2 deployment](public/docs/AWS_RUNBOOK.md)
- [Docker and Docker Hub](public/docs/Docker_DockerHub_RUNBOOK.md)
- [Nginx reverse proxy](public/docs/NGINX_RUNBOOK.md)

## Repository Layout

```text
.
├── .github/workflows/       # Build CI and Docker image publishing
├── public/
│   ├── docs/                # Deployment runbooks and project report
│   └── projects/glassbox/   # GlassBox architecture and implementation images
├── src/
│   ├── components/          # Portfolio sections and shared UI
│   ├── App.tsx              # Landing, section navigation, and footer
│   ├── data.ts              # Portfolio, project, contact, and blog content
│   └── index.css            # Global and responsive styles
├── Dockerfile
└── README.md
```

## About Me

I’m Raunak Pandey, a Computer Science undergraduate focused on DevOps, cloud infrastructure, platform engineering, and observability. I use this portfolio to document projects, practical implementation work, and the skills I’m continuing to develop.

- [GitHub](https://github.com/Raunak08-code)
- [LinkedIn](https://www.linkedin.com/in/raunak-pandey-1801202a0/)
