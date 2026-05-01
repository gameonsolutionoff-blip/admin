// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Image, MapPin, FileText } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Project {
//   id: string;
//   imageUrl: string;
//   title: string;
//   location: string;
//   shortDescription: string;
//   createdAt: string;
// }

// const ProjectsEdit = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { id } = useParams();

//   const [formData, setFormData] = useState({
//     imageUrl: "",
//     title: "",
//     location: "",
//     shortDescription: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     const storedProjects = localStorage.getItem("projects");
//     if (storedProjects) {
//       const projects: Project[] = JSON.parse(storedProjects);
//       const project = projects.find((p) => p.id === id);
//       if (project) {
//         setFormData({
//           imageUrl: project.imageUrl,
//           title: project.title,
//           location: project.location,
//           shortDescription: project.shortDescription,
//         });
//       } else {
//         toast({
//           title: "Project not found",
//           description: "Redirecting to projects data",
//           variant: "destructive",
//         });
//         navigate("/projects-data");
//       }
//     }
//   }, [id, navigate, toast]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.imageUrl) {
//       newErrors.imageUrl = "Image URL is required";
//     } else if (!formData.imageUrl.startsWith("https://")) {
//       newErrors.imageUrl = "Image URL must start with https://";
//     } else if (!/\.(jpg|jpeg|png|webp)$/i.test(formData.imageUrl)) {
//       newErrors.imageUrl = "Image URL must end with .jpg, .jpeg, .png, or .webp";
//     }

//     if (!formData.title) {
//       newErrors.title = "Project title is required";
//     } else if (formData.title.length > 80) {
//       newErrors.title = "Title must be 80 characters or less";
//     }

//     if (!formData.location) {
//       newErrors.location = "Project location is required";
//     }

//     if (!formData.shortDescription) {
//       newErrors.shortDescription = "Short description is required";
//     } else if (formData.shortDescription.length > 150) {
//       newErrors.shortDescription = "Short description must be 150 characters or less";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fix the errors in the form",
//         variant: "destructive",
//       });
//       return;
//     }

//     const storedProjects = localStorage.getItem("projects");
//     if (storedProjects) {
//       const projects: Project[] = JSON.parse(storedProjects);
//       const updatedProjects = projects.map((project) =>
//         project.id === id
//           ? { ...project, ...formData }
//           : project
//       );
//       localStorage.setItem("projects", JSON.stringify(updatedProjects));

//       toast({
//         title: "Success!",
//         description: "Project has been updated successfully",
//       });

//       navigate("/projects-data");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
//       <div className="max-w-3xl mx-auto py-8">
//         <Button
//           variant="outline"
//           onClick={() => navigate("/projects-data")}
//           className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Projects Data
//         </Button>

