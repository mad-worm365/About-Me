export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#blog", label: "Blog" },
  { href: "#contact", label: "Contact" },
] as const;

export const stats = [
  { value: 8, suffix: "+", label: "Years Experience", icon: "spark" },
  { value: 20, suffix: "+", label: "Projects Delivered", icon: "layers" },
  { value: 100, suffix: "%", label: "Remote Work", icon: "globe" },
  { value: 10, suffix: "M+", label: "API Transactions/Year", icon: "zap" },
  { value: 12, suffix: "+", label: "Global Clients & Teams", icon: "users" },
] as const;

export const aboutCards = [
  {
    title: "AI & LLM Integration",
    body: "Agents, RAG pipelines, and production-ready LLM features that feel native in the product.",
    icon: "brain",
  },
  {
    title: "Full Stack Development",
    body: "From polished interfaces to resilient APIs — TypeScript end to end.",
    icon: "code",
  },
  {
    title: "Cloud & DevOps",
    body: "Automated deploys, observability, and infrastructure that stays out of the way.",
    icon: "cloud",
  },
  {
    title: "Clean Architecture",
    body: "Modular systems that stay readable, testable, and cheap to change.",
    icon: "layers",
  },
] as const;

export const skills = [
  { name: "React", color: "#38BDF8" },
  { name: "Next.js", color: "#0F172A" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "Node.js", color: "#339933" },
  { name: "Python", color: "#3776AB" },
  { name: "AWS", color: "#FF9900" },
  { name: "Docker", color: "#2496ED" },
  { name: "Kubernetes", color: "#326CE5" },
  { name: "GraphQL", color: "#E535AB" },
  { name: "PostgreSQL", color: "#4169E1" },
  { name: "MongoDB", color: "#47A248" },
  { name: "Redis", color: "#DC382D" },
  { name: "Prisma", color: "#0C344B" },
  { name: "Tailwind", color: "#06B6D4" },
  { name: "OpenAI", color: "#10A37F" },
  { name: "LangChain", color: "#1C3C3C" },
  { name: "Pinecone", color: "#000000" },
  { name: "Vercel", color: "#111111" },
  { name: "GitHub", color: "#24292F" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Terraform", color: "#7B42BC" },
  { name: "Supabase", color: "#3ECF8E" },
  { name: "Stripe", color: "#635BFF" },
  { name: "tRPC", color: "#398CCB" },
  { name: "Playwright", color: "#2EAD33" },
  { name: "Grafana", color: "#F46800" },
] as const;

export const projects = [
  {
    title: "Kohler AI Product Platform",
    description:
      "A multi-tenant AI workspace that turns product knowledge into answers, workflows, and launch-ready insights.",
    tags: ["Next.js", "Node.js", "OpenAI", "AWS"],
    accent: "from-violet-500 to-indigo-500",
    metric: "3.2x faster discovery",
  },
  {
    title: "Neural Commerce Hub",
    description:
      "Personalized storefronts and agent-assisted checkout that lift conversion without adding ops overhead.",
    tags: ["React", "Python", "LangChain", "Stripe"],
    accent: "from-sky-500 to-cyan-400",
    metric: "+28% checkout rate",
  },
  {
    title: "Atlas Cloud Ops",
    description:
      "A control plane for releases, cost, and reliability — one place for teams to see what the system is doing.",
    tags: ["Next.js", "Kubernetes", "Terraform", "Grafana"],
    accent: "from-emerald-500 to-teal-400",
    metric: "99.95% deploys",
  },
  {
    title: "Lumina Chat Agents",
    description:
      "Composable support agents with memory, tools, and human handoff that stay on-brand and on-policy.",
    tags: ["TypeScript", "OpenAI", "Pinecone", "Redis"],
    accent: "from-fuchsia-500 to-pink-400",
    metric: "41% fewer tickets",
  },
  {
    title: "Pulse Analytics",
    description:
      "Real-time product analytics with AI summaries so stakeholders get the story, not another dashboard.",
    tags: ["Next.js", "PostgreSQL", "ClickHouse", "d3"],
    accent: "from-amber-400 to-orange-500",
    metric: "Sub-second queries",
  },
] as const;

export const focusAreas = [
  {
    title: "AI-Powered Solutions",
    body: "Practical LLM features: search, agents, copilots, and automation that ship.",
    tone: "violet",
  },
  {
    title: "Full Stack Engineering",
    body: "Interfaces, APIs, and data models designed as one coherent system.",
    tone: "blue",
  },
  {
    title: "Cloud & DevOps",
    body: "Secure pipelines, observability, and infrastructure that scales quietly.",
    tone: "emerald",
  },
  {
    title: "Automation & Efficiency",
    body: "Remove the repetitive work so teams can spend time on the product.",
    tone: "rose",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Mad Worm turned a vague AI idea into a production platform in weeks. The architecture still feels effortless a year later.",
    name: "Sarah Chen",
    role: "Product Lead, Kohler Labs",
    initials: "SC",
  },
  {
    quote:
      "Rare mix of taste and systems thinking. Our API volume grew 8x and the stack stayed calm.",
    name: "Marcus Rivera",
    role: "CTO, Northline",
    initials: "MR",
  },
  {
    quote:
      "He doesn’t just add models — he designs the product around them. Our support team actually loves the agent.",
    name: "Aisha Patel",
    role: "Engineering Manager, Lumina",
    initials: "AP",
  },
  {
    quote:
      "Clear communication, ruthless prioritization, and code we can hand to any engineer without a tour.",
    name: "Jonah Blake",
    role: "Founder, Pulse",
    initials: "JB",
  },
] as const;

export const posts = [
  {
    title: "Shipping LLM features without the chaos",
    excerpt:
      "A practical checklist for evals, fallbacks, and UX that keeps AI features trustworthy.",
    tag: "AI Product",
    read: "6 min",
  },
  {
    title: "From monolith to modular full stack",
    excerpt:
      "How to split a Next.js app so teams move faster without drowning in microservices.",
    tag: "Architecture",
    read: "8 min",
  },
  {
    title: "Designing AI UX that users trust",
    excerpt:
      "Confidence, citations, and the quiet details that make copilots feel safe to use.",
    tag: "Design",
    read: "5 min",
  },
] as const;
