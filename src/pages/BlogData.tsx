import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Eye,
  Trash2,
  Pencil,
  RefreshCw,
  FileText,
} from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  createdAt?: string;
}

const API_URL = API_BASE_URL;

const BlogData = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

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
      const token = await user?.getIdToken(true);
      const res = await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    } catch (err: any) {
      console.error("Error deleting blog:", err);
      const message =
        err?.response?.data?.message ||
        (err?.response?.status === 401
          ? "Not authorized. Try signing out and back in."
          : "Could not delete blog. Check backend logs.");
      toast({
        title: "❌ Failed",
        description: message,
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
    <div className="min-h-screen bg-[#F4F7F2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; }
        .font-mono-score { font-family: 'JetBrains Mono', monospace; }
        body, .font-body { font-family: 'Inter', sans-serif; }

        .corner-card { position: relative; }
        .corner-card::before,
        .corner-card::after {
          content: "";
          position: absolute;
          width: 14px;
          height: 14px;
          border-color: #C8FF4D;
          opacity: 0;
          transition: opacity 0.15s ease;
        }
        .corner-card::before { top: 8px; left: 8px; border-top: 2px solid; border-left: 2px solid; }
        .corner-card::after { bottom: 8px; right: 8px; border-bottom: 2px solid; border-right: 2px solid; }
        .corner-card:hover::before, .corner-card:hover::after { opacity: 1; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .live-dot { animation: pulse-dot 2s ease-in-out infinite; }

        .prose img { border-radius: 0.5rem; }
      `}</style>

      <header className="sticky top-0 z-20 bg-white border-b border-black/5">
        <div className="px-4 md:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
                <FileText className="h-5 w-5 text-[#C8FF4D]" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                  Blog posts
                </h1>
                <p className="text-sm text-[#7C8B85]">
                  Manage your sports content library
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-1.5 border-[#1B4332]/30"
                onClick={() => {
                  fetchBlogs();
                  toast({
                    title: "Refreshed",
                    description: "Refetched blogs.",
                  });
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Link to="/blog-admin">
                <Button className="bg-[#1B4332] hover:bg-[#163828] text-white">
                  Create new post
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
            <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
              Blog · {blogPosts.length}{" "}
              {blogPosts.length === 1 ? "post" : "posts"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <p className="text-[#5B6B64]">Loading blogs...</p>
          </div>
        ) : blogPosts.length === 0 ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-[#C8FF4D]" />
            </div>
            <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
              No blog posts yet
            </h3>
            <p className="text-[#7C8B85] mb-6">
              Start creating engaging content about sports, pickleball, and
              court construction.
            </p>
            <Link to="/blog-admin">
              <Button className="bg-[#1B4332] hover:bg-[#163828] text-white">
                Create your first post
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {blogPosts.map((post) => (
              <div
                key={post.id}
                className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-6"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center flex-wrap gap-x-2 text-sm text-[#7C8B85]">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(post.createdAt)}
                      </span>
                      <span>•</span>
                      <span className="font-mono-score text-[#1B4332]">
                        /{post.slug}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/blog-edit/${post.id}`)}
                      className="gap-1.5 border-[#1B4332]/30 text-[#1B4332] hover:bg-[#1B4332]/5"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteBlogPost(post.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-[#5B6B64] leading-relaxed mb-4">
                  {post.excerpt}
                </p>

                {post.image && (
                  <div className="mb-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="mb-2 h-44 w-full rounded-lg object-cover border border-black/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                    {!isInlineImage(post.image) && (
                      <code className="bg-[#F4F7F2] px-2 py-1 rounded text-xs text-[#5B6B64] break-all">
                        {post.image}
                      </code>
                    )}
                  </div>
                )}

                {post.tags && post.tags.length > 0 && (
                  <div className="mb-4">
                    <div className="flex items-center mb-2 gap-1.5 text-sm font-medium text-[#0B1410]">
                      <Tag className="w-4 h-4 text-[#1B4332]" />
                      Tags
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-[#1B4332]/10 text-[#1B4332] hover:bg-[#1B4332]/10"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-black/5 pt-4 mt-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C8B85] mb-2">
                    Content preview
                  </p>
                  <div
                    className="bg-[#F4F7F2] p-3 rounded-lg text-sm max-h-32 overflow-y-auto prose prose-sm max-w-none text-[#5B6B64]"
                    dangerouslySetInnerHTML={{
                      __html: post.content || "No content available",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogData;
