import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api";
import { ArrowLeft, ShieldCheck, UserPlus, Trash2 } from "lucide-react";

interface AdminEntry {
  email: string;
  addedBy?: string;
}

export default function AdminUsers() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<AdminEntry[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);

  const authedFetch = async (path: string, options: RequestInit = {}) => {
    const token = await user?.getIdToken();
    return fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const res = await authedFetch("/api/admins");
      const data = await res.json();
      if (data.success) {
        setAdmins(data.admins);
      } else {
        toast({
          title: data.message || "Failed to load admins",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to load admins", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addAdmin = async () => {
    const email = newEmail.trim().toLowerCase();
    if (!email || !email.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    try {
      const res = await authedFetch("/api/admins", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setNewEmail("");
        loadAdmins();
        toast({ title: data.message });
      } else {
        toast({
          title: data.message || "Failed to add admin",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to add admin", variant: "destructive" });
    }
  };

  const removeAdmin = async (email: string) => {
    if (email === user?.email) {
      toast({ title: "You can't remove yourself", variant: "destructive" });
      return;
    }
    if (!confirm(`Remove admin access for ${email}?`)) return;
    try {
      const res = await authedFetch(
        `/api/admins/${encodeURIComponent(email)}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        loadAdmins();
      } else {
        toast({
          title: data.message || "Failed to remove admin",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
      toast({ title: "Failed to remove admin", variant: "destructive" });
    }
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
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1410] shrink-0">
                <ShieldCheck className="h-5 w-5 text-[#C8FF4D]" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                  Admin access
                </h1>
                <p className="text-sm text-[#7C8B85]">
                  Control which Google accounts can sign in to this dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
            <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
              Admins · {admins.length}{" "}
              {admins.length === 1 ? "account" : "accounts"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto px-4 md:px-8 py-8 space-y-6">
        <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1B4332]">
              <UserPlus className="h-4.5 w-4.5 text-[#C8FF4D]" />
            </div>
            <h2 className="font-display text-lg tracking-wide text-[#0B1410]">
              Add administrator
            </h2>
          </div>
          <p className="mt-2 text-sm text-[#7C8B85]">
            Enter a Google email address to grant administrator access.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Input
              placeholder="admin@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="h-11 border-black/10 focus-visible:ring-[#1B4332] focus-visible:border-[#1B4332]"
              onKeyDown={(e) => e.key === "Enter" && addAdmin()}
            />
            <Button
              onClick={addAdmin}
              className="h-11 w-full gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white sm:w-auto sm:px-8"
            >
              <UserPlus className="h-4 w-4" />
              Add admin
            </Button>
          </div>
        </div>

        <div className="corner-card overflow-hidden bg-white rounded-xl border border-black/5 shadow-sm">
          <div className="border-b border-black/5 px-6 py-4">
            <h2 className="font-display text-lg tracking-wide text-[#0B1410]">
              Current administrators
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3 p-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-[#F4F7F2]"
                />
              ))}
            </div>
          ) : admins.length === 0 ? (
            <div className="py-16 text-center px-6">
              <div className="w-14 h-14 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7 text-[#C8FF4D]" />
              </div>
              <h3 className="font-display text-lg tracking-wide text-[#0B1410]">
                No administrators
              </h3>
              <p className="mt-2 text-[#7C8B85]">
                Add your first administrator.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {admins.map((admin) => (
                <div
                  key={admin.email}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-[#F4F7F2]/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B4332]/10 font-display text-sm font-semibold text-[#1B4332]">
                      {admin.email.substring(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-[#0B1410]">
                        {admin.email}
                      </h3>
                      <p className="text-sm text-[#7C8B85]">
                        Added by {admin.addedBy || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeAdmin(admin.email)}
                    className="w-full gap-1.5 text-red-600 border-red-200 hover:bg-red-50 sm:w-auto"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
