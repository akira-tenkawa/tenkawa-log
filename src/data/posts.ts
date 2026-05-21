export type Post = {
  date: string;
  excerpt: string;
  title: string;
};

export const posts: Post[] = [
  {
    date: "2026.05.21",
    title: "Astroブログを始めた",
    excerpt: `思考ログの基地を作りたかった。
WordPressではなく、
Astroで静かに積み上げていく。`
  }
];
