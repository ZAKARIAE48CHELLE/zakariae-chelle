# Portfolio Enhancement Plan — Zakariae Chelle

**Target portfolio:** `https://zakariae48chelle.github.io/zakariae-chelle/`  
**Goal:** Upgrade the portfolio into a modern, recruiter-ready, AI/Data-focused personal website and add the latest projects, skills, links, and stronger UX/UI polish.

> Note for Codex / Antigravity: the live portfolio URL may not be accessible from all environments. Treat this document as the source of truth for the redesign and content update. Before editing, inspect the repository structure and adapt the instructions to the existing stack.

---

## 1. Main Positioning

The portfolio should position Zakariae as a:

> **Data & Artificial Intelligence Engineering Student building AI platforms, local LLM systems, multi-agent applications, data pipelines, and full-stack intelligent dashboards.**

The current CV profile contains strong AI, LLM, RAG, multi-agent, data engineering, and full-stack signals. The portfolio should make these clear immediately in the hero section instead of presenting him only as a generic developer.

### Recommended headline

```text
Data & Artificial Intelligence Engineering Student
Building AI platforms, local LLM systems, multi-agent applications, and data-driven web solutions.
```

### Recommended short bio

```text
I am a Data & Artificial Intelligence engineering student based in Tangier, Morocco. I build intelligent platforms that combine machine learning, LLMs, RAG, multi-agent systems, dashboards, APIs, and production-oriented software architecture. My work includes privacy-preserving incident triage, digital twin-based client classification, intelligent marketplaces, computer vision, and cloud/virtualization solutions.
```

### Hero CTAs

Add clear buttons:

- **View Projects** → scroll to projects section
- **Download CV** → link to CV PDF
- **GitHub** → add real GitHub URL
- **LinkedIn** → add real LinkedIn URL

---

## 2. Immediate Design Problems to Fix

### 2.1 Visual hierarchy

The portfolio should show the most important information first:

1. Name + role
2. Short AI/Data positioning
3. Main project highlights
4. Skills grouped by domain
5. Experience
6. Education
7. Contact

Avoid making all sections visually equal. Projects and technical stack should be the strongest parts.

### 2.2 Too generic presentation

The portfolio should not look like a generic student template. It should visually communicate:

- AI systems
- data dashboards
- LLM/RAG pipelines
- multi-agent workflows
- production APIs
- monitoring and deployment

Use cards, badges, architecture-like visuals, and project impact labels.

### 2.3 Improve trust

Add proof elements:

- GitHub links for projects where available
- demo links where available
- screenshots or GIFs
- stack badges
- project role: `Developer`, `AI Engineer`, `Full-stack`, `Data/ML`, etc.
- project status: `Completed`, `Prototype`, `Academic`, `Professional`, `Research Prototype`

### 2.4 Public privacy cleanup

Do **not** display the full street address publicly on the portfolio. Use:

```text
Tangier, Morocco
```

The phone number can be hidden behind a contact action, or omitted if the portfolio is public. Keep email and LinkedIn/GitHub.

---

## 3. Recommended Site Structure

Use a clean one-page portfolio with smooth navigation.

```text
Navbar
Hero
About
Featured Projects
All Projects
Skills / Tech Stack
Experience
Education
Contact
Footer
```

### Navbar

Items:

```text
Home | About | Projects | Skills | Experience | Contact
```

Add small right-side actions:

```text
GitHub | LinkedIn | Download CV
```

Make navbar sticky with blur background.

---

## 4. Design Direction

### 4.1 Style

Use a modern dark AI portfolio style, with optional light mode.

Recommended visual identity:

```text
Background: deep navy / near-black
Primary: electric cyan or blue
Accent: violet / purple
Text: off-white
Cards: dark glassmorphism with subtle border
```

Example palette:

```css
--bg: #07111f;
--surface: #0e1b2e;
--surface-2: #12243b;
--text: #f8fafc;
--muted: #94a3b8;
--primary: #38bdf8;
--accent: #8b5cf6;
--success: #22c55e;
--border: rgba(148, 163, 184, 0.18);
```

### 4.2 Typography

Use one clean sans-serif font:

```text
Inter, Satoshi, Manrope, or Geist
```

Recommended sizing:

