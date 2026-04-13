import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  ExternalLink,
  FileDown,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Sparkles,
  Star,
  UserRound
} from "lucide-react";

import { MotionFade } from "@/components/shared/motion-fade";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { ContactFormCard } from "@/components/portfolio/contact-form-card";
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

type TemplateVariant = "studio" | "executive" | "editorial" | "atelier";

function getTemplateVariant(theme?: string | null): TemplateVariant {
  switch (theme) {
    case "ocean-breeze":
    case "sunset-glow":
      return "executive";
    case "forest-whisper":
    case "monochrome-exec":
      return "editorial";
    case "rose-luxe":
      return "atelier";
    default:
      return "studio";
  }
}

function buildCaseStudy(project: ProjectRecord) {
  const stack = (project.tech_stack ?? []).filter(Boolean).slice(0, 3).join(", ");

  return {
    id: project.id,
    title: project.title,
    problem:
      project.description?.trim() ||
      "Needed to create a reliable product experience for real users.",
    approach: stack
      ? `Designed and shipped using ${stack}, with focus on maintainability and performance.`
      : "Designed and shipped with a modern web stack and pragmatic architecture.",
    result: project.live_url
      ? "Delivered to production with a live deployment and polished user flows."
      : "Published as an open-source build to document implementation quality."
  };
}

