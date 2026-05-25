export type Category = {
  name: string;
  slug: string;
};

export type Tag = {
  name: string;
  slug: string;
};

export const categories: Category[] = [
  { slug: "ai", name: "AI" },
  { slug: "pc", name: "PC" },
  { slug: "manga", name: "漫画" },
  { slug: "movie", name: "映画" },
  { slug: "zakki", name: "雑記" }
];

export const tags: Tag[] = [
  { slug: "windows", name: "Windows" },
  { slug: "mac", name: "Mac" },
  { slug: "linux", name: "Linux" },
  { slug: "dify", name: "Dify" },
  { slug: "zakki", name: "雑記" }
];

export const categorySlugs = categories.map((category) => category.slug) as [
  string,
  ...string[]
];

export const tagSlugs = tags.map((tag) => tag.slug) as [string, ...string[]];

export const getCategoryHref = (slug: string) => `/category/${slug}/`;

export const getPostHref = (slug: string) => `/posts/${slug}/`;

export const getTagHref = (slug: string) => `/tag/${slug}/`;

export const normalizeRouteValue = (value: string) =>
  decodeURIComponent(value).trim().toLowerCase();

export const findCategoryByRouteValue = (value: string) => {
  const normalizedValue = normalizeRouteValue(value);

  return categories.find((category) => {
    return (
      normalizeRouteValue(category.slug) === normalizedValue ||
      normalizeRouteValue(category.name) === normalizedValue
    );
  });
};

export const findTagByRouteValue = (value: string) => {
  const normalizedValue = normalizeRouteValue(value);

  return tags.find((tag) => {
    return (
      normalizeRouteValue(tag.slug) === normalizedValue ||
      normalizeRouteValue(tag.name) === normalizedValue
    );
  });
};

export const getCategoryRouteParams = (category: Category) =>
  Array.from(new Set([category.slug, category.name]));

export const getTagRouteParams = (tag: Tag) =>
  Array.from(new Set([tag.slug, tag.name]));
