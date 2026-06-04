import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Save, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { mediaFileToDataUrl } from "@/lib/imageUpload";

const initialForm = {
  name: "",
  feedback: "",
  mediaUrl: "",
  mediaType: "",
  instagramUrl: "",
};

const TestimonialsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialForm);
  const [fileName, setFileName] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");

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
    setFileName(file.name);
    setFormData((current) => ({
      ...current,
      mediaType: file.type.startsWith("video/") ? "video" : "image",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.feedback.trim() || (!formData.mediaUrl && !selectedFile)) {
      toast({
        title: "Missing details",
        description: "Name, feedback, and cover media are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    let finalMediaUrl = formData.mediaUrl;
    if (selectedFile) {
      try {
        toast({ title: "Processing Media...", description: "Please wait, processing file for upload." });
        finalMediaUrl = await mediaFileToDataUrl(selectedFile);
      } catch (err) {
        toast({ title: "Error", description: "Failed to read media file.", variant: "destructive" });
        setSaving(false);
        return;
      }
    }
    try {
      await axios.post(`${API_BASE_URL}/api/testimonials`, {
        name: formData.name.trim(),
        feedback: formData.feedback.trim(),
        mediaUrl: finalMediaUrl,
        mediaType: formData.mediaType,
        instagramUrl: formData.instagramUrl.trim(),
      });
      toast({ title: "Testimonial saved", description: "The card is ready." });
      navigate("/testimonials-data");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? `API is not running at ${API_BASE_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save testimonial.");
      toast({
        title: "Save failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Star className="mr-2" />
              Add Testimonial
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-green-800">
                  Name *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, name: e.target.value }))
                  }
                  placeholder="Customer name"
                  maxLength={80}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-green-800">
                  Feedback *
                </Label>
                <Textarea
                  id="feedback"
                  value={formData.feedback}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      feedback: e.target.value,
                    }))
                  }
                  placeholder="Customer feedback"
                  rows={4}
                  maxLength={300}
                />
                <p className="text-sm text-gray-600">
                  {formData.feedback.length}/300 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="media" className="text-green-800">
                  Cover Image or Video *
                </Label>
                <Input
                  id="media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                />
                {fileName && <p className="text-sm text-green-700">{fileName}</p>}
                
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
                    alt="Selected testimonial cover"
                    className="mt-3 h-56 w-full rounded-md border border-green-100 object-cover"
                  />
                )}
                {!previewUrl && formData.mediaUrl && formData.mediaType === "image" && (
                  <img
                    src={formData.mediaUrl}
                    alt="Selected testimonial cover"
                    className="mt-3 h-56 w-full rounded-md border border-green-100 object-cover"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl" className="text-green-800">
                  Instagram Reel Link
                </Label>
                <Input
                  id="instagramUrl"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) =>
                    setFormData((current) => ({
                      ...current,
                      instagramUrl: e.target.value,
                    }))
                  }
                  placeholder="https://www.instagram.com/reel/..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={saving}
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Testimonial"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TestimonialsAdmin;
