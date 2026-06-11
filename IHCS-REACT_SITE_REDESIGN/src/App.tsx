import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Services from "./pages/Services";
import Employment from "./pages/Employment";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AxisChatWidget from "./components/AxisChatWidget";

const pageTitles: Record<string, string> = {
  "/": "Innovation",
  "/courses": "Innovation - Courses",
  "/services": "Innovation - Services",
  "/employment": "Innovation - Employment",
  "/contact": "Innovation - Contact",
};

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function PageTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const base = pathname.startsWith("/courses/") ? "Innovation - Courses" : pageTitles[pathname];
    document.title = base ?? "Innovation";
  }, [pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <PageTitle />
      <AxisChatWidget />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/employment" element={<Employment />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
