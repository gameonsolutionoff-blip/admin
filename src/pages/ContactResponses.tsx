// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import axios from "axios";
// // import { ArrowLeft, Mail, Phone, Trash2, RefreshCw } from "lucide-react";
// // import { Button } from "@/components/ui/button";
// // import { useToast } from "@/hooks/use-toast";
// // import { API_BASE_URL, getAuthHeaders } from "@/lib/api";

// // interface ContactResponse {
// //   id: string;
// //   name: string;
// //   email: string;
// //   phone?: string;
// //   subject?: string;
// //   message: string;
// //   createdAt?: string;
// // }

// // const ContactResponses = () => {
// //   const navigate = useNavigate();
// //   const { toast } = useToast();
// //   const [responses, setResponses] = useState<ContactResponse[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [deletingId, setDeletingId] = useState<string | null>(null);

// //   const fetchResponses = async () => {
// //     setLoading(true);
// //     try {
// //       const headers = await getAuthHeaders();
// //       const res = await axios.get(`${API_BASE_URL}/api/contacts`, { headers });
// //       setResponses(res.data?.contacts || []);
// //     } catch (error: any) {
// //       toast({
// //         title: "Fetch failed",
// //         description:
// //           error?.response?.data?.message ||
// //           "Could not fetch contact responses.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleDelete = async (id: string) => {
// //     if (!window.confirm("Delete this contact response?")) return;
// //     setDeletingId(id);
// //     try {
// //       const headers = await getAuthHeaders();
// //       await axios.delete(`${API_BASE_URL}/api/contacts/${id}`, { headers });
// //       setResponses((current) => current.filter((item) => item.id !== id));
// //       toast({ title: "Deleted", description: "Contact response removed." });
// //     } catch (error: any) {
// //       toast({
// //         title: "Delete failed",
// //         description:
// //           error?.response?.data?.message || "Could not delete response.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setDeletingId(null);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-[#F4F7F2]">
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
// //         .font-display { font-family: 'Oswald', sans-serif; }
// //         .font-mono-score { font-family: 'JetBrains Mono', monospace; }
// //         body, .font-body { font-family: 'Inter', sans-serif; }

// //         .corner-card { position: relative; }
// //         .corner-card::before,
// //         .corner-card::after {
// //           content: "";
// //           position: absolute;
// //           width: 14px;
// //           height: 14px;
// //           border-color: #C8FF4D;
// //           opacity: 0;
// //           transition: opacity 0.15s ease;
// //         }
// //         .corner-card::before { top: 8px; left: 8px; border-top: 2px solid; border-left: 2px solid; }
// //         .corner-card::after { bottom: 8px; right: 8px; border-bottom: 2px solid; border-right: 2px solid; }
// //         .corner-card:hover::before, .corner-card:hover::after { opacity: 1; }

// //         @keyframes pulse-dot {
// //           0%, 100% { opacity: 1; }
// //           50% { opacity: 0.35; }
// //         }
// //         .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
// //       `}</style>

// //       <header className="sticky top-0 z-20 bg-white border-b border-black/5">
// //         <div className="px-4 md:px-8 py-4">
// //           <button
// //             onClick={() => navigate("/")}
// //             className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
// //           >
// //             <ArrowLeft className="h-4 w-4" />
// //             Back to dashboard
// //           </button>
// //           <div className="flex flex-wrap items-center justify-between gap-4">
// //             <div className="flex items-center gap-3 min-w-0">
// //               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332] shrink-0">
// //                 <Mail className="h-5 w-5 text-[#C8FF4D]" />
// //               </div>
// //               <div className="min-w-0">
// //                 <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
// //                   Contact responses
// //                 </h1>
// //                 <p className="text-sm text-[#7C8B85]">
// //                   Every message submitted through the site's contact form
// //                 </p>
// //               </div>
// //             </div>
// //             <Button
// //               variant="outline"
// //               className="gap-1.5 border-[#1B4332]/30 shrink-0"
// //               onClick={fetchResponses}
// //             >
// //               <RefreshCw className="h-4 w-4" />
// //               Refresh
// //             </Button>
// //           </div>
// //         </div>
// //         <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
// //           <div className="flex items-center gap-2">
// //             <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
// //             <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
// //               Contacts · {responses.length}{" "}
// //               {responses.length === 1 ? "message" : "messages"}
// //             </span>
// //           </div>
// //         </div>
// //       </header>