//         <Card className="border-2 border-green-200">
//           <CardHeader className="bg-green-600 text-white">
//             <CardTitle className="text-2xl flex items-center">
//               <Image className="mr-2" />
//               Edit Project
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-6">
//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="space-y-2">
//                 <Label htmlFor="imageUrl" className="text-green-800">
//                   Image URL *
//                 </Label>
//                 <Input
//                   id="imageUrl"
//                   type="url"
//                   placeholder="https://example.com/image.jpg"
//                   value={formData.imageUrl}
//                   onChange={(e) =>
//                     setFormData({ ...formData, imageUrl: e.target.value })
//                   }
//                   className={errors.imageUrl ? "border-red-500" : ""}
//                 />
//                 {errors.imageUrl && (
//                   <p className="text-red-500 text-sm">{errors.imageUrl}</p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   Must start with https:// and end with .jpg, .jpeg, .png, or .webp
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="title" className="text-green-800">
//                   Project Title * (max 80 characters)
//                 </Label>
//                 <Input
//                   id="title"
//                   placeholder="Premium Pickleball Court Installation"
//                   value={formData.title}
//                   onChange={(e) =>
//                     setFormData({ ...formData, title: e.target.value })
//                   }
//                   className={errors.title ? "border-red-500" : ""}
//                   maxLength={80}
//                 />
//                 {errors.title && (
//                   <p className="text-red-500 text-sm">{errors.title}</p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   {formData.title.length}/80 characters
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location" className="text-green-800">
//                   Project Location *
//                 </Label>
//                 <div className="flex items-center">
//                   <MapPin className="mr-2 text-green-600" />
//                   <Input
//                     id="location"
//                     placeholder="Chennai, Tamil Nadu, India"
//                     value={formData.location}
//                     onChange={(e) =>
//                       setFormData({ ...formData, location: e.target.value })
//                     }
//                     className={errors.location ? "border-red-500" : ""}
//                   />
//                 </div>
//                 {errors.location && (
//                   <p className="text-red-500 text-sm">{errors.location}</p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   Format: City, State/Region, Country
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="shortDescription" className="text-green-800">
//                   Short Description * (max 150 characters)
//                 </Label>
//                 <Textarea
//                   id="shortDescription"
//                   placeholder="One-line summary for project cards"
//                   value={formData.shortDescription}
//                   onChange={(e) =>
//                     setFormData({
//                       ...formData,
//                       shortDescription: e.target.value,
//                     })
//                   }
//                   className={errors.shortDescription ? "border-red-500" : ""}
//                   maxLength={150}
//                   rows={3}
//                 />
//                 {errors.shortDescription && (
//                   <p className="text-red-500 text-sm">
//                     {errors.shortDescription}
//                   </p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   {formData.shortDescription.length}/150 characters
//                 </p>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-green-600 hover:bg-green-700"
//               >
//                 <FileText className="mr-2 h-4 w-4" />
//                 Update Project
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProjectsEdit;

// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Image as ImgIcon, MapPin, FileText } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Project {
//   id: string;
//   imageUrl: string;
//   title: string;
//   location: string;
//   shortDescription: string;
//   createdAt: string;
// }

// const loadProjects = (): Project[] => {
//   try {
//     const raw = localStorage.getItem("projects");
//     if (!raw) return [];
//     const parsed = JSON.parse(raw);
//     if (!Array.isArray(parsed)) return [];
//     return parsed;
//   } catch (e) {
//     console.error("Failed to load projects", e);
//     return [];
//   }
// };

// const saveProjects = (projects: Project[]) => {
//   try {
//     localStorage.setItem("projects", JSON.stringify(projects));
//   } catch (e) {
//     console.error("Failed to save projects", e);
//     throw e;
//   }
// };

// const isValidImageUrl = (u: string) =>
//   typeof u === "string" &&
//   u.startsWith("https://") &&
//   /\.(jpe?g|png|webp)$/i.test(u.trim());

// const ProjectsEdit = (): JSX.Element => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { id } = useParams<{ id: string }>();

//   const [formData, setFormData] = useState({
//     imageUrl: "",
//     title: "",
//     location: "",
//     shortDescription: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const stored = loadProjects();
//     const project = stored.find((p) => p.id === id);
//     if (!project) {
//       toast({
//         title: "Project not found",
//         description: "Redirecting to projects list",
//         variant: "destructive",
//       });
//       navigate("/projects-data");
//       return;
//     }

//     setFormData({
//       imageUrl: project.imageUrl,
//       title: project.title,
//       location: project.location,
//       shortDescription: project.shortDescription,
//     });
//     setLoading(false);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const validateForm = (): boolean => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.imageUrl.trim()) {
//       newErrors.imageUrl = "Image URL is required";
//     } else if (!formData.imageUrl.startsWith("https://")) {
//       newErrors.imageUrl = "Image URL must start with https://";
//     } else if (!/\.(jpg|jpeg|png|webp)$/i.test(formData.imageUrl)) {
//       newErrors.imageUrl =
//         "Image URL must end with .jpg, .jpeg, .png, or .webp";
//     }

//     if (!formData.title.trim()) {
//       newErrors.title = "Project title is required";
//     } else if (formData.title.trim().length > 80) {
//       newErrors.title = "Title must be 80 characters or less";
//     }

