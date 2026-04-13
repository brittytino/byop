import type { IconType } from "react-icons";
import {
  SiAndroid,
  SiCss,
  SiDjango,
  SiDocker,
  SiExpress,
  SiFigma,
  SiFirebase,
  SiFlutter,
  SiGit,
  SiGithub,
  SiGo,
  SiGraphql,
  SiHtml5,
  SiJavascript,
  SiKotlin,
  SiMongodb,
  SiMysql,
  SiNestjs,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiPython,
  SiReact,
  SiRedis,
  SiSupabase,
  SiSvelte,
  SiSwift,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVuedotjs
} from "react-icons/si";

import { Badge } from "@/components/ui/badge";

const techIconMap: Record<string, IconType> = {
  android: SiAndroid,
  css: SiCss,
  django: SiDjango,
  docker: SiDocker,
  express: SiExpress,
  figma: SiFigma,
  firebase: SiFirebase,
  flutter: SiFlutter,
  git: SiGit,
  github: SiGithub,
  go: SiGo,
  golang: SiGo,
  graphql: SiGraphql,
  html: SiHtml5,
  javascript: SiJavascript,
  js: SiJavascript,
  kotlin: SiKotlin,
  mongodb: SiMongodb,
  mysql: SiMysql,
  nest: SiNestjs,
  nestjs: SiNestjs,
  next: SiNextdotjs,
  nextjs: SiNextdotjs,
  node: SiNodedotjs,
  nodejs: SiNodedotjs,
  postgres: SiPostgresql,
  postgresql: SiPostgresql,
  python: SiPython,
  react: SiReact,
  redis: SiRedis,
  supabase: SiSupabase,
  svelte: SiSvelte,
  swift: SiSwift,
  tailwind: SiTailwindcss,
  tailwindcss: SiTailwindcss,
  typescript: SiTypescript,
  ts: SiTypescript,
  vercel: SiVercel,
  vue: SiVuedotjs,
  vuejs: SiVuedotjs
};

function normalizeTech(tech: string) {
  return tech.toLowerCase().replace(/[.+#\s_-]/g, "");
}

type TechPillProps = {
  tech: string;
  variant?: "secondary" | "outline";
  className?: string;
};

export function TechPill({ tech, variant = "secondary", className }: TechPillProps) {
  const key = normalizeTech(tech);
  const Icon = techIconMap[key];

  return (
    <Badge variant={variant} className={className}>
      {Icon ? <Icon className="mr-1.5 h-3.5 w-3.5" /> : null}
      {tech}
    </Badge>
  );
}
