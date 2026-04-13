import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  FileDown,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  UserRound
} from "lucide-react";

import { ContactFormCard } from "@/components/portfolio/contact-form-card";
import { TechPill } from "@/components/portfolio/tech-pill";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PortfolioRecord, ProjectRecord, UserRecord } from "@/types/db";

type PortfolioTemplateData = {
  user: UserRecord | null;
  portfolio: PortfolioRecord | null;
  projects: ProjectRecord[];
  views: number;
};

type PublicPortfolioTemplateProps = {
  data: PortfolioTemplateData;
  showUnpublishedBanner?: boolean;
  siteUrl: string;
};

type SharedTemplateProps = {
  user: UserRecord;
  projects: ProjectRecord[];
  skills: string[];
  links: Record<string, string>;
  email?: string | null;
  resumeUrl: string;
};

type TemplateVariant =
  | "cinematic"
  | "swipe"
  | "editorial"
  | "executive"
  | "monolith"
  | "atelier";

function getTemplateVariant(theme?: string | null): TemplateVariant {
  switch (theme) {
    case "midnight-inferno":
      return "cinematic";
    case "ocean-breeze":
      return "swipe";
    case "forest-whisper":
      return "editorial";
    case "sunset-glow":
      return "executive";
    case "monochrome-exec":
      return "monolith";
    case "rose-luxe":
      return "atelier";
    default:
      return "cinematic";
  }
}

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-muted md:text-base">{description}</p>
    </div>
  );
}

function Topbar({
  name,
  username,
  links,
  email,
  hasProjects,
  hasSkills,
  hasContact
}: {
  name: string;
  username: string;
  links: Record<string, string>;
  email?: string | null;
  hasProjects: boolean;
  hasSkills: boolean;
  hasContact: boolean;
}) {
  return (
    <header className="sticky top-3 z-30 px-4 pt-4 md:px-6">
      <div className="glass mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border bg-surface/80 px-4 py-3 md:px-6">
        <Link
          href={`/${username}`}
          className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight md:text-lg"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          {name}
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-muted md:flex">
          {hasProjects ? (
            <a href="#projects" className="transition-colors hover:text-foreground">Projects</a>
          ) : null}
          {hasSkills ? (
            <a href="#skills" className="transition-colors hover:text-foreground">Skills</a>
          ) : null}
          <a href="#about" className="transition-colors hover:text-foreground">About</a>
          {hasContact ? (
            <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {links.github ? (
            <Link
              href={links.github}
              target="_blank"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-muted transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4" />
            </Link>
          ) : null}
          {email ? (
            <Link
              href={`mailto:${email}`}
              className="hidden rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground md:inline-flex"
            >
              Hire Me
            </Link>
          ) : null}
        </div>
      </div>
    </header>
  );
}

function SkillsSection({ skills }: { skills: string[] }) {
  if (skills.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="space-y-4">
      <SectionTitle
        title="Technical Skills"
        description="Core tools and technologies used in production development."
      />
      <Card>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <TechPill
              key={skill}
              tech={skill}
              className="bg-foreground/5 hover:bg-foreground/10"
            />
          ))}
        </div>
      </Card>
    </section>
  );
}

function AboutSection({ user }: { user: UserRecord }) {
  if (!user.bio && !user.location && !user.username) {
    return null;
  }

  return (
    <section id="about" className="space-y-4">
      <SectionTitle title="About" description="Professional summary and personal profile." />
      <Card>
        {user.bio ? <p className="text-sm leading-relaxed text-muted md:text-base">{user.bio}</p> : null}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted md:text-sm">
          {user.location ? (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-4 w-4 text-primary" />
              {user.location}
            </span>
          ) : null}
          <span className="inline-flex items-center gap-1">
            <UserRound className="h-4 w-4 text-primary" />
            @{user.username}
          </span>
        </div>
      </Card>
    </section>
  );
}

function ResumeSection({ resumeUrl }: { resumeUrl: string }) {
  if (!resumeUrl) {
    return null;
  }

  return (
    <section id="resume" className="space-y-4">
      <SectionTitle title="Resume" description="Open resume/CV link shared by the portfolio owner." />
      <Card>
        <Link
          href={resumeUrl}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 font-medium text-primary-foreground shadow-glow"
        >
          <FileDown className="h-4 w-4" />
          Open Resume
        </Link>
      </Card>
    </section>
  );
}

function RecommendationSection({ linkedin }: { linkedin?: string }) {
  if (!linkedin) {
    return null;
  }

  return (
    <section id="recommendations" className="space-y-4">
      <SectionTitle
        title="Recommendations"
        description="See endorsements and recommendations on LinkedIn."
      />
      <Card>
        <Link
          href={linkedin}
          target="_blank"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          <Linkedin className="h-4 w-4" />
          View LinkedIn Recommendations
        </Link>
      </Card>
    </section>
  );
}

