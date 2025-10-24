import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { Check, X, Trash2, Eye, MessageCircle } from "lucide-react";

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pending"); // 'pending', 'approved', 'all'
  const [selectedComments, setSelectedComments] = useState([]);

  useEffect(() => {
    fetchComments();
  }, []);

  const bulkApprove = async () => {
    if (selectedComments.length === 0) return;

    try {
      const promises = selectedComments.map((commentId) =>
        updateDoc(doc(db, "comments", commentId), {
          approved: true,
          approvedAt: new Date().toISOString(),
        })
      );

      await Promise.all(promises);
      setSelectedComments([]);
      fetchComments();
      alert(`${selectedComments.length} comments approved!`);
    } catch (error) {
      console.error("Error bulk approving comments:", error);
      alert("Error approving comments");
    }
  };

  const fetchComments = async () => {
    try {
      const commentsQuery = query(
        collection(db, "comments"),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(commentsQuery);
      const commentsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsData);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const approveComment = async (commentId) => {
    try {
      await updateDoc(doc(db, "comments", commentId), {
        approved: true,
        approvedAt: new Date().toISOString(),
      });
      fetchComments(); // Refresh the list
      alert("Comment approved!");
    } catch (error) {
      console.error("Error approving comment:", error);
      alert("Error approving comment");
    }
  };

  const rejectComment = async (commentId) => {
    if (
      confirm(
        "Are you sure you want to reject this comment? It will be deleted permanently."
      )
    ) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
        fetchComments(); // Refresh the list
        alert("Comment rejected and deleted!");
      } catch (error) {
        console.error("Error rejecting comment:", error);
        alert("Error rejecting comment");
      }
    }
  };

  const deleteComment = async (commentId) => {
    if (confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteDoc(doc(db, "comments", commentId));
        fetchComments(); // Refresh the list
        alert("Comment deleted!");
      } catch (error) {
        console.error("Error deleting comment:", error);
        alert("Error deleting comment");
      }
    }
  };

  const filteredComments = comments.filter((comment) => {
    if (filter === "pending") return !comment.approved;
    if (filter === "approved") return comment.approved;
    return true; // 'all'
  });

  const pendingCount = comments.filter((comment) => !comment.approved).length;
  const approvedCount = comments.filter((comment) => comment.approved).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Comment Moderation</h1>
        <p className="text-gray-600">Approve or reject user comments</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Comments
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {comments.length}
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-800">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-yellow-800">
                {pendingCount}
              </p>
            </div>
            <MessageCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Approved</p>
              <p className="text-2xl font-bold text-green-800">
                {approvedCount}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {[
              { key: "pending", label: `Pending (${pendingCount})` },
              { key: "approved", label: `Approved (${approvedCount})` },
              { key: "all", label: "All Comments" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? "border-pink-500 text-pink-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredComments.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {filter === "pending"
                ? "No pending comments to review"
                : filter === "approved"
                ? "No approved comments yet"
                : "No comments yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredComments.map((comment) => (
              <div key={comment.id} className="p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {comment.author}
                      </span>
                      {comment.approved ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check className="h-3 w-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Pending Review
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      On post: {comment.postId} •{" "}
                      {comment.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!comment.approved && (
                      <>
                        <button
                          onClick={() => approveComment(comment.id)}
                          className="text-green-600 hover:text-green-700 p-1 rounded transition-colors duration-200"
                          title="Approve comment"
                        >
                          <Check className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => rejectComment(comment.id)}
                          className="text-red-600 hover:text-red-700 p-1 rounded transition-colors duration-200"
                          title="Reject comment"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => deleteComment(comment.id)}
                      className="text-gray-400 hover:text-red-600 p-1 rounded transition-colors duration-200"
                      title="Delete comment"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <input
                      type="checkbox"
                      checked={selectedComments.includes(comment.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedComments([
                            ...selectedComments,
                            comment.id,
                          ]);
                        } else {
                          setSelectedComments(
                            selectedComments.filter((id) => id !== comment.id)
                          );
                        }
                      }}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {comment.content}
                </p>

                <div className="mt-3 flex items-center space-x-4 text-sm text-gray-500">
                  <button
                    onClick={() =>
                      window.open(`/blog/${comment.postId}`, "_blank")
                    }
                    className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View Post</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Moderation Guidelines */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">
          Moderation Guidelines
        </h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Approve constructive, respectful comments that add value</li>
          <li>• Reject spam, harassment, or inappropriate content</li>
          <li>• Ensure comments maintain a safe, supportive environment</li>
          <li>• Delete any comments that violate community guidelines</li>
        </ul>
      </div>
    </AdminLayout>
  );
}
