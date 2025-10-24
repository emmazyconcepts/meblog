import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { MessageCircle, Send, Heart } from "lucide-react";

export default function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [userName, setUserName] = useState("");
  const [debugInfo, setDebugInfo] = useState("");

  useEffect(() => {
    if (!postId) {
      setDebugInfo("No postId provided");
      return;
    }

    console.log("Setting up comments listener for postId:", postId);
    setDebugInfo(`Listening for comments on post: ${postId}`);

    const commentsQuery = query(
      collection(db, "comments"),
      where("postId", "==", postId),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      commentsQuery,
      (snapshot) => {
        console.log(
          "Comments snapshot received:",
          snapshot.docs.length,
          "comments"
        );
        const commentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Comments data:", commentsData);
        setComments(commentsData);
        setDebugInfo(`Found ${commentsData.length} approved comments`);
      },
      (error) => {
        console.error("Error in comments listener:", error);
        setDebugInfo(`Error: ${error.message}`);
      }
    );

    return unsubscribe;
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "comments"), {
        postId,
        content: newComment.trim(),
        author: userName.trim() || "Anonymous",
        approved: false,
        createdAt: serverTimestamp(),
        likes: 0,
      });
      setNewComment("");
      setUserName("");
      alert("Comment submitted for moderation. Thank you!");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Error submitting comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 border-t border-gray-200 pt-8">
      {/* Debug Info - Remove in production */}
      {/* <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm text-yellow-800">
          <strong>Debug:</strong> {debugInfo} | PostID: {postId}
        </p>
      </div> */}

      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="h-5 w-5 text-gray-600" />
        <h3 className="text-xl font-semibold text-gray-900">
          Community Discussion ({comments.length})
        </h3>
      </div>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-8 text-black">
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="mb-4">
            <label
              htmlFor="userName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Name (optional)
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thoughts, experiences, or additional safety tips..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-colors duration-200"
            required
          />
          <div className="flex justify-between items-center mt-4">
            <p className="text-sm text-gray-500">
              Comments are moderated to ensure a safe and supportive environment
            </p>
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-200"
            >
              <Send className="h-4 w-4" />
              <span>{submitting ? "Posting..." : "Post Comment"}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="bg-white border border-gray-200 rounded-xl p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="font-medium text-gray-900">
                  {comment.author}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  {comment.createdAt?.toDate
                    ? comment.createdAt.toDate().toLocaleDateString()
                    : "Unknown date"}
                </span>
              </div>
              <button className="flex items-center space-x-1 text-gray-400 hover:text-pink-600 transition-colors duration-200">
                <Heart className="h-4 w-4" />
                <span className="text-sm">{comment.likes || 0}</span>
              </button>
            </div>
            <p className="text-gray-700 leading-relaxed">{comment.content}</p>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              No comments yet. Be the first to share your thoughts!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