function ContactSection({
  links,
  email,
  name,
  username
}: {
  links: Record<string, string>;
  email?: string | null;
  name: string;
  username: string;
}) {
  const hasAnyContact = Boolean(email || links.github || links.linkedin || links.website);
  if (!hasAnyContact) {
    return null;
  }

  return (
    <section id="contact" className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <SectionTitle
          title="Contact"
          description="Professional channels for collaborations and opportunities."
        />

        <div className="space-y-3 text-sm">
          {email ? (
            <Link
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <Mail className="h-4 w-4 text-primary" />
              {email}
            </Link>
          ) : null}

          {links.github ? (
            <Link
              href={links.github}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <Github className="h-4 w-4 text-primary" />
              GitHub
            </Link>
          ) : null}

          {links.linkedin ? (
            <Link
              href={links.linkedin}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <Linkedin className="h-4 w-4 text-primary" />
              LinkedIn
            </Link>
          ) : null}

          {links.website ? (
            <Link
              href={links.website}
              target="_blank"
              className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground"
            >
              <Globe className="h-4 w-4 text-primary" />
              Website
            </Link>
          ) : null}
        </div>
      </Card>

      {email ? <ContactFormCard recipientUsername={username} recipientName={name} /> : null}
    </section>
  );
}

function ProjectsGrid({ projects }: { projects: ProjectRecord[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="space-y-4">
      <SectionTitle title="Projects" description="Selected production work and shipped products." />

      <div className="grid gap-4 md:grid-cols-2">
        {projects.slice(0, 6).map((project) => (
          <Card key={project.id} className="h-full">
            <h3 className="font-heading text-xl font-semibold tracking-tight">{project.title}</h3>
            {project.description ? (
              <p className="mt-2 text-sm leading-relaxed text-muted">{project.description}</p>
            ) : null}

            {(project.tech_stack ?? []).filter(Boolean).length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {(project.tech_stack ?? [])
                  .filter((tech) => tech && tech.trim().length > 0)
                  .slice(0, 8)
                  .map((tech) => (
                    <TechPill key={tech} tech={tech} className="bg-foreground/5 hover:bg-foreground/10" />
                  ))}
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium">
              {project.github_url ? (
                <Link
                  href={project.github_url}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                >
                  <Github className="h-4 w-4" />
                  GitHub Repo
                </Link>
              ) : null}
              {project.live_url ? (
                <Link
                  href={project.live_url}
                  target="_blank"
                  className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live Project
                </Link>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function ProjectsList({ projects }: { projects: ProjectRecord[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="space-y-4">
      <SectionTitle title="Projects" description="Clean, timeline-like presentation of project work." />
      <div className="space-y-3">
        {projects.slice(0, 8).map((project, index) => (
          <Card key={project.id} className="grid gap-3 md:grid-cols-[auto_1fr_auto] md:items-center">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-primary">
              {(index + 1).toString().padStart(2, "0")}
            </div>

            <div>
              <h3 className="font-heading text-lg font-semibold tracking-tight">{project.title}</h3>
              {project.description ? <p className="mt-1 text-sm text-muted">{project.description}</p> : null}
              {(project.tech_stack ?? []).filter(Boolean).length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {(project.tech_stack ?? []).slice(0, 5).map((tech) => (
                    <TechPill key={tech} tech={tech} className="bg-foreground/5" />
                  ))}
                </div>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {project.github_url ? (
                <Link
                  href={project.github_url}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <Github className="h-4 w-4" />
                  Repo
                </Link>
              ) : null}
              {project.live_url ? (
                <Link
                  href={project.live_url}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
                >
                  <ExternalLink className="h-4 w-4" />
                  Live
                </Link>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

function Footer({
  name,
  username,
  links
}: {
  name: string;
  username: string;
  links: Record<string, string>;
}) {
  return (
    <footer className="mt-16 border-t border-border/70 bg-surface/30">
      <div className="container mx-auto flex flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          {name} portfolio by BYOP. @{username}
        </p>
        <div className="flex items-center gap-3 text-sm text-muted">
          {links.github ? (
            <Link href={links.github} target="_blank" className="transition-colors hover:text-foreground">GitHub</Link>
          ) : null}
          {links.linkedin ? (
            <Link href={links.linkedin} target="_blank" className="transition-colors hover:text-foreground">LinkedIn</Link>
          ) : null}
          {links.website ? (
            <Link href={links.website} target="_blank" className="transition-colors hover:text-foreground">Website</Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function CinematicTemplate({ user, projects, skills, links, email, resumeUrl }: SharedTemplateProps) {
  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
      <section className="glass rounded-3xl border border-border bg-surface/75 p-8 md:p-12">
        <p className="inline-flex items-center rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
          Cinematic Portfolio
        </p>
        <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
        {user.bio ? <p className="mt-4 max-w-3xl text-base leading-relaxed text-muted md:text-xl">{user.bio}</p> : null}
      </section>

      <ProjectsGrid projects={projects} />
      <SkillsSection skills={skills} />
      <AboutSection user={user} />
      <ResumeSection resumeUrl={resumeUrl} />
      <RecommendationSection linkedin={links.linkedin} />
      <ContactSection links={links} email={email} name={user.name} username={user.username} />
    </div>
  );
}

function SwipeTemplate({ user, projects, skills, links, email, resumeUrl }: SharedTemplateProps) {
  const sections = [
    { id: "projects", title: "Projects", content: <ProjectsGrid projects={projects} /> },
    { id: "skills", title: "Skills", content: <SkillsSection skills={skills} /> },
    { id: "about", title: "About", content: <AboutSection user={user} /> },
    { id: "resume", title: "Resume", content: <ResumeSection resumeUrl={resumeUrl} /> },
    { id: "contact", title: "Contact", content: <ContactSection links={links} email={email} name={user.name} username={user.username} /> }
  ].filter((item) => item.content !== null);

  return (
    <div className="container relative z-10 mx-auto max-w-6xl px-4 pb-16 pt-8">
      <section className="glass rounded-3xl border border-border bg-surface/75 p-6 md:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary">Swipe Deck</p>
            <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight md:text-4xl">{user.name}</h1>
            {user.bio ? <p className="mt-3 max-w-2xl text-sm text-muted md:text-base">{user.bio}</p> : null}
          </div>
          <span className="inline-flex rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs text-muted">
            Swipe on phone, clean grid on wide screens
          </span>
        </div>
      </section>

      <section className="mt-6">
        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pr-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-2 xl:overflow-visible xl:pb-0 xl:pr-0">
          {sections.map((section) => (
            <article
              key={section.id}
              className="min-w-[min(90vw,30rem)] snap-start rounded-3xl border border-border bg-surface/70 p-5 shadow-[0_12px_30px_rgba(2,6,23,0.12)] sm:min-w-[min(74vw,34rem)] xl:min-w-0"
            >
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">{section.title}</p>
              {section.content}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function EditorialTemplate({ user, projects, skills, links, email, resumeUrl }: SharedTemplateProps) {
  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Editorial Portfolio</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
          {user.bio ? <p className="mt-4 max-w-xl text-base text-muted md:text-lg">{user.bio}</p> : null}
        </Card>

        {skills.length > 0 ? (
          <Card className="p-6">
            <h3 className="font-semibold">Skill Highlights</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 8).map((skill) => (
                <TechPill key={skill} tech={skill} />
              ))}
            </div>
          </Card>
        ) : null}
      </section>

      <ProjectsGrid projects={projects} />
      <section className="grid gap-4 lg:grid-cols-2">
        <AboutSection user={user} />
        <div className="space-y-4">
          <ResumeSection resumeUrl={resumeUrl} />
          <RecommendationSection linkedin={links.linkedin} />
        </div>
      </section>

      <ContactSection links={links} email={email} name={user.name} username={user.username} />
    </div>
  );
}

function ExecutiveTemplate({ user, projects, skills, links, email, resumeUrl }: SharedTemplateProps) {
  return (
    <div className="container relative z-10 mx-auto grid max-w-6xl gap-6 px-4 pb-16 pt-8 lg:grid-cols-[300px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full border border-border bg-surface/80">
              <Image src={user.avatar_url} alt={`${user.name} avatar`} width={56} height={56} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted">@{user.username}</p>
            </div>
          </div>
          {user.bio ? <p className="mt-4 text-sm text-muted">{user.bio}</p> : null}
        </Card>

        <SkillsSection skills={skills} />
      </aside>

      <main className="space-y-6">
        <ProjectsList projects={projects} />
        <AboutSection user={user} />
        <ResumeSection resumeUrl={resumeUrl} />
        <RecommendationSection linkedin={links.linkedin} />
        <ContactSection links={links} email={email} name={user.name} username={user.username} />
      </main>
    </div>
  );
}

function MonolithTemplate({ user, projects, skills, links, email, resumeUrl }: SharedTemplateProps) {
  return (
    <div className="container relative z-10 mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-8">
      <section className="rounded-3xl border border-border bg-surface/85 p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Monolith Portfolio</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
        {user.bio ? <p className="mt-4 max-w-3xl text-base text-muted md:text-lg">{user.bio}</p> : null}
      </section>

      <div className="border-l border-border pl-5">
        <div className="relative space-y-8">
          <div className="absolute left-[-0.45rem] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
          <ProjectsList projects={projects} />
        </div>

        <div className="relative mt-8 space-y-8">
          <div className="absolute left-[-0.45rem] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
          <SkillsSection skills={skills} />
          <AboutSection user={user} />
          <ResumeSection resumeUrl={resumeUrl} />
          <RecommendationSection linkedin={links.linkedin} />
          <ContactSection links={links} email={email} name={user.name} username={user.username} />
        </div>
      </div>
    </div>
  );
}

function AtelierTemplate({ user, projects, skills, links, email, resumeUrl }: SharedTemplateProps) {
  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-3xl border border-border bg-surface/70 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Atelier Portfolio</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
          {user.bio ? <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">{user.bio}</p> : null}
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-foreground/5">@{user.username}</Badge>
            {user.location ? <Badge variant="secondary" className="bg-foreground/5">{user.location}</Badge> : null}
          </div>
        </div>

        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted">Profile Links</p>
          {links.github ? (
            <Link href={links.github} target="_blank" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              <Github className="h-4 w-4 text-primary" />
              GitHub
            </Link>
          ) : null}
          {links.linkedin ? (
            <Link href={links.linkedin} target="_blank" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              <Linkedin className="h-4 w-4 text-primary" />
              LinkedIn
            </Link>
          ) : null}
          {links.website ? (
            <Link href={links.website} target="_blank" className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground">
              <Globe className="h-4 w-4 text-primary" />
              Website
            </Link>
          ) : null}
          {resumeUrl ? (
            <Link href={resumeUrl} target="_blank" className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80">
              <FileDown className="h-4 w-4" />
              Resume
            </Link>
          ) : null}
        </Card>
      </section>

      <ProjectsGrid projects={projects} />
      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <SkillsSection skills={skills} />
        <div className="space-y-4">
          <AboutSection user={user} />
          <RecommendationSection linkedin={links.linkedin} />
        </div>
      </section>

      <ContactSection links={links} email={email} name={user.name} username={user.username} />
    </div>
  );
}

export function PublicPortfolioTemplate({
  data,
  showUnpublishedBanner = false,
  siteUrl
}: PublicPortfolioTemplateProps) {
  const { user, portfolio, projects } = data;

  if (!user) {
    return null;
  }

  const links = (user.links as Record<string, string>) ?? {};
  const skills = (user.skills as string[]) ?? [];

  const themeClass =
    portfolio?.theme && portfolio.theme !== "midnight-inferno"
      ? `theme-${portfolio.theme}`
      : "";
  const variant = getTemplateVariant(portfolio?.theme);

  const githubFallback = `https://github.com/${user.username}`;
  const normalizedLinks: Record<string, string> = {
    ...links,
    github: links.github || githubFallback
  };

  const profileUrl = `${siteUrl}/${user.username}`;
  const resumeUrl = normalizedLinks.resume || normalizedLinks.website || "";

  const hasProjects = projects.length > 0;
  const hasSkills = skills.length > 0;
  const hasContact = Boolean(user.email || normalizedLinks.github || normalizedLinks.linkedin || normalizedLinks.website);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name ?? user.username,
    url: profileUrl,
    description: user.bio ?? "Developer portfolio",
    image: user.avatar_url,
    sameAs: Object.values(normalizedLinks).filter(Boolean)
  };

  const sharedProps: SharedTemplateProps = {
    user,
    projects,
    skills,
    links: normalizedLinks,
    email: user.email,
    resumeUrl
  };

  return (
    <main className={cn("noise min-h-screen overflow-hidden pb-12", themeClass)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[30rem] w-[30rem] -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/10 blur-[120px]" />

      <Topbar
        name={user.name}
        username={user.username}
        links={normalizedLinks}
        email={user.email}
        hasProjects={hasProjects}
        hasSkills={hasSkills}
        hasContact={hasContact}
      />

      {showUnpublishedBanner ? (
        <div className="container mx-auto mt-4 max-w-6xl px-4">
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
            This portfolio is not published. You are viewing private preview mode.
          </div>
        </div>
      ) : null}

      {variant === "cinematic" ? <CinematicTemplate {...sharedProps} /> : null}
      {variant === "swipe" ? <SwipeTemplate {...sharedProps} /> : null}
      {variant === "editorial" ? <EditorialTemplate {...sharedProps} /> : null}
      {variant === "executive" ? <ExecutiveTemplate {...sharedProps} /> : null}
      {variant === "monolith" ? <MonolithTemplate {...sharedProps} /> : null}
      {variant === "atelier" ? <AtelierTemplate {...sharedProps} /> : null}

      <Footer name={user.name} username={user.username} links={normalizedLinks} />
    </main>
  );
}
