import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  ExternalLink,
  Pencil,
  Play,
  Star,
  Trash2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  feedback: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  instagramUrl?: string;
  createdAt?: string;
}

type SortOrder = "new" | "old";

const TestimonialsData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>("new");

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/testimonials`);
      setItems(res.data?.testimonials || []);
    } catch (error: any) {
      toast({
        title: "Fetch failed",
        description:
          error?.response?.data?.message || "Could not fetch testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await axios.delete(`${API_BASE_URL}/api/testimonials/${id}`);
    setItems((current) => current.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Testimonial removed." });
  };

  // Sort a copy of items by createdAt, newest-first or oldest-first.
  // Items with missing/invalid dates are pushed to the end regardless of order.
  const sortedItems = [...items].sort((a, b) => {
    const aTime = a.createdAt ? new Date(a.createdAt).getTime() : NaN;
    const bTime = b.createdAt ? new Date(b.createdAt).getTime() : NaN;

    if (isNaN(aTime) && isNaN(bTime)) return 0;
    if (isNaN(aTime)) return 1;
    if (isNaN(bTime)) return -1;

    return sortOrder === "new" ? bTime - aTime : aTime - bTime;
  });

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
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
                <Star className="h-5 w-5 text-[#C8FF4D]" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                  Testimonials
                </h1>
                <p className="text-sm text-[#7C8B85]">
                  Manage client feedback and reels
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* New / Old sort toggle */}
              <div className="flex items-center rounded-lg border border-[#1B4332]/30 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSortOrder("new")}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    sortOrder === "new"
                      ? "bg-[#1B4332] text-white"
                      : "bg-white text-[#1B4332] hover:bg-[#1B4332]/5"
                  }`}
                >
                  New
                </button>
                <button
                  type="button"
                  onClick={() => setSortOrder("old")}
                  className={`px-3 py-2 text-sm font-medium transition-colors border-l border-[#1B4332]/30 ${
                    sortOrder === "old"
                      ? "bg-[#1B4332] text-white"
                      : "bg-white text-[#1B4332] hover:bg-[#1B4332]/5"
                  }`}
                >
                  Old
                </button>
              </div>
              <Button
                variant="outline"
                className="gap-1.5 border-[#1B4332]/30"
                onClick={fetchTestimonials}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => navigate("/testimonials-admin")}
                className="gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white"
              >
                <Plus className="h-4 w-4" />
                Add testimonial
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
            <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
              Testimonials · {items.length}{" "}
              {items.length === 1 ? "entry" : "entries"} ·{" "}
              {sortOrder === "new" ? "Newest first" : "Oldest first"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <p className="text-[#5B6B64]">Loading testimonials...</p>
          </div>
        ) : sortedItems.length === 0 ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-[#C8FF4D]" />
            </div>
            <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
              No testimonials yet
            </h3>
            <p className="text-[#7C8B85] mb-6">
              Add your first client testimonial to get started.
            </p>
            <Button
              onClick={() => navigate("/testimonials-admin")}
              className="bg-[#1B4332] hover:bg-[#163828] text-white"
            >
              Add testimonial
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sortedItems.map((item) => (
              <div
                key={item.id}
                className="corner-card bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-video bg-[#0B1410] relative">
                  {item.mediaType === "video" ? (
                    <video
                      src={item.mediaUrl}
                      controls
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={item.mediaUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  )}
                  {item.instagramUrl && (
                    <a
                      href={item.instagramUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1B4332] shadow hover:bg-white transition-colors"
                      aria-label="Open Instagram reel"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                  {item.mediaType === "video" && (
                    <div className="absolute left-3 top-3 rounded-full bg-black/60 p-2 text-[#C8FF4D]">
                      <Play className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display text-lg tracking-wide text-[#0B1410] mb-2 line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-[#5B6B64] leading-relaxed mb-4 line-clamp-4 flex-grow">
                    {item.feedback}
                  </p>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#7C8B85] pt-3 border-t border-black/5">
                    <span className="font-mono-score truncate">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/testimonials-edit/${item.id}`)
                        }
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

export default TestimonialsData;
