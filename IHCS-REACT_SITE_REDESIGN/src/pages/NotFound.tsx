import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-white to-[#f7f2fb] py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-[#eee5f5] text-[#6b2d94] size-24 rounded-full flex items-center justify-center text-2xl sm:text-3xl lg:text-4xl font-bold mx-auto mb-8">
            404
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium text-[#101828] mb-6">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] mb-8 leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 bg-[#6b2d94] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#4a1a6d] transition-colors"
            >
              <Home className="size-5" />
              Go to Homepage
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 bg-white border-2 border-[#6b2d94] text-[#6b2d94] px-5 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-[#eee5f5] transition-colors"
            >
              <ArrowLeft className="size-5" />
              Go Back
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}





