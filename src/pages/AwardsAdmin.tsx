import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Award as AwardIcon, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { API_BASE_URL } from "@/lib/api";
import { uploadMediaDirectly } from "@/lib/imageUpload";

const inputClass =
  "mt-2 border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]";

const AwardsAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", date: "" });
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

    if (!formData.title.trim() || !formData.date.trim() || !selectedFile) {
      toast({
        title: "Missing details",
        description: "Award title, image, and date are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      toast({ title: "Uploading image...", description: "Please wait." });
      const imageUrl = await uploadMediaDirectly(selectedFile);

      await axios.post(`${API_BASE_URL}/api/awards`, {
        title: formData.title.trim(),
        imageUrl,
        date: formData.date.trim(),
      });
      toast({ title: "✅ Award saved", description: "Award item created." });
      navigate("/awards-data");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? `API is not running at ${API_BASE_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save award.");
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
              <AwardIcon className="h-5 w-5 text-[#C8FF4D]" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                Add award
              </h1>
              <p className="text-sm text-[#7C8B85]">
                List a recognition with a logo and year
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
            Awards · New item
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
              <Label htmlFor="title" className="text-[#0B1410] font-semibold">
                Award title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Best Sports Infra Solution by..."
                maxLength={100}
                className={inputClass}
              />
            </div>

            <div>
              <Label htmlFor="date" className="text-[#0B1410] font-semibold">
                Date / year *
              </Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, date: e.target.value }))
                }
                placeholder="2023 or 2021-2023"
                maxLength={50}
                className={`${inputClass} font-mono-score text-sm`}
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-[#0B1410] font-semibold">
                Award icon (upload image) *
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
                <div className="mt-3 h-44 w-full rounded-lg border border-black/10 bg-[#F4F7F2] flex items-center justify-center p-4">
                  <img
                    src={previewUrl}
                    alt="Selected award"
                    className="h-full max-w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-6 border-t border-black/5">
              <Button
                type="submit"
                disabled={saving}
                className="gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white"
              >
                <Save className="w-4 h-4" />
                {saving ? "Saving..." : "Save award"}
              </Button>
              <Link to="/awards-data">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#1B4332]/30"
                >
                  View all awards
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AwardsAdmin;