// //       <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
// //         {loading ? (
// //           <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
// //             <p className="text-[#5B6B64]">Loading contact responses...</p>
// //           </div>
// //         ) : responses.length === 0 ? (
// //           <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
// //             <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
// //               <Mail className="w-8 h-8 text-[#C8FF4D]" />
// //             </div>
// //             <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
// //               No contact responses yet
// //             </h3>
// //             <p className="text-[#7C8B85]">
// //               Messages submitted through the site's contact form will show up
// //               here.
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
// //             {responses.map((response) => (
// //               <div
// //                 key={response.id}
// //                 className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-5 md:p-6"
// //               >
// //                 <div className="flex items-start justify-between gap-3">
// //                   <div className="min-w-0">
// //                     <h3 className="font-display text-lg tracking-wide text-[#0B1410] truncate">
// //                       {response.name}
// //                     </h3>
// //                     <a
// //                       href={`mailto:${response.email}`}
// //                       className="text-sm text-[#1B4332] hover:underline break-all"
// //                     >
// //                       {response.email}
// //                     </a>
// //                     {response.phone && (
// //                       <div className="mt-1 flex items-center gap-1.5 text-sm text-[#7C8B85]">
// //                         <Phone className="h-3.5 w-3.5 shrink-0" />
// //                         <span className="truncate">{response.phone}</span>
// //                       </div>
// //                     )}
// //                   </div>
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() => handleDelete(response.id)}
// //                     disabled={deletingId === response.id}
// //                     className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
// //                     aria-label={`Delete message from ${response.name}`}
// //                   >
// //                     <Trash2 className="h-3.5 w-3.5" />
// //                   </Button>
// //                 </div>

// //                 {response.subject && (
// //                   <p className="mt-4 font-semibold text-[#0B1410]">
// //                     {response.subject}
// //                   </p>
// //                 )}

// //                 <p className="mt-3 whitespace-pre-wrap text-sm text-[#5B6B64] leading-relaxed">
// //                   {response.message}
// //                 </p>

// //                 <p className="mt-4 pt-3 border-t border-black/5 font-mono-score text-xs text-[#7C8B85]">
// //                   {response.createdAt
// //                     ? new Date(response.createdAt).toLocaleString()
// //                     : "Unknown date"}
// //                 </p>
// //               </div>
// //             ))}
// //           </div>
// //         )}
// //       </main>
// //     </div>
// //   );
// // };

// // export default ContactResponses;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { ArrowLeft, Mail, Phone, Trash2, RefreshCw } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/hooks/useAuth";
// import { API_BASE_URL } from "@/lib/api";

// interface ContactResponse {
//   id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   subject?: string;
//   message: string;
//   createdAt?: string;
// }

// const ContactResponses = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const { user } = useAuth();
//   const [responses, setResponses] = useState<ContactResponse[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [deletingId, setDeletingId] = useState<string | null>(null);

//   const fetchResponses = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/contacts`);
//       setResponses(res.data?.contacts || []);
//     } catch (error: any) {
//       toast({
//         title: "Fetch failed",
//         description:
//           error?.response?.data?.message ||
//           "Could not fetch contact responses.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchResponses();
//   }, []);