```css
Hero title: 56px desktop / 36px mobile
Section title: 36px desktop / 28px mobile
Body text: 16px-18px
Cards: 15px-16px
```

### 4.3 Background elements

Add subtle technical visuals:

- gradient mesh background
- animated small particles or grid
- blurred glowing circles
- code/data pattern in hero
- thin connection lines behind project cards

Keep animations subtle and performant.

---

## 5. Hero Section Specification

### Content

```text
Hi, I’m Zakariae Chelle
Data & Artificial Intelligence Engineering Student

I build intelligent platforms combining machine learning, local LLMs, RAG, multi-agent systems, dashboards, APIs, and production-oriented software architecture.

[View Projects] [Download CV] [GitHub] [LinkedIn]
```

### Add quick badges

```text
AI Engineering
LLMs & RAG
Multi-Agent Systems
Full-Stack Development
Data Engineering
```

### Add visual block on right

Use either:

- a stylized terminal card showing stack keywords
- animated neural/data graph
- dashboard mockup
- AI workflow mini-diagram

Example text inside terminal card:

```bash
> building local AI systems
> fine-tuning with QLoRA
> serving APIs with FastAPI
> monitoring with Prometheus
> deploying with Docker
```

---

## 6. About Section

### Recommended text

```text
I am a Data & Artificial Intelligence engineering student at EMSI Tangier with experience in full-stack web development, AI systems, data platforms, and intelligent dashboards. I enjoy building practical AI products that connect models, APIs, databases, monitoring tools, and user-facing interfaces.

My recent work focuses on local LLMs, RAG systems, multi-agent architectures, digital twins, classification pipelines, and privacy-preserving AI applications.
```

### Add stats cards

Use cards like:

```text
6+ AI / software projects
2+ professional experiences
LLM, RAG & multi-agent focus
Full-stack + data engineering stack
```

---

## 7. Featured Projects Section

Use 3 featured project cards at the top. These should be the strongest and most relevant to AI/Data roles.

### Featured Project 1 — LocalOps AI

**Title:** LocalOps AI — Privacy-Preserving Incident Triage & Root Cause Analysis System

**Short description:**

```text
A local incident triage and root cause analysis system based on a small language model fine-tuned with QLoRA. It integrates severity calibration, RAG over operational runbooks, FastAPI services, Prometheus monitoring, Docker deployment, and a web dashboard.
```

**Recommended tags:**

```text
SLM
QLoRA
RAG
FastAPI
Prometheus
Docker
Incident Triage
Root Cause Analysis
```

**Display as:** Featured AI/LLMOps project.

**Recommended card sections:**

```text
Problem: Help operators classify incidents and understand probable root causes locally.
AI Core: Fine-tuned SLM + RAG over runbooks.
System Layer: API, monitoring, dashboard, Dockerized deployment.
Value: Privacy-preserving local intelligence for operational support.
```

**Links to add:**

```text
GitHub: TODO_ADD_LINK
Demo: TODO_ADD_LINK
Report: TODO_ADD_LINK
```

---

### Featured Project 2 — Digital Twin Client Classification Platform

**Title:** Intelligent Client & Prospect Classification Platform using Digital Twins

**Short description:**

```text
An AI platform for dynamic classification of prospects and clients using digital twins, RFM-ES/AHP scoring, CLV estimation, churn and conversion prediction, dynamic personas, A/B testing simulation, PostgreSQL, Streamlit, LangGraph, and a governed local LLM.
```

**Recommended tags:**

```text
Digital Twins
RFM-ES/AHP
CLV
Churn Prediction
Conversion Prediction
Streamlit
PostgreSQL
LangGraph
Local LLM
```

**Display as:** Featured Data/AI business platform.

**Recommended card sections:**

```text
Problem: Help businesses classify clients and prospects dynamically.
AI Core: scoring, prediction, segmentation, local LLM assistance.
Data Layer: PostgreSQL + behavioral/customer features.
Interface: Streamlit dashboard and reports.
Value: actionable segmentation for marketing and customer intelligence.
```

**Links to add:**

```text
GitHub: TODO_ADD_LINK
Demo: TODO_ADD_LINK
Documentation: TODO_ADD_LINK
```

---

### Featured Project 3 — AuraMarket

**Title:** AuraMarket — Intelligent Marketplace Platform with Multi-Agent System

