import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/AdminLayout";
import PostEditor from "../../../components/admin/PostEditor";

export default function NewPost() {
  const router = useRouter();

  const handleSave = () => {
    router.push("/admin/posts");
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
        <p className="text-gray-600">Write and publish a new blog post</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <PostEditor onSave={handleSave} />
      </div>
    </AdminLayout>
  );
}
