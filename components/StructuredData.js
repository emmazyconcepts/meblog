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
      name: "Meetanescort",
      url: "https://meetanescort.info",
    },
    publisher: {
      "@type": "Organization",
      name: "Meetanescort",
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

export function generateBlogSchema(posts) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Meetanescort Safety Blog",
    description: "Essential safety resources, guides, and tips for sex workers",
    url: "https://meetanescort.info/blog",
    publisher: {
      "@type": "Organization",
      name: "Meetanescort",
      logo: {
        "@type": "ImageObject",
        url: "https://meetanescort.info/images/logo.png",
      },
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.excerpt,
      url: `https://meetanescort.info/blog/${post.slug}`,
      datePublished: post.publishedAt,
      dateModified: post.updatedAt || post.publishedAt,
      author: {
        "@type": "Organization",
        name: "Meetanescort",
      },
    })),
  };
}

export function generateFAQSchema(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

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