**Short description:**

```text
An intelligent marketplace platform integrating smart product search, user assistance, automated negotiation, dynamic offers, and suspicious activity detection through a multi-agent system.
```

**Recommended tags:**

```text
Multi-Agent System
Smart Search
Negotiation Agent
Offer Generation
Security Monitoring
Marketplace
Full-Stack
```

**Display as:** Featured multi-agent product project.

**Recommended card sections:**

```text
Problem: Improve marketplace interactions through automated assistance and negotiation.
AI Core: specialized agents for buyer, seller, offer generation, and security detection.
Software Layer: product processing, service integration, feature development, testing.
Value: smarter marketplace interactions and safer transactions.
```

**Links to add:**

```text
GitHub: TODO_ADD_LINK
Demo: TODO_ADD_LINK
Architecture: TODO_ADD_LINK
```

---

## 8. Additional Projects Section

Use smaller cards for other projects.

### Project 4 — Deep Learning Skin Disease Detection

```text
Automatic skin disease detection system based on CNN models. It analyzes dermatological images and provides a rapid pre-diagnosis with confidence scores and medical recommendations.
```

Tags:

```text
CNN
Computer Vision
TensorFlow
Keras
Medical AI
Image Classification
```

Important wording:

Use “decision-support / educational prototype” instead of making medical claims. Add a disclaimer that it is not a substitute for professional diagnosis.

---

### Project 5 — Virtualization / Cloud Solutions

```text
Design and deployment of an isolated internal network in a virtualized environment using Proxmox VE Type 1 hypervisor.
```

Tags:

```text
Proxmox VE
Virtualization
Networking
Internal Network
Infrastructure
Cloud Lab
```

---

### Project 6 — Bank Transaction Simulator

```text
Java desktop application simulating bank transactions, including account management, deposits, withdrawals, transaction history, object-oriented design, and concurrency handling.
```

Tags:

```text
Java
OOP
Concurrency
Desktop Application
Banking Simulation
```

---

## 9. Project Card Design

Each project card should contain:

```text
Project title
One-line value proposition
Short description
Tech tags
3 bullet highlights
Links: GitHub / Demo / Details
```

### Example JSX-like structure

```jsx
<ProjectCard
  title="LocalOps AI"
  category="AI / LLMOps"
  description="Privacy-preserving incident triage and root cause analysis system powered by a fine-tuned local SLM and RAG over runbooks."
  tags={["SLM", "QLoRA", "RAG", "FastAPI", "Prometheus", "Docker"]}
  highlights={[
    "Fine-tuned small language model with QLoRA",
    "RAG layer over operational runbooks",
    "Monitoring and deployment with Prometheus and Docker"
  ]}
  github="TODO_ADD_LINK"
  demo="TODO_ADD_LINK"
/>
```

---

## 10. Skills Section Redesign

Group skills by clear domains instead of a long mixed list.

### AI & Machine Learning

```text
Machine Learning
Deep Learning
Supervised Learning
Unsupervised Learning
NLP
Computer Vision
TensorFlow
Keras
PyTorch
NumPy
Pandas
Matplotlib
```

### Generative AI & LLM Systems

```text
Large Language Models
Prompt Engineering
Retrieval-Augmented Generation
QLoRA
Ollama
AI Agents
Multi-Agent Systems
LangGraph
Local LLMs
```

### Data Engineering & Databases

```text
PostgreSQL
SQL
Apache Hadoop / HDFS
Apache Spark
Apache Kafka
Data Processing
Dashboards
```

### Backend & Software Architecture

```text
Python
Java
TypeScript
C++
FastAPI
Spring Boot
Microservices
REST APIs
Docker
Prometheus
```

### Frontend & Dashboards

```text
Angular
Streamlit
HTML
CSS
JavaScript / TypeScript
Responsive UI
Dashboard Design
```

### Design & Creative Tools

```text
Photoshop
Premiere Pro
Lightroom
Infographics
UI polishing
```

### Suggested visual treatment

Use domain cards with icons:

```text
AI / ML        Brain icon
LLM Systems    Bot icon
Data Stack     Database icon
Backend        Server icon
Frontend       Monitor icon
Design         Brush icon
```

---

## 11. Experience Section

### Experience 1