//     if (!formData.location.trim()) {
//       newErrors.location = "Project location is required";
//     }

//     if (!formData.shortDescription.trim()) {
//       newErrors.shortDescription = "Short description is required";
//     } else if (formData.shortDescription.trim().length > 150) {
//       newErrors.shortDescription =
//         "Short description must be 150 characters or less";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!validateForm()) {
//       toast({
//         title: "Validation Error",
//         description: "Please fix the errors in the form",
//         variant: "destructive",
//       });
//       return;
//     }

//     try {
//       const stored = loadProjects();
//       const updated = stored.map((p) =>
//         p.id === id
//           ? {
//               ...p,
//               imageUrl: formData.imageUrl.trim(),
//               title: formData.title.trim(),
//               location: formData.location.trim(),
//               shortDescription: formData.shortDescription.trim(),
//             }
//           : p
//       );
//       saveProjects(updated);

//       toast({
//         title: "Success",
//         description: "Project updated successfully",
//       });

//       navigate("/projects-data");
//     } catch (err) {
//       console.error("Update error", err);
//       toast({
//         title: "Update Failed",
//         description: "Could not update project. See console.",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-10 text-center text-green-600">Loading project...</div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
//       <div className="max-w-3xl mx-auto py-8">
//         <Button
//           variant="outline"
//           onClick={() => navigate("/projects-data")}
//           className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
//           aria-label="Back to projects list"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Projects Data
//         </Button>

//         <Card className="border-2 border-green-200">
//           <CardHeader className="bg-green-600 text-white">
//             <CardTitle className="text-2xl flex items-center">
//               <ImgIcon className="mr-2" />
//               Edit Project
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="pt-6">
//             <form onSubmit={handleSubmit} className="space-y-6" noValidate>
//               <div className="space-y-2">
//                 <Label htmlFor="imageUrl" className="text-green-800">
//                   Image URL *
//                 </Label>
//                 <Input
//                   id="imageUrl"
//                   type="url"
//                   placeholder="https://example.com/image.jpg"
//                   value={formData.imageUrl}
//                   onChange={(e) =>
//                     setFormData((f) => ({ ...f, imageUrl: e.target.value }))
//                   }
//                   aria-invalid={!!errors.imageUrl}
//                   aria-describedby={
//                     errors.imageUrl ? "imageUrl-error" : undefined
//                   }
//                   className={errors.imageUrl ? "border-red-500" : ""}
//                 />
//                 {errors.imageUrl && (
//                   <p id="imageUrl-error" className="text-red-500 text-sm">
//                     {errors.imageUrl}
//                   </p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   Must start with https:// and end with .jpg, .jpeg, .png, or
//                   .webp
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="title" className="text-green-800">
//                   Project Title * (max 80 characters)
//                 </Label>
//                 <Input
//                   id="title"
//                   placeholder="Premium Pickleball Court Installation"
//                   value={formData.title}
//                   onChange={(e) =>
//                     setFormData((f) => ({ ...f, title: e.target.value }))
//                   }
//                   aria-invalid={!!errors.title}
//                   aria-describedby={errors.title ? "title-error" : undefined}
//                   maxLength={80}
//                 />
//                 {errors.title && (
//                   <p id="title-error" className="text-red-500 text-sm">
//                     {errors.title}
//                   </p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   {formData.title.length}/80 characters
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="location" className="text-green-800">
//                   Project Location *
//                 </Label>
//                 <div className="flex items-center">
//                   <MapPin className="mr-2 text-green-600" />
//                   <Input
//                     id="location"
//                     placeholder="Chennai, Tamil Nadu, India"
//                     value={formData.location}
//                     onChange={(e) =>
//                       setFormData((f) => ({ ...f, location: e.target.value }))
//                     }
//                     aria-invalid={!!errors.location}
//                     aria-describedby={
//                       errors.location ? "location-error" : undefined
//                     }
//                   />
//                 </div>
//                 {errors.location && (
//                   <p id="location-error" className="text-red-500 text-sm">
//                     {errors.location}
//                   </p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   Format: City, State/Region, Country
//                 </p>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="shortDescription" className="text-green-800">
//                   Short Description * (max 150 characters)
//                 </Label>
//                 <Textarea
//                   id="shortDescription"
//                   placeholder="One-line summary for project cards"
//                   value={formData.shortDescription}
//                   onChange={(e) =>
//                     setFormData((f) => ({
//                       ...f,
//                       shortDescription: e.target.value,
//                     }))
//                   }
//                   aria-invalid={!!errors.shortDescription}
//                   aria-describedby={
//                     errors.shortDescription
//                       ? "shortDescription-error"
//                       : undefined
//                   }
//                   maxLength={150}
//                   rows={3}
//                 />
//                 {errors.shortDescription && (
//                   <p
//                     id="shortDescription-error"
//                     className="text-red-500 text-sm"
//                   >
//                     {errors.shortDescription}
//                   </p>
//                 )}
//                 <p className="text-sm text-gray-600">
//                   {formData.shortDescription.length}/150 characters
//                 </p>
//               </div>

