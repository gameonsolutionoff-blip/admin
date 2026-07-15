import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Trash2,
  Pencil,
  RefreshCw,
  Plus,
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

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
                <Building2 className="h-5 w-5 text-[#C8FF4D]" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                  Projects
                </h1>
                <p className="text-sm text-[#7C8B85]">
                  Manage finished courts and facilities
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-1.5 border-[#1B4332]/30"
                onClick={fetchProjects}
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              <Button
                onClick={() => navigate("/projects-admin")}
                className="gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white"
              >
                <Plus className="h-4 w-4" />
                New project
              </Button>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
            <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
              Projects · {projects.length}{" "}
              {projects.length === 1 ? "entry" : "entries"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <p className="text-[#5B6B64]">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-[#C8FF4D]" />
            </div>
            <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
              No projects yet
            </h3>
            <p className="text-[#7C8B85] mb-6">
              Add your first project to get started.
            </p>
            <Button
              onClick={() => navigate("/projects-admin")}
              className="bg-[#1B4332] hover:bg-[#163828] text-white"
            >
              Add new project
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="corner-card bg-white rounded-xl border border-black/5 shadow-sm overflow-hidden flex flex-col"
              >
                <div className="aspect-video bg-[#F4F7F2] relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>

                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-display text-lg tracking-wide text-[#0B1410] mb-2 line-clamp-2">
                    {project.title}
                  </h3>

                  <div className="flex items-start gap-1.5 mb-3 text-sm text-[#7C8B85]">
                    <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-[#1B4332]" />
                    <span className="line-clamp-1">{project.location}</span>
                  </div>

                  <p className="text-sm text-[#5B6B64] leading-relaxed mb-4 line-clamp-3 flex-grow">
                    {project.shortDescription}
                  </p>

                  <div className="flex items-center justify-between gap-2 text-xs text-[#7C8B85] pt-3 border-t border-black/5">
                    <span className="font-mono-score truncate">
                      {project.createdAt
                        ? new Date(project.createdAt).toLocaleDateString()
                        : "Unknown date"}
                    </span>

                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/projects-edit/${project.id}`)}
                        className="border-[#1B4332]/30 text-[#1B4332] hover:bg-[#1B4332]/5"
                        aria-label={`Edit ${project.title}`}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        aria-label={`Delete ${project.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ProjectsData;
