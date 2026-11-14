import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

// ✅ Set this to the actual path relative to the project root
export const BLOG_PATH = "src/content/posts";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string().default("PrepViVo Editorial"),
      pubDatetime: z.coerce.date(),
      modDatetime: z.coerce.date().optional().nullable(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      ogImage: image().or(z.string()).optional(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      hideToc: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      ogImage: image().or(z.string()).optional(),
    }),
});

export const collections = { posts, pages };
