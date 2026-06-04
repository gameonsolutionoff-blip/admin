// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { ArrowLeft, Plus, X, Save } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

// interface BlogPost {
//   id: string;
//   slug: string;
//   title: string;
//   excerpt: string;
//   image: string;
//   tags: string[];
//   content: string;
// }

// const BlogAdmin = () => {
//   const [formData, setFormData] = useState<BlogPost>({
//     id: '',
//     slug: '',
//     title: '',
//     excerpt: '',
//     image: '',
//     tags: [],
//     content: ''
//   });

//   const [newTag, setNewTag] = useState('');

//   const generateId = () => {
//     return Date.now().toString();
//   };

//   const generateSlug = (title: string) => {
//     return title
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)/g, '');
//   };

//   const handleTitleChange = (title: string) => {
//     setFormData(prev => ({
//       ...prev,
//       title,
//       slug: generateSlug(title),
//       id: prev.id || generateId()
//     }));
//   };

//   const addTag = () => {
//     if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
//       setFormData(prev => ({
//         ...prev,
//         tags: [...prev.tags, newTag.trim()]
//       }));
//       setNewTag('');
//     }
//   };

//   const removeTag = (tagToRemove: string) => {
//     setFormData(prev => ({
//       ...prev,
//       tags: prev.tags.filter(tag => tag !== tagToRemove)
//     }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     // Store in localStorage for now (until Supabase is connected)
//     const existingPosts = JSON.parse(localStorage.getItem('blogPosts') || '[]');
//     const updatedPosts = [...existingPosts, { ...formData, createdAt: new Date().toISOString() }];
//     localStorage.setItem('blogPosts', JSON.stringify(updatedPosts));

//     toast({
//       title: "Blog Post Created!",
//       description: "Your blog post has been saved successfully.",
//     });

//     // Reset form
//     setFormData({
//       id: '',
//       slug: '',
//       title: '',
//       excerpt: '',
//       image: '',
//       tags: [],
//       content: ''
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
//       <div className="container mx-auto px-4 py-8">
//         <div className="mb-8">
//           <Link to="/" className="inline-flex items-center text-green-600 hover:text-green-700 mb-4">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Back to Dashboard
//           </Link>
//           <h1 className="text-4xl font-bold text-green-800 mb-2">Create Blog Post</h1>
//           <p className="text-green-600">Share your sports insights and court construction expertise</p>
//         </div>

//         <div className="bg-white rounded-xl shadow-lg p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <Label htmlFor="title" className="text-green-800 font-semibold">Title *</Label>
//                 <Input
//                   id="title"
//                   value={formData.title}
//                   onChange={(e) => handleTitleChange(e.target.value)}
//                   placeholder="The Rise of Pickleball in Tamil Nadu..."
//                   className="mt-2 border-green-200 focus:border-green-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <Label htmlFor="slug" className="text-green-800 font-semibold">Slug (Auto-generated)</Label>
//                 <Input
//                   id="slug"
//                   value={formData.slug}
//                   onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
//                   className="mt-2 border-green-200 focus:border-green-500 bg-gray-50"
//                   placeholder="Auto-generated from title"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="excerpt" className="text-green-800 font-semibold">Excerpt *</Label>
//               <Textarea
//                 id="excerpt"
//                 value={formData.excerpt}
//                 onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
//                 placeholder="Brief description of your blog post..."
//                 className="mt-2 border-green-200 focus:border-green-500 min-h-[100px]"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="image" className="text-green-800 font-semibold">Image URL</Label>
//               <Input
//                 id="image"
//                 value={formData.image}
//                 onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
//                 placeholder="/blog/Blog32.webp"
//                 className="mt-2 border-green-200 focus:border-green-500"
//               />
//             </div>

