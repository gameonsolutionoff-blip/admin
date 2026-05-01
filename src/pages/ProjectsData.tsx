// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { ArrowLeft, Image, MapPin, Trash2, Pencil } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";

// interface Project {
//   id: string;
//   imageUrl: string;
//   title: string;
//   location: string;
//   shortDescription: string;
//   createdAt: string;
// }

// const ProjectsData = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     const loadProjects = () => {
//       const storedProjects = localStorage.getItem("projects");
//       if (storedProjects) {
//         setProjects(JSON.parse(storedProjects));
//       }
//     };
//     loadProjects();
//   }, []);

//   const handleDelete = (id: string) => {
//     const updatedProjects = projects.filter((project) => project.id !== id);
//     localStorage.setItem("projects", JSON.stringify(updatedProjects));
//     setProjects(updatedProjects);
//     toast({
//       title: "Deleted",
//       description: "Project has been removed",
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
//       <div className="max-w-7xl mx-auto py-8">
//         <div className="flex justify-between items-center mb-6">
//           <Button
//             variant="outline"
//             onClick={() => navigate("/")}
//             className="border-green-600 text-green-600 hover:bg-green-50"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Dashboard
//           </Button>
//           <Button
//             onClick={() => navigate("/projects-admin")}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             Add New Project
//           </Button>
//         </div>

//         <Card className="border-2 border-green-200">
//           <CardHeader className="bg-green-600 text-white">
//             <CardTitle className="text-2xl flex items-center">
//               <Image className="mr-2" />
//               All Projects ({projects.length})
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-6">
//             {projects.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <Image className="mx-auto h-12 w-12 mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No projects yet</p>
//                 <p className="text-sm">
//                   Add your first project to get started
//                 </p>
//               </div>
//             ) : (
//               <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                   <Card
//                     key={project.id}
//                     className="overflow-hidden border-green-200 hover:border-green-400 transition-colors flex flex-col"
//                   >
//                     <div className="aspect-video bg-gray-200 relative">
//                       <img
//                         src={project.imageUrl}
//                         alt={project.title}
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           (e.target as HTMLImageElement).src =
//                             "/placeholder.svg";
//                         }}
//                       />
//                     </div>
//                     <CardContent className="p-4 flex flex-col flex-grow">
//                       <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">
//                         {project.title}
//                       </h3>
//                       <div className="flex items-start mb-3 text-sm text-gray-600">
//                         <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
//                         <span className="line-clamp-1">{project.location}</span>
//                       </div>
//                       <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
//                         {project.shortDescription}
//                       </p>
//                       <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
//                         <span className="truncate">
//                           {new Date(project.createdAt).toLocaleDateString()}
//                         </span>
//                         <div className="flex gap-2 flex-shrink-0">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() => navigate(`/projects-edit/${project.id}`)}
//                             className="border-green-600 text-green-600 hover:bg-green-50"
//                           >
//                             <Pencil className="h-3 w-3" />
//                           </Button>
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => handleDelete(project.id)}
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProjectsData;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   ArrowLeft,
//   Image as ImgIcon,
//   MapPin,
//   Trash2,
//   Pencil,
// } from "lucide-react";
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

// const ProjectsData = (): JSX.Element => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [projects, setProjects] = useState<Project[]>([]);

//   useEffect(() => {
//     setProjects(loadProjects());
//   }, []);

//   const handleDelete = (id: string) => {
//     const ok = window.confirm("Are you sure you want to delete this project?");
//     if (!ok) return;

//     const updated = projects.filter((p) => p.id !== id);
//     try {
//       saveProjects(updated);
//       setProjects(updated);
//       toast({
//         title: "Deleted",
//         description: "Project has been removed",
//       });
//     } catch {
//       toast({
//         title: "Delete Failed",
//         description: "Could not delete project. See console.",
//         variant: "destructive",
//       });
//     }
//   };

//   const handleImageError = (
//     e: React.SyntheticEvent<HTMLImageElement, Event>
//   ) => {
//     (e.target as HTMLImageElement).src = "/placeholder.svg";
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
//       <div className="max-w-7xl mx-auto py-8">
//         <div className="flex justify-between items-center mb-6">
//           <Button
//             variant="outline"
//             onClick={() => navigate("/")}
//             className="border-green-600 text-green-600 hover:bg-green-50"
//             aria-label="Back to dashboard"
//           >
//             <ArrowLeft className="mr-2 h-4 w-4" />
//             Back to Dashboard
//           </Button>

//           <div className="flex gap-2">
//             <Button
//               onClick={() => navigate("/projects-admin")}
//               className="bg-green-600 hover:bg-green-700"
//               aria-label="Add new project"
//             >
//               Add New Project
//             </Button>
//             <Button
//               variant="outline"
//               onClick={() => {
//                 setProjects(loadProjects());
//                 toast({
//                   title: "Refreshed",
//                   description: "Projects reloaded from storage.",
//                 });
//               }}
//             >
//               Refresh
//             </Button>
//           </div>
//         </div>

