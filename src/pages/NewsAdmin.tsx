import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Newspaper, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { uploadMediaDirectly } from "@/lib/imageUpload";

const inputClass =
  "mt-2 border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]";

const NewsAdmin = () => {
  const navigate = useNavigate();
  const [uploadType, setUploadType] = useState<"image" | "youtube">("image");
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    youtubeUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [saving, setSaving] = useState(false);

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
    setImageName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isYoutube = uploadType === "youtube";

    if (!formData.title.trim() || !formData.details.trim()) {
      toast({
        title: "Missing details",
        description: "Title and details are required.",
        variant: "destructive",
      });
      return;
    }
    if (isYoutube && !formData.youtubeUrl.trim()) {
      toast({
        title: "Missing YouTube link",
        description: "Add a YouTube URL or switch to image upload.",
        variant: "destructive",
      });
      return;
    }
    if (!isYoutube && !selectedFile) {
      toast({
        title: "Missing image",
        description: "Select an image or switch to YouTube link.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      let mediaUrl = formData.youtubeUrl.trim();
      if (!isYoutube && selectedFile) {
        toast({ title: "Uploading image...", description: "Please wait." });
        mediaUrl = await uploadMediaDirectly(selectedFile);
      }

      await axios.post(`${API_BASE_URL}/api/news-feeds`, {
        title: formData.title.trim(),
        imageUrl: mediaUrl,
        fileType: uploadType,
        details: formData.details.trim(),
      });
      toast({ title: "✅ News saved", description: "News feed item created." });
      navigate("/news-data");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? `API is not running at ${API_BASE_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save news.");
      toast({
        title: "❌ Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
              <Newspaper className="h-5 w-5 text-[#C8FF4D]" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                Add news feed
              </h1>
              <p className="text-sm text-[#7C8B85]">
                Post updates and announcements to the site
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
            News · New item
          </span>
          <span className="font-mono-score text-[11px] tracking-widest text-[#7C8B85]">
            Draft
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
              <Label htmlFor="title" className="text-[#0B1410] font-semibold">
                Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Tournament update"
                maxLength={100}
                className={inputClass}
              />
            </div>

            {uploadType === "image" ? (
              <div>
                <Label htmlFor="image" className="text-[#0B1410] font-semibold">
                  Upload image *
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={inputClass}
                />
                {imageName && (
                  <p className="mt-2 text-sm text-[#1B4332] font-medium">
                    {imageName}
                  </p>
                )}
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Selected news"
                    className="mt-3 h-44 w-full rounded-lg object-cover border border-black/10"
                  />
                )}
              </div>
            ) : (
              <div>
                <Label
                  htmlFor="youtube"
                  className="text-[#0B1410] font-semibold"
                >
                  YouTube URL *
                </Label>
                <Input
                  id="youtube"
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      youtubeUrl: e.target.value,
                    }))
                  }
                  className={inputClass}
                />
              </div>
            )}

            <div>
              <Label htmlFor="details" className="text-[#0B1410] font-semibold">
                Details *
              </Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, details: e.target.value }))
                }
                placeholder="News feed details"
                rows={5}
                className={inputClass}
              />
            </div>

            <div className="flex gap-3 pt-6 border-t border-black/5">
              <Button
                type="submit"
                disabled={saving}
                className="gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save news"}
              </Button>
              <Link to="/news-data">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#1B4332]/30"
                >
                  View all news
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default NewsAdmin;
