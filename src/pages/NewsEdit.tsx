import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const NewsEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ title: "", imageUrl: "", details: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/news-feeds/${id}`);
        setFormData(res.data.newsFeed);
      } catch {
        toast({
          title: "Not found",
          description: "News feed item could not be loaded.",
          variant: "destructive",
        });
        navigate("/news-data");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, navigate, toast]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = await imageFileToDataUrl(file);
    setFormData((current) => ({ ...current, imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/news-feeds/${id}`, {
        title: formData.title.trim(),
        imageUrl: formData.imageUrl,
        details: formData.details.trim(),
      });
      toast({ title: "Updated", description: "News feed item updated." });
      navigate("/news-data");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error?.response?.data?.message || "Could not update news.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-green-600">Loading news...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/news-data")}
          className="mb-6 border-green-600 text-green-600 hover:bg-green-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to News
        </Button>
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Newspaper className="mr-2" />
              Edit News Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label className="text-green-800">News Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label className="text-green-800">Replace Image</Label>
                <Input type="file" accept="image/*" onChange={handleImageChange} />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="News cover"
                    className="mt-3 h-44 w-full rounded-md border border-green-100 object-cover"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-green-800">Details *</Label>
                <Textarea
                  value={formData.details}
                  onChange={(e) =>
                    setFormData((current) => ({ ...current, details: e.target.value }))
                  }
                  rows={5}
                />
              </div>
              <Button
                type="submit"
                disabled={saving}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Save className="mr-2 h-4 w-4" />
                {saving ? "Saving..." : "Update News"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewsEdit;
