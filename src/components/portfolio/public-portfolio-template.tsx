import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  ExternalLink,
  FileDown,
  Github,
  Globe,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Star,
  UserRound
} from "lucide-react";

import { ContactFormCard } from "@/components/portfolio/contact-form-card";
import { GsapHero } from "@/components/portfolio/gsap-hero";
import { MotionFade } from "@/components/shared/motion-fade";
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

type TemplateVariant =
  | "cinematic"
  | "swipe"
  | "editorial"
  | "executive"
  | "monolith"
  | "atelier";

type SharedTemplateProps = {
  user: UserRecord;
  projects: ProjectRecord[];
  skills: string[];
  views: number;
  links: Record<string, string>;
  email?: string | null;
  profileUrl: string;
  resumeUrl: string;
  hasResume: boolean;
};

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

function buildCaseStudy(project: ProjectRecord) {
  const stack = (project.tech_stack ?? []).filter(Boolean).slice(0, 3).join(", ");

  return {
    id: project.id,
    title: project.title,
    problem: project.description?.trim() || "Project requirements and core user pain points.",
    approach: stack
      ? `Implemented and shipped using ${stack}.`
      : "Implemented with a production-focused modern web stack.",
    result: project.live_url
      ? "Delivered as a live product with practical user outcomes."
      : "Delivered as an open-source implementation."
  };
}

function getNavSections(hasProjects: boolean, hasSkills: boolean, hasContact: boolean) {
  return [
    hasProjects ? { href: "#projects", label: "Projects" } : null,
    hasProjects ? { href: "#case-studies", label: "Case Studies" } : null,
    hasSkills ? { href: "#skills", label: "Skills" } : null,
    hasContact ? { href: "#contact", label: "Contact" } : null
  ].filter(Boolean) as Array<{ href: string; label: string }>;
}

function PortfolioTopbar({
  name,
  username,
  links,
  email,
  navItems
}: {
  name: string;
  username: string;
  links: Record<string, string>;
  email?: string | null;
  navItems: Array<{ href: string; label: string }>;
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
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
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

function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-4">
      <h2 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      <p className="mt-1 text-sm text-muted md:text-base">{description}</p>
    </div>
  );
}

