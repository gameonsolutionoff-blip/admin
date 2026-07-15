import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Calendar,
  Eye,
  Newspaper,
  Pencil,
  RefreshCw,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface NewsFeed {
  id: string;
  title: string;
  imageUrl: string;
  details: string;
  fileType?: "image" | "youtube";
  createdAt?: string;
}

function getYouTubeID(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

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

const NewsData = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<NewsFeed[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/news-feeds`);
      setItems(res.data?.newsFeeds || []);
    } catch (error: any) {
      toast({
        title: "❌ Fetch failed",
        description: error?.response?.data?.message || "Could not fetch news.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        "Delete this news feed item? This action cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(`${API_BASE_URL}/api/news-feeds/${id}`);
      setItems((current) => current.filter((item) => item.id !== id));
      toast({ title: "🗑️ Deleted", description: "News feed item removed." });
    } catch (error: any) {
      toast({
        title: "❌ Failed",
        description:
          error?.response?.data?.message || "Could not delete news item.",
        variant: "destructive",
      });
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
                <Newspaper className="h-5 w-5 text-[#C8FF4D]" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                  News feed
                </h1>
                <p className="text-sm text-[#7C8B85]">
                  Manage updates and announcements
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-1.5 border-[#1B4332]/30"
                onClick={() => {
                  fetchNews();
                  toast({
                    title: "Refreshed",
                    description: "Refetched news feed.",
                  });
                }}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Link to="/news-admin">
                <Button className="bg-[#1B4332] hover:bg-[#163828] text-white">
                  Add news
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
            <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
              News · {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <p className="text-[#5B6B64]">Loading news...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Eye className="w-8 h-8 text-[#C8FF4D]" />
            </div>
            <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
              No news feed items yet
            </h3>
            <p className="text-[#7C8B85] mb-6">
              Start posting updates and announcements for site visitors.
            </p>
            <Link to="/news-admin">
              <Button className="bg-[#1B4332] hover:bg-[#163828] text-white">
                Add your first update
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="corner-card bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-video bg-[#F4F7F2]">
                  <img
                    src={
                      item.fileType === "youtube"
                        ? `https://img.youtube.com/vi/${getYouTubeID(
                            item.imageUrl
                          )}/hqdefault.jpg`
                        : item.imageUrl
                    }
                    alt={item.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display text-lg tracking-wide text-[#0B1410] mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#5B6B64] mb-4 line-clamp-3 flex-grow">
                    {item.details}
                  </p>
                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-black/5">
                    <span className="inline-flex items-center gap-1 text-xs text-[#7C8B85]">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(item.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/news-edit/${item.id}`)}
                        className="border-[#1B4332]/30 text-[#1B4332] hover:bg-[#1B4332]/5"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default NewsData;