```text
Full-Stack Web Developer
Smart Automation Technologies — Tangier, Morocco
12/2023 – 10/2025

- Developed and maintained web applications using full-stack technologies.
- Designed user interfaces to improve user experience.
- Improved server performance and optimized backend processes.
- Contributed to AI/data-oriented internal platforms and dashboards where applicable.
```

### Experience 2

```text
Main Stack Developer
KIINOV — Tangier, Morocco
07/2023 – 08/2023

- Developed an Angular user interface to improve returns management.
- Contributed to front-end structure, components, and user flow improvement.
```

### Design

Use a vertical timeline. Add company, date, location, stack chips, and bullet highlights.

---

## 12. Education Section

```text
Engineering Program — Data & Artificial Intelligence
EMSI Tangier
10/2025 – Present
Tangier, Morocco

Bachelor of Science and Technology — Computer Engineering
Faculty of Sciences and Technology
2022 – 2023
Tangier, Morocco
```

Note: in the CV, the engineering program appears as `10/2025 – aujourd'hui`; in English UI use `Present`.

---

## 13. Contact Section

Recommended public contact content:

```text
Let’s build intelligent systems together.
I’m open to internships, AI/data projects, full-stack opportunities, and collaboration.
```

Show:

```text
Email: zakariaechelle2001@gmail.com
Academic email: Zakariae.Chelle@emsi-edu.ma
Location: Tangier, Morocco
GitHub: TODO_ADD_GITHUB_URL
LinkedIn: TODO_ADD_LINKEDIN_URL
Portfolio: current URL
```

Avoid showing full street address.

Add a simple contact form only if backend/form service exists. Otherwise use a `mailto:` link.

---

## 14. Links to Add / Replace

Codex should create a centralized links object, for example:

```ts
export const links = {
  portfolio: "https://zakariae48chelle.github.io/zakariae-chelle/",
  github: "TODO_ADD_GITHUB_URL",
  linkedin: "TODO_ADD_LINKEDIN_URL",
  cv: "TODO_ADD_CV_PDF_PATH",
  emailPrimary: "mailto:zakariaechelle2001@gmail.com",
  emailAcademic: "mailto:Zakariae.Chelle@emsi-edu.ma",
  projects: {
    localOps: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK",
      report: "TODO_ADD_LINK"
    },
    digitalTwinClassification: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK",
      docs: "TODO_ADD_LINK"
    },
    auraMarket: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK",
      architecture: "TODO_ADD_LINK"
    },
    skinDiseaseDetection: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK"
    },
    virtualizationCloud: {
      github: "TODO_ADD_LINK",
      docs: "TODO_ADD_LINK"
    },
    bankTransactionSimulator: {
      github: "TODO_ADD_LINK"
    }
  }
};
```

---

## 15. Content Data Structure Recommendation

Create reusable content files instead of hardcoding everything in components.

Recommended files:

```text
src/data/profile.ts
src/data/projects.ts
src/data/skills.ts
src/data/experience.ts
src/data/education.ts
src/data/links.ts
```

### Example `projects.ts`

```ts
export const projects = [
  {
    title: "LocalOps AI",
    subtitle: "Privacy-Preserving Incident Triage & Root Cause Analysis System",
    category: "AI / LLMOps",
    featured: true,
    description:
      "Local incident triage and root cause analysis system based on a fine-tuned small language model with QLoRA, RAG over runbooks, FastAPI, Prometheus monitoring, Docker, and a web dashboard.",
    tags: ["SLM", "QLoRA", "RAG", "FastAPI", "Prometheus", "Docker"],
    highlights: [
      "Fine-tuned local SLM for incident triage",
      "RAG over operational runbooks",
      "Monitoring and deployment-ready architecture"
    ],
    links: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK",
      details: "TODO_ADD_LINK"
    }
  },
  {
    title: "Digital Twin Client Classification Platform",
    subtitle: "Dynamic Classification of Prospects and Clients",
    category: "Data Science / Business AI",
    featured: true,
    description:
      "AI platform combining digital twins, RFM-ES/AHP, CLV, churn, conversion, dynamic classification, personas, A/B testing simulation, PostgreSQL, Streamlit, LangGraph, and a governed local LLM.",
    tags: ["Digital Twins", "CLV", "Churn", "Streamlit", "PostgreSQL", "LangGraph"],
    highlights: [
      "Dynamic client and prospect classification",
      "CLV, churn and conversion modeling",
      "Local LLM and governed decision support"
    ],
    links: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK",
      details: "TODO_ADD_LINK"
    }
  },
  {
    title: "AuraMarket",
    subtitle: "Intelligent Marketplace Platform with Multi-Agent System",
    category: "Multi-Agent Systems",
    featured: true,
    description:
      "Marketplace platform integrating smart product search, user assistance, automated negotiation, dynamic offers, and suspicious activity detection with specialized agents.",
    tags: ["Multi-Agent", "Smart Search", "Negotiation", "Security", "Marketplace"],
    highlights: [
      "Buyer-side negotiation and seller counter-offer agents",
      "Dynamic offer generation",
      "Suspicious activity detection"
    ],
    links: {
      github: "TODO_ADD_LINK",
      demo: "TODO_ADD_LINK",
      details: "TODO_ADD_LINK"
    }
  }
];
```

