import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Newspaper, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { imageFileToDataUrl } from "@/lib/imageUpload";

const NewsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadType, setUploadType] = useState<"image" | "youtube">("image");
  const [formData, setFormData] = useState({ title: "", imageUrl: "", details: "", youtubeUrl: "" });
  const [saving, setSaving] = useState(false);
  const [imageName, setImageName] = useState("");

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = await imageFileToDataUrl(file);
    setFormData((current) => ({ ...current, imageUrl }));
    setImageName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isYoutube = uploadType === "youtube";
    const mediaUrl = isYoutube ? formData.youtubeUrl : formData.imageUrl;
    
    if (!formData.title.trim() || !mediaUrl || !formData.details.trim()) {
      toast({
        title: "Missing details",
        description: isYoutube ? "News title, YouTube link, and details are required." : "News title, image, and details are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/api/news-feeds`, {
        title: formData.title.trim(),
        imageUrl: mediaUrl,
        fileType: uploadType,
        details: formData.details.trim(),
      });
      toast({ title: "News saved", description: "News feed item created." });
      navigate("/news-data");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? `API is not running at ${API_BASE_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save news.");
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
              <Newspaper className="mr-2" />
              Add News Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-green-800 font-semibold mb-2 block">Upload Type</Label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      checked={uploadType === "image"} 
                      onChange={() => setUploadType("image")} 
                      className="form-radio text-green-600 h-4 w-4"
                    />
                    <span>Image Upload</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      checked={uploadType === "youtube"} 
                      onChange={() => setUploadType("youtube")} 
                      className="form-radio text-green-600 h-4 w-4"
                    />
                    <span>YouTube Link</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-green-800">
                  News Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, title: e.target.value }))
                  }
                  placeholder="Tournament update"
                  maxLength={100}
                />
              </div>

              {uploadType === "image" ? (
                <div className="space-y-2">
                  <Label htmlFor="image" className="text-green-800">
                    Upload Image *
                  </Label>
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                  {imageName && <p className="text-sm text-green-700">{imageName}</p>}
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Selected news"
                      className="mt-3 h-44 w-full rounded-md border border-green-100 object-cover"
                    />
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="youtube" className="text-green-800">
                    YouTube URL *
                  </Label>
                  <Input 
                    id="youtube" 
                    type="url" 
                    placeholder="https://www.youtube.com/watch?v=..."
                    value={formData.youtubeUrl}
                    onChange={(e) => setFormData(c => ({...c, youtubeUrl: e.target.value}))}
                  />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="details" className="text-green-800">
                  Details *
                </Label>
                <Textarea
                  id="details"
                  value={formData.details}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, details: e.target.value }))
                  }
                  placeholder="News feed details"
                  rows={5}
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save News"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsAdmin;