//         <Card className="border-2 border-green-200">
//           <CardHeader className="bg-green-600 text-white">
//             <CardTitle className="text-2xl flex items-center">
//               <ImgIcon className="mr-2" />
//               All Projects ({projects.length})
//             </CardTitle>
//           </CardHeader>

//           <CardContent className="pt-6">
//             {projects.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <ImgIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
//                 <p className="text-lg font-medium">No projects yet</p>
//                 <p className="text-sm">Add your first project to get started</p>
//               </div>
//             ) : (
//               <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
//                 {projects.map((project) => (
//                   <Card
//                     key={project.id}
//                     className="overflow-hidden border-green-200 hover:border-green-400 transition-colors flex flex-col"
//                   >
//                     <div className="aspect-video bg-gray-200 relative">
//                       <img
//                         src={project.imageUrl}
//                         alt={project.title}
//                         className="w-full h-full object-cover"
//                         onError={handleImageError}
//                       />
//                     </div>

//                     <CardContent className="p-4 flex flex-col flex-grow">
//                       <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">
//                         {project.title}
//                       </h3>

//                       <div className="flex items-start mb-3 text-sm text-gray-600">
//                         <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
//                         <span className="line-clamp-1">{project.location}</span>
//                       </div>

//                       <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
//                         {project.shortDescription}
//                       </p>

//                       <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
//                         <span className="truncate">
//                           {new Date(project.createdAt).toLocaleDateString()}
//                         </span>

//                         <div className="flex gap-2 flex-shrink-0">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               navigate(`/projects-edit/${project.id}`)
//                             }
//                             className="border-green-600 text-green-600 hover:bg-green-50"
//                             aria-label={`Edit ${project.title}`}
//                           >
//                             <Pencil className="h-3 w-3" />
//                           </Button>

//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => handleDelete(project.id)}
//                             aria-label={`Delete ${project.title}`}
//                           >
//                             <Trash2 className="h-3 w-3" />
//                           </Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ProjectsData;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Image as ImgIcon,
  MapPin,
  Trash2,
  Pencil,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

const API_URL = API_BASE_URL;

interface Project {
  id: string;
  imageUrl: string;
  title: string;
  location: string;
  shortDescription: string;
  createdAt?: string | null;
  updatedAt?: string | null;
}

const ProjectsData = (): JSX.Element => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      if (res.data?.success && Array.isArray(res.data.projects)) {
        setProjects(res.data.projects);
      } else {
        toast({
          title: "Fetch Error",
          description: "Unexpected server response",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("ProjectsData:fetch error", err);
      toast({
        title: "Fetch Failed",
        description: err?.response?.data?.message || "Could not fetch projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id: string) => {
    const ok = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!ok) return;

    setDeletingId(id);
    try {
      const res = await axios.delete(`${API_URL}/api/projects/${id}`);
      if (res.data?.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        toast({ title: "Deleted", description: "Project has been removed" });
      } else {
        toast({
          title: "Delete Failed",
          description: res.data?.message || "Could not delete",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error("ProjectsData:delete error", err);
      toast({
        title: "Delete Failed",
        description: err?.response?.data?.message || "Delete request failed",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    (e.target as HTMLImageElement).src = "/placeholder.svg";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-green-600 text-green-600 hover:bg-green-50"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/projects-admin")}
              className="bg-green-600 hover:bg-green-700"
            >
              Add New Project
            </Button>
            <Button variant="outline" onClick={fetchProjects}>
              Refresh
            </Button>
          </div>
        </div>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <ImgIcon className="mr-2" />
              All Projects ({projects.length})
            </CardTitle>
          </CardHeader>

          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-green-600">
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ImgIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p className="text-lg font-medium">No projects yet</p>
                <p className="text-sm">Add your first project to get started</p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    className="overflow-hidden border-green-200 hover:border-green-400 transition-colors flex flex-col"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>

                    <CardContent className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">
                        {project.title}
                      </h3>

                      <div className="flex items-start mb-3 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-1">{project.location}</span>
                      </div>

                      <p className="text-sm text-gray-700 mb-4 line-clamp-3 flex-grow">
                        {project.shortDescription}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                        <span className="truncate">
                          {project.createdAt
                            ? new Date(project.createdAt).toLocaleDateString()
                            : "Unknown date"}
                        </span>

                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(`/projects-edit/${project.id}`)
                            }
                            className="border-green-600 text-green-600 hover:bg-green-50"
                            aria-label={`Edit ${project.title}`}
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                            disabled={deletingId === project.id}
                            aria-label={`Delete ${project.title}`}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectsData;