function PortfolioTopbar({
  name,
  username,
  links,
  email
}: {
  name: string;
  username: string;
  links: Record<string, string>;
  email?: string | null;
}) {
  return (
    <header className="sticky top-3 z-30 px-4 pt-4 md:px-6">
      <div className="glass mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-border bg-surface/80 px-4 py-3 md:px-6">
        <Link href={`/${username}`} className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight md:text-lg">
          <Sparkles className="h-4 w-4 text-primary" />
          {name}
        </Link>

        <nav className="hidden items-center gap-4 text-sm text-muted md:flex">
          <a href="#projects" className="transition-colors hover:text-foreground">Projects</a>
          <a href="#case-studies" className="transition-colors hover:text-foreground">Case Studies</a>
          <a href="#skills" className="transition-colors hover:text-foreground">Skills</a>
          <a href="#contact" className="transition-colors hover:text-foreground">Contact</a>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {links.github ? (
            <Link href={links.github} target="_blank" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/90 text-muted transition-colors hover:text-foreground">
              <Github className="h-4 w-4" />
            </Link>
          ) : null}
          {email ? (
            <Link href={`mailto:${email}`} className="hidden rounded-full border border-border bg-surface/90 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:text-foreground md:inline-flex">
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

function PremiumProjects({ projects }: { projects: ProjectRecord[] }) {
  return (
    <section id="projects" className="space-y-4">
      <SectionTitle
        title="Top Projects"
        description="Quality-first project showcase with technical stack and source links."
      />

      {projects.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">No projects published yet.</p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.slice(0, 6).map((project) => (
            <Card key={project.id} className="h-full">
              <h3 className="font-heading text-xl font-semibold tracking-tight">{project.title}</h3>
              <p className="mt-2 text-sm text-muted leading-relaxed">
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
                      <Badge key={tech} variant="secondary" className="bg-foreground/5 hover:bg-foreground/10">
                        {tech}
                      </Badge>
                    ))
                )}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm font-medium">
                {project.github_url ? (
                  <Link href={project.github_url} target="_blank" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
                    <Github className="h-4 w-4" />
                    GitHub Repo
                  </Link>
                ) : null}
                {project.live_url ? (
                  <Link href={project.live_url} target="_blank" className="inline-flex items-center gap-1 text-primary transition-colors hover:text-primary/80">
                    <ExternalLink className="h-4 w-4" />
                    Live Project
                  </Link>
                ) : null}
                {!project.github_url && !project.live_url ? (
                  <span className="text-muted">No external links yet</span>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

function CaseStudies({ projects }: { projects: ProjectRecord[] }) {
  const caseStudies = projects.slice(0, 3).map(buildCaseStudy);

  return (
    <section id="case-studies" className="space-y-4">
      <SectionTitle
        title="Case Studies"
        description="How problems were identified, solved, and shipped to measurable outcomes."
      />

      {caseStudies.length === 0 ? (
        <Card>
          <p className="text-sm text-muted">Case studies will appear as projects are added.</p>
        </Card>
      ) : (
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
      )}
    </section>
  );
}

function SkillsSection({ skills }: { skills: string[] }) {
  return (
    <section id="skills" className="space-y-4">
      <SectionTitle
        title="Technical Skills"
        description="Languages, frameworks, and tools used in production-grade development."
      />
      <Card>
        <div className="flex flex-wrap gap-2">
          {skills.length === 0 ? (
            <p className="text-sm text-muted">Skills will appear here once added from the dashboard.</p>
          ) : (
            skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="bg-foreground/5 hover:bg-foreground/10">
                {skill}
              </Badge>
            ))
          )}
        </div>
      </Card>
    </section>
  );
}

function AboutAndResume({
  user,
  profileUrl,
  resumeUrl,
  hasPublicResume
}: {
  user: UserRecord;
  profileUrl: string;
  resumeUrl: string;
  hasPublicResume: boolean;
}) {
  return (
    <section id="about" className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <SectionTitle
          title="About Me"
          description="Professional summary and personal brand positioning."
        />
        <p className="text-sm leading-relaxed text-muted md:text-base">
          {user.bio ||
            `${user.name} is a developer focused on building polished, reliable, and user-first digital products.`}
        </p>
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

      <Card>
        <SectionTitle
          title="Resume / CV"
          description="Quickly review or export this profile as a resume-ready document."
        />
        <div className="space-y-3 text-sm text-muted">
          <p>
            {hasPublicResume
              ? "Resume link is available below."
              : "Use this portfolio route and print to PDF for an instant resume export."}
          </p>
          <Link
            href={resumeUrl || profileUrl}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 font-medium text-primary-foreground shadow-glow"
          >
            <FileDown className="h-4 w-4" />
            {hasPublicResume ? "Open Resume Link" : "Open Resume View"}
          </Link>
        </div>
      </Card>
    </section>
  );
}

function TestimonialsSection() {
  const placeholders = [
    {
      quote:
        "Add a recommendation from a manager or client here to strengthen trust and social proof.",
      name: "Recommendation Slot 1",
      role: "LinkedIn / Client Testimonial"
    },
    {
      quote:
        "Include a concise quote focused on communication, ownership, and delivery quality.",
      name: "Recommendation Slot 2",
      role: "Mentor / Team Lead"
    }
  ];

  return (
    <section id="testimonials" className="space-y-4">
      <SectionTitle
        title="Testimonials & Recommendations"
        description="Social proof section designed for trust and credibility."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {placeholders.map((item) => (
          <Card key={item.name}>
            <p className="text-sm italic leading-relaxed text-muted">
              &quot;{item.quote}&quot;
            </p>
            <p className="mt-4 text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted">{item.role}</p>
          </Card>
        ))}
      </div>
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
  return (
    <section id="contact" className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
      <Card>
        <SectionTitle
          title="Contact"
          description="Professional channels for collaboration and opportunities."
        />
        <div className="space-y-3 text-sm">
          {email ? (
            <Link href={`mailto:${email}`} className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
              <Mail className="h-4 w-4 text-primary" />
              {email}
            </Link>
          ) : (
            <p className="text-muted">Email not configured yet.</p>
          )}

          {links.github ? (
            <Link href={links.github} target="_blank" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
              <Github className="h-4 w-4 text-primary" />
              GitHub
            </Link>
          ) : null}

          {links.linkedin ? (
            <Link href={links.linkedin} target="_blank" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
              <Linkedin className="h-4 w-4 text-primary" />
              LinkedIn
            </Link>
          ) : null}

          {links.website ? (
            <Link href={links.website} target="_blank" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-foreground">
              <ExternalLink className="h-4 w-4 text-primary" />
              Website
            </Link>
          ) : null}
        </div>
      </Card>

      <ContactFormCard recipientEmail={email} recipientName={name} />
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

function StudioTemplate({
  user,
  projects,
  skills,
  views,
  links,
  email,
  profileUrl,
  resumeUrl,
  hasPublicResume
}: {
  user: UserRecord;
  projects: ProjectRecord[];
  skills: string[];
  views: number;
  links: Record<string, string>;
  email?: string | null;
  profileUrl: string;
  resumeUrl: string;
  hasPublicResume: boolean;
}) {
  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-8 px-4 pb-16 pt-8">
      <MotionFade delay={0.1}>
        <section className="glass rounded-3xl border border-border bg-surface/70 p-8 md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            Impactful Hero
          </p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-6xl">
            {user.name}
          </h1>
          <p className="mt-4 max-w-3xl text-base text-muted md:text-xl">
            Building premium digital products with modern engineering, clean UX, and production quality.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Portfolio Views</p>
              <p className="mt-1 text-2xl font-bold text-primary">{views}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Projects Shipped</p>
              <p className="mt-1 text-2xl font-bold text-primary">{projects.length}</p>
            </Card>
            <Card className="p-4">
              <p className="text-xs uppercase tracking-wide text-muted">Focus</p>
              <p className="mt-1 text-2xl font-bold text-primary">UX + Scale</p>
            </Card>
          </div>
        </section>
      </MotionFade>

      <PremiumProjects projects={projects} />
      <CaseStudies projects={projects} />
      <SkillsSection skills={skills} />
      <AboutAndResume user={user} profileUrl={profileUrl} resumeUrl={resumeUrl} hasPublicResume={hasPublicResume} />
      <TestimonialsSection />
      <ContactSection links={links} email={email} name={user.name} />
    </div>
  );
}

function ExecutiveTemplate({
  user,
  projects,
  skills,
  views,
  links,
  email,
  profileUrl,
  resumeUrl,
  hasPublicResume
}: {
  user: UserRecord;
  projects: ProjectRecord[];
  skills: string[];
  views: number;
  links: Record<string, string>;
  email?: string | null;
  profileUrl: string;
  resumeUrl: string;
  hasPublicResume: boolean;
}) {
  return (
    <div className="container relative z-10 mx-auto grid max-w-6xl gap-6 px-4 pb-16 pt-8 lg:grid-cols-[280px_1fr]">
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
          <p className="mt-4 text-sm text-muted">Premium portfolio with structured delivery and executive presentation.</p>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p className="inline-flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> {projects.length} projects</p>
            <p className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-primary" /> {views} views</p>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold">Core Skills</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.slice(0, 8).map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </Card>
      </aside>

      <main className="space-y-6">
        <Card>
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Impactful Hero</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-5xl">{user.name}</h1>
          <p className="mt-3 text-base text-muted md:text-lg">
            Product-minded developer focused on measurable outcomes, reliable systems, and premium user experiences.
          </p>
        </Card>

        <PremiumProjects projects={projects} />
        <CaseStudies projects={projects} />
        <AboutAndResume user={user} profileUrl={profileUrl} resumeUrl={resumeUrl} hasPublicResume={hasPublicResume} />
        <TestimonialsSection />
        <ContactSection links={links} email={email} name={user.name} />
      </main>
    </div>
  );
}

function EditorialTemplate({
  user,
  projects,
  skills,
  links,
  email,
  profileUrl,
  resumeUrl,
  hasPublicResume
}: {
  user: UserRecord;
  projects: ProjectRecord[];
  skills: string[];
  links: Record<string, string>;
  email?: string | null;
  profileUrl: string;
  resumeUrl: string;
  hasPublicResume: boolean;
}) {
  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.2em] text-primary">Personal Brand</p>
          <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight md:text-6xl">{user.name}</h1>
          <p className="mt-4 max-w-xl text-base text-muted md:text-lg">
            Designing and engineering mature digital products with modern aesthetics and practical business value.
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold">Technical Highlights</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {skills.slice(0, 10).map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </Card>
      </section>

      <PremiumProjects projects={projects} />
      <section className="grid gap-4 lg:grid-cols-2">
        <CaseStudies projects={projects} />
        <div className="space-y-4">
          <AboutAndResume user={user} profileUrl={profileUrl} resumeUrl={resumeUrl} hasPublicResume={hasPublicResume} />
        </div>
      </section>

      <TestimonialsSection />
      <ContactSection links={links} email={email} name={user.name} />
    </div>
  );
}

function AtelierTemplate({
  user,
  projects,
  skills,
  views,
  links,
  email,
  profileUrl,
  resumeUrl,
  hasPublicResume
}: {
  user: UserRecord;
  projects: ProjectRecord[];
  skills: string[];
  views: number;
  links: Record<string, string>;
  email?: string | null;
  profileUrl: string;
  resumeUrl: string;
  hasPublicResume: boolean;
}) {
  return (
    <div className="container relative z-10 mx-auto max-w-6xl space-y-6 px-4 pb-16 pt-8">
      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="glass rounded-3xl border border-border bg-surface/70 p-8 md:p-10">
          <p className="text-xs uppercase tracking-[0.22em] text-primary">Signature Template</p>
          <h1 className="mt-3 font-heading text-4xl font-bold tracking-tight md:text-6xl">
            {user.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base text-muted md:text-lg">
            End-to-end product builder delivering mature, trustable, and premium digital
            experiences with a strong engineering foundation.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-foreground/5">Atelier Portfolio</Badge>
            <Badge variant="secondary" className="bg-foreground/5">@{user.username}</Badge>
            {user.location ? (
              <Badge variant="secondary" className="bg-foreground/5">{user.location}</Badge>
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
            <p className="text-xs uppercase tracking-wide text-muted">Core Style</p>
            <p className="mt-1 text-lg font-semibold">Elegant + Technical</p>
          </div>
        </Card>
      </section>

      <section id="projects" className="space-y-4">
        <SectionTitle
          title="Top Projects"
          description="Handpicked product work with premium presentation and direct access links."
        />

        {projects.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">No projects published yet.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {projects.slice(0, 6).map((project, index) => (
              <Card key={project.id} className="grid gap-4 md:grid-cols-[auto_1fr_auto] md:items-center">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-sm font-semibold text-primary">
                  {(index + 1).toString().padStart(2, "0")}
                </div>

                <div>
                  <h3 className="font-heading text-xl font-semibold tracking-tight">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {project.description || "No description provided."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(project.tech_stack ?? []).filter(Boolean).length === 0 ? (
                      <Badge variant="secondary">General Web Stack</Badge>
                    ) : (
                      (project.tech_stack ?? [])
                        .filter((tech) => tech && tech.trim().length > 0)
                        .slice(0, 5)
                        .map((tech) => (
                          <Badge key={tech} variant="secondary" className="bg-foreground/5">
                            {tech}
                          </Badge>
                        ))
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  {project.github_url ? (
                    <Link href={project.github_url} target="_blank" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground">
                      <Github className="h-4 w-4" />
                      Repo
                    </Link>
                  ) : null}
                  {project.live_url ? (
                    <Link href={project.live_url} target="_blank" className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground">
                      <ExternalLink className="h-4 w-4" />
                      Live
                    </Link>
                  ) : null}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <CaseStudies projects={projects} />
          <SkillsSection skills={skills} />
        </div>

        <div className="space-y-4">
          <AboutAndResume
            user={user}
            profileUrl={profileUrl}
            resumeUrl={resumeUrl}
            hasPublicResume={hasPublicResume}
          />
          <TestimonialsSection />
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
  const resumeUrl = normalizedLinks.resume || normalizedLinks.website || `${profileUrl}?print=true`;
  const hasPublicResume = Boolean(normalizedLinks.resume || normalizedLinks.website);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: user.name ?? user.username,
    url: profileUrl,
    description: user.bio ?? "Developer portfolio",
    image: user.avatar_url,
    sameAs: Object.values(normalizedLinks).filter(Boolean)
  };

  return (
    <main className={cn("noise min-h-screen overflow-hidden pb-12", themeClass)}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <div className="absolute right-0 top-0 -z-10 h-[30rem] w-[30rem] -translate-y-1/3 translate-x-1/3 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />

      <PortfolioTopbar
        name={user.name}
        username={user.username}
        links={normalizedLinks}
        email={user.email}
      />

      {showUnpublishedBanner ? (
        <div className="container mx-auto mt-4 max-w-6xl px-4">
          <div className="rounded-2xl border border-yellow-500/40 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-700 dark:text-yellow-200">
            This portfolio is not published. You are viewing private preview mode.
          </div>
        </div>
      ) : null}

      {variant === "executive" ? (
        <ExecutiveTemplate
          user={user}
          projects={projects}
          skills={skills}
          views={views}
          links={normalizedLinks}
          email={user.email}
          profileUrl={profileUrl}
          resumeUrl={resumeUrl}
          hasPublicResume={hasPublicResume}
        />
      ) : null}

      {variant === "editorial" ? (
        <EditorialTemplate
          user={user}
          projects={projects}
          skills={skills}
          links={normalizedLinks}
          email={user.email}
          profileUrl={profileUrl}
          resumeUrl={resumeUrl}
          hasPublicResume={hasPublicResume}
        />
      ) : null}

      {variant === "studio" ? (
        <StudioTemplate
          user={user}
          projects={projects}
          skills={skills}
          views={views}
          links={normalizedLinks}
          email={user.email}
          profileUrl={profileUrl}
          resumeUrl={resumeUrl}
          hasPublicResume={hasPublicResume}
        />
      ) : null}

      {variant === "atelier" ? (
        <AtelierTemplate
          user={user}
          projects={projects}
          skills={skills}
          views={views}
          links={normalizedLinks}
          email={user.email}
          profileUrl={profileUrl}
          resumeUrl={resumeUrl}
          hasPublicResume={hasPublicResume}
        />
      ) : null}

      <PortfolioFooter name={user.name} username={user.username} links={normalizedLinks} />
    </main>
  );
}
