import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { uploadMediaDirectly } from "@/lib/imageUpload";

const initialForm = {
  name: "",
  feedback: "",
  mediaUrl: "",
  mediaType: "",
  instagramUrl: "",
};

const inputClass =
  "border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]";

const TestimonialsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Invalid media",
        description: "Please upload an image or video.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFileName(file.name);
    setFormData((current) => ({
      ...current,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name.trim() ||
      !formData.feedback.trim() ||
      (!formData.mediaUrl && !selectedFile)
    ) {
      toast({
        title: "Missing details",
        description: "Name, feedback, and cover media are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    let finalMediaUrl = formData.mediaUrl;
    if (selectedFile) {
      try {
        toast({
          title: "Uploading Media...",
          description: "Please wait, uploading file quickly.",
        });
        finalMediaUrl = await uploadMediaDirectly(selectedFile);
      } catch (err: any) {
        toast({
          title: "Upload Failed",
          description:
            err.message ||
            "Could not upload to server. Did you update the main frontend?",
          variant: "destructive",
        });
        setSaving(false);
        return;
      }
    }
    try {
      await axios.post(`${API_BASE_URL}/api/testimonials`, {
        name: formData.name.trim(),
        feedback: formData.feedback.trim(),
        mediaUrl: finalMediaUrl,
        mediaType: formData.mediaType,
        instagramUrl: formData.instagramUrl.trim(),
      });
      toast({ title: "Testimonial saved", description: "The card is ready." });
      navigate("/testimonials-data");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? `API is not running at ${API_BASE_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save testimonial.");
      toast({
        title: "Save failed",
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
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
              <Star className="h-5 w-5 text-[#C8FF4D]" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                Add testimonial
              </h1>
              <p className="text-sm text-[#7C8B85]">
                Add client feedback with a cover image, video, or reel link
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
            Testimonials · New entry
          </span>
          <span className="font-mono-score text-[11px] tracking-widest text-[#7C8B85]">
            Draft
          </span>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0B1410] font-semibold">
                Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    name: e.target.value,
                  }))
                }
                placeholder="Customer name"
                maxLength={80}
                className={inputClass}
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="feedback"
                className="text-[#0B1410] font-semibold"
              >
                Feedback *
              </Label>
              <Textarea
                id="feedback"
                value={formData.feedback}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    feedback: e.target.value,
                  }))
                }
                placeholder="Customer feedback"
                rows={4}
                maxLength={300}
                className={inputClass}
              />
              <p className="text-sm text-[#7C8B85]">
                {formData.feedback.length}/300 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="media" className="text-[#0B1410] font-semibold">
                Cover image or video *
              </Label>
              <Input
                id="media"
                type="file"
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className={inputClass}
              />
              {fileName && (
                <p className="text-sm text-[#1B4332] font-medium">{fileName}</p>
              )}

              {previewUrl && formData.mediaType === "video" && (
                <video
                  src={previewUrl}
                  controls
                  className="mt-3 h-56 w-full rounded-lg border border-black/10 object-cover"
                />
              )}
              {!previewUrl &&
                formData.mediaUrl &&
                formData.mediaType === "video" && (
                  <video
                    src={formData.mediaUrl}
                    controls
                    className="mt-3 h-56 w-full rounded-lg border border-black/10 object-cover"
                  />
                )}

              {previewUrl && formData.mediaType === "image" && (
                <img
                  src={previewUrl}
                  alt="Selected testimonial cover"
                  className="mt-3 h-56 w-full rounded-lg border border-black/10 object-cover"
                />
              )}
              {!previewUrl &&
                formData.mediaUrl &&
                formData.mediaType === "image" && (
                  <img
                    src={formData.mediaUrl}
                    alt="Selected testimonial cover"
                    className="mt-3 h-56 w-full rounded-lg border border-black/10 object-cover"
                  />
                )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="instagramUrl"
                className="text-[#0B1410] font-semibold"
              >
                Instagram reel link
              </Label>
              <Input
                id="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={(e) =>
                  setFormData((current) => ({
                    ...current,
                    instagramUrl: e.target.value,
                  }))
                }
                placeholder="https://www.instagram.com/reel/..."
                className={inputClass}
              />
            </div>

            <div className="pt-2 border-t border-black/5">
              <Button
                type="submit"
                className="w-full gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white mt-6"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save testimonial"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default TestimonialsAdmin;
