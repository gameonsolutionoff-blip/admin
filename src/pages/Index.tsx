import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  FileText,
  Building2,
  Star,
  Newspaper,
  Award,
  Mail,
  ShieldCheck,
  LogOut,
  Menu,
  Plus,
  ListChecks,
  ArrowUpRight,
} from "lucide-react";

type ContentGroup = {
  key: string;
  label: string;
  description: string;
  icon: typeof FileText;
  createHref?: string;
  createLabel?: string;
  viewHref: string;
  viewLabel: string;
};

const contentGroups: ContentGroup[] = [
  {
    key: "blog",
    label: "Blog",
    description:
      "Write posts on turf construction, court care, and sport trends.",
    icon: FileText,
    createHref: "/blog-admin",
    createLabel: "New post",
    viewHref: "/blog-data",
    viewLabel: "Manage",
  },
  {
    key: "projects",
    label: "Projects",
    description:
      "Showcase finished courts and facilities with photos and details.",
    icon: Building2,
    createHref: "/projects-admin",
    createLabel: "New project",
    viewHref: "/projects-data",
    viewLabel: "Manage",
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Add client feedback, cover images, video, or a reel link.",
    icon: Star,
    createHref: "/testimonials-admin",
    createLabel: "New testimonial",
    viewHref: "/testimonials-data",
    viewLabel: "Manage",
  },
  {
    key: "news",
    label: "News feed",
    description: "Post updates and announcements to the site's news feed.",
    icon: Newspaper,
    createHref: "/news-admin",
    createLabel: "New update",
    viewHref: "/news-data",
    viewLabel: "Manage",
  },
  // {
  //   key: "awards",
  //   label: "Awards",
  //   description: "List recognitions with a logo and year.",
  //   icon: Award,
  //   createHref: "/awards-admin",
  //   createLabel: "New award",
  //   viewHref: "/awards-data",
  //   viewLabel: "Manage",
  // },
];

const soloItems: ContentGroup[] = [
  {
    key: "contacts",
    label: "Contact responses",
    description: "Every message submitted through the site's contact form.",
    icon: Mail,
    viewHref: "/contact-responses",
    viewLabel: "View responses",
  },
  {
    key: "admins",
    label: "Admin access",
    description: "Control which Google accounts can sign in to this dashboard.",
    icon: ShieldCheck,
    viewHref: "/admin-users",
    viewLabel: "Manage access",
  },
];

const navItems = [...contentGroups, ...soloItems];

const todayLabel = new Date().toLocaleDateString("en-IN", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[#0B1410] text-[#F4F7F2]">
      <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
        <img
          src="/GO.png"
          className="h-10 w-10 rounded-lg"
          alt="GameOn Solution"
        />
        <div>
          <p className="font-display text-lg leading-none tracking-wide">
            GameOn Solution
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-[#7C8B85]">
            Content CMS
          </p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.key}
            to={item.viewHref}
            onClick={onNavigate}
            className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-[#D8E0DC] hover:bg-[#1B4332] hover:text-white transition-colors"
          >
            <item.icon className="h-4 w-4 shrink-0 text-[#7C8B85] group-hover:text-[#C8FF4D]" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[#D8E0DC] hover:bg-white/5 hover:text-white"
          onClick={() => {
            onNavigate?.();
          }}
          asChild
        >
          <SignOutButton />
        </Button>
      </div>
    </div>
  );
}

function SignOutButton() {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="flex w-full items-center gap-3"
      onClick={async () => {
        await signOut(auth);
        navigate("/login", { replace: true });
      }}
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}

export default function Index() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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
        .corner-card::before {
          top: 8px; left: 8px;
          border-top: 2px solid; border-left: 2px solid;
        }
        .corner-card::after {
          bottom: 8px; right: 8px;
          border-bottom: 2px solid; border-right: 2px solid;
        }
        .corner-card:hover::before,
        .corner-card:hover::after { opacity: 1; }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .live-dot { animation: pulse-dot 2s ease-in-out infinite; }
      `}</style>

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
          <Sidebar />
        </aside>

        {/* Main column */}
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          {/* Top bar */}
          <header className="sticky top-0 z-20 bg-white border-b border-black/5">
            <div className="flex items-center justify-between px-4 md:px-8 py-4">
              <div className="flex items-center gap-3">
                <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                  <SheetTrigger asChild className="lg:hidden">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Open menu"
                    >
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="p-0 w-72 border-0">
                    <Sidebar onNavigate={() => setMobileNavOpen(false)} />
                  </SheetContent>
                </Sheet>
                <div>
                  <h1 className="font-display text-2xl md:text-3xl tracking-wide text-[#0B1410]">
                    Dashboard
                  </h1>
                  <p className="text-sm text-[#7C8B85]">
                    Manage GameOn Solution's website content
                  </p>
                </div>
              </div>

              <div className="hidden md:block">
                <SignOutButton />
              </div>
            </div>

            {/* Scoreboard strip — signature element */}
            <div className="flex items-center justify-between bg-[#0B1410] px-4 md:px-8 py-2 text-[#F4F7F2]">
              <div className="flex items-center gap-2">
                <span className="live-dot h-2 w-2 rounded-full bg-[#C8FF4D]" />
                <span className="font-mono-score text-[11px] tracking-widest uppercase text-[#C8FF4D]">
                  Site live
                </span>
              </div>
              <span className="font-mono-score text-[11px] tracking-widest text-[#7C8B85]">
                {todayLabel}
              </span>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 md:px-8 py-8 max-w-6xl w-full mx-auto">
            <section className="mb-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C8B85] mb-4">
                Content library
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {contentGroups.map((item) => (
                  <div
                    key={item.key}
                    className="bg-white rounded-xl border border-black/5 shadow-sm p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4332]">
                          <item.icon className="h-5 w-5 text-[#C8FF4D]" />
                        </div>
                        <h2 className="font-display text-lg tracking-wide text-[#0B1410]">
                          {item.label}
                        </h2>
                      </div>
                      <p className="text-sm text-[#5B6B64] leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-2">
                      {item.createHref && (
                        <Link to={item.createHref} className="min-w-0 flex-1">
                          <Button className="w-full gap-1.5 bg-[#1B4332] hover:bg-[#163828] text-white px-3">
                            <Plus className="h-4 w-4 shrink-0" />
                            <span className="truncate">{item.createLabel}</span>
                          </Button>
                        </Link>
                      )}
                      <Link to={item.viewHref} className="min-w-0 flex-1">
                        <Button
                          variant="outline"
                          className="w-full gap-1.5 border-[#1B4332]/30 px-3"
                        >
                          <ListChecks className="h-4 w-4 shrink-0" />
                          <span className="truncate">{item.viewLabel}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7C8B85] mb-4">
                Operations
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {soloItems.map((item) => (
                  <Link key={item.key} to={item.viewHref}>
                    <div className="bg-white rounded-xl border border-black/5 shadow-sm p-6 flex items-center justify-between hover:border-[#1B4332]/30 transition-colors">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0B1410] shrink-0">
                          <item.icon className="h-5 w-5 text-[#C8FF4D]" />
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-display text-base tracking-wide text-[#0B1410]">
                            {item.label}
                          </h2>
                          <p className="text-sm text-[#7C8B85] truncate">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-[#7C8B85] shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </main>

          <footer className="px-4 md:px-8 py-6 text-center">
            <p className="text-xs text-[#7C8B85]">
              &copy; {new Date().getFullYear()} GameOn Solution. All rights
              reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
