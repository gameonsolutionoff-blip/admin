import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Newspaper, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface NewsFeed {
  id: string;
  title: string;
  imageUrl: string;
  details: string;
  createdAt?: string;
}

const NewsData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<NewsFeed[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/news-feeds`);
      setItems(res.data?.newsFeeds || []);
    } catch (error: any) {
      toast({
        title: "Fetch failed",
        description: error?.response?.data?.message || "Could not fetch news.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this news feed item?")) return;
    await axios.delete(`${API_BASE_URL}/api/news-feeds/${id}`);
    setItems((current) => current.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "News feed item removed." });
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
            <Button onClick={() => navigate("/news-admin")} className="bg-green-600 hover:bg-green-700">
              Add News
            </Button>
            <Button variant="outline" onClick={fetchNews}>
              Refresh
            </Button>
          </div>
        </div>
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Newspaper className="mr-2" />
              All News Feed ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-green-600">Loading news...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No news feed items yet</div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-green-200 hover:border-green-400 transition-colors flex flex-col"
                  >
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-4 flex-grow">
                        {item.details}
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
                            onClick={() => navigate(`/news-edit/${item.id}`)}
                            className="border-green-600 text-green-600 hover:bg-green-50"
                          >
                            <Pencil className="h-3 w-3" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
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

export default NewsData;
