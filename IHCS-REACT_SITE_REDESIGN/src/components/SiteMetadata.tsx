import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isSchoolSite, ihsSiteUrl, schoolSiteUrl, siteBrand } from "../data/siteVariant";

const ihsDescriptions: Record<string, string> = {
  "/": "Home care, personal care, healthcare staffing, and workforce support from Innovation Healthcare Solutions in Winston-Salem, North Carolina.",
  "/services": "Explore home assistance, personal care, specialty support, and healthcare staffing services in Winston-Salem, North Carolina.",
  "/employment": "Explore careers with Innovation Healthcare Solutions and join a team committed to compassionate care and healthcare support.",
  "/education": "Connect with Innovation Healthcare Solutions about education, skill expansion, and healthcare workforce partnerships.",
  "/contact": "Contact Innovation Healthcare Solutions for home care, personal care, healthcare staffing, or partnership support.",
};

const schoolDescriptions: Record<string, string> = {
  "/": "Healthcare education, training programs, and career development from Innovation Institute of Healthcare Solutions in Winston-Salem, North Carolina.",
  "/courses": "Explore healthcare training programs from Innovation Institute of Healthcare Solutions in Winston-Salem, North Carolina.",
  "/how-to-apply": "Follow the seven-step application process for Innovation Institute of Healthcare Solutions programs.",
  "/student-resources": "Student resources, admissions support, and next steps from Innovation Institute of Healthcare Solutions.",
  "/contact": "Contact Admissions at Innovation Institute of Healthcare Solutions for help with programs and enrollment.",
};

function upsertMeta(name: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.name = name;
    document.head.appendChild(element);
  }
  element.content = content;
}

function upsertCanonical(href: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!element) {
    element = document.createElement("link");
    element.rel = "canonical";
    document.head.appendChild(element);
  }
  element.href = href;
}

export function SiteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    const descriptions = isSchoolSite ? schoolDescriptions : ihsDescriptions;
    const description = pathname.startsWith("/courses/")
      ? "Explore program details, requirements, schedules, tuition, and application steps at Innovation Institute of Healthcare Solutions."
      : descriptions[pathname] ?? siteBrand.description;
    const origin = isSchoolSite ? schoolSiteUrl : ihsSiteUrl;

    document.documentElement.lang = "en";
    upsertMeta("description", description);
    upsertCanonical(`${origin}${pathname}`);

    const schemaId = "ihs-local-business-schema";
    document.getElementById(schemaId)?.remove();
    if (!isSchoolSite) {
      const schema = document.createElement("script");
      schema.id = schemaId;
      schema.type = "application/ld+json";
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        name: "Innovation Healthcare Solutions Enterprise, Inc.",
        url: ihsSiteUrl,
        telephone: "+1-336-999-7123",
        email: "contact@innovationhealthcaresolutions.com",
        address: {
          "@type": "PostalAddress",
          streetAddress: "609 Peters Creek Parkway",
          addressLocality: "Winston-Salem",
          addressRegion: "NC",
          postalCode: "27103",
          addressCountry: "US",
        },
        sameAs: [
          "https://www.facebook.com/share/1JZceNDsCH/",
          "https://www.linkedin.com/company/innovation-healthcare-solutions-enterprise-inc/",
        ],
      });
      document.head.appendChild(schema);
    }
  }, [pathname]);

  return null;
}
