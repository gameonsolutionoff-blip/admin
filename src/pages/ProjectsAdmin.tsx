// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Image, MapPin, FileText } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// const ProjectsAdmin = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     imageUrl: "",
//     title: "",
//     location: "",
//     shortDescription: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     // Image URL validation
//     if (!formData.imageUrl) {
//       newErrors.imageUrl = "Image URL is required";
//     } else if (!formData.imageUrl.startsWith("https://")) {
//       newErrors.imageUrl = "Image URL must start with https://";
//     } else if (!/\.(jpg|jpeg|png|webp)$/i.test(formData.imageUrl)) {
//       newErrors.imageUrl = "Image URL must end with .jpg, .jpeg, .png, or .webp";
//     }

//     // Title validation
//     if (!formData.title) {
//       newErrors.title = "Project title is required";
//     } else if (formData.title.length > 80) {
//       newErrors.title = "Title must be 80 characters or less";
//     }

//     // Location validation
//     if (!formData.location) {
//       newErrors.location = "Project location is required";
//     }

//     // Short description validation
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

//     const projectData = {
//       id: Date.now().toString(),
//       ...formData,
//       createdAt: new Date().toISOString(),
//     };

//     const existingProjects = JSON.parse(
//       localStorage.getItem("projects") || "[]"
//     );
//     localStorage.setItem(
//       "projects",
//       JSON.stringify([...existingProjects, projectData])
//     );

//     toast({
//       title: "Success!",
//       description: "Project has been added successfully",
//     });

//     setFormData({
//       imageUrl: "",
//       title: "",
//       location: "",
//       shortDescription: "",
//     });
//     setErrors({});
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
//       <div className="max-w-3xl mx-auto py-8">
//         <Button
//           variant="outline"
//           onClick={() => navigate("/")}
//           className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Dashboard
//         </Button>

//         <Card className="border-2 border-green-200">
//           <CardHeader className="bg-green-600 text-white">
//             <CardTitle className="text-2xl flex items-center">
//               <Image className="mr-2" />
//               Add New Project
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
//                 Add Project
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProjectsAdmin;

// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
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
//   createdAt: string; // ISO
// }

// /** Helpers */
// const loadProjects = (): Project[] => {
//   try {
//     const raw = localStorage.getItem("projects");
//     if (!raw) return [];
//     const parsed = JSON.parse(raw);
//     if (!Array.isArray(parsed)) return [];
//     return parsed;
//   } catch (e) {
//     console.error("Failed to load projects from localStorage", e);
//     return [];
//   }
// };

// const saveProjects = (projects: Project[]) => {
//   try {
//     localStorage.setItem("projects", JSON.stringify(projects));
//   } catch (e) {
//     console.error("Failed to save projects to localStorage", e);
//     throw e;
//   }
// };

// const isValidImageUrl = (u: string) =>
//   typeof u === "string" &&
//   u.startsWith("https://") &&
//   /\.(jpe?g|png|webp)$/i.test(u.trim());

// const makeId = (): string =>
//   // stable modern id, fallback to Date.now
//   typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
//     ? crypto.randomUUID()
//     : `${Date.now()}`;

// const ProjectsAdmin = (): JSX.Element => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [formData, setFormData] = useState({
//     imageUrl: "",
//     title: "",
//     location: "",
//     shortDescription: "",
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

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

//     const projectData: Project = {
//       id: makeId(),
//       imageUrl: formData.imageUrl.trim(),
//       title: formData.title.trim(),
//       location: formData.location.trim(),
//       shortDescription: formData.shortDescription.trim(),
//       createdAt: new Date().toISOString(),
//     };

//     try {
//       const existing = loadProjects();
//       const updated = [...existing, projectData];
//       saveProjects(updated);

//       toast({
//         title: "Success",
//         description: "Project has been added successfully",
//       });

//       // Reset form
//       setFormData({
//         imageUrl: "",
//         title: "",
//         location: "",
//         shortDescription: "",
//       });
//       setErrors({});

//       // Navigate to projects list so user can see it immediately
//       navigate("/projects-data");
//     } catch (err) {
//       toast({
//         title: "Save Failed",
//         description: "Could not save project. Check console for details.",
//         variant: "destructive",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
//       <div className="max-w-3xl mx-auto py-8">
//         <Button
//           variant="outline"
//           onClick={() => navigate("/")}
//           className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
//           aria-label="Back to dashboard"
//         >
//           <ArrowLeft className="mr-2 h-4 w-4" />
//           Back to Dashboard
//         </Button>

//         <Card className="border-2 border-green-200">
//           <CardHeader className="bg-green-600 text-white">
//             <CardTitle className="text-2xl flex items-center">
//               <ImgIcon className="mr-2" />
//               Add New Project
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
//                 aria-label="Add project"
//               >
//                 <FileText className="mr-2 h-4 w-4" />
//                 Add Project
//               </Button>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProjectsAdmin;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface ProjectCreatePayload {
  imageUrl: string;
  title: string;
  location: string;
  shortDescription: string;
}

const ProjectsAdmin = (): JSX.Element => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<ProjectCreatePayload>({
    imageUrl: "",
    title: "",
    location: "",
    shortDescription: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [imageName, setImageName] = useState("");

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
        description: `${file.name} is ready to upload.`,
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

    setSubmitting(true);
    try {
      const payload = {
        imageUrl: formData.imageUrl.trim(),
        title: formData.title.trim(),
        location: formData.location.trim(),
        shortDescription: formData.shortDescription.trim(),
      };

      const res = await axios.post(`${API_URL}/api/projects`, payload);
      if (res.data?.success && res.data?.id) {
        toast({
          title: "Project Created",
          description: "Project saved successfully",
        });
        // Navigate to projects list (or optionally to edit: /projects-edit/:id)
        navigate("/projects-data");
      } else {
        toast({
          title: "Create Failed",
          description: res.data?.message || "Unexpected server response",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("ProjectsAdmin:create error", err);
      const message =
        err?.response?.data?.message ||
        (err?.request
          ? `API is not running at ${API_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not create project");
      toast({
        title: "Request Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <ImgIcon className="mr-2" />
              Add New Project
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
                  aria-describedby={
                    errors.imageUrl ? "imageUrl-error" : undefined
                  }
                />
                {errors.imageUrl && (
                  <p id="imageUrl-error" className="text-red-500 text-sm">
                    {errors.imageUrl}
                  </p>
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
                disabled={submitting}
                aria-label="Add project"
              >
                <FileText className="mr-2 h-4 w-4" />
                {submitting ? "Saving..." : "Add Project"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsAdmin;