---

## 16. UI Components to Build or Refactor

Codex should create or improve the following components:

```text
Navbar
Hero
AboutSection
StatsCard
ProjectCard
FeaturedProjects
SkillsSection
SkillGroupCard
ExperienceTimeline
EducationSection
ContactSection
Footer
ThemeToggle
ScrollToTop
```

Optional components:

```text
AnimatedGradientBackground
TechBadge
ProjectFilter
ProjectModal
```

---

## 17. Animation Guidelines

Use subtle animations only:

- fade-in on scroll
- slight card hover lift
- glowing border on featured project cards
- animated gradient in hero
- tech badges moving very slightly or appearing with stagger

Avoid heavy animations that reduce performance.

Recommended libraries if the project uses React:

```text
Framer Motion
Lucide React icons
React Icons
```

If no animation library exists, use pure CSS transitions.

---

## 18. Responsiveness Requirements

Ensure the site works well on:

```text
Mobile: 360px+
Tablet: 768px+
Desktop: 1024px+
Large screen: 1440px+
```

### Mobile rules

- Hero title must not overflow.
- Project cards should stack vertically.
- Navbar should become a hamburger menu.
- Buttons should wrap cleanly.
- Cards should have enough padding but not too much.

---

## 19. Accessibility Requirements

Codex should check:

- semantic HTML sections
- correct heading order: one `h1`, then `h2`, `h3`
- sufficient color contrast
- visible focus states
- alt text for project images
- keyboard-friendly navigation
- reduced motion support

Add CSS:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 20. SEO Improvements

Add or update metadata:

```html
<title>Zakariae Chelle | Data & AI Engineering Student</title>
<meta name="description" content="Portfolio of Zakariae Chelle, Data & Artificial Intelligence Engineering Student building AI platforms, local LLM systems, RAG, multi-agent applications, and full-stack intelligent dashboards." />
<meta name="keywords" content="Zakariae Chelle, Data AI Engineering, Machine Learning, LLM, RAG, Multi-Agent Systems, FastAPI, Streamlit, Python, Tangier, Morocco" />
```

Open Graph:

```html
<meta property="og:title" content="Zakariae Chelle | Data & AI Engineering Student" />
<meta property="og:description" content="AI/Data portfolio featuring LocalOps AI, digital twin client classification, AuraMarket, computer vision, and cloud solutions." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://zakariae48chelle.github.io/zakariae-chelle/" />
<meta property="og:image" content="TODO_ADD_OG_IMAGE" />
```

---

## 21. Assets to Add

Recommended assets:

```text
/public/cv/CHELLE_ZAKARIAE_ENG.pdf
/public/images/projects/localops-dashboard.png
/public/images/projects/digital-twin-dashboard.png
/public/images/projects/auramarket.png
/public/images/projects/skin-disease-cnn.png
/public/images/projects/proxmox-lab.png
/public/images/projects/bank-simulator.png
/public/images/og-image.png
```

If screenshots are not available yet, create consistent placeholder cards with abstract technical illustrations.

---

## 22. GitHub Pages Deployment Notes

Since the URL uses GitHub Pages, check whether the app is built with Vite/React or plain HTML.

### If Vite

Ensure `vite.config.ts` contains:

