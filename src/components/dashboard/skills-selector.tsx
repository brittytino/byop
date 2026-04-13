"use client";

import { Check, Plus, Search, X } from "lucide-react";
import { useMemo, useState, type KeyboardEvent } from "react";

import {
  getTechIcon,
  normalizeTech,
  TECH_STACK_SUGGESTIONS
} from "@/components/portfolio/tech-pill";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

type SkillsSelectorProps = {
  id?: string;
  name?: string;
  initialSkills?: string[];
  placeholder?: string;
};

function uniqueSkills(skills: string[]) {
  const seen = new Set<string>();
  const values: string[] = [];

  for (const skill of skills) {
    const value = skill.trim().replace(/\s+/g, " ");
    if (!value) {
      continue;
    }

    const key = normalizeTech(value);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    values.push(value);
  }

  return values;
}

function toCanonicalName(input: string) {
  const inputKey = normalizeTech(input);
  return TECH_STACK_SUGGESTIONS.find((value) => normalizeTech(value) === inputKey) ?? input.trim();
}

export function SkillsSelector({
  id = "skills",
  name = "skills",
  initialSkills = [],
  placeholder = "Search tech stack and add skills"
}: SkillsSelectorProps) {
  const [skills, setSkills] = useState<string[]>(() => uniqueSkills(initialSkills));
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const selectedKeys = useMemo(() => {
    return new Set(skills.map((value) => normalizeTech(value)));
  }, [skills]);

  const suggestions = useMemo(() => {
    const normalizedQuery = normalizeTech(query);

    return TECH_STACK_SUGGESTIONS.filter((skill) => {
      const key = normalizeTech(skill);
      if (selectedKeys.has(key)) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      return key.includes(normalizedQuery);
    }).slice(0, 10);
  }, [query, selectedKeys]);

  const hasExactTypedValue = useMemo(() => {
    if (!query.trim()) {
      return false;
    }

    const key = normalizeTech(query);
    return selectedKeys.has(key) || TECH_STACK_SUGGESTIONS.some((value) => normalizeTech(value) === key);
  }, [query, selectedKeys]);

  function addSkill(value: string) {
    const trimmed = value.trim().replace(/\s+/g, " ");
    if (!trimmed) {
      return;
    }

    const canonical = toCanonicalName(trimmed);
    const normalized = normalizeTech(canonical);

    if (skills.some((existing) => normalizeTech(existing) === normalized)) {
      setQuery("");
      setOpen(false);
      return;
    }

    setSkills((previous) => [...previous, canonical]);
    setQuery("");
    setOpen(false);
  }

  function removeSkill(value: string) {
    const key = normalizeTech(value);
    setSkills((previous) => previous.filter((entry) => normalizeTech(entry) !== key));
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();

      if (query.trim()) {
        addSkill(suggestions[0] ?? query);
      }
      return;
    }

    if (event.key === "Backspace" && !query && skills.length > 0) {
      event.preventDefault();
      setSkills((previous) => previous.slice(0, -1));
    }

    if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={skills.join(", ")} />

      <div className="rounded-2xl border border-border bg-surface/70 p-3">
        <div className="flex flex-wrap gap-2">
          {skills.length > 0 ? (
            skills.map((skill) => {
              const Icon = getTechIcon(skill);

              return (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="gap-1.5 border-border bg-background/70 pr-1"
                >
                  {Icon ? <Icon className="h-3.5 w-3.5 text-primary" /> : null}
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="rounded-full p-0.5 text-muted transition-colors hover:bg-foreground/10 hover:text-foreground"
                    aria-label={`Remove ${skill}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })
          ) : (
            <p className="text-xs text-muted">No skills selected yet.</p>
          )}
        </div>

        <div className="relative mt-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            id={id}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => {
              setTimeout(() => setOpen(false), 120);
            }}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="pl-9"
          />

          {open && (query.trim().length > 0 || suggestions.length > 0) ? (
            <div className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-background/95 p-1 shadow-xl backdrop-blur">
              {query.trim().length > 0 && !hasExactTypedValue ? (
                <button
                  type="button"
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => addSkill(query)}
                >
                  <span className="inline-flex items-center gap-2">
                    <Plus className="h-3.5 w-3.5 text-primary" />
                    Add &quot;{query.trim()}&quot;
                  </span>
                </button>
              ) : null}

              {suggestions.map((skill) => {
                const Icon = getTechIcon(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => addSkill(skill)}
                  >
                    <span className="inline-flex items-center gap-2">
                      {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
                      {skill}
                    </span>
                    <Check className="h-3.5 w-3.5 text-muted" />
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </div>

      <p className="text-xs text-muted">
        Press Enter or comma to add. You can add unlimited skills.
      </p>
    </div>
  );
}
