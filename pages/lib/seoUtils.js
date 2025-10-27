// Generate schema for articles
export function generateArticleSchema(post) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image:
      post.featuredImage || "https://meetanescort.info/images/og-image.jpg",
    author: {
      "@type": "Organization",
      name: "MeetAnEscort",
      url: "https://meetanescort.info",
    },
    publisher: {
      "@type": "Organization",
      name: "MeetAnEscort",
      logo: {
        "@type": "ImageObject",
        url: "https://meetanescort.info/images/logo.png",
      },
    },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://meetanescort.info/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags
      ? post.tags.join(", ")
      : "sex worker safety, escort safety",
  };
}

// Generate schema for blog listing
export function generateBlogSchema(posts) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "MeetAnEscort Safety Blog",
    description: "Essential safety resources, guides, and tips for sex workers",
    url: "https://meetanescort.info/blog",
    publisher: {
      "@type": "Organization",
      name: "MeetAnEscort",
      logo: {
        "@type": "ImageObject",
        url: "https://meetanescort.info/images/logo.png",
      },
    },
  };
}

// Generate breadcrumb schema
export function generateBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
