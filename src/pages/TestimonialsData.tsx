import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, ExternalLink, Pencil, Play, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface Testimonial {
  id: string;
  name: string;
  feedback: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  instagramUrl?: string;
  createdAt?: string;
}

const TestimonialsData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/testimonials`);
      setItems(res.data?.testimonials || []);
    } catch (error: any) {
      toast({
        title: "Fetch failed",
        description: error?.response?.data?.message || "Could not fetch testimonials.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this testimonial?")) return;
    await axios.delete(`${API_BASE_URL}/api/testimonials/${id}`);
    setItems((current) => current.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Testimonial removed." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-wrap justify-between gap-3 mb-6">
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="border-green-600 text-green-600 hover:bg-green-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate("/testimonials-admin")}
              className="bg-green-600 hover:bg-green-700"
            >
              Add Testimonial
            </Button>
            <Button variant="outline" onClick={fetchTestimonials}>
              Refresh
            </Button>
          </div>
        </div>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Star className="mr-2" />
              All Testimonials ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-green-600">
                Loading testimonials...
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No testimonials yet
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-green-200 hover:border-green-400 transition-colors flex flex-col"
                  >
                    <div className="aspect-video bg-gray-200 relative">
                      {item.mediaType === "video" ? (
                        <video
                          src={item.mediaUrl}
                          controls
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img
                          src={item.mediaUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                      {item.instagramUrl && (
                        <a
                          href={item.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-green-700 shadow"
                          aria-label="Open Instagram reel"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      {item.mediaType === "video" && (
                        <div className="absolute left-3 top-3 rounded-full bg-black/60 p-2 text-white">
                          <Play className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-4 flex-grow">
                        {item.feedback}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                        <span>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/testimonials-edit/${item.id}`)}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
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

export default TestimonialsData;
