import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { mediaFileToDataUrl, uploadMediaDirectly } from "@/lib/imageUpload";

const TestimonialsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    feedback: "",
    mediaUrl: "",
    mediaType: "image",
    instagramUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/testimonials/${id}`);
        setFormData(res.data.testimonial);
      } catch {
        toast({
          title: "Not found",
          description: "Testimonial could not be loaded.",
          variant: "destructive",
        });
        navigate("/testimonials-data");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate, toast]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
      toast({
        title: "Invalid media",
        description: "Please upload an image or video.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setFormData((current) => ({
      ...current,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    let finalMediaUrl = formData.mediaUrl;
    if (selectedFile) {
      try {
        toast({ title: "Uploading Media...", description: "Please wait, uploading file quickly." });
        finalMediaUrl = await uploadMediaDirectly(selectedFile);
      } catch (err: any) {
        toast({ title: "Upload Failed", description: err.message || "Could not upload to server. Did you update the main frontend?", variant: "destructive" });
        setSaving(false);
        return;
      }
    }
    try {
      await axios.put(`${API_BASE_URL}/api/testimonials/${id}`, {
        name: formData.name.trim(),
        feedback: formData.feedback.trim(),
        mediaUrl: finalMediaUrl,
        mediaType: formData.mediaType,
        instagramUrl: formData.instagramUrl?.trim() || "",
      });
      toast({ title: "Updated", description: "Testimonial updated." });
      navigate("/testimonials-data");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || "Could not update testimonial.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-green-600">Loading testimonial...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/testimonials-data")}
          className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Testimonials
        </Button>
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Star className="mr-2" />
              Edit Testimonial
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-green-800">Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-800">Feedback *</Label>
                <Textarea
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, feedback: e.target.value }))
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-800">Replace Media</Label>
                <Input type="file" accept="image/*,video/*" onChange={handleMediaChange} />
                {previewUrl && formData.mediaType === "video" && (
                  <video
                    src={previewUrl}
                    controls
                    className="mt-3 h-56 w-full rounded-md border border-green-100 object-cover"
                  />
                )}
                {!previewUrl && formData.mediaUrl && formData.mediaType === "video" && (
                  <video
                    src={formData.mediaUrl}
                    controls
                    className="mt-3 h-56 w-full rounded-md border border-green-100 object-cover"
                  />
                )}

                {previewUrl && formData.mediaType === "image" && (
                  <img
                    src={previewUrl}
                    alt="Testimonial cover"
                    className="mt-3 h-56 w-full rounded-md border border-green-100 object-cover"
                  />
                )}
                {!previewUrl && formData.mediaUrl && formData.mediaType === "image" && (
                  <img
                    src={formData.mediaUrl}
                    alt="Testimonial cover"
                    className="mt-3 h-56 w-full rounded-md border border-green-100 object-cover"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-green-800">Instagram Reel Link</Label>
                <Input
                  type="url"
                  value={formData.instagramUrl || ""}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      instagramUrl: e.target.value,
                    }))
                  }
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Update Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsEdit;
