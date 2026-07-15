import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Building2, MapPin, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { imageFileToDataUrl } from "@/lib/imageUpload";
import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

interface ProjectPayload {
  imageUrl: string;
  title: string;
  location: string;
  shortDescription: string;
}

interface Project extends ProjectPayload {
  id: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const inputClass =
  "border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]";

const ProjectsEdit = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProjectPayload>({
    imageUrl: "",
    title: "",
    location: "",
    shortDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [imageName, setImageName] = useState("");

  useEffect(() => {
    if (!id) {
      toast({
        title: "Missing ID",
        description: "No project id provided",
        variant: "destructive",
      });
      navigate("/projects-data");
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/projects/${id}`);
        if (res.data?.success && res.data.project) {
          const p: Project = res.data.project;
          setFormData({
            imageUrl: p.imageUrl || "",
            title: p.title || "",
            location: p.location || "",
            shortDescription: p.shortDescription || "",
          });
        } else {
          toast({
            title: "Not found",
            description: res.data?.message || "Project not found",
            variant: "destructive",
          });
          navigate("/projects-data");
        }
      } catch (err: any) {
        console.error("ProjectsEdit:fetch error", err);
        toast({
          title: "Fetch Failed",
          description:
            err?.response?.data?.message || "Could not fetch project",
          variant: "destructive",
        });
        navigate("/projects-data");
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const validate = (): boolean => {
    const err: Record<string, string> = {};
    if (!formData.imageUrl.trim()) err.imageUrl = "Image is required";

    if (!formData.title.trim()) err.title = "Title is required";
    else if (formData.title.trim().length > 80)
      err.title = "Title must be 80 characters or less";

    if (!formData.location.trim()) err.location = "Location is required";

    if (!formData.shortDescription.trim())
      err.shortDescription = "Short description is required";
    else if (formData.shortDescription.trim().length > 150)
      err.shortDescription = "Short description must be 150 characters or less";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await imageFileToDataUrl(file);
      setFormData((f) => ({ ...f, imageUrl }));
      setImageName(file.name);
      setErrors((current) => {
        const { imageUrl: _imageUrl, ...rest } = current;
        return rest;
      });
      toast({
        title: "Image selected",
        description: `${file.name} will replace the current image.`,
      });
    } catch (err: any) {
      e.target.value = "";
      toast({
        title: "Invalid Image",
        description: err?.message || "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast({
        title: "Validation Error",
        description: "Please fix the fields highlighted",
        variant: "destructive",
      });
      return;
    }

    if (!id) return;
    setSaving(true);

    try {
      const payload = {
        imageUrl: formData.imageUrl.trim(),
        title: formData.title.trim(),
        location: formData.location.trim(),
        shortDescription: formData.shortDescription.trim(),
      };

      const res = await axios.put(`${API_URL}/api/projects/${id}`, payload);
      if (res.data?.success) {
        toast({
          title: "Updated",
          description: "Project updated successfully",
        });
        navigate("/projects-data");
      } else {
        toast({
          title: "Update Failed",
          description: res.data?.message || "Unexpected response",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("ProjectsEdit:update error", err);
      toast({
        title: "Update Failed",
        description: err?.response?.data?.message || "Could not update project",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7F2] flex items-center justify-center">
        <p className="text-[#5B6B64]">Loading project...</p>
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
          <button
            onClick={() => navigate("/projects-data")}
            className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
              <Building2 className="h-5 w-5 text-[#C8FF4D]" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                Edit project
              </h1>
              <p className="text-sm text-[#7C8B85]">
                {formData.title || "Untitled project"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
            Projects · Editing
          </span>
          <span className="font-mono-score text-[11px] tracking-widest text-[#7C8B85] truncate max-w-[50%]">
            {formData.location || "..."}
          </span>
        </div>
      </header>

      <main className="max-w-3xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="space-y-2">
              <Label
                htmlFor="imageUrl"
                className="text-[#0B1410] font-semibold"
              >
                Upload image *
              </Label>
              <Input
                id="imageUrl"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={errors.imageUrl ? "border-red-400" : inputClass}
                aria-invalid={!!errors.imageUrl}
              />
              {errors.imageUrl && (
                <p className="text-red-600 text-sm">{errors.imageUrl}</p>
              )}
              <p className="text-sm text-[#7C8B85]">
                Accepts JPG, PNG, WebP, GIF, SVG, AVIF, and other image formats.
              </p>
              {imageName && (
                <p className="text-sm text-[#1B4332] font-medium">
                  {imageName}
                </p>
              )}
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Selected project"
                  className="mt-3 h-44 w-full rounded-lg object-cover border border-black/10"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#0B1410] font-semibold">
                Project title * (max 80 characters)
              </Label>
              <Input
                id="title"
                placeholder="Premium Pickleball Court Installation"
                value={formData.title}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, title: e.target.value }))
                }
                className={errors.title ? "border-red-400" : inputClass}
                maxLength={80}
                aria-invalid={!!errors.title}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
              <p className="text-sm text-[#7C8B85]">
                {formData.title.length}/80 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-[#0B1410] font-semibold"
              >
                Project location *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1B4332]" />
                <Input
                  id="location"
                  placeholder="Chennai, Tamil Nadu, India"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, location: e.target.value }))
                  }
                  className={`pl-9 ${
                    errors.location ? "border-red-400" : inputClass
                  }`}
                  aria-invalid={!!errors.location}
                />
              </div>
              {errors.location && (
                <p className="text-red-600 text-sm">{errors.location}</p>
              )}
              <p className="text-sm text-[#7C8B85]">
                Format: City, State/Region, Country
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="shortDescription"
                className="text-[#0B1410] font-semibold"
              >
                Short description * (max 150 characters)
              </Label>
              <Textarea
                id="shortDescription"
                placeholder="One-line summary for project cards"
                value={formData.shortDescription}
                onChange={(e) =>
                  setFormData((f) => ({
                    ...f,
                    shortDescription: e.target.value,
                  }))
                }
                className={
                  errors.shortDescription ? "border-red-400" : inputClass
                }
                maxLength={150}
                rows={3}
                aria-invalid={!!errors.shortDescription}
              />
              {errors.shortDescription && (
                <p className="text-red-600 text-sm">
                  {errors.shortDescription}
                </p>
              )}
              <p className="text-sm text-[#7C8B85]">
                {formData.shortDescription.length}/150 characters
              </p>
            </div>

            <div className="pt-2 border-t border-black/5">
              <Button
                type="submit"
                className="w-full gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white mt-6"
                disabled={saving}
                aria-label="Update project"
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Update project"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProjectsEdit;
