import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Newspaper, Save } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/api";
import { uploadMediaDirectly } from "@/lib/imageUpload";

const inputClass =
  "mt-2 border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]";

const NewsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState<"image" | "youtube">("image");
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: "",
    details: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Backend doesn't support GET /api/news-feeds/:id (405 Method Not Allowed),
        // so fetch the collection and find the matching entry client-side —
        // same approach used for BlogEdit / TestimonialsEdit.
        const res = await axios.get(`${API_BASE_URL}/api/news-feeds`);
        const item = (res.data?.newsFeeds || []).find((n: any) => n.id === id);

        if (item) {
          setFormData({
            title: item.title || "",
            imageUrl: item.imageUrl || "",
            details: item.details || "",
          });
          setUploadType(item.fileType === "youtube" ? "youtube" : "image");
        } else {
          toast({
            title: "Not found",
            description: "News feed item could not be loaded.",
            variant: "destructive",
          });
          navigate("/news-data");
        }
      } catch {
        toast({
          title: "Not found",
          description: "News feed item could not be loaded.",
          variant: "destructive",
        });
        navigate("/news-data");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid image",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalMediaUrl = formData.imageUrl;
    if (uploadType === "image" && selectedFile) {
      try {
        toast({ title: "Uploading image...", description: "Please wait." });
        finalMediaUrl = await uploadMediaDirectly(selectedFile);
      } catch {
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }

    try {
      const token = await user?.getIdToken(true);
      await axios.put(
        `${API_BASE_URL}/api/news-feeds/${id}`,
        {
          title: formData.title.trim(),
          imageUrl: finalMediaUrl,
          fileType: uploadType,
          details: formData.details.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({ title: "✅ Updated", description: "News feed item updated." });
      navigate("/news-data");
    } catch (error: any) {
      toast({
        title: "❌ Update failed",
        description: error?.response?.data?.message || "Could not update news.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F2] flex items-center justify-center">
        <p className="text-[#5B6B64]">Loading news item...</p>
      </div>
    );
  }

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
      `}</style>

      <header className="sticky top-0 z-20 bg-white border-b border-black/5">
        <div className="px-4 md:px-8 py-4">
          <Link
            to="/news-data"
            className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to news
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
              <Newspaper className="h-5 w-5 text-[#C8FF4D]" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                Edit news item
              </h1>
              <p className="text-sm text-[#7C8B85]">
                {formData.title || "Untitled item"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
            News · Editing
          </span>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-[#0B1410] font-semibold">Media type</Label>
              <div className="mt-2 flex gap-4">
                <label className="flex items-center gap-2 text-sm text-[#5B6B64]">
                  <input
                    type="radio"
                    checked={uploadType === "image"}
                    onChange={() => setUploadType("image")}
                    className="h-4 w-4 accent-[#1B4332]"
                  />
                  Image upload
                </label>
                <label className="flex items-center gap-2 text-sm text-[#5B6B64]">
                  <input
                    type="radio"
                    checked={uploadType === "youtube"}
                    onChange={() => setUploadType("youtube")}
                    className="h-4 w-4 accent-[#1B4332]"
                  />
                  YouTube link
                </label>
              </div>
            </div>

            <div>
              <Label className="text-[#0B1410] font-semibold">Title *</Label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className={inputClass}
                required
              />
            </div>

            {uploadType === "image" ? (
              <div>
                <Label className="text-[#0B1410] font-semibold">
                  Replace image
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={inputClass}
                />
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="News cover"
                    className="mt-3 h-44 w-full rounded-lg object-cover border border-black/10"
                  />
                ) : (
                  formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="News cover"
                      className="mt-3 h-44 w-full rounded-lg object-cover border border-black/10"
                    />
                  )
                )}
              </div>
            ) : (
              <div>
                <Label className="text-[#0B1410] font-semibold">
                  YouTube URL *
                </Label>
                <Input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageUrl: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <Label className="text-[#0B1410] font-semibold">Details *</Label>
              <Textarea
                value={formData.details}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, details: e.target.value }))
                }
                rows={5}
                className={inputClass}
                required
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-black/5">
              <Button
                type="submit"
                disabled={saving}
                className="gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save changes"}
              </Button>
              <Link to="/news-data">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#1B4332]/30"
                >
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewsEdit;
