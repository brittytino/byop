import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().min(2).max(80),
  bio: z.string().max(300).optional(),
  location: z.string().max(80).optional(),
  skills: z.array(z.string().min(1).max(30)).max(24),
  links: z
    .record(z.union([z.string().url(), z.literal("")]))
    .default({})
});

export const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  github_url: z.string().url().optional().or(z.literal("")),
  live_url: z.string().url().optional().or(z.literal("")),
  tech_stack: z.array(z.string().min(1).max(30)).max(20)
});
