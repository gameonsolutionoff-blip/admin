import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X, Save, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { uploadMediaDirectly } from "@/lib/imageUpload";
import { API_BASE_URL } from "@/lib/api";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  tags: string[];
  content: string;
}

const API_URL = API_BASE_URL;

const inputClass =
  "mt-2 border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]";

const BlogAdmin = () => {
  const [formData, setFormData] = useState<BlogPost>({
    slug: "",
    title: "",
    excerpt: "",
    image: "",
    tags: [],
    content: "",
  });

  const [newTag, setNewTag] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageName, setImageName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ align: [] }],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
    "align",
  ];

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid Image",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setImageName(file.name);
    toast({
      title: "Image selected",
      description: `${file.name} will replace the current image.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let finalImageBase64 = formData.image;
    if (selectedFile) {
      try {
        toast({
          title: "Uploading Image...",
          description: "Please wait, uploading image quickly.",
        });
        finalImageBase64 = await uploadMediaDirectly(selectedFile);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to upload image.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axios.post(`${API_URL}/api/blogs`, {
        ...formData,
        image: finalImageBase64,
      });

      if (res.data.success) {
        toast({
          title: "✅ Blog Created",
          description: "Your blog post has been saved successfully!",
        });

        setFormData({
          slug: "",
          title: "",
          excerpt: "",
          image: "",
          tags: [],
          content: "",
        });
        setImageName("");
        setSelectedFile(null);
        setPreviewUrl("");
      } else {
        toast({
          title: "⚠️ Error",
          description: res.data.message || "Something went wrong",
        });
      }
    } catch (err: any) {
      console.error("Error creating blog:", err);
      const message =
        err?.response?.data?.message ||
        (err?.request
          ? `API is not running at ${API_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save blog.");
      toast({
        title: "❌ Failed",
        description: message,
      });
    } finally {
      setLoading(false);
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

        .ql-toolbar.ql-snow { border-color: rgba(0,0,0,0.1); border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; background: #FAFBF9; }
        .ql-container.ql-snow { border-color: rgba(0,0,0,0.1); border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
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
              <FileText className="h-5 w-5 text-[#C8FF4D]" />
            </div>
            <div>
              <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                Create blog post
              </h1>
              <p className="text-sm text-[#7C8B85]">
                Share sports insights and court construction expertise
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
            Blog · New post
          </span>
          <span className="font-mono-score text-[11px] tracking-widest text-[#7C8B85]">
            Draft
          </span>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto px-4 md:px-8 py-8">
        <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-[#0B1410] font-semibold">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="The Rise of Pickleball in Tamil Nadu..."
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-[#0B1410] font-semibold">
                  Slug (auto-generated)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className={`${inputClass} bg-[#F4F7F2] font-mono-score text-sm`}
                  placeholder="Auto-generated from title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-[#0B1410] font-semibold">
                Excerpt *
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description of your blog post..."
                className={`${inputClass} min-h-[100px]`}
                required
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-[#0B1410] font-semibold">
                Upload image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={inputClass}
              />
              <p className="mt-1 text-sm text-[#7C8B85]">
                Accepts JPG, PNG, WebP, GIF, SVG, AVIF, and other image formats.
              </p>
              {imageName && (
                <p className="mt-2 text-sm text-[#1B4332] font-medium">
                  {imageName}
                </p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected blog"
                  className="mt-3 h-40 w-full rounded-lg object-cover border border-black/10"
                />
              )}
              {!previewUrl && formData.image && (
                <img
                  src={formData.image}
                  alt="Selected blog"
                  className="mt-3 h-40 w-full rounded-lg object-cover border border-black/10"
                />
              )}
            </div>

            <div>
              <Label className="text-[#0B1410] font-semibold">Tags</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className={inputClass.replace("mt-2 ", "")}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button
                  type="button"
                  onClick={addTag}
                  className="bg-[#1B4332] hover:bg-[#163828] text-white shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-[#1B4332]/10 text-[#1B4332] px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-[#1B4332]/70 hover:text-[#1B4332]"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-[#0B1410] font-semibold">
                Content *
              </Label>
              <div className="mt-2 rounded-lg">
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content: value }))
                  }
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-white min-h-[300px] pb-10"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-6 border-t border-black/5">
              <Button
                type="submit"
                disabled={loading}
                className="gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white"
              >
                <Save className="w-4 h-4" />
                {loading ? "Saving..." : "Save blog post"}
              </Button>
              <Link to="/blog-data">
                <Button
                  type="button"
                  variant="outline"
                  className="border-[#1B4332]/30"
                >
                  View all posts
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default BlogAdmin;