function ProjectsSection({ projects }: { projects: ProjectRecord[] }) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section id="projects" className="space-y-4">
      <SectionTitle
        title="Top Projects"
        description="Quality-first project showcase with stack details and source links."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {projects.slice(0, 6).map((project) => (
          <Card key={project.id} className="h-full">
            <h3 className="font-heading text-xl font-semibold tracking-tight">{project.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.description || "No description provided."}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              {(project.tech_stack ?? []).filter(Boolean).length === 0 ? (
                <Badge variant="secondary">General Web Stack</Badge>
              ) : (
                (project.tech_stack ?? [])
                  .filter((tech) => tech && tech.trim().length > 0)
                  .slice(0, 6)
                  .map((tech) => (
                    <Badge
                      key={tech}
                      variant="secondary"
                      className="bg-foreground/5 hover:bg-foreground/10"
                    >
                      {tech}
                    </Badge>
                  ))
              )}
            </div>

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

function CaseStudiesSection({ projects }: { projects: ProjectRecord[] }) {
  const caseStudies = projects.slice(0, 3).map(buildCaseStudy);
  if (caseStudies.length === 0) {
    return null;
  }

  return (
    <section id="case-studies" className="space-y-4">
      <SectionTitle
        title="Case Studies"
        description="Problem, approach, and result overview for selected projects."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {caseStudies.map((study) => (
          <Card key={study.id} className="space-y-3">
            <h3 className="font-heading text-lg font-semibold">{study.title}</h3>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">Problem</p>
              <p className="mt-1 text-sm text-muted">{study.problem}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">Approach</p>
              <p className="mt-1 text-sm text-muted">{study.approach}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-primary">Result</p>
              <p className="mt-1 text-sm text-muted">{study.result}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
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
        description="Languages, frameworks, and tools used in production work."
      />
      <Card>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="bg-foreground/5 hover:bg-foreground/10">
              {skill}
            </Badge>
          ))}
        </div>
      </Card>
    </section>
  );
}

function AboutSection({ user }: { user: UserRecord }) {
  const hasDetails = Boolean(user.bio || user.location || user.username);
  if (!hasDetails) {
    return null;
  }

  return (
    <section id="about" className="space-y-4">
      <SectionTitle title="About Me" description="Personal brand and professional summary." />
      <Card>
        {user.bio ? (
          <p className="text-sm leading-relaxed text-muted md:text-base">{user.bio}</p>
        ) : null}
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
      <SectionTitle
        title="Resume / CV"
        description="Direct access to a professional resume or portfolio summary link."
      />
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

function RecommendationsSection({ linkedin }: { linkedin?: string }) {
  if (!linkedin) {
    return null;
  }

  return (
    <section id="recommendations" className="space-y-4">
      <SectionTitle
        title="Recommendations"
        description="Trust signals from your professional profile and network."
      />
      <Card className="space-y-3">
        <p className="text-sm text-muted">
          Recommendations and endorsements can be viewed on the LinkedIn profile.
        </p>
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
  name
}: {
  links: Record<string, string>;
  email?: string | null;
  name: string;
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
          description="Professional channels for collaboration and opportunities."
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

      {email ? <ContactFormCard recipientEmail={email} recipientName={name} /> : null}
    </section>
  );
}

function PortfolioFooter({
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
            <Link href={links.github} target="_blank" className="transition-colors hover:text-foreground">
              GitHub
            </Link>
          ) : null}
          {links.linkedin ? (
            <Link href={links.linkedin} target="_blank" className="transition-colors hover:text-foreground">
              LinkedIn
            </Link>
          ) : null}
          {links.website ? (
            <Link href={links.website} target="_blank" className="transition-colors hover:text-foreground">
              Website
            </Link>
          ) : null}
        </div>
      </div>
    </footer>
  );
}

function CinematicTemplate(props: SharedTemplateProps) {
  const { user, projects, skills, views, links, email, resumeUrl } = props;
  const linkCount = [links.github, links.linkedin, links.website].filter(Boolean).length;

  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
      <MotionFade delay={0.05}>
        <GsapHero
          name={user.name}
          tagline="Cinematic Template"
          summary={
            user.bio ||
            "Developer portfolio focused on production quality, modern UX, and measurable impact."
          }
          stats={[
            { label: "Portfolio Views", value: String(views) },
            { label: "Projects", value: String(projects.length) },
            { label: "Public Profiles", value: String(linkCount) }
          ]}
        />
      </MotionFade>

      <ProjectsSection projects={projects} />
      <CaseStudiesSection projects={projects} />
      <SkillsSection skills={skills} />
      <AboutSection user={user} />
      <ResumeSection resumeUrl={resumeUrl} />
      <RecommendationsSection linkedin={links.linkedin} />
      <ContactSection links={links} email={email} name={user.name} />
    </div>
  );
}

function SwipeTemplate(props: SharedTemplateProps) {
  const { user, projects, skills, views, links, email, resumeUrl } = props;
  const linkCount = [links.github, links.linkedin, links.website].filter(Boolean).length;

  const panels = [
    {
      id: "swipe-projects",
      title: "Projects",
      content: <ProjectsSection projects={projects} />
    },
    {
      id: "swipe-case",
      title: "Case Studies",
      content: <CaseStudiesSection projects={projects} />
    },
    {
      id: "swipe-skills",
      title: "Skills",
      content: <SkillsSection skills={skills} />
    },
    {
      id: "swipe-about",
      title: "About",
      content: <AboutSection user={user} />
    },
    {
      id: "swipe-contact",
      title: "Contact",
      content: <ContactSection links={links} email={email} name={user.name} />
    }
  ].filter((panel) => panel.content !== null);

  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <aside className="glass h-fit rounded-3xl border border-border bg-surface/75 p-6 lg:sticky lg:top-24">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Swipe Template</p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">{user.name}</h1>
          <p className="mt-3 text-sm text-muted">
            {user.bio ||
              "Swipe through portfolio sections for a focused mobile-first browsing experience."}
          </p>
          <div className="mt-5 space-y-2 text-sm text-muted">
            <p className="inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              {projects.length} projects
            </p>
            <p className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              {views} views
            </p>
            <p className="inline-flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              {linkCount} public links
            </p>
          </div>
          <div className="mt-5 space-y-3">
            <ResumeSection resumeUrl={resumeUrl} />
            <RecommendationsSection linkedin={links.linkedin} />
          </div>
        </aside>

        <div className="overflow-x-auto pb-2">
          <div className="flex gap-4 pr-4">
            {panels.map((panel) => (
              <article
                key={panel.id}
                className="min-w-[88%] snap-start rounded-3xl border border-border bg-surface/40 p-4 md:min-w-[72%] lg:min-w-[60%]"
              >
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-primary">{panel.title}</p>
                {panel.content}
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function EditorialTemplate(props: SharedTemplateProps) {
  const { user, projects, skills, links, email, resumeUrl } = props;

  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Editorial Template</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
          <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
            {user.bio ||
              "A refined editorial layout focused on readability, structure, and technical depth."}
          </p>
        </Card>

        {skills.length > 0 ? (
          <Card className="p-6">
            <h3 className="font-semibold">Technical Highlights</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.slice(0, 10).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </Card>
        ) : null}
      </section>

      <ProjectsSection projects={projects} />
      <section className="grid gap-4 lg:grid-cols-2">
        <CaseStudiesSection projects={projects} />
        <div className="space-y-4">
          <AboutSection user={user} />
          <ResumeSection resumeUrl={resumeUrl} />
          <RecommendationsSection linkedin={links.linkedin} />
        </div>
      </section>

      <ContactSection links={links} email={email} name={user.name} />
    </div>
  );
}

function ExecutiveTemplate(props: SharedTemplateProps) {
  const { user, projects, skills, views, links, email, resumeUrl } = props;

  return (
    <div className="container relative z-10 mx-auto grid max-w-6xl gap-6 px-4 pb-16 pt-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
        <Card>
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full border border-border bg-surface/80">
              <Image
                src={user.avatar_url}
                alt={`${user.name} avatar`}
                width={56}
                height={56}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="font-heading text-lg font-semibold">{user.name}</p>
              <p className="text-sm text-muted">@{user.username}</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted">
            Structured executive-style portfolio with trustable project communication.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p className="inline-flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" /> {projects.length} projects
            </p>
            <p className="inline-flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" /> {views} views
            </p>
          </div>
        </Card>

        <SkillsSection skills={skills} />
      </aside>

      <main className="space-y-6">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Executive Template</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-5xl">{user.name}</h1>
          <p className="mt-3 text-base text-muted md:text-lg">
            {user.bio ||
              "Product-minded engineer focused on reliability, outcomes, and polished UX delivery."}
          </p>
        </Card>

        <ProjectsSection projects={projects} />
        <CaseStudiesSection projects={projects} />
        <AboutSection user={user} />
        <ResumeSection resumeUrl={resumeUrl} />
        <RecommendationsSection linkedin={links.linkedin} />
        <ContactSection links={links} email={email} name={user.name} />
      </main>
    </div>
  );
}

function MonolithTemplate(props: SharedTemplateProps) {
  const { user, projects, skills, links, email, resumeUrl } = props;

  return (
    <div className="container relative z-10 mx-auto max-w-5xl space-y-8 px-4 pb-16 pt-8">
      <section className="rounded-3xl border border-border bg-surface/85 p-8">
        <p className="text-xs uppercase tracking-[0.22em] text-primary">Monolith Template</p>
        <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
        <p className="mt-4 max-w-3xl text-base text-muted md:text-lg">
          {user.bio ||
            "Minimal monochrome-inspired template with crisp hierarchy and high contrast readability."}
        </p>
      </section>

      <div className="border-l border-border pl-5">
        <div className="relative space-y-8">
          <div className="absolute left-[-0.45rem] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
          <ProjectsSection projects={projects} />
        </div>

        <div className="relative mt-8 space-y-8">
          <div className="absolute left-[-0.45rem] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
          <CaseStudiesSection projects={projects} />
          <SkillsSection skills={skills} />
        </div>

        <div className="relative mt-8 space-y-8">
          <div className="absolute left-[-0.45rem] top-1 h-3.5 w-3.5 rounded-full bg-primary" />
          <AboutSection user={user} />
          <ResumeSection resumeUrl={resumeUrl} />
          <RecommendationsSection linkedin={links.linkedin} />
          <ContactSection links={links} email={email} name={user.name} />
        </div>
      </div>
    </div>
  );
}

function AtelierTemplate(props: SharedTemplateProps) {
  const { user, projects, skills, views, links, email, resumeUrl } = props;
  const linkCount = [links.github, links.linkedin, links.website].filter(Boolean).length;

  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-3xl border border-border bg-surface/70 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Atelier Template</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">
            {user.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            {user.bio ||
              "Signature portfolio style blending elegant visuals with engineering-first project communication."}
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-foreground/5">
              @{user.username}
            </Badge>
            {user.location ? (
              <Badge variant="secondary" className="bg-foreground/5">
                {user.location}
              </Badge>
            ) : null}
          </div>
        </div>

        <Card className="space-y-3">
          <p className="text-xs uppercase tracking-wide text-muted">Portfolio Metrics</p>
          <div className="rounded-2xl border border-border bg-surface/80 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Views</p>
            <p className="mt-1 text-2xl font-bold text-primary">{views}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/80 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Published Projects</p>
            <p className="mt-1 text-2xl font-bold text-primary">{projects.length}</p>
          </div>
          <div className="rounded-2xl border border-border bg-surface/80 p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Public Profiles</p>
            <p className="mt-1 text-2xl font-bold text-primary">{linkCount}</p>
          </div>
        </Card>
      </section>

      <ProjectsSection projects={projects} />

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <CaseStudiesSection projects={projects} />
          <SkillsSection skills={skills} />
        </div>

        <div className="space-y-4">
          <AboutSection user={user} />
          <ResumeSection resumeUrl={resumeUrl} />
          <RecommendationsSection linkedin={links.linkedin} />
        </div>
      </section>

      <ContactSection links={links} email={email} name={user.name} />
    </div>
  );
}

export function PublicPortfolioTemplate({
  data,
  showUnpublishedBanner = false,
  siteUrl
}: PublicPortfolioTemplateProps) {
  const { user, portfolio, projects, views } = data;

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
  const hasResume = Boolean(resumeUrl);

  const hasProjects = projects.length > 0;
  const hasSkills = skills.length > 0;
  const hasContact = Boolean(user.email || normalizedLinks.github || normalizedLinks.linkedin || normalizedLinks.website);
  const navItems = getNavSections(hasProjects, hasSkills, hasContact);

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
    views,
    links: normalizedLinks,
    email: user.email,
    profileUrl,
    resumeUrl,
    hasResume
  };

  return (
    <main className={cn("noise min-h-screen overflow-hidden pb-12", themeClass)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="pointer-events-none absolute right-0 top-0 -z-10 h-[30rem] w-[30rem] -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/10 blur-[120px]" />

      <PortfolioTopbar
        name={user.name}
        username={user.username}
        links={normalizedLinks}
        email={user.email}
        navItems={navItems}
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

      <PortfolioFooter name={user.name} username={user.username} links={normalizedLinks} />
    </main>
  );
}
