export const isSchoolSite = import.meta.env.VITE_SITE_VARIANT === "school";

function siteUrl(value: string | undefined): string {
  if (!value?.trim()) return "";
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.origin : "";
  } catch {
    return "";
  }
}

export const schoolSiteUrl = siteUrl(import.meta.env.VITE_SCHOOL_SITE_URL);
export const ihsSiteUrl =
  siteUrl(import.meta.env.VITE_IHS_SITE_URL) ||
  "https://innovationhealthcaresolutions.com";
export const siteBrand = isSchoolSite
  ? {
      name: "Innovation Institute of Healthcare Solutions",
      shortName: "IIHS",
      logo: "/brands/iihs-logo.png",
      description:
        "Healthcare education, training, and career development in Winston-Salem, North Carolina.",
    }
  : {
      name: "Innovation Healthcare Solutions",
      shortName: "IHS",
      logo: "/brands/ihs-logo.png",
      description:
        "Home care services and healthcare staffing in Winston-Salem, North Carolina.",
    };
export const siteNavigation = isSchoolSite
  ? [
      { path: "/", label: "Home" },
      { path: "/courses", label: "Programs" },
      { path: "/how-to-apply", label: "Admissions" },
      { path: "/student-resources", label: "Student resources" },
      { path: "/contact", label: "Contact" },
    ]
  : [
      { path: "/", label: "Home" },
      { path: "/services", label: "Care & staffing" },
      { path: "/employment", label: "Careers" },
      { path: "/education", label: "Education" },
      { path: "/contact", label: "Contact" },
    ];
