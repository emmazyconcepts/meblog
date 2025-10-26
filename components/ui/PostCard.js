import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";

// Safe date formatting function (fallback)
const formatDate = (dateString) => {
  if (!dateString) return "Recently";

  try {
    // Handle Firestore timestamps
    if (dateString && typeof dateString === "object" && dateString.toDate) {
      const date = dateString.toDate();
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }

    // Handle string dates
    const date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Date formatting error:", error);
    return "Recently";
  }
};

export default function PostCard({ post, featured = false }) {
  if (!post) {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
        <div className="h-48 bg-gray-200"></div>
        <div className="p-6">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  const cardClass = featured
    ? "group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    : "group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100";

  // Enhanced placeholder generator with patterns
  const generatePlaceholderImage = (title) => {
    const words = title.split(" ");
    const firstWord = words[0] || "";
    const secondWord = words[1] || "";

    // Get initials (first letter of first two words)
    const initials = (
      firstWord.charAt(0) + (secondWord ? secondWord.charAt(0) : "")
    ).toUpperCase();

    // Color schemes for different categories
    const colorSchemes = [
      // Pink/Purple - Safety related
      { bg: "from-pink-500 to-purple-600", pattern: "🔒" },
      // Blue/Teal - Information/Guide
      { bg: "from-blue-500 to-cyan-600", pattern: "📚" },
      // Orange/Red - Emergency/Important
      { bg: "from-orange-500 to-red-600", pattern: "⚠️" },
      // Green/Blue - Health/Wellness
      { bg: "from-green-500 to-teal-600", pattern: "💚" },
      // Purple/Pink - Community/Support
      { bg: "from-purple-500 to-pink-600", pattern: "👥" },
      // Teal/Green - Legal/Rights
      { bg: "from-teal-500 to-green-600", pattern: "⚖️" },
    ];

    // Simple hash for consistent color per title
    const hash = title.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const scheme = colorSchemes[Math.abs(hash) % colorSchemes.length];

    return (
      <div
        className={`w-full h-48 bg-gradient-to-br ${scheme.bg} flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-300`}
      >
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center text-6xl">
          {scheme.pattern}
        </div>

        {/* Main initials */}
        <div className="relative z-10 text-white font-bold text-4xl drop-shadow-lg">
          {initials}
        </div>

        {/* Subtle pattern */}
        <div className="absolute bottom-2 right-2 text-white text-xs opacity-70">
          {words.length > 2 ? words[2].charAt(0).toUpperCase() : ""}
        </div>
      </div>
    );
  };

  return (
    <article className={cardClass}>
      <Link href={`/blog/${post.slug || "post"}`}>
        <div className="relative overflow-hidden">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title || "Post"}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            generatePlaceholderImage(post.title || "Untitled Post")
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime || 5} min read</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug || "post"}`}>
          <h3 className="font-bold text-lg text-gray-900 group-hover:text-pink-600 transition-colors duration-200 mb-3">
            {post.title || "Untitled Post"}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-2">
          {post.excerpt || "Read this important safety guide..."}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-pink-600">
            {post.author || "Admin"}
          </span>
          <Link
            href={`/blog/${post.slug || "post"}`}
            className="flex items-center space-x-1 text-pink-600 hover:text-pink-700 font-medium text-sm group"
          >
            <span>Read More</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </article>
  );
}
