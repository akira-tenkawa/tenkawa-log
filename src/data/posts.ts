export type Category = {
  name: string;
  slug: string;
};

export type Tag = {
  name: string;
  slug: string;
};

export type Post = {
  category: Category;
  content: string[];
  date: string;
  excerpt: string;
  slug: string;
  tags: Tag[];
  title: string;
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
  { slug: "dify", name: "Dify" }
];

const categoryBySlug = Object.fromEntries(
  categories.map((category) => [category.slug, category])
) as Record<string, Category>;

const tagBySlug = Object.fromEntries(
  tags.map((tag) => [tag.slug, tag])
) as Record<string, Tag>;

export const posts: Post[] = [
  {
    slug: "dify-notes-for-local-testing",
    title: "Difyをローカルで触り始めたメモ",
    date: "2026.05.22",
    excerpt: "AIワークフローを手元で試すために、Difyの導入と最初の確認ポイントをメモした。",
    content: [
      "AIワークフローを手元で試すために、Difyの導入を始めた。",
      "まずは管理画面の流れと、プロンプトの差し替えやすさを確認している。",
      "しばらくは小さい検証を積み重ねて、使いどころを見極めたい。"
    ],
    category: categoryBySlug.ai,
    tags: [tagBySlug.linux, tagBySlug.dify]
  },
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
    tags: [tagBySlug.linux]
  }
];

export const getCategoryHref = (slug: string) => `/category/${slug}/`;

export const getPostHref = (slug: string) => `/posts/${slug}/`;

export const getTagHref = (slug: string) => `/tag/${slug}/`;
