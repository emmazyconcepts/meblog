import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, updateDoc, doc } from "firebase/firestore";
import {
  generateSlug,
  calculateReadTime,
  generateExcerpt,
} from "../../lib/utils";
import RichTextEditor from "./RichTextEditor";

export default function PostEditor({ post, onSave }) {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    featuredImage: "", // This will store ImgBB URL
    author: "Admin",
    tags: [],
    status: "draft",
    metaTitle: "",
    metaDescription: "",
    featured: false,
  });
  const [saving, setSaving] = useState(false);
  const [uploadingFeatured, setUploadingFeatured] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        excerpt: post.excerpt || "",
        content: post.content || "",
        featuredImage: post.featuredImage || "",
        author: post.author || "Admin",
        tags: post.tags || [],
        status: post.status || "draft",
        metaTitle: post.metaTitle || "",
        metaDescription: post.metaDescription || "",
        featured: post.featured || false,
      });
    }
  }, [post]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleContentChange = (content) => {
    setFormData((prev) => ({
      ...prev,
      content,
    }));
  };

  // Upload featured image to ImgBB
  const handleFeaturedImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setUploadingFeatured(true);

    try {
      const { uploadToImgBB, optimizeImage } = await import("../../lib/imgbb");

      const optimizedFile = await optimizeImage(file);
      const result = await uploadToImgBB(optimizedFile);

      if (result.success) {
        setFormData((prev) => ({
          ...prev,
          featuredImage: result.url,
        }));
        alert("Featured image uploaded successfully!");
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Featured image upload error:", error);
      alert(`Failed to upload featured image: ${error.message}`);
    } finally {
      setUploadingFeatured(false);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert("Please fill in title and content");
      return;
    }

    setSaving(true);
    try {
      const postData = {
        ...formData,
        slug: generateSlug(formData.title),
        readTime: calculateReadTime(formData.content),
        updatedAt: new Date().toISOString(),
        // All image URLs are already ImgBB URLs from the editor
        excerpt: formData.excerpt || generateExcerpt(formData.content),
      };

      if (post) {
        await updateDoc(doc(db, "posts", post.id), postData);
        alert("Post updated successfully!");
      } else {
        postData.createdAt = new Date().toISOString();
        postData.publishedAt =
          formData.status === "published" ? new Date().toISOString() : null;
        await addDoc(collection(db, "posts"), postData);
        alert("Post created successfully!");
      }

      onSave?.();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter post title"
              required
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt
            </label>
            <textarea
              name="excerpt"
              value={formData.excerpt}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Brief description of the post"
            />
          </div>

          {/* Rich Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <RichTextEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Write your post content here... Use the toolbar for formatting!"
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Publish Settings */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Publish Settings</h3>

            {/* Status */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            {/* Featured */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Feature this post
              </label>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-4">Featured Image</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFeaturedImageUpload}
              disabled={uploadingFeatured}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 disabled:opacity-50"
            />
            {uploadingFeatured && (
              <p className="text-sm text-gray-500 mt-2">
                Uploading to ImgBB...
              </p>
            )}
            {formData.featuredImage && (
              <div className="mt-4">
                <img
                  src={formData.featuredImage}
                  alt="Featured"
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Hosted on ImgBB</p>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, featuredImage: "" }))
                  }
                  className="text-red-600 text-sm mt-2 hover:text-red-700"
                >
                  Remove image
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
          </button>
        </div>
      </div>
    </form>
  );
}
