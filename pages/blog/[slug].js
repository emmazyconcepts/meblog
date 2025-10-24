import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Layout from "../../components/layout/Layout";
import { Calendar, Clock, User, ArrowLeft, Share2 } from "lucide-react";
import { formatDate, calculateReadTime } from "../../lib/utils";
import CommentSection from "../../components/comments/CommentSection";

export default function BlogPost() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      console.log("Fetching post with slug:", slug);

      // First try to find post by slug
      const postsQuery = query(
        collection(db, "posts"),
        where("slug", "==", slug),
        where("status", "==", "published")
      );

      const querySnapshot = await getDocs(postsQuery);

      if (!querySnapshot.empty) {
        const postDoc = querySnapshot.docs[0];
        const postData = {
          id: postDoc.id,
          ...postDoc.data(),
        };
        console.log("Post found by slug:", postData);
        setPost(postData);
      } else {
        // If not found by slug, try by ID (for comments that reference postId)
        console.log("Trying to find post by ID:", slug);
        try {
          const postDoc = await getDoc(doc(db, "posts", slug));
          if (postDoc.exists()) {
            const postData = {
              id: postDoc.id,
              ...postDoc.data(),
            };
            console.log("Post found by ID:", postData);

            // Only show if published
            if (postData.status === "published") {
              setPost(postData);
            } else {
              setError("Post not found or not published");
            }
          } else {
            setError("Post not found");
          }
        } catch (idError) {
          console.error("Error fetching by ID:", idError);
          setError("Post not found");
        }
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError("Error loading post");
    } finally {
      setLoading(false);
    }
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading post...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              {error ||
                "The post you are looking for does not exist or has been removed."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      meta={{
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
      }}
    >
      <article className="min-h-screen bg-white">
        {/* Back Button */}
        <div className="border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button
              onClick={() => router.push("/")}
              className="flex items-center space-x-2 text-gray-600 hover:text-pink-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Blog</span>
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="w-full h-64 md:h-96 bg-gray-200">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span className="text-sm">{post.author || "Admin"}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">{formatDate(post.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {post.readTime || calculateReadTime(post.content)} min read
                </span>
              </div>
            </div>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-gray-600 leading-relaxed border-l-4 border-pink-500 pl-4 mb-6">
                {post.excerpt}
              </p>
            )}

            {/* Share Button */}
            <button
              onClick={sharePost}
              className="flex items-center space-x-2 text-pink-600 hover:text-pink-700 transition-colors duration-200 mb-6"
            >
              <Share2 className="h-4 w-4" />
              <span className="text-sm font-medium">Share this post</span>
            </button>
          </header>

          {/* Article Body */}
          <div className="prose prose-lg max-w-none mb-12">
            <div
              className="text-gray-700 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{ __html: formatContent(post.content) }}
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                Tags:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <CommentSection postId={post.id} />
        </div>
      </article>
    </Layout>
  );
}

// Helper function to format content
function formatContent(content) {
  if (!content) return "";

  // Convert line breaks to paragraphs but preserve formatting
  return content
    .split("\n\n")
    .map((paragraph) => {
      if (paragraph.trim()) {
        return `<p>${paragraph.trim().replace(/\n/g, "<br/>")}</p>`;
      }
      return "";
    })
    .join("");
}
