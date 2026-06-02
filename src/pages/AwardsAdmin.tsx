import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Trophy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { imageFileToDataUrl } from "@/lib/imageUpload";

const AwardsAdmin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ title: "", imageUrl: "", date: "" });
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
    if (!formData.title.trim() || !formData.imageUrl || !formData.date.trim()) {
      toast({
        title: "Missing details",
        description: "Award title, image, and date are required.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      await axios.post(`${API_BASE_URL}/api/awards`, {
        title: formData.title.trim(),
        imageUrl: formData.imageUrl,
        date: formData.date.trim(),
      });
      toast({ title: "Award saved", description: "Award item created." });
      navigate("/awards-data");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        (error?.request
          ? `API is not running at ${API_BASE_URL}. Start it with npm.cmd run api or npm.cmd run dev:all.`
          : "Could not save award.");
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
              <Trophy className="mr-2" />
              Add Award
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-green-800">
                  Award Title *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, title: e.target.value }))
                  }
                  placeholder="Best Sports Infra Solution by..."
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-green-800">
                  Date / Year *
                </Label>
                <Input
                  id="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, date: e.target.value }))
                  }
                  placeholder="2023 or 2021-2023"
                  maxLength={50}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-green-800">
                  Award Icon (Upload Image) *
                </Label>
                <Input id="image" type="file" accept="image/*" onChange={handleImageChange} />
                {imageName && <p className="text-sm text-green-700">{imageName}</p>}
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Selected award"
                    className="mt-3 h-44 w-full rounded-md border border-green-100 object-contain bg-yellow-100/20"
                  />
                )}
              </div>
              
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Save Award"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AwardsAdmin;
