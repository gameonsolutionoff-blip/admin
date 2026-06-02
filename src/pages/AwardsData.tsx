import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Trophy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface Award {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  createdAt?: string;
}

const AwardsData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [items, setItems] = useState<Award[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAwards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/awards`);
      setItems(res.data?.awards || []);
    } catch (error: any) {
      toast({
        title: "Fetch failed",
        description: error?.response?.data?.message || "Could not fetch awards.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAwards();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this award item?")) return;
    await axios.delete(`${API_BASE_URL}/api/awards/${id}`);
    setItems((current) => current.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Award item removed." });
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
            <Button onClick={() => navigate("/awards-admin")} className="bg-green-600 hover:bg-green-700 text-white">
              Add Award
            </Button>
            <Button variant="outline" onClick={fetchAwards}>
              Refresh
            </Button>
          </div>
        </div>
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Trophy className="mr-2" />
              All Awards ({items.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-green-600">Loading awards...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No awards yet</div>
            ) : (
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden border-green-200 hover:border-green-400 transition-colors flex flex-col"
                  >
                    <div className="aspect-video bg-yellow-100/20 flex items-center justify-center p-4">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full max-w-full object-contain"
                      />
                    </div>
                    <CardContent className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-lg text-green-800 mb-2 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4 line-clamp-1 flex-grow">
                        {item.date}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500 gap-2">
                        <span>
                          {item.createdAt
                            ? new Date(item.createdAt).toLocaleDateString()
                            : "Unknown date"}
                        </span>
                        <div className="flex gap-2">
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

export default AwardsData;
