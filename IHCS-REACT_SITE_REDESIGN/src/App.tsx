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
import { AdminRoute } from "./editor/AdminRoute";
import { EditorToolbar } from "./editor/EditorToolbar";
import { SetPassword } from "./editor/SetPassword";

const pageTitles: Record<string, string> = {
  "/": "Innovation",
  "/courses": "Innovation - Courses",
  "/services": "Innovation - Services",
  "/employment": "Innovation - Employment",
  "/contact": "Innovation - Contact",
  "/admin": "Website Editor",
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
  const { pathname } = useLocation();
  // The chat widget is for visitors; it would only get in the way while
  // editing, and the admin screen is not a public page.
  const isAdminScreen = pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <PageTitle />
      <EditorToolbar />
      {!isAdminScreen && <AxisChatWidget />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:courseId" element={<CourseDetail />} />
        <Route path="/services" element={<Services />} />
        <Route path="/employment" element={<Employment />} />
        <Route path="/contact" element={<Contact />} />
        {/* Must precede the /admin/* catch-all so a recovery link is not
            swallowed by the sign-in route. */}
        <Route path="/admin/reset" element={<SetPassword />} />
        <Route path="/admin/*" element={<AdminRoute />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