//             <div>
//               <Label className="text-green-800 font-semibold">Tags</Label>
//               <div className="mt-2 flex gap-2">
//                 <Input
//                   value={newTag}
//                   onChange={(e) => setNewTag(e.target.value)}
//                   placeholder="Add a tag..."
//                   className="border-green-200 focus:border-green-500"
//                   onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
//                 />
//                 <Button type="button" onClick={addTag} className="bg-green-600 hover:bg-green-700">
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//               <div className="flex flex-wrap gap-2 mt-3">
//                 {formData.tags.map((tag, index) => (
//                   <span
//                     key={index}
//                     className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
//                   >
//                     {tag}
//                     <button
//                       type="button"
//                       onClick={() => removeTag(tag)}
//                       className="ml-2 text-green-600 hover:text-green-800"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="content" className="text-green-800 font-semibold">Content *</Label>
//               <Textarea
//                 id="content"
//                 value={formData.content}
//                 onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
//                 placeholder="Write your blog content here..."
//                 className="mt-2 border-green-200 focus:border-green-500 min-h-[300px]"
//                 required
//               />
//             </div>

//             <div className="flex gap-4 pt-6">
//               <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
//                 <Save className="w-4 h-4 mr-2" />
//                 Save Blog Post
//               </Button>
//               <Link to="/blog-data">
//                 <Button type="button" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
//                   View All Posts
//                 </Button>
//               </Link>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogAdmin;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Plus, X, Save } from "lucide-react";
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
    }
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
        toast({ title: "Uploading Image...", description: "Please wait, uploading image quickly." });
        finalImageBase64 = await uploadMediaDirectly(selectedFile);
      } catch (err) {
        toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
        setLoading(false);
        return;
      }
    }

    try {
      const res = await axios.post(`${API_URL}/api/blogs`, {
        ...formData,
        image: finalImageBase64
      });

      if (res.data.success) {
        toast({
          title: "✅ Blog Created",
          description: "Your blog post has been saved successfully!",
        });

        // Reset form
        setFormData({
          slug: "",
          title: "",
          excerpt: "",
          image: "",
          tags: [],
          content: "",
        });
        setImageName("");
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center text-green-600 hover:text-green-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-green-800 mb-2">
            Create Blog Post
          </h1>
          <p className="text-green-600">
            Share your sports insights and court construction expertise
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="title" className="text-green-800 font-semibold">
                  Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="The Rise of Pickleball in Tamil Nadu..."
                  className="mt-2 border-green-200 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug" className="text-green-800 font-semibold">
                  Slug (Auto-generated)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="mt-2 border-green-200 focus:border-green-500 bg-gray-50"
                  placeholder="Auto-generated from title"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="excerpt" className="text-green-800 font-semibold">
                Excerpt *
              </Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, excerpt: e.target.value }))
                }
                placeholder="Brief description of your blog post..."
                className="mt-2 border-green-200 focus:border-green-500 min-h-[100px]"
                required
              />
            </div>

            <div>
              <Label htmlFor="image" className="text-green-800 font-semibold">
                Upload Image
              </Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-2 border-green-200 focus:border-green-500"
              />
              <p className="mt-1 text-sm text-gray-600">
                Accepts JPG, PNG, WebP, GIF, SVG, AVIF, and other image formats.
              </p>
              {imageName && (
                <p className="mt-2 text-sm text-green-700">{imageName}</p>
              )}
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Selected blog"
                  className="mt-3 h-40 w-full rounded-md object-cover border border-green-100"
                />
              )}
              {!previewUrl && formData.image && (
                <img
                  src={formData.image}
                  alt="Selected blog"
                  className="mt-3 h-40 w-full rounded-md object-cover border border-green-100"
                />
              )}
            </div>

            <div>
              <Label className="text-green-800 font-semibold">Tags</Label>
              <div className="mt-2 flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="border-green-200 focus:border-green-500"
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                />
                <Button
                  type="button"
                  onClick={addTag}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-green-600 hover:text-green-800"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="content" className="text-green-800 font-semibold">
                Content *
              </Label>
              <div className="mt-2 border-green-200 focus-within:border-green-500 rounded-md">
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

            <div className="flex gap-4 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Blog Post"}
              </Button>
              <Link to="/blog-data">
                <Button
                  type="button"
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  View All Posts
                </Button>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;
