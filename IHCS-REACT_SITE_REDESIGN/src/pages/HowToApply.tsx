import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ADMISSION_EMAIL } from "../data/siteInfo";

const steps = [
  [
    "Choose your program",
    "Explore programs and select the training that fits your goals.",
  ],
  [
    "Review requirements and schedule",
    "Check prerequisites, class dates, tuition, and required materials on your program page.",
  ],
  [
    "Complete your application",
    "Use the school application in Populi to submit your information.",
  ],
  [
    "Submit required documents",
    "Follow the program-specific submission instructions from Admissions. Contact the team if you need help.",
  ],
  [
    "Pay the application fee",
    "Payment options are in the Populi application. If a fee applies, you'll pay it there.",
  ],
  [
    "Document verification",
    "Admissions reviews your application and documents and contacts you if anything else is needed.",
  ],
  [
    "Receive your next steps",
    "Watch for your acceptance or next-step instructions from Admissions before completing enrollment.",
  ],
];

export default function HowToApply() {
  return (
    <div>
      <Header />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-5xl px-4 py-12 sm:py-16 lg:py-20"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#561D7E]">
          IIHS admissions
        </p>
        <h1 className="mt-3 text-4xl font-medium text-[#28133e]">
          Your path from application to enrollment
        </h1>
        <p className="my-6 max-w-2xl text-lg leading-8 text-gray-600">
          Start with your program’s requirements. These seven steps explain the
          general application journey; Admissions can confirm the requirements
          for your selected course.
        </p>
        <Link
          to="/courses"
          className="font-medium text-[#561D7E] underline underline-offset-4"
        >
          Review programs and requirements →
        </Link>
        <ol className="my-12 space-y-5">
          {steps.map(([title, copy], i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.2) }}
              whileHover={{ y: -3 }}
              className="flex gap-5 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eee5f5] font-semibold text-[#561D7E]">
                {i + 1}
              </span>
              <div>
                <h2 className="text-xl font-medium text-[#28133e]">{title}</h2>
                <p className="mt-2 leading-7 text-gray-600">{copy}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <div className="rounded-2xl bg-[#f8f5fa] p-8">
          <h2 className="text-2xl font-medium text-[#28133e]">
            Ready to take the next step?
          </h2>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              to="?apply=1"
              className="rounded-full bg-[#561D7E] px-6 py-3 text-white"
            >
              Open school application
            </Link>
            <a
              href={`mailto:${ADMISSION_EMAIL}`}
              className="rounded-full border border-[#561D7E]/30 px-6 py-3 text-[#561D7E]"
            >
              Contact Admissions
            </a>
          </div>
        </div>
        <details className="mt-10">
          <summary className="cursor-pointer font-medium text-[#561D7E]">
            View the application guide infographic
          </summary>
          <img
            src="/admissions/application-guide.png"
            alt="Seven-step application guide; an accessible text version appears on this page."
            loading="lazy"
            className="mx-auto mt-6 max-w-full rounded-xl"
          />
        </details>
      </motion.main>
      <Footer />
    </div>
  );
}