//               <Button
//                 type="submit"
//                 className="w-full bg-green-600 hover:bg-green-700"
//                 aria-label="Update project"
//               >
//                 <FileText className="mr-2 h-4 w-4" />
//                 Update Project
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProjectsEdit;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Image as ImgIcon, MapPin, FileText } from "lucide-react";
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

  if (loading)
    return (
      <div className="p-10 text-center text-green-600">Loading project...</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/projects-data")}
          className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
          aria-label="Back to projects list"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects Data
        </Button>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <ImgIcon className="mr-2" />
              Edit Project
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-green-800">
                  Upload Image *
                </Label>
                <Input
                  id="imageUrl"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className={errors.imageUrl ? "border-red-500" : ""}
                  aria-invalid={!!errors.imageUrl}
                />
                {errors.imageUrl && (
                  <p className="text-red-500 text-sm">{errors.imageUrl}</p>
                )}
                <p className="text-sm text-gray-600">
                  Accepts JPG, PNG, WebP, GIF, SVG, AVIF, and other image
                  formats.
                </p>
                {imageName && (
                  <p className="text-sm text-green-700">{imageName}</p>
                )}
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Selected project"
                    className="mt-3 h-44 w-full rounded-md object-cover border border-green-100"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-green-800">
                  Project Title * (max 80 characters)
                </Label>
                <Input
                  id="title"
                  placeholder="Premium Pickleball Court Installation"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, title: e.target.value }))
                  }
                  className={errors.title ? "border-red-500" : ""}
                  maxLength={80}
                  aria-invalid={!!errors.title}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm">{errors.title}</p>
                )}
                <p className="text-sm text-gray-600">
                  {formData.title.length}/80 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-green-800">
                  Project Location *
                </Label>
                <div className="flex items-center">
                  <MapPin className="mr-2 text-green-600" />
                  <Input
                    id="location"
                    placeholder="Chennai, Tamil Nadu, India"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData((f) => ({ ...f, location: e.target.value }))
                    }
                    className={errors.location ? "border-red-500" : ""}
                    aria-invalid={!!errors.location}
                  />
                </div>
                {errors.location && (
                  <p className="text-red-500 text-sm">{errors.location}</p>
                )}
                <p className="text-sm text-gray-600">
                  Format: City, State/Region, Country
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription" className="text-green-800">
                  Short Description * (max 150 characters)
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
                  className={errors.shortDescription ? "border-red-500" : ""}
                  maxLength={150}
                  rows={3}
                  aria-invalid={!!errors.shortDescription}
                />
                {errors.shortDescription && (
                  <p className="text-red-500 text-sm">
                    {errors.shortDescription}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {formData.shortDescription.length}/150 characters
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={saving}
                aria-label="Update project"
              >
                <FileText className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Update Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsEdit;
