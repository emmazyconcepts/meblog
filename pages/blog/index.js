import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import Layout from "../../components/layout/Layout";
import PostCard from "../../components/ui/PostCard";
import SearchBar from "../../components/ui/SearchBar";
import { formatDate } from "../../lib/utils";
import { generateBlogSchema, generateFAQSchema } from "../../lib/seoUtils";

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Categories for filtering
  const categories = [
    { id: "all", name: "All Posts", count: 0 },
    { id: "safety", name: "Safety Guides", count: 0 },
    { id: "legal", name: "Legal Rights", count: 0 },
    { id: "health", name: "Health Resources", count: 0 },
    { id: "business", name: "Business Tips", count: 0 },
    { id: "technology", name: "Technology", count: 0 },
    { id: "community", name: "Community", count: 0 },
  ];

  const blogMeta = {
    title: "Safety Blog - Essential Guides for Sex Workers | MeetAnEscort",
    description:
      "Comprehensive safety blog featuring essential guides, legal rights information, health resources, and safety tips for sex workers and escorts.",
    keywords:
      "sex worker safety blog, escort safety articles, safety tips blog, legal rights information, health resources for sex workers",
    canonical: "https://meetanescort.info/blog",
    schema: generateBlogSchema(posts), // You'll need to create this function
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("Fetching all blog posts...");

      // Query to get all published posts, ordered by latest first
      const postsQuery = query(
        collection(db, "posts"),
        where("status", "==", "published"),
        orderBy("publishedAt", "desc")
      );

      const snapshot = await getDocs(postsQuery);
      console.log("Total published posts found:", snapshot.docs.length);

      const allPosts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure dates are properly handled
          publishedAt: data.publishedAt || data.createdAt,
          createdAt: data.createdAt,
        };
      });

      console.log("All posts:", allPosts);

      // Update category counts
      const updatedCategories = categories.map((category) => {
        if (category.id === "all") {
          return { ...category, count: allPosts.length };
        }
        const count = allPosts.filter(
          (post) => post.category === category.id
        ).length;
        return { ...category, count };
      });

      // For demo, update the categories state (you might want to use state for this)
      categories.forEach((cat) => {
        if (cat.id === "all") {
          cat.count = allPosts.length;
        } else {
          cat.count = allPosts.filter(
            (post) => post.category === cat.id
          ).length;
        }
      });

      setPosts(allPosts);
      setFilteredPosts(allPosts);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);

      // Fallback to mock data for development
      const mockPosts = [
        {
          id: 1,
          title: "Essential Safety Tips for Sex Workers",
          excerpt:
            "Learn fundamental safety practices and risk assessment strategies to protect yourself in the industry.",
          content: "<p>Comprehensive safety guide for sex workers...</p>",
          featuredImage: "",
          category: "safety",
          readTime: 5,
          slug: "safety-tips",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          tags: ["safety", "beginners", "tips"],
          author: "Admin",
          status: "published",
        },
        {
          id: 2,
          title: "Understanding Your Legal Rights",
          excerpt:
            "Know your legal rights and how to navigate different situations safely and confidently.",
          content: "<p>Legal rights information...</p>",
          featuredImage: "",
          category: "legal",
          readTime: 7,
          slug: "legal-rights",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          tags: ["legal", "rights"],
          author: "Admin",
          status: "published",
        },
        {
          id: 3,
          title: "Health Resources and Support",
          excerpt:
            "Access important health resources and information for maintaining your well-being.",
          content: "<p>Health resources content...</p>",
          featuredImage: "",
          category: "health",
          readTime: 4,
          slug: "health-resources",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          tags: ["health", "wellness"],
          author: "Admin",
          status: "published",
        },
        {
          id: 4,
          title: "Business Tips for Independent Workers",
          excerpt:
            "Learn how to manage your business effectively and build a sustainable career.",
          content: "<p>Business tips content...</p>",
          featuredImage: "",
          category: "business",
          readTime: 6,
          slug: "business-tips",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          tags: ["business", "marketing"],
          author: "Admin",
          status: "published",
        },
        {
          id: 5,
          title: "Technology Safety Guide",
          excerpt:
            "Protect your digital privacy and security while using technology in your work.",
          content: "<p>Technology safety content...</p>",
          featuredImage: "",
          category: "technology",
          readTime: 8,
          slug: "technology-safety",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          tags: ["technology", "privacy"],
          author: "Admin",
          status: "published",
        },
        {
          id: 6,
          title: "Building Community Support",
          excerpt:
            "Connect with other workers and build a supportive community network.",
          content: "<p>Community building content...</p>",
          featuredImage: "",
          category: "community",
          readTime: 5,
          slug: "community-support",
          publishedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          tags: ["community", "support"],
          author: "Admin",
          status: "published",
        },
      ];

      setPosts(mockPosts);
      setFilteredPosts(mockPosts);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on category and search term
  useEffect(() => {
    let filtered = posts;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          post.excerpt.toLowerCase().includes(term) ||
          (post.tags &&
            post.tags.some((tag) => tag.toLowerCase().includes(term))) ||
          post.content.toLowerCase().includes(term)
      );
    }

    setFilteredPosts(filtered);
  }, [selectedCategory, searchTerm, posts]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  if (loading) {
    return (
      <Layout
        title="Blog - Meetanescort Safety Resources"
        description="Browse all safety guides, legal resources, and educational content for sex workers."
      >
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading blog posts...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && posts.length === 0) {
    return (
      <Layout
        title="Blog - Meetanescort Safety Resources"
        description="Browse all safety guides, legal resources, and educational content for sex workers."
      >
        <div className="min-h-screen bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-red-600 mb-4">Error loading posts: {error}</p>
              <button
                onClick={fetchPosts}
                className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      meta={blogMeta}
      title="Blog - Meetanescort Safety Resources"
      description="Browse all safety guides, legal resources, and educational content for sex workers. Stay informed and stay safe."
    >
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6"> Blog</h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
              Essential resources, guides, and tips for maintaining safety and
              well-being in the industry
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar - Categories */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                <h3 className="font-bold text-gray-900 text-lg mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex justify-between items-center ${
                        selectedCategory === category.id
                          ? "bg-pink-50 text-pink-700 border border-pink-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span>{category.name}</span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          selectedCategory === category.id
                            ? "bg-pink-100 text-pink-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {category.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Blog Stats */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Blog Stats
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Total Posts:</span>
                      <span className="font-medium">{posts.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Showing:</span>
                      <span className="font-medium">
                        {filteredPosts.length}
                      </span>
                    </div>
                    {searchTerm && (
                      <div className="flex justify-between">
                        <span>Search results for:</span>
                        <span className="font-medium text-pink-600">
                          {searchTerm}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content - Posts Grid */}
            <div className="lg:w-3/4">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {selectedCategory === "all"
                      ? "All Safety Guides"
                      : categories.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {filteredPosts.length}{" "}
                    {filteredPosts.length === 1 ? "post" : "posts"} found
                    {searchTerm && ` for "${searchTerm}"`}
                  </p>
                </div>

                {/* Sort Options (you can implement this later) */}
                <div className="mt-4 sm:mt-0">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                    <option>Newest First</option>
                    <option>Oldest First</option>
                    <option>Most Read</option>
                  </select>
                </div>
              </div>

              {/* Posts Grid */}
              {filteredPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No posts found
                  </h3>
                  <p className="text-gray-600 max-w-md mx-auto mb-6">
                    {searchTerm
                      ? `No posts found matching "${searchTerm}". Try different keywords or browse all categories.`
                      : `No posts found in the ${
                          categories.find((c) => c.id === selectedCategory)
                            ?.name
                        } category.`}
                  </p>
                  {(searchTerm || selectedCategory !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                    >
                      View All Posts
                    </button>
                  )}
                </div>
              )}

              {/* Load More Button (for pagination) */}
              {filteredPosts.length > 0 &&
                filteredPosts.length < posts.length && (
                  <div className="text-center mt-12">
                    <button className="bg-white border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium">
                      Load More Posts
                    </button>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <section className="bg-white border-t border-gray-200 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated on Safety
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Get the latest safety guides, legal updates, and community
              resources delivered to your inbox.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button className="bg-pink-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-pink-700 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
