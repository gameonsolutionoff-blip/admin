import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Database, Trophy, Star, Newspaper, Mail } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-start p-6 md:p-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-10 md:mb-14 pt-6">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-600 rounded-full mb-4 md:mb-6 mx-auto">
            <img
              src="/GO.png"
              alt="GameOn Logo"
              className="w-20 h-20 rounded-full"
            />
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-800 mb-2 md:mb-3">
            GameOn Blog Admin
          </h1>
          <p className="text-base md:text-lg text-green-700 max-w-2xl mx-auto">
            Manage your sports blog content with our turf-themed admin
            interface. Create engaging content about pickleball, sports courts,
            and more.
          </p>
        </div>

        {/* Grid: 1 column small screens, 2 columns medium and up. Each card has consistent height and spacing. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <FileText className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Blog Admin
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Create and manage blog posts with rich content, tags, and
                images. Perfect for sharing insights about sports court
                construction and pickleball trends.
              </p>
            </div>

            <div className="mt-4">
              <Link to="/blog-admin">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Create New Blog Post
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Database className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Blog Data
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                View and manage all submitted blog entries. Review content, edit
                posts, and track your sports content library.
              </p>
            </div>

            <div className="mt-4">
              <Link to="/blog-data">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  View All Posts
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Trophy className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Add Project
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Showcase completed sports court projects with images and
                details. Display your portfolio of pickleball courts and
                facilities.
              </p>
            </div>

            <div className="mt-4">
              <Link to="/projects-admin">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Add New Project
                </Button>
              </Link>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Database className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Projects Data
                </h2>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                View and manage all submitted projects. Review content, delete
                projects, and track your sports facility portfolio.
              </p>
            </div>

            <div className="mt-4">
              <Link to="/projects-data">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Star className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Add Testimonial
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Upload customer testimonials with a name, feedback, cover image
                or playable video, plus an optional Instagram reel link.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/testimonials-admin">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Add New Testimonial
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Database className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Testimonials Data
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                View, edit, and delete testimonial cards in the same card-style
                layout as your project section.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/testimonials-data">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  View Testimonials
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Newspaper className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Add News Feed
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create news feed items with a title, image, and details for
                updates, announcements, and sports activity posts.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/news-admin">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Add News
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Database className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  News Data
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Review, edit, and remove all news feed cards from one admin
                screen.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/news-data">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  View News Feed
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Trophy className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Add Award
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create award items with a title, image logo, and date/year.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/awards-admin">
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  Add Award
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px]">
            <div>
              <div className="flex items-center mb-4">
                <Database className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Awards Data
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Review and delete all awards from one admin screen.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/awards-data">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  View Awards
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border-2 border-green-200 hover:border-green-400 transition-colors flex flex-col justify-between min-h-[320px] md:col-span-2">
            <div>
              <div className="flex items-center mb-4">
                <Mail className="w-7 h-7 text-green-600 mr-3" />
                <h2 className="text-xl md:text-2xl font-semibold text-green-800">
                  Contact Responses
                </h2>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                See every contact form response in a dashboard-style page with
                sender details, messages, dates, and delete controls.
              </p>
            </div>
            <div className="mt-4">
              <Link to="/contact-responses">
                <Button
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  View Contact Responses
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full mx-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">
              Ready to manage your sports content
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-5xl mt-8 md:mt-12 text-center px-4">
        <small className="text-sm text-green-700">
          Copyright owned by GameOn Solutions
        </small>
      </div>
    </div>
  );
};

export default Index;
