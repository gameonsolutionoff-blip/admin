import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Mail, Phone, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";

interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt?: string;
}

const ContactResponses = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [responses, setResponses] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contacts`);
      setResponses(res.data?.contacts || []);
    } catch (error: any) {
      toast({
        title: "Fetch failed",
        description: error?.response?.data?.message || "Could not fetch contact responses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this contact response?")) return;
    await axios.delete(`${API_BASE_URL}/api/contacts/${id}`);
    setResponses((current) => current.filter((item) => item.id !== id));
    toast({ title: "Deleted", description: "Contact response removed." });
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
          <Button variant="outline" onClick={fetchResponses}>
            Refresh
          </Button>
        </div>

        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-600 text-white">
            <CardTitle className="text-2xl flex items-center">
              <Mail className="mr-2" />
              Contact Responses ({responses.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-green-600">
                Loading contact responses...
              </div>
            ) : responses.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No contact responses yet
              </div>
            ) : (
              <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
                {responses.map((response) => (
                  <Card key={response.id} className="border-green-200">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-green-800">
                            {response.name}
                          </h3>
                          <a
                            href={`mailto:${response.email}`}
                            className="text-sm text-green-700 hover:underline"
                          >
                            {response.email}
                          </a>
                          {response.phone && (
                            <div className="mt-1 flex items-center text-sm text-gray-600">
                              <Phone className="mr-1 h-3.5 w-3.5" />
                              {response.phone}
                            </div>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(response.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      {response.subject && (
                        <p className="mt-4 font-semibold text-gray-800">
                          {response.subject}
                        </p>
                      )}
                      <p className="mt-3 whitespace-pre-wrap text-sm text-gray-700">
                        {response.message}
                      </p>
                      <p className="mt-4 text-xs text-gray-500">
                        {response.createdAt
                          ? new Date(response.createdAt).toLocaleString()
                          : "Unknown date"}
                      </p>
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

export default ContactResponses;
