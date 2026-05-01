import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlogAdmin from "./pages/BlogAdmin";
import BlogData from "./pages/BlogData";
import NotFound from "./pages/NotFound";
import BlogEdit from "./pages/BlogEdit";
import ProjectsAdmin from "./pages/ProjectsAdmin";
import ProjectsData from "./pages/ProjectsData";
import ProjectsEdit from "./pages/ProjectsEdit";
import TestimonialsAdmin from "./pages/TestimonialsAdmin";
import TestimonialsData from "./pages/TestimonialsData";
import TestimonialsEdit from "./pages/TestimonialsEdit";
import NewsAdmin from "./pages/NewsAdmin";
import NewsData from "./pages/NewsData";
import NewsEdit from "./pages/NewsEdit";
import ContactResponses from "./pages/ContactResponses";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/blog-admin" element={<BlogAdmin />} />
          <Route path="/blog-data" element={<BlogData />} />
          <Route path="/blog-edit/:id" element={<BlogEdit />} />
          <Route path="/projects-admin" element={<ProjectsAdmin />} />
          <Route path="/projects-data" element={<ProjectsData />} />
          <Route path="/projects-edit/:id" element={<ProjectsEdit />} />
          <Route path="/testimonials-admin" element={<TestimonialsAdmin />} />
          <Route path="/testimonials-data" element={<TestimonialsData />} />
          <Route path="/testimonials-edit/:id" element={<TestimonialsEdit />} />
          <Route path="/news-admin" element={<NewsAdmin />} />
          <Route path="/news-data" element={<NewsData />} />
          <Route path="/news-edit/:id" element={<NewsEdit />} />
          <Route path="/contact-responses" element={<ContactResponses />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
