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
  content?: string[];
  date: string;
  entryId?: string;
  excerpt: string;
  slug: string;
  source: "content" | "legacy";
  tags: Tag[];
  title: string;
};

const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category])
) as Record<string, Category>;

const tagBySlug = Object.fromEntries(
  tags.map((tag) => [tag.slug, tag])
) as Record<string, Tag>;

const legacyPosts: Post[] = [
  {
    slug: "windows-and-mac-desktop-notes",
    title: "WindowsとMacの使い分けメモ",
    date: "2026.05.20",
    excerpt: "作業内容ごとにWindowsとMacをどう切り替えるか、最近の自分用ルールを書き残した。",
    content: [
      "作業内容ごとにWindowsとMacをどう切り替えるか、最近の自分用ルールを書き残した。",
      "周辺機器やショートカットの差を理解しておくと、思ったよりストレスが少ない。",
      "PC環境は一度固めるより、用途に合わせて少しずつ更新する方が合っている。"
    ],
    category: categoryBySlug.pc,
    source: "legacy",
    tags: [tagBySlug.windows, tagBySlug.mac]
  },
  {
    slug: "manga-reread-night",
    title: "漫画を読み返す夜のログ",
    date: "2026.05.18",
    excerpt: "昔好きだった漫画を読み返して、当時とは違う読み方になっていたことに気づいた。",
    content: [
      "昔好きだった漫画を読み返して、当時とは違う読み方になっていたことに気づいた。",
      "ストーリーよりも、間の取り方や台詞の余白に目が向くようになっている。",
      "読み返すたびに違う感想が出る作品は、やっぱり長く残る。"
    ],
    category: categoryBySlug.manga,
    source: "legacy",
    tags: [tagBySlug.mac]
  },
  {
    slug: "movie-log-for-weekend",
    title: "週末に観た映画の短い感想",
    date: "2026.05.17",
    excerpt: "派手さよりも空気感で引っ張る映画が好きだと、最近あらためて思った。",
    content: [
      "派手さよりも空気感で引っ張る映画が好きだと、最近あらためて思った。",
      "大きな事件がなくても、画と音だけで気持ちを持っていかれる作品がある。",
      "観終わったあとに余韻が残る映画を、これからも少しずつ記録していきたい。"
    ],
    category: categoryBySlug.movie,
    source: "legacy",
    tags: [tagBySlug.windows]
  },
  {
    slug: "small-zakki-about-blogging",
    title: "ブログを続けるための小さな雑記",
    date: "2026.05.16",
    excerpt: "完璧な記事を書くより、短くても残していく方がこの場所には合っている気がした。",
    content: [
      "完璧な記事を書くより、短くても残していく方がこの場所には合っている気がした。",
      "気軽に書ける型を作っておくと、あとから見返したときにも流れが追いやすい。",
      "雑記は散らかって見えるけれど、あとで自分を助けるメモになる。"
    ],
    category: categoryBySlug.zakki,
    source: "legacy",
    tags: [tagBySlug.linux]
  }
];

const normalizeEntrySlug = (entryId: string) =>
  entryId.replace(/\.(md|mdx)$/u, "");

const getContentPosts = async (): Promise<Post[]> => {
  const entries = await getCollection("posts");

  return entries.map((entry) => {
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
      category,
      entryId: entry.id,
      source: "content",
      tags: entryTags
    };
  });
};

export const getAllPosts = async (): Promise<Post[]> => {
  const contentPosts = await getContentPosts();

  return [...contentPosts, ...legacyPosts].sort((left, right) =>
    right.date.localeCompare(left.date)
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
  if (post.source !== "content" || !post.entryId) {
    return null;
  }

  return getEntry("posts", post.entryId);
};

export {
  categories,
  getCategoryHref,
  getPostHref,
  getTagHref,
  tags
};

export type { Category, Tag };
