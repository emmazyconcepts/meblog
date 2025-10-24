import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { formatDate } from "../../lib/utils";

export default function FeaturedPost({ post, featured = false }) {
  const cardClass = featured
    ? "group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 col-span-1 lg:col-span-2"
    : "group bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100";

  // Function to generate a placeholder image with the title
  const generatePlaceholderImage = (title) => {
    // Get first letter or first two letters of the title
    const letters = title
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    // Generate a consistent color based on the title
    const colors = [
      "from-pink-500 to-purple-600",
      "from-blue-500 to-teal-600",
      "from-orange-500 to-red-600",
      "from-green-500 to-blue-600",
      "from-purple-500 to-pink-600",
      "from-teal-500 to-green-600",
      "from-red-500 to-orange-600",
      "from-indigo-500 to-purple-600",
    ];

    // Simple hash function to pick consistent color for same title
    const hash = title.split("").reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);

    const colorIndex = Math.abs(hash) % colors.length;
    const gradient = colors[colorIndex];

    return (
      <div
        className={`w-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform duration-300 ${
          featured ? "h-64 text-6xl" : "h-48 text-4xl"
        }`}
      >
        {letters}
      </div>
    );
  };

  return (
    <article className={cardClass}>
      <Link href={`/blog/${post.slug}`}>
        <div className="relative overflow-hidden">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                featured ? "h-64" : "h-48"
              }`}
            />
          ) : (
            generatePlaceholderImage(post.title)
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(post.publishedAt)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{post.readTime || 5} min read</span>
          </div>
        </div>

        <Link href={`/blog/${post.slug}`}>
          <h3
            className={`font-bold text-gray-900 group-hover:text-pink-600 transition-colors duration-200 mb-3 ${
              featured ? "text-2xl" : "text-xl"
            }`}
          >
            {post.title}
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
            href={`/blog/${post.slug}`}
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
