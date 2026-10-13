import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import HealthcareHome from "./pages/HealthcareHome";
import HowToApply from "./pages/HowToApply";
import StudentResources from "./pages/StudentResources";
import Contact from "./pages/Contact";
import EducationGateway from "./pages/EducationGateway";
import { isSchoolSite, siteBrand } from "./data/siteVariant";
import Courses from "./pages/Courses";
import CourseDetail from "./pages/CourseDetail";
import Services from "./pages/Services";
import Employment from "./pages/Employment";
import NotFound from "./pages/NotFound";
// Axis chat widget disabled — uncomment this import, the isAdminScreen
// const in App(), and the render line below to bring the widget back.
// import AxisChatWidget from "./components/AxisChatWidget";
import { AdminRoute } from "./editor/AdminRoute";
import { EditorToolbar } from "./editor/EditorToolbar";
import { SetPassword } from "./editor/SetPassword";
import DesignReview from "./pages/DesignReview";

const pageTitles: Record<string, string> = {
  "/": "Innovation",
  "/courses": "Innovation - Courses",
  "/services": "Innovation - Services",
  "/employment": "Innovation - Employment",
  "/contact": "Innovation - Contact",
  "/how-to-apply": "Innovation - How to Apply",
  "/student-resources": "Innovation - Student Resources",
  "/education": "Innovation - Healthcare Education",
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
    const base = pathname === "/review" || pathname.startsWith("/review/")
      ? "Design Review"
      : pathname.startsWith("/courses/")
      ? "Innovation - Courses"
      : pageTitles[pathname];
    document.title = `${base === "Innovation" ? "Home" : (base?.replace("Innovation - ", "") ?? "Explore")} | ${siteBrand.name}`;
  }, [pathname]);

  return null;
}

function App() {
  const { pathname } = useLocation();
  // The chat widget is for visitors; it would only get in the way while
  // editing, and the admin screen is not a public page.
  // const { pathname } = useLocation();
  // const isAdminScreen = pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      <PageTitle />
      {!(pathname === "/review" || pathname.startsWith("/review/")) && <EditorToolbar />}
      {/* {!isAdminScreen && <AxisChatWidget />} */}
      <Routes>
        <Route path="/review" element={<DesignReview />} />
        <Route path="/review/:previewId" element={<DesignReview />} />
        <Route path="/" element={isSchoolSite ? <Home /> : <HealthcareHome />} />
        <Route
          path="/courses"
          element={isSchoolSite ? <Courses /> : <EducationGateway />}
        />
        <Route
          path="/courses/:courseId"
          element={isSchoolSite ? <CourseDetail /> : <EducationGateway />}
        />
        <Route
          path="/how-to-apply"
          element={isSchoolSite ? <HowToApply /> : <EducationGateway />}
        />
        <Route
          path="/student-resources"
          element={
            isSchoolSite ? <StudentResources /> : <EducationGateway />
          }
        />
        <Route path="/education" element={<EducationGateway />} />
        {!isSchoolSite && <Route path="/services" element={<Services />} />}
        {!isSchoolSite && <Route path="/employment" element={<Employment />} />}
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
