import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import PostCard from "../components/ui/PostCard";
import FeaturedPost from "../components/ui/FeaturedPost";
import Newsletter from "../components/ui/Newsletter";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Head from "next/head";

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log("Fetching posts...");

      // Simple query to get all published posts
      const postsQuery = query(
        collection(db, "posts"),
        where("status", "==", "published")
      );

      const snapshot = await getDocs(postsQuery);
      console.log("Total posts found:", snapshot.docs.length);

      const allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("All posts:", allPosts);

      // Filter featured posts client-side
      const featuredData = allPosts
        .filter((post) => post.featured === true)
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 3);

      console.log("Featured posts:", featuredData);

      // Get recent posts
      const recentData = allPosts
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 6);

      console.log("Recent posts:", recentData);

      setFeaturedPosts(featuredData);
      setRecentPosts(recentData);
      setError(null);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add loading and error states
  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading posts...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Error: {error}</p>
            <button
              onClick={fetchPosts}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              Try Again.
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>MeetAnEscort - Safety Resources for Sex Workers</title>
        <meta
          name="description"
          content="Essential safety guides, legal rights information, and health resources for sex workers. Stay safe with expert advice and community support."
        />
        <meta
          name="keywords"
          content="sex worker safety, escort safety, harm reduction, safety tips"
        />
        <meta
          property="og:title"
          content="MeetAnEscort - Safety Resources for Sex Workers"
        />
        <meta
          property="og:description"
          content="Essential safety guides and resources for sex workers"
        />
        <meta
          property="og:image"
          content="https://meetanescort.info/logo.png"
        />
        <meta property="og:url" content="https://meetanescort.info" />
        <link rel="canonical" href="https://meetanescort.info" />
      </Head>
      <Layout>
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display font-bold text-4xl md:text-6xl mb-6">
              Safety First,{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Always
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100 max-w-3xl mx-auto">
              Empowering sex workers with essential safety resources,
              educational content, and community support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = "#featured-posts")}
                className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Explore Safety Guides
              </button>
              <button
                onClick={() => (window.location.href = "/resources")}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors duration-200"
              >
                Get Help Now
              </button>
            </div>
          </div>
        </section>

        {/* Debug Info - Remove this in production */}
        {/* <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong>Debug Info:</strong> Featured: {featuredPosts.length} |
              Recent: {recentPosts.length} | Total:{" "}
              {recentPosts.length + featuredPosts.length}
            </p>
          </div>
        </div>
      </div> */}

        {/* Featured Posts */}
        {featuredPosts.length > 0 ? (
          <section id="featured-posts" className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                  Escort Blog
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  News, Advice & Safety Information for Clients
                </p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <FeaturedPost
                    key={post.id}
                    post={post}
                    featured={index === 0}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                No Featured Posts Yet
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Check back soon for featured safety guides and resources.
              </p>
              {/* <a
              href="/admin/posts/new"
              className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 inline-block"
            >
              Create First Post
            </a> */}
            </div>
          </section>
        )}

        {/* Recent Posts */}
        {recentPosts.length > 0 ? (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                  Latest Updates
                </h2>
                <p className="text-xl text-gray-600">
                  Stay informed with our most recent safety resources
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </div>
          </section>
        ) : (
          <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                No Posts Yet
              </h2>
              <p className="text-xl text-gray-600">
                Posts will appear here once they are published.
              </p>
            </div>
          </section>
        )}

        {/* Newsletter */}
        <Newsletter />

        {/* Emergency Resources */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-6">
              Need Immediate Help?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <h3 className="font-semibold text-red-800 mb-2">
                  Emergency Contacts
                </h3>
                <p className="text-red-600 text-sm">
                  Local support hotlines and emergency services
                </p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <h3 className="font-semibold text-yellow-800 mb-2">
                  Safety Planning
                </h3>
                <p className="text-yellow-600 text-sm">
                  Create your personal safety plan
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <h3 className="font-semibold text-green-800 mb-2">
                  Community Support
                </h3>
                <p className="text-green-600 text-sm">
                  Connect with trusted organizations
                </p>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
