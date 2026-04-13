export type UserRecord = {
  id: string;
  github_id: string;
  username: string;
  name: string;
  bio: string | null;
  avatar_url: string;
  email: string | null;
  location: string | null;
  skills: string[];
  links: Record<string, string>;
  created_at: string;
};

export type PortfolioRecord = {
  id: string;
  user_id: string;
  theme: string;
  is_published: boolean;
  updated_at: string;
};

export type ProjectRecord = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  github_url: string | null;
  live_url: string | null;
  tech_stack: string[];
  created_at: string;
  updated_at: string;
};
