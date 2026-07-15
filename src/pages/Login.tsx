import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

import Logo from "/logo.webp";
import GoogleLogo from "/google.webp";
import TurfImage from "/turf.webp";

export default function Login() {
  const { user, isAdmin, loading, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate("/", { replace: true });
    }
  }, [loading, user, isAdmin, navigate]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1410]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap');
        .font-display { font-family: 'Oswald', sans-serif; }
        .font-mono-score { font-family: 'JetBrains Mono', monospace; }
        body, .font-body { font-family: 'Inter', sans-serif; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="flex items-center justify-center bg-[#0B1410] px-8">
          <div className="w-full max-w-md">
            <img
              src={Logo}
              alt="GameOn Solution"
              className="mb-16 h-14 w-auto"
            />

            <span className="inline-flex items-center gap-2 rounded-full bg-[#1B4332] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8FF4D]">
              <span className="live-dot h-1.5 w-1.5 rounded-full bg-[#C8FF4D]" />
              Admin Panel
            </span>

            <h1 className="font-display mt-6 text-5xl tracking-wide text-[#F4F7F2]">
              Welcome Back
            </h1>

            <p className="mt-5 text-lg leading-8 text-[#7C8B85]">
              Securely sign in using your authorized Google account to access
              the GameOn Solution Admin Dashboard.
            </p>

            <Button
              onClick={handleSignIn}
              className="mt-12 h-14 w-full gap-1.5 rounded-xl bg-[#1B4332] text-base font-semibold text-white transition hover:bg-[#163828]"
            >
              <img
                src={GoogleLogo}
                alt="Google"
                className="mr-3 h-6 w-6 rounded-full bg-white p-1"
              />
              Continue with Google
            </Button>

            {!loading && user && !isAdmin && (
              <div className="mt-8 rounded-xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-300">
                Signed in as{" "}
                <strong className="text-red-200">{user.email}</strong>.
                <br />
                This account is not authorized to access the admin panel.
              </div>
            )}

            <p className="font-mono-score mt-12 text-center text-[11px] uppercase tracking-widest text-[#7C8B85]">
              Authorized access only.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative hidden overflow-hidden lg:block">
          <img
            src={TurfImage}
            alt="GameOn Solution"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#0B1410] via-[#0B1410]/50 to-[#0B1410]/85" />

          <div className="relative flex h-full flex-col justify-end p-16">
            <span className="mb-6 inline-flex w-fit rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#F4F7F2] backdrop-blur-md">
              GameOn Solution CMS
            </span>

            <h2 className="font-display max-w-xl text-5xl leading-tight tracking-wide text-[#F4F7F2]">
              Manage Your Website
              <span className="block text-[#C8FF4D]">
                From One Secure Dashboard.
              </span>
            </h2>

            <p className="mt-6 max-w-lg text-lg leading-8 text-[#D8E0DC]">
              Update news, blogs, project galleries, contact information, turf
              calculator leads, homepage content, and other website resources
              from a centralized admin panel.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#F4F7F2] backdrop-blur">
                📰 News
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#F4F7F2] backdrop-blur">
                ✍️ Blogs
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#F4F7F2] backdrop-blur">
                🖼 Projects
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#F4F7F2] backdrop-blur">
                📞 Contact Details
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-[#F4F7F2] backdrop-blur">
                📊 Turf Calculator Leads
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
