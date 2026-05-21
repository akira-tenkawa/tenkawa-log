import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { categorySlugs, tagSlugs } from "./data/taxonomy";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: "**/*.{md,mdx}"
  }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    category: z.enum(categorySlugs),
    tags: z.array(z.enum(tagSlugs))
  })
});

export const collections = {
  posts
};