//   const handleDelete = async (id: string) => {
//     if (!window.confirm("Delete this contact response?")) return;
//     setDeletingId(id);
//     try {
//       const token = await user?.getIdToken();
//       await axios.delete(`${API_BASE_URL}/api/contacts/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setResponses((current) => current.filter((item) => item.id !== id));
//       toast({ title: "Deleted", description: "Contact response removed." });
//     } catch (error: any) {
//       toast({
//         title: "Delete failed",
//         description:
//           error?.response?.data?.message || "Could not delete response.",
//         variant: "destructive",
//       });
//     } finally {
//       setDeletingId(null);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F4F7F2]">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
//         .font-display { font-family: 'Oswald', sans-serif; }
//         .font-mono-score { font-family: 'JetBrains Mono', monospace; }
//         body, .font-body { font-family: 'Inter', sans-serif; }

//         .corner-card { position: relative; }
//         .corner-card::before,
//         .corner-card::after {
//           content: "";
//           position: absolute;
//           width: 14px;
//           height: 14px;
//           border-color: #C8FF4D;
//           opacity: 0;
//           transition: opacity 0.15s ease;
//         }
//         .corner-card::before { top: 8px; left: 8px; border-top: 2px solid; border-left: 2px solid; }
//         .corner-card::after { bottom: 8px; right: 8px; border-bottom: 2px solid; border-right: 2px solid; }
//         .corner-card:hover::before, .corner-card:hover::after { opacity: 1; }

//         @keyframes pulse-dot {
//           0%, 100% { opacity: 1; }
//           50% { opacity: 0.35; }
//         }
//         .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
//       `}</style>

//       <header className="sticky top-0 z-20 bg-white border-b border-black/5">
//         <div className="px-4 md:px-8 py-4">
//           <button
//             onClick={() => navigate("/")}
//             className="inline-flex items-center gap-1.5 text-sm text-[#5B6B64] hover:text-[#0B1410] transition-colors mb-3"
//           >
//             <ArrowLeft className="h-4 w-4" />
//             Back to dashboard
//           </button>
//           <div className="flex flex-wrap items-center justify-between gap-4">
//             <div className="flex items-center gap-3 min-w-0">
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332] shrink-0">
//                 <Mail className="h-5 w-5 text-[#C8FF4D]" />
//               </div>
//               <div className="min-w-0">
//                 <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
//                   Contact responses
//                 </h1>
//                 <p className="text-sm text-[#7C8B85]">
//                   Every message submitted through the site's contact form
//                 </p>
//               </div>
//             </div>
//             <Button
//               variant="outline"
//               className="gap-1.5 border-[#1B4332]/30 shrink-0"
//               onClick={fetchResponses}
//             >
//               <RefreshCw className="h-4 w-4" />
//               Refresh
//             </Button>
//           </div>
//         </div>
//         <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
//           <div className="flex items-center gap-2">
//             <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
//             <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
//               Contacts · {responses.length}{" "}
//               {responses.length === 1 ? "message" : "messages"}
//             </span>
//           </div>
//         </div>
//       </header>

//       <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
//         {loading ? (
//           <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
//             <p className="text-[#5B6B64]">Loading contact responses...</p>
//           </div>
//         ) : responses.length === 0 ? (
//           <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
//             <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
//               <Mail className="w-8 h-8 text-[#C8FF4D]" />
//             </div>
//             <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
//               No contact responses yet
//             </h3>
//             <p className="text-[#7C8B85]">
//               Messages submitted through the site's contact form will show up
//               here.
//             </p>
//           </div>
//         ) : (
//           <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
//             {responses.map((response) => (
//               <div
//                 key={response.id}
//                 className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-5 md:p-6"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     <h3 className="font-display text-lg tracking-wide text-[#0B1410] truncate">
//                       {response.name}
//                     </h3>
//                     <a
//                       href={`mailto:${response.email}`}
//                       className="text-sm text-[#1B4332] hover:underline break-all"
//                     >
//                       {response.email}
//                     </a>
//                     {response.phone && (
//                       <div className="mt-1 flex items-center gap-1.5 text-sm text-[#7C8B85]">
//                         <Phone className="h-3.5 w-3.5 shrink-0" />
//                         <span className="truncate">{response.phone}</span>
//                       </div>
//                     )}
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => handleDelete(response.id)}
//                     disabled={deletingId === response.id}
//                     className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
//                     aria-label={`Delete message from ${response.name}`}
//                   >
//                     <Trash2 className="h-3.5 w-3.5" />
//                   </Button>
//                 </div>

