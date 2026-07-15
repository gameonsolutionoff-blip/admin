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
import AwardsAdmin from "./pages/AwardsAdmin";
import AwardsData from "./pages/AwardsData";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminUsers from "./pages/AdminUsers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-admin"
              element={
                <ProtectedRoute>
                  <BlogAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-data"
              element={
                <ProtectedRoute>
                  <BlogData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-edit/:id"
              element={
                <ProtectedRoute>
                  <BlogEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects-admin"
              element={
                <ProtectedRoute>
                  <ProjectsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects-data"
              element={
                <ProtectedRoute>
                  <ProjectsData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects-edit/:id"
              element={
                <ProtectedRoute>
                  <ProjectsEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/testimonials-admin"
              element={
                <ProtectedRoute>
                  <TestimonialsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/testimonials-data"
              element={
                <ProtectedRoute>
                  <TestimonialsData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/testimonials-edit/:id"
              element={
                <ProtectedRoute>
                  <TestimonialsEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news-admin"
              element={
                <ProtectedRoute>
                  <NewsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news-data"
              element={
                <ProtectedRoute>
                  <NewsData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/news-edit/:id"
              element={
                <ProtectedRoute>
                  <NewsEdit />
                </ProtectedRoute>
              }
            />
            <Route
              path="/contact-responses"
              element={
                <ProtectedRoute>
                  <ContactResponses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/awards-admin"
              element={
                <ProtectedRoute>
                  <AwardsAdmin />
                </ProtectedRoute>
              }
            />
            <Route
              path="/awards-data"
              element={
                <ProtectedRoute>
                  <AwardsData />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-users"
              element={
                <ProtectedRoute>
                  <AdminUsers />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
