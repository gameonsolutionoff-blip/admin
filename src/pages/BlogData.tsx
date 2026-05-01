// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Calendar, Tag, Eye, Trash2 } from "lucide-react";

// interface BlogPost {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt: string;
//   image: string;
//   tags: string[];
//   content: string;
//   createdAt: string;
// }

// const BlogData = () => {
//   const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

//   useEffect(() => {
//     const posts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
//     setBlogPosts(posts);
//   }, []);

//   const deleteBlogPost = (id: string) => {
//     const updatedPosts = blogPosts.filter(post => post.id !== id);
//     setBlogPosts(updatedPosts);
//     localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </Link>
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-4xl font-bold text-green-800 mb-2">Blog Posts</h1>
//               <p className="text-green-600">Manage your sports content library</p>
//             </div>
//             <Link to="/blog-admin">
//               <Button className="bg-green-600 hover:bg-green-700 text-white">
//                 Create New Post
//               </Button>
//             </Link>
//           </div>
//         </div>

//         {blogPosts.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Eye className="w-8 h-8 text-green-600" />
//             </div>
//             <h3 className="text-xl font-semibold text-green-800 mb-2">No blog posts yet</h3>
//             <p className="text-gray-600 mb-6">
//               Start creating engaging content about sports, pickleball, and court construction.
//             </p>
//             <Link to="/blog-admin">
//               <Button className="bg-green-600 hover:bg-green-700 text-white">
//                 Create Your First Post
//               </Button>
//             </Link>
//           </div>
//         ) : (
//           <div className="grid gap-6">
//             {blogPosts.map((post) => (
//               <Card key={post.id} className="border-green-200 hover:shadow-lg transition-shadow">
//                 <CardHeader>
//                   <div className="flex justify-between items-start">
//                     <div className="flex-1">
//                       <CardTitle className="text-green-800 text-xl mb-2">{post.title}</CardTitle>
//                       <div className="flex items-center text-sm text-gray-500 mb-3">
//                         <Calendar className="w-4 h-4 mr-1" />
//                         {formatDate(post.createdAt)}
//                         <span className="mx-2">•</span>
//                         <span className="font-mono text-green-600">/{post.slug}</span>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={() => deleteBlogPost(post.id)}
//                       className="text-red-600 border-red-200 hover:bg-red-50"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-gray-700 mb-4 line-clamp-3">{post.excerpt}</p>

//                   {post.image && (
//                     <div className="mb-4">
//                       <p className="text-sm text-gray-500 mb-1">Image:</p>
//                       <code className="bg-gray-100 px-2 py-1 rounded text-sm">{post.image}</code>
//                     </div>
//                   )}

//                   {post.tags.length > 0 && (
//                     <div className="mb-4">
//                       <div className="flex items-center mb-2">
//                         <Tag className="w-4 h-4 text-green-600 mr-1" />
//                         <span className="text-sm font-medium text-green-800">Tags:</span>
//                       </div>
//                       <div className="flex flex-wrap gap-2">
//                         {post.tags.map((tag, index) => (
//                           <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
//                             {tag}
//                           </Badge>
//                         ))}
//                       </div>
//                     </div>
//                   )}

//                   <div className="border-t pt-4 mt-4">
//                     <p className="text-sm text-gray-500 mb-2">Content Preview:</p>
//                     <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
//                       {post.content || 'No content available'}
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BlogData;
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, Tag, Eye, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { isInlineImage } from "@/lib/imageUpload";
import { API_BASE_URL } from "@/lib/api";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  tags: string[];
  content?: string;
  createdAt?: string; // ISO string or undefined
}

const API_URL = API_BASE_URL;

const BlogData = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/blogs`);
      if (res.data && res.data.success && Array.isArray(res.data.blogs)) {
        setBlogPosts(res.data.blogs);
      } else {
        toast({
          title: "⚠️ Unexpected response",
          description: "Server returned unexpected data while fetching blogs.",
        });
      }
    } catch (err) {
      console.error("Error fetching blogs:", err);
      toast({
        title: "❌ Fetch failed",
        description: "Could not fetch blogs. Check backend or network.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteBlogPost = async (id: string) => {
    const ok = window.confirm(
      "Are you sure you want to delete this blog post? This action cannot be undone."
    );
    if (!ok) return;

    try {
      const res = await axios.delete(`${API_URL}/api/blogs/${id}`);
      if (res.data && res.data.success) {
        setBlogPosts((prev) => prev.filter((post) => post.id !== id));
        toast({
          title: "🗑️ Deleted",
          description: "Blog post removed successfully",
        });
      } else {
        toast({
          title: "⚠️ Error",
          description: res.data?.message || "Failed to delete blog",
        });
      }
    } catch (err) {
      console.error("Error deleting blog:", err);
      toast({
        title: "❌ Failed",
        description: "Could not delete blog. Check backend logs.",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown date";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "Unknown date";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-green-800 mb-2">
                Blog Posts
              </h1>
              <p className="text-green-600">
                Manage your sports content library
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/blog-admin">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  Create New Post
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  fetchBlogs();
                  toast({
                    title: "Refreshed",
                    description: "Refetched blogs.",
                  });
                }}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-green-600">Loading blogs...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">
              No blog posts yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start creating engaging content about sports, pickleball, and
              court construction.
            </p>
            <Link to="/blog-admin">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Create Your First Post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {blogPosts.map((post) => (
              <Card
                key={post.id}
                className="border-green-200 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-green-800 text-xl mb-2">
                        {post.title}
                      </CardTitle>
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(post.createdAt)}
                        <span className="mx-2">•</span>
                        <span className="font-mono text-green-600">
                          /{post.slug}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteBlogPost(post.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/blog-edit/${post.id}`)}
                        className="text-blue-600 border-blue-200 hover:bg-blue-50"
                      >
                        ✏️ Edit
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-700 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {post.image && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Image:</p>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="mb-2 h-44 w-full rounded-md object-cover border border-green-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/placeholder.svg";
                        }}
                      />
                      {!isInlineImage(post.image) && (
                        <code className="bg-gray-100 px-2 py-1 rounded text-sm break-all">
                          {post.image}
                        </code>
                      )}
                    </div>
                  )}

                  {post.tags && post.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <Tag className="w-4 h-4 text-green-600 mr-1" />
                        <span className="text-sm font-medium text-green-800">
                          Tags:
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-2">
                      Content Preview:
                    </p>
                    <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                      {post.content || "No content available"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogData;