```ts
export default defineConfig({
  base: "/zakariae-chelle/",
  plugins: [react()],
});
```

### If React Router is used

Use HashRouter for GitHub Pages or configure fallback correctly.

```tsx
import { HashRouter } from "react-router-dom";
```

For a one-page portfolio, avoid router complexity.

---

## 23. Performance Checklist

Codex should verify:

```text
- No oversized uncompressed images
- Use WebP/AVIF when possible
- Lazy-load project screenshots
- Avoid heavy animation loops
- Keep JS bundle small
- Use CSS variables for theme
- Ensure Lighthouse score target: 90+ Performance, 90+ Accessibility, 90+ Best Practices, 90+ SEO
```

---

## 24. Suggested Implementation Steps for Codex / Antigravity

### Step 1 — Inspect project

```text
Identify framework, file structure, package manager, and deployment setup.
```

### Step 2 — Create content data files

```text
Create or update links.ts, profile.ts, projects.ts, skills.ts, experience.ts, education.ts.
```

### Step 3 — Redesign layout

```text
Build the page order: Navbar → Hero → About → Featured Projects → All Projects → Skills → Experience → Education → Contact → Footer.
```

### Step 4 — Update design system

```text
Add CSS variables, dark theme, responsive layout, cards, buttons, badges, and spacing.
```

### Step 5 — Add projects

Add these projects:

```text
1. LocalOps AI
2. Digital Twin Client Classification Platform
3. AuraMarket
4. Deep Learning Skin Disease Detection
5. Virtualization / Cloud Solutions
6. Bank Transaction Simulator
```

### Step 6 — Add skills

Group skills by domain as specified above.

### Step 7 — Add links

Replace all TODO links with the real links provided by the user.

### Step 8 — Test

```text
npm run build
npm run preview
Check mobile responsiveness
Check broken links
Check GitHub Pages base path
```

### Step 9 — Deploy

```text
Commit changes
Push to GitHub
Verify GitHub Pages deployment
Open live URL and test all sections
```

---

## 25. Final QA Checklist

Before considering the portfolio finished:

```text
[ ] Hero clearly says Data & AI Engineering Student
[ ] No full street address is public
[ ] Email links work
[ ] CV download works
[ ] GitHub link works
[ ] LinkedIn link works
[ ] Project links are not empty
[ ] All six projects are present
[ ] Featured projects are LocalOps AI, Digital Twin Client Classification, AuraMarket
[ ] Skills are grouped by domain
[ ] Experience timeline is readable
[ ] Mobile layout is clean
[ ] Lighthouse score is acceptable
[ ] No console errors
[ ] GitHub Pages base path works
```

---

## 26. Ready-to-Paste Prompt for Codex / Antigravity

```text
You are editing my portfolio repository for GitHub Pages. Use the file `portfolio_enhancement_plan_zakariae_chelle.md` as the source of truth.

Tasks:
1. Inspect the current framework and structure.
2. Redesign the portfolio as a modern Data & AI Engineering portfolio.
3. Add the following projects: LocalOps AI, Digital Twin Client Classification Platform, AuraMarket, Deep Learning Skin Disease Detection, Virtualization / Cloud Solutions, and Bank Transaction Simulator.
4. Group skills into AI/ML, Generative AI & LLMs, Data Engineering, Backend, Frontend, and Design.
5. Add clean hero, about, featured projects, skills, experience, education, and contact sections.
6. Use a modern dark theme with responsive cards, badges, and subtle animations.
7. Do not publicly show the full street address; show only Tangier, Morocco.
8. Add TODO placeholders for missing GitHub/demo/LinkedIn links and keep all links centralized.
9. Ensure the site builds and deploys correctly on GitHub Pages with the `/zakariae-chelle/` base path if using Vite.
10. Run build/tests and fix any errors.

Do not remove important existing content unless it is outdated or duplicated. Keep the result clean, professional, responsive, and recruiter-ready.
```

---

## 27. Optional Extra Improvements

After the first redesign, consider adding:

```text
- Project detail modal for each project
- Downloadable CV button
- GitHub contribution section
- Blog/notes section for AI/Data learning posts
- Language toggle: English / French
- Small architecture diagram for LocalOps AI
- Small workflow diagram for Digital Twin Classification
- Small multi-agent diagram for AuraMarket
```

