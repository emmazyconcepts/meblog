export const PostStatus = {
  DRAFT: "draft",
  PUBLISHED: "published",
  SCHEDULED: "scheduled",
};

export const LayoutType = {
  FEATURED: "featured",
  GRID: "grid",
  LIST: "list",
};

export const Post = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  author: "",
  status: PostStatus.DRAFT,
  publishedAt: null,
  createdAt: "",
  updatedAt: "",
  tags: [],
  metaTitle: "",
  metaDescription: "",
  readTime: 0,
};

export const LayoutConfig = {
  heroSection: {
    enabled: true,
    layout: "featured",
    posts: [],
  },
  featuredPosts: {
    enabled: true,
    title: "Featured Stories",
    posts: [],
  },
  recentPosts: {
    enabled: true,
    title: "Latest Updates",
    layout: LayoutType.GRID,
    limit: 6,
  },
};
