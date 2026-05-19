import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, Plus, X } from "lucide-react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { imageFileToDataUrl } from "@/lib/imageUpload";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    slug: "",
    title: "",
    excerpt: "",
    image: "",
    tags: [] as string[],
    content: "",
  });

  const [newTag, setNewTag] = useState("");
  const [imageName, setImageName] = useState("");

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
  };

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs`);
        if (res.data.success) {
          const blog = res.data.blogs.find((b: any) => b.id === id);
          if (blog) setFormData(blog);
          else
            toast({ title: "Not found", description: "Blog does not exist" });
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const image = await imageFileToDataUrl(file);
      setFormData((prev) => ({ ...prev, image }));
      setImageName(file.name);
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
    try {
      await axios.put(`${API_URL}/api/blogs/${id}`, formData);
      toast({ title: "✅ Blog Updated", description: "Changes saved!" });
      navigate("/blog-data");
    } catch (err) {
      console.error("Error updating blog:", err);
      toast({ title: "❌ Error", description: "Failed to update blog." });
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-green-600">Loading blog...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/blog-data"
          className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blogs
        </Link>

        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Edit Blog Post
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-8 rounded-xl shadow-lg"
        >
          <div>
            <Label>Title</Label>
            <Input
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  title: e.target.value,
                  slug: e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, ""),
                }))
              }
              required
            />
          </div>

          <div>
            <Label>Slug</Label>
            <Input
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label>Excerpt</Label>
            <Textarea
              value={formData.excerpt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="blog-image">Upload Image</Label>
            <Input
              id="blog-image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <p className="mt-1 text-sm text-gray-600">
              Accepts JPG, PNG, WebP, GIF, SVG, AVIF, and other image formats.
            </p>
            {imageName && (
              <p className="mt-2 text-sm text-green-700">{imageName}</p>
            )}
            {formData.image && (
              <img
                src={formData.image}
                alt="Selected blog"
                className="mt-3 h-40 w-full rounded-md object-cover border border-green-100"
              />
            )}
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mt-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-green-100 px-3 py-1 rounded-full text-green-800 text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <Label>Content</Label>
            <div className="mt-2 border-green-200 focus-within:border-green-500 rounded-md">
              <ReactQuill
                theme="snow"
                value={formData.content}
                onChange={(value) =>
                  setFormData((prev) => ({ ...prev, content: value }))
                }
                modules={quillModules}
                className="bg-white min-h-[300px] pb-10"
              />
            </div>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BlogEdit;