//                 {response.subject && (
//                   <p className="mt-4 font-semibold text-[#0B1410]">
//                     {response.subject}
//                   </p>
//                 )}

//                 <p className="mt-3 whitespace-pre-wrap text-sm text-[#5B6B64] leading-relaxed">
//                   {response.message}
//                 </p>

//                 <p className="mt-4 pt-3 border-t border-black/5 font-mono-score text-xs text-[#7C8B85]">
//                   {response.createdAt
//                     ? new Date(response.createdAt).toLocaleString()
//                     : "Unknown date"}
//                 </p>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default ContactResponses;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Mail, Phone, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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
  const { user } = useAuth();
  const [responses, setResponses] = useState<ContactResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/contacts`);
      setResponses(res.data?.contacts || []);
    } catch (error: any) {
      toast({
        title: "Fetch failed",
        description:
          error?.response?.data?.message ||
          "Could not fetch contact responses.",
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
    setDeletingId(id);
    try {
      const token = await user?.getIdToken();
      await axios.delete(`${API_BASE_URL}/api/contacts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResponses((current) => current.filter((item) => item.id !== id));
      toast({ title: "Deleted", description: "Contact response removed." });
    } catch (error: any) {
      toast({
        title: "Delete failed",
        description:
          error?.response?.data?.message || "Could not delete response.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
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
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332] shrink-0">
                <Mail className="h-5 w-5 text-[#C8FF4D]" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                  Contact responses
                </h1>
                <p className="text-sm text-[#7C8B85]">
                  Every message submitted through the site's contact form
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="gap-1.5 border-[#1B4332]/30 shrink-0"
              onClick={fetchResponses}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
          <div className="flex items-center gap-2">
            <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
            <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
              Contacts · {responses.length}{" "}
              {responses.length === 1 ? "message" : "messages"}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl w-full mx-auto px-4 md:px-8 py-8">
        {loading ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <p className="text-[#5B6B64]">Loading contact responses...</p>
          </div>
        ) : responses.length === 0 ? (
          <div className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-[#1B4332] rounded-lg flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[#C8FF4D]" />
            </div>
            <h3 className="font-display text-xl tracking-wide text-[#0B1410] mb-2">
              No contact responses yet
            </h3>
            <p className="text-[#7C8B85]">
              Messages submitted through the site's contact form will show up
              here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 grid-cols-1 lg:grid-cols-2">
            {responses.map((response) => (
              <div
                key={response.id}
                className="corner-card bg-white rounded-xl border border-black/5 shadow-sm p-5 md:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-lg tracking-wide text-[#0B1410] truncate">
                      {response.name}
                    </h3>
                    <a
                      href={`mailto:${response.email}`}
                      className="text-sm text-[#1B4332] hover:underline break-all"
                    >
                      {response.email}
                    </a>
                    {response.phone && (
                      <div className="mt-1 flex items-center gap-1.5 text-sm text-[#7C8B85]">
                        <Phone className="h-3.5 w-3.5 shrink-0" />
                        <span className="truncate">{response.phone}</span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(response.id)}
                    disabled={deletingId === response.id}
                    className="text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                    aria-label={`Delete message from ${response.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {response.subject && (
                  <p className="mt-4 font-semibold text-[#0B1410]">
                    {response.subject}
                  </p>
                )}

                <p className="mt-3 whitespace-pre-wrap text-sm text-[#5B6B64] leading-relaxed">
                  {response.message}
                </p>

                <p className="mt-4 pt-3 border-t border-black/5 font-mono-score text-xs text-[#7C8B85]">
                  {response.createdAt
                    ? new Date(response.createdAt).toLocaleString()
                    : "Unknown date"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ContactResponses;
