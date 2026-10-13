// Generate a sandboxed, standalone proposal from the actual website components.
// All proposed edits happen in an isolated copy; public pages are untouched.
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';
import react from '@vitejs/plugin-react';
import tailwind from '@tailwindcss/vite';

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(site, 'node_modules/.cache/ihs-proposal');
await mkdir(root, { recursive: true });
await cp(path.join(site, 'src'), path.join(root, 'src'), { recursive: true });
async function edit(file, transform) {
  const target = path.join(root, 'src', file);
  await writeFile(target, transform((await readFile(target, 'utf8')).replaceAll('\r\n', '\n')));
}
function replace(text, from, to) {
  if (!text.includes(from)) throw new Error(`Proposal source changed: ${from.slice(0, 80)}`);
  return text.replaceAll(from, to);
}

const snapshot = await (await fetch('https://innovationhealthcaresolutions.com/content.json')).json();
// Preserve published text except the specific messaging the client asked to revise.
const overrides = {
  'hero.overview': 'Healthcare staffing for facilities and medical offices, compassionate in-home care, and specialized healthcare services. Explore how Innovation Healthcare Solutions can support your family or organization.',
  'pillars.description': 'Supporting people at home, strengthening healthcare teams, and connecting healthcare organizations through strategic partnerships.',
};
await writeFile(path.join(root, 'src/content/hooks.ts'), `
const snapshot = ${JSON.stringify(snapshot)};
const overrides = ${JSON.stringify(overrides)};
export const useCourses = () => snapshot.courses ?? [];
export function useText(page, key, fallback) {
  if(page === 'ihsHome' && overrides[key]) return overrides[key];
  if(page === 'ihsHome' && key.startsWith('pillars.')) return fallback;
  return snapshot.content?.[page]?.[key] || fallback;
}
export function useBlock(page, key, fallback) { return snapshot.content?.[page]?.[key] ?? fallback; }
export function useSetting(key, fallback) { return snapshot.settings?.[key] || fallback; }
`);
await writeFile(path.join(root, 'src/editor/Editable.tsx'), 'export const EditableText = ({children}) => <>{children}</>;');
await writeFile(path.join(root, 'src/editor/EditableCards.tsx'), 'export const EditableCards = ({children}) => <>{children}</>;');
await writeFile(path.join(root, 'src/editor/useEditor.ts'), 'export const useEditor = () => ({isSignedIn:false});');
await edit('data/siteVariant.ts', t => replace(replace(t,
  '{ path: "/services", label: "Care & staffing" }', '{ path: "/services", label: "Services" }'),
  '{ path: "/education", label: "Education" }', '{ path: "/partnerships", label: "Partnerships" }')
  .replace('{ path: "/employment", label: "Careers" },\n      { path: "/partnerships", label: "Partnerships" },', '{ path: "/partnerships", label: "Partnerships" },\n      { path: "/employment", label: "Careers" },'));
await edit('components/Header.tsx', t => replace(replace(t,
  'className={`text-[15px] transition-colors ${',
  'className={`text-[15px] transition-colors ${link.path === "/contact" ? "rounded-full bg-gradient-to-r from-[#d5a641] via-[#f8dd93] to-[#e7be60] px-6 py-3 font-medium text-[#251334]" : ""} ${'),
  'className={`block py-3 px-4 transition-colors ${',
  'className={`block py-3 px-4 transition-colors ${link.path === "/contact" ? "rounded-full bg-[#f6d98b]" : ""} ${'));
await edit('components/Footer.tsx', t => replace(t,
  '{ path: "/education", label: "Healthcare Education" }',
  '{ path: "/services#specialized", label: "Specialized Healthcare Services" }'));
