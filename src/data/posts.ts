import { getCollection, getEntry } from "astro:content";
import {
  categories,
  findCategoryByRouteValue,
  findTagByRouteValue,
  getCategoryHref,
  getPostHref,
  getTagHref,
  normalizeRouteValue,
  tags,
  type Category,
  type Tag
} from "./taxonomy";

export type Post = {
  category: Category;
  date: string;
  entryId: string;
  excerpt: string;
  ogImage?: string;
  slug: string;
  tags: Tag[];
  title: string;
};

const normalizeEntrySlug = (entryId: string) =>
  entryId.replace(/\.(md|mdx)$/u, "");

const getSortablePostDate = (date: string) => {
  const [year = 0, month = 0, day = 0] = date
    .split(/[-.]/u)
    .map((value) => Number.parseInt(value, 10));

  return year * 10000 + month * 100 + day;
};

export const getAllPosts = async (): Promise<Post[]> => {
  const entries = await getCollection("posts");

  return entries
    .map((entry) => {
      const category = findCategoryByRouteValue(entry.data.category);
      const entryTags = entry.data.tags
        .map((tag) => findTagByRouteValue(tag))
        .filter((tag): tag is Tag => Boolean(tag));

      if (!category) {
        throw new Error(`Unknown category in content post: ${entry.id}`);
      }

      return {
        slug: normalizeEntrySlug(entry.id),
        title: entry.data.title,
        date: entry.data.date,
        excerpt: entry.data.excerpt,
        ogImage: entry.data.ogImage,
        category,
        entryId: entry.id,
        tags: entryTags
      };
    })
    .sort(
      (left, right) =>
        getSortablePostDate(right.date) - getSortablePostDate(left.date)
    );
};

export const getPostsByCategory = async (categorySlug: string) => {
  const posts = await getAllPosts();
  const normalizedCategorySlug =
    findCategoryByRouteValue(categorySlug)?.slug ?? normalizeRouteValue(categorySlug);

  return posts.filter(
    (post) => normalizeRouteValue(post.category.slug) === normalizedCategorySlug
  );
};

export const getPostsByTag = async (tagSlug: string) => {
  const posts = await getAllPosts();
  const normalizedTagSlug =
    findTagByRouteValue(tagSlug)?.slug ?? normalizeRouteValue(tagSlug);

  return posts.filter((post) =>
    post.tags.some((tag) => normalizeRouteValue(tag.slug) === normalizedTagSlug)
  );
};

export const getPostBySlug = async (slug: string) => {
  const posts = await getAllPosts();

  return posts.find((post) => post.slug === slug);
};

export const getContentEntryByPost = async (post: Post) => {
  const entry = await getEntry("posts", post.entryId);

  if (!entry) {
    throw new Error(`Content entry not found for post: ${post.slug}`);
  }

  return entry;
};

export {
  categories,
  getCategoryHref,
  getPostHref,
  getTagHref,
  tags
};

export type { Category, Tag };