await edit('pages/HealthcareHome.tsx', t => {
  t = replace(t, '{ icon: GraduationCap, title: "Education & Skill Expansion", text: "Connect with IHS about skill-development needs and education-related partnerships.", to: "/education" }',
    '{ icon: Activity, title: "Specialized Healthcare Services", text: "Explore home infusion and specialized nursing foot care with IHS.", to: "/services#specialized" }');
  t = replace(t, '{ icon: Users, title: "Workforce Pipeline Development", text: "Discuss partnerships that connect healthcare talent development with your organization\'s workforce needs.", to: "/education#workforce" }',
    '{ icon: Users, title: "Strategic Partnerships", text: "Connect with IHS about staffing, healthcare services, and collaboration for your organization.", to: "/partnerships" }');
  t = t.replace(/const pillars = \[[\s\S]*?\n\];/, `const pillars = [
  { icon: Activity, title: "Healthcare Staffing Solutions", text: "Explore staffing support for healthcare facilities, medical offices, and organizations.", to: "/services#staffing" },
  { icon: Heart, title: "Quality In-Home Care", text: "Find compassionate home assistance and personal care for individuals and families.", to: "/services#in-home" },
  { icon: Users, title: "Strategic Healthcare Partnerships", text: "Connect with IHS about healthcare services, staffing, and collaboration for your organization.", to: "/partnerships" },
  { icon: Activity, title: "Specialized Healthcare Services", text: "Explore home infusion and specialized nursing foot care with IHS.", to: "/services#specialized" },
];`);
  t = replace(t, '<Link to="/services" className="group flex h-full flex-col rounded-2xl', '<Link to={({ "Home assistance": "/services#in-home", "Personal care": "/services#in-home", "Healthcare staffing": "/services#staffing", "Specialty services": "/services#specialized" })[title]} className="group flex h-full flex-col rounded-2xl');
  t = replace(t, 'Explore this pillar', 'Learn more');
  t = replace(t, 'to="/contact?interest=partnership"', 'to="/partnerships"');
  t = replace(t, 'text: "Partner With IHS", to: "/contact?interest=partnership"', 'text: "Partner With IHS", to: "/partnerships"');
  const start = t.indexOf('        <section className="border-y border-[#e8dfd1] bg-white py-10">');
  const end = t.indexOf('        </section>', start) + '        </section>'.length;
  if(start < 0 || end < start) throw new Error('Missing home partnership strip');
  t = t.slice(0, start) + t.slice(start, end)
    .replace('Education, skills & workforce partnerships', 'Strategic partnerships')
    .replace("Connect with IHS about your organization's needs, or explore IIHS as a separate educational institution.", 'Connect with IHS about healthcare staffing, service collaboration, and your organization’s goals.')
    .replace('to="/education"', 'to="/partnerships"').replace('Explore education', 'Explore partnerships') + t.slice(end);
  return t;
});
await edit('pages/Contact.tsx', t => {
  t = replace(t, '        { value: "education-workforce", label: "Education & Workforce Partnerships" },', '        { value: "specialized", label: "Specialized Healthcare Services" },');
  t = replace(t, 'Use Education to discuss IHS education and workforce partnerships. For school programs and admissions, Innovation Institute of Healthcare Solutions (IIHS) is a separate educational institution with its own application and student portal.', 'Innovation Institute of Healthcare Solutions (IIHS) is a separate educational institution. Visit the IIHS website for school programs and admissions.');
  t = t.replace(/    window.location.href = `mailto:.*?;\r?\n/, '    // Preview only: keep the complete form but never send an inquiry.\n');
  t = replace(t, 'Your message is ready. Send the draft in your email app to', 'This is a design preview. No inquiry was sent to');
  t = t.replace(/<iframe\s+title="Innovation Healthcare Solutions Location"[\s\S]*?\/>/, '<div className="flex h-full items-center justify-center bg-[#f7f2fb] p-6 text-center text-[#561D7E]">609 Peters Creek Parkway · Winston Salem, NC 27103<br/>Interactive map is inactive in this private preview.</div>');
  return t;
});
await edit('pages/Services.tsx', t => {
  // Keep all detailed lists and specialty interactions. Move staffing into its own group.
  t = replace(t, 'const defaultSpecialtyImage = specialtyServices[0].backgroundImage;', 'const specialized = specialtyServices.filter(s => !/staffing/i.test(s.title));\n  const staffing = specialtyServices.find(s => /staffing/i.test(s.title));\n  const defaultSpecialtyImage = specialized[0]?.backgroundImage || "/Home Infusion.jpeg";');
  t = replace(t, 'Home Care Services\n                </div>', 'Healthcare Services\n                </div>');
  t = replace(t, 'Compassionate Care in the Comfort of Home', 'Care for Your Family. Staffing for Your Team.');
  t = replace(t, "Innovation Home Care Agency provides comprehensive in-home care services throughout Winston-Salem, North Carolina. We're dedicated to helping patients maintain independence and quality of life with one point of contact for all your care needs.", 'Explore healthcare staffing for facilities and medical offices, quality in-home care, and specialized healthcare services. Find detailed information below about the support IHS offers.');
  const marker = '        {/* Our Promise */}';
  t = replace(t, marker, `<section id="staffing" className="scroll-mt-40 bg-[#f7f2fb] py-12 sm:py-20"><div className="mx-auto max-w-[1600px] px-4"><div className="grid items-center gap-10 lg:grid-cols-2"><motion.img initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} src="/Supplemental Staffing.jpeg" alt="Healthcare staffing team" className="w-full rounded-3xl shadow-xl"/><div><h2 className="mb-6 text-3xl font-medium text-[#101828] sm:text-4xl">Healthcare Staffing Solutions</h2><p className="mb-6 text-lg leading-8 text-[#4a5565]">{staffing?.description || "Staffing support for healthcare facilities, medical offices, and organizations seeking RNs, LPNs, CNAs, and patient sitters."}</p><ul className="mb-8 grid gap-3 sm:grid-cols-2">{(staffing?.features || ["Registered Nurses (RN)","Licensed Practical Nurses (LPN)","Certified Nursing Assistants (CNA)","Patient sitters"]).map(role => <li key={role} className="flex gap-3 text-[#4a5565]"><CheckCircle className="size-5 shrink-0 text-[#561D7E]"/>{role}</li>)}</ul><p className="mb-6 leading-7 text-[#4a5565]">Tell us about your facility, the roles you need, and your scheduling priorities. Our team can discuss available support for your organization.</p><a href="/contact?interest=staffing" className="inline-block rounded-full bg-[#561D7E] px-7 py-4 text-white">Discuss Staffing Needs</a></div></div></div></section><section id="in-home" className="scroll-mt-40 bg-white px-4 pt-14 text-center"><h2 className="text-3xl font-medium text-[#101828] sm:text-4xl">Quality In-Home Care</h2><p className="mx-auto mt-5 max-w-2xl leading-8 text-[#4a5565]">The same home assistance and personal care services, organized together below.</p></section>\n${marker}`);
  t = replace(t, '{specialtyServices.map((service, index) => {', '{specialized.map((service, index) => {');
  t = replace(t, 'The same home assistance and personal care services, organized together below.', 'Compassionate home assistance and personal care to support independence, dignity, and everyday life.');
  t = replace(t, 'Specialty Healthcare Services', 'Specialized Healthcare Services');
  t = replace(t, '<section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden">', '<section id="specialized" className="relative scroll-mt-40 py-12 sm:py-16 lg:py-20 overflow-hidden">');
  t = replace(t, 'className="grid grid-cols-1 lg:grid-cols-3 gap-8"', 'className="grid grid-cols-1 lg:grid-cols-2 gap-8"');
  return t;
});
// Reuse the existing Education page styling for its replacement, not a new design system.
await edit('pages/EducationGateway.tsx', t => {
  const body = t.indexOf('  return (\n    <div', t.indexOf('export default function'));
  t = t.slice(0, t.indexOf('  const { pathname')) + t.slice(body);
  const schoolStart = t.indexOf('        <section className="bg-[#f7f2fb] py-14 sm:py-20">');
  const schoolEnd = t.indexOf('        </section>', schoolStart) + '        </section>'.length;
  t = t.slice(0, schoolStart) + t.slice(schoolEnd);
  t = t.replaceAll('Education, skills & <span className="text-[#6b2d94]">workforce partnerships</span>', 'Strategic Healthcare <span className="text-[#6b2d94]">Partnerships</span>');
  t = t.replaceAll('Education & Skill Expansion and Workforce Pipeline Development are two of IHS\'s four pillars. Talk with our team about education-related services, skill-development needs, and workforce partnerships for your healthcare organization.', 'Connect with IHS about healthcare staffing, in-home care, specialized services, and collaboration opportunities for your organization. Partnership descriptions are proposed for review.');
  t = t.replaceAll('/contact?interest=education-workforce', '/contact?interest=partnership').replaceAll('Discuss your education needs', 'Discuss a partnership');
  t = t.replaceAll('Share the skills you want to develop, the workforce needs you are planning for, and the type of partnership you have in mind.', 'Share your service priorities, staffing needs, and the type of collaboration you have in mind.');
  t = t.replaceAll('Education and skill-development priorities', 'Healthcare service priorities').replaceAll('Collaboration with education partners', 'Care and business collaboration');
  t = t.replaceAll('Education & Skill Expansion', 'Healthcare Service Partnerships').replaceAll('Workforce Pipeline Development', 'Staffing & Workforce Partnerships');
  t = t.replaceAll("Connect with IHS about your team's learning objectives and skill-development priorities. Our team can discuss education-related services and partnership opportunities relevant to your needs.", 'Discuss collaboration around in-home care, specialized services, and connections between healthcare organizations. Specific partnership offerings will be confirmed with IHS.');
  t = t.replaceAll("Bring your organization's workforce needs into the conversation. Discuss how education partnerships, talent development, and healthcare staffing could support your workforce plans.", 'Discuss the roles, schedules, and staffing priorities of your facility or medical office. Explore how IHS could support your workforce needs.');
  t = t.replaceAll('your education, workforce, or staffing priorities', 'your healthcare service or staffing priorities');
  t = t.replace('useText("ihsEducation", contentKey, fallback)', 'fallback');
  return t;
});
await writeFile(path.join(root, 'src/main.tsx'), `
import {useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {MemoryRouter,Routes,Route,useLocation,useNavigate} from 'react-router-dom';
import {MotionConfig} from 'motion/react';
import Home from './pages/HealthcareHome';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Careers from './pages/Employment';
import Partnerships from './pages/EducationGateway';
import './index.css';
function Navigation(){const location=useLocation();const navigate=useNavigate();
useEffect(()=>{window.scrollTo(0,0);if(location.hash)requestAnimationFrame(()=>document.getElementById(location.hash.slice(1))?.scrollIntoView());},[location]);
useEffect(()=>{function click(e){const a=e.target.closest('a');if(!a)return;const href=a.getAttribute('href');if(href?.startsWith('/')){e.preventDefault();navigate(href);}else if(href?.startsWith('#')&&href.length>1){e.preventDefault();document.getElementById(href.slice(1))?.scrollIntoView();}else{e.preventDefault();}}
document.addEventListener('click',click);return()=>document.removeEventListener('click',click);},[navigate]);return null;}
function Notes(){return <div className="bg-[#f7f2fb] p-6 text-sm leading-7 text-[#4a5565]"><details><summary className="cursor-pointer font-medium text-[#561D7E]">Proposal scope, sitemap & open questions</summary><p className="mt-4">Keep the existing site design, animations, service details, careers layout, and complete sticky contact form. Proposed navigation: Home · Services · Partnerships · Careers · Contact. Services groups: Healthcare Staffing Solutions · Quality In-Home Care · Specialized Healthcare Services. Partnerships replaces Education; IIHS remains separate.</p><p className="mt-3">The homepage uses the four IHS pillars confirmed by Jim: Healthcare Staffing Solutions, Quality In-Home Care, Strategic Healthcare Partnerships, and Specialized Healthcare Services. Please confirm service coverage, staffing roles, partnership descriptions, contact information, and inquiry recipients.</p><p className="mt-3">Estimated implementation: 3–5 working days after content and direction approval, excluding new integrations. Preview forms and external links are inactive.</p></details></div>;}
createRoot(document.getElementById('root')).render(<MemoryRouter><MotionConfig reducedMotion="user"><Navigation/><Routes><Route path="/" element={<Home/>}/><Route path="/services" element={<Services/>}/><Route path="/partnerships" element={<Partnerships/>}/><Route path="/employment" element={<Careers/>}/><Route path="/contact" element={<Contact/>}/></Routes><Notes/></MotionConfig></MemoryRouter>);
`);
await edit('index.css', t => t + '\n@source "./";\n');
await writeFile(path.join(root, 'index.html'), '<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IHS — existing design with proposed edits</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>');
const result = await build({ configFile:false, root, publicDir:false, plugins:[react(),tailwind()], define:{'import.meta.env.VITE_SITE_VARIANT':'"ihs"','import.meta.env.VITE_SCHOOL_SITE_URL':'"https://innovationinstituteofhealthcaresolutions.com"'}, build:{write:false,cssCodeSplit:false,minify:true,rolldownOptions:{output:{codeSplitting:false}}} });
const outputs = (Array.isArray(result) ? result : [result]).flatMap(r => r.output);
const js = outputs.filter(o => o.type === 'chunk').map(o => o.code).join('\n').replaceAll('</script', '<\\/script');
const css = outputs.filter(o => o.fileName.endsWith('.css')).map(o => o.source).join('\n');
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>IHS proposal</title><style>'+css+'</style></head><body><div id="root"></div><script>'+js+'</script></body></html>';
await writeFile(path.resolve(site,'../ihcs-editor-api/src/lib/ihsProposal.ts'), '// Generated by scripts/build-ihs-proposal.mjs from the current site.\nexport const ihsProposal = '+JSON.stringify(html)+';\n');
await mkdir(path.resolve(site,'../tmp/client-proposal'), {recursive:true});
await writeFile(path.resolve(site,'../tmp/client-proposal/IHS-client-proposal.html'),html);
console.log(`Generated ${html.length} character private proposal.`);
