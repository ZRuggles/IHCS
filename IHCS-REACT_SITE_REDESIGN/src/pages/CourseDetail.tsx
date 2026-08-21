import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { useCourses } from "../content/hooks";
import {
  EditableCourseText,
  EditableCourseList,
  EditableCourseImage
} from "../editor/EditableField";
import { Clock, Calendar, DollarSign, Award, CheckCircle, ArrowLeft, Heart, Activity, Droplet, Ambulance, PillBottle, Stethoscope, Pill, RefreshCw, Mail, FileText, CreditCard } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { APPLICATION_LINKS, ADMISSION_EMAIL, buildDocumentEmailHref } from "../data/siteInfo";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const parseCurrencyAmount = (value: string) => {
  const numericValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
};
const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  medical: Activity,
  droplet: Droplet,
  ambulance: Ambulance,
  tooth: PillBottle,
  stethoscope: Stethoscope,
  pill: Pill,
  "refresh-cw": RefreshCw,
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const courses = useCourses();
  const course = courses.find((c) => c.id === courseId);

  // NOTE: every Hook below must run on every render (Rules of Hooks), so the
  // "course not found" redirect is returned AFTER all Hooks, not before them.
  // Derived values use optional chaining / fallbacks so they are safe when the
  // course is missing.
  const IconComponent = (course && iconMap[course.icon]) || Heart;
  // Memoize so the array keeps a stable identity across renders. Without this,
  // `?? []` produces a new array every render, which makes the effects below
  // (that list it as a dependency) re-run on every render and loop infinitely
  // — "Maximum update depth exceeded" — freezing the page for courses that have
  // no payment plans.
  const paymentPlans = useMemo(
    () => course?.payments.paymentPlans ?? [],
    [course]
  );
  const hasPaymentPlans = paymentPlans.length > 0;
  const hasFullPayment = Boolean(course?.payments.fullPaymentUrl);
  const documentEmailHref = buildDocumentEmailHref(course?.title);
  const installmentCount = paymentPlans.length;
  const totalCostAmount = course ? parseCurrencyAmount(course.details.cost) : null;
  const installmentAmount =
    totalCostAmount !== null && installmentCount > 0
      ? totalCostAmount / installmentCount
      : null;
  const installmentsStorageKey = `ihcs-installment-clicks-${course?.id ?? "unknown"}`;
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [selectedPlanUrl, setSelectedPlanUrl] = useState<string | null>(
    paymentPlans[0]?.url ?? null
  );
  const [openedInstallmentUrls, setOpenedInstallmentUrls] = useState<string[]>([]);

  const openedInstallmentCount = paymentPlans.filter((plan) =>
    openedInstallmentUrls.includes(plan.url)
  ).length;

  useEffect(() => {
    if (!hasPaymentPlans) {
      setSelectedPlanUrl(null);
      setIsPlanModalOpen(false);
      return;
    }
    setSelectedPlanUrl((currentUrl) =>
      paymentPlans.some((plan) => plan.url === currentUrl)
        ? currentUrl
        : paymentPlans[0].url
    );
  }, [course?.id, hasPaymentPlans, paymentPlans]);

  useEffect(() => {
    if (!hasPaymentPlans) {
      setOpenedInstallmentUrls([]);
      return;
    }

    try {
      const rawValue = window.localStorage.getItem(installmentsStorageKey);
      if (!rawValue) {
        setOpenedInstallmentUrls([]);
        return;
      }
      const parsedValue = JSON.parse(rawValue);
      if (!Array.isArray(parsedValue)) {
        setOpenedInstallmentUrls([]);
        return;
      }

      const validUrls = parsedValue.filter(
        (value): value is string =>
          typeof value === "string" &&
          paymentPlans.some((plan) => plan.url === value)
      );
      setOpenedInstallmentUrls(validUrls);
    } catch {
      setOpenedInstallmentUrls([]);
    }
  }, [hasPaymentPlans, installmentsStorageKey, paymentPlans]);

  useEffect(() => {
    if (!isPlanModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPlanModalOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPlanModalOpen]);

  // All Hooks have run — safe to bail out for an unknown course id.
  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const markInstallmentAsOpened = (planUrl: string) => {
    setOpenedInstallmentUrls((currentUrls) => {
      if (currentUrls.includes(planUrl)) {
        return currentUrls;
      }
      const nextUrls = [...currentUrls, planUrl];
      window.localStorage.setItem(installmentsStorageKey, JSON.stringify(nextUrls));
      return nextUrls;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-white py-10 sm:py-14 lg:py-16 border-b-2 border-[#eee5f5]">
          <div className="max-w-[1600px] mx-auto px-4">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 text-[#561D7E] hover:text-[#461464] mb-8 transition-colors font-medium"
            >
              <ArrowLeft className="size-5" />
              Back to All Programs
            </Link>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div>
                {course.badge && (
                  <div className="inline-block bg-[#ffcc00] text-[#461464] px-4 py-2 rounded-full text-sm mb-4">
                    {course.badge}
                  </div>
                )}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6 leading-tight text-[#101828]">
                  <EditableCourseText
                    courseId={course.courseId}
                    field="title"
                    value={course.title}
                    label="program name"
                  >
                    {course.title}
                  </EditableCourseText>
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed mb-8">
                  <EditableCourseText
                    courseId={course.courseId}
                    field="description"
                    value={course.description}
                    label="short description"
                    multiline
                  >
                    {course.description}
                  </EditableCourseText>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <Clock className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Duration</div>
                    <div className="text-lg font-medium text-[#101828]">
                      <EditableCourseText
                        courseId={course.courseId}
                        field="duration"
                        value={course.duration}
                        label="duration"
                      >
                        {course.duration}
                      </EditableCourseText>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <Calendar className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Next Start</div>
                    <div className="text-lg font-medium text-[#101828]">{course.nextStart}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <DollarSign className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Total Cost</div>
                    <div className="text-lg font-medium text-[#101828]">
                      <EditableCourseText
                        courseId={course.courseId}
                        field="cost"
                        value={course.details.cost}
                        label="tuition price"
                      >
                        {course.details.cost}
                      </EditableCourseText>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <Award className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Certification</div>
                    <div className="text-lg font-medium text-[#101828]">State Approved</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <EditableCourseImage courseId={course.courseId} alt={course.title}>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover aspect-[4/3]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 right-6 bg-white/95 p-4 rounded-2xl shadow-lg">
                    <IconComponent className="size-12 text-[#561D7E]" strokeWidth={2} />
                  </div>
                </div>
                </EditableCourseImage>
              </div>
            </div>
          </div>
        </section>

        {/* Program Overview */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <h2 className="text-3xl font-medium text-[#101828] mb-6">
                  Program Overview
                </h2>
                <p className="text-lg text-[#4a5565] leading-relaxed mb-8">
                  <EditableCourseText
                    courseId={course.courseId}
                    field="overview"
                    value={course.details.overview}
                    label="program overview"
                    multiline
                  >
                    {course.details.overview}
                  </EditableCourseText>
                </p>

                <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                  Curriculum
                </h3>
                <EditableCourseList
                  courseId={course.courseId}
                  field="curriculum"
                  value={course.details.curriculum}
                  label="Curriculum"
                >
                  <div className="space-y-3">
                    {course.details.curriculum.map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <CheckCircle className="size-6 text-[#561D7E] shrink-0 mt-0.5" />
                        <span className="text-[#4a5565] text-lg">{item}</span>
                      </div>
                    ))}
                  </div>
                </EditableCourseList>

                {course.scheduleDates && course.scheduleDates.length > 0 ? (
                  <>
                    <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                      Upcoming Schedule
                    </h3>
                    <div className="bg-[#f7f2fb] border border-[#eee5f5] rounded-xl p-6">
                      <ul className="space-y-3">
                        {course.scheduleDates.map((date) => (
                          <li key={date} className="flex gap-3 items-start">
                            <div className="bg-[#561D7E] rounded-full size-2 mt-2 shrink-0" />
                            <span className="text-[#4a5565]">{date}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}

                <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                  Requirements
                </h3>
                <EditableCourseList
                  courseId={course.courseId}
                  field="requirements"
                  value={course.details.requirements}
                  label="Requirements"
                >
                  <div className="bg-[#f7f2fb] border border-[#eee5f5] rounded-xl p-6">
                    <ul className="space-y-3">
                      {course.details.requirements.map((req, index) => (
                        <li key={index} className="flex gap-3 items-start">
                          <div className="bg-[#561D7E] rounded-full size-2 mt-2 shrink-0" />
                          <span className="text-[#4a5565]">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </EditableCourseList>

                {course.details.tuitionIncludes && course.details.tuitionIncludes.length > 0 ? (
                  <>
                    <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                      Tuition Includes
                    </h3>
                    <div className="bg-[#f7f2fb] border border-[#eee5f5] rounded-xl p-6">
                      <ul className="space-y-3">
                        {course.details.tuitionIncludes.map((item, index) => (
                          <li key={index} className="flex gap-3 items-start">
                            <CheckCircle className="size-5 text-[#561D7E] shrink-0 mt-0.5" />
                            <span className="text-[#4a5565]">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}

                {course.details.additionalNotes && course.details.additionalNotes.length > 0 ? (
                  <>
                    <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                      Additional Information
                    </h3>
                    <div className="bg-[#fffaf0] border border-[#f5e6b8] rounded-xl p-6">
                      <ul className="space-y-3">
                        {course.details.additionalNotes.map((note, index) => (
                          <li key={index} className="flex gap-3 items-start">
                            <div className="bg-[#ffcc00] rounded-full size-2 mt-2 shrink-0" />
                            <span className="text-[#4a5565]">{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : null}

                <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                  Certification
                </h3>
                <div className="bg-gradient-to-br from-[#561D7E] to-[#461464] text-white rounded-xl p-8">
                  <Award className="size-12 mb-4" />
                  <p className="text-lg leading-relaxed">
                    {course.details.certification}
                  </p>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 lg:sticky lg:top-24">
                  <h3 className="text-2xl font-medium text-[#101828] mb-6">
                    Enroll Now
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-[#6a7282]">Duration</span>
                      <span className="font-medium text-[#101828]">{course.duration}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-[#6a7282]">Schedule</span>
                      <span className="font-medium text-[#101828] text-right max-w-[65%]">{course.details.schedule}</span>
                    </div>
                    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                      <span className="text-[#6a7282]">Next Start</span>
                      <span className="font-medium text-[#101828]">{course.nextStart}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[#6a7282]">Total Cost</span>
                      <span className="text-2xl font-bold text-[#561D7E]">{course.details.cost}</span>
                    </div>
                  </div>

                  <a
                    href={APPLICATION_LINKS.schoolApplication}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-[#6b2d94] text-white text-center py-4 rounded-full hover:bg-[#4a1a6d] transition-colors mb-3"
                  >
                    Apply for This Course
                  </a>
                  {/* Enrollment Agreement Forms — temporarily disabled while the Populi flow is confirmed.
                  <a
                    href={APPLICATION_LINKS.enrollmentAgreement}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-white border-2 border-[#6b2d94] text-[#6b2d94] text-center py-3 rounded-full hover:bg-[#eee5f5] transition-colors mb-3"
                  >
                    Enrollment Agreement Forms
                  </a>
                  */}
                  {hasFullPayment ? (
                    <a
                      href={course.payments.fullPaymentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full bg-[#561D7E] text-white text-center py-4 rounded-full hover:bg-[#461464] transition-colors mb-3"
                    >
                      Pay In Full
                    </a>
                  ) : null}
                  {hasPaymentPlans ? (
                    <button
                      type="button"
                      onClick={() => setIsPlanModalOpen(true)}
                      className="block w-full bg-[#eee5f5] text-[#561D7E] text-center py-3 rounded-full hover:bg-[#dfd1eb] transition-colors mb-3"
                    >
                      Choose Payment Plan
                    </button>
                  ) : null}
                  {hasPaymentPlans && installmentAmount !== null ? (
                    <p className="text-xs text-[#6a7282] text-center mb-3">
                      {`Or split into ${installmentCount} payments of ${currencyFormatter.format(installmentAmount)}.`}
                    </p>
                  ) : null}
                  <a
                    href={documentEmailHref}
                    className="flex w-full items-center justify-center gap-2 bg-white border-2 border-[#561D7E] text-[#561D7E] text-center py-3 rounded-full hover:bg-[#eee5f5] transition-colors mb-3"
                  >
                    <Mail className="size-5" />
                    Send Documents by Email
                  </a>
                  <a
                    href="tel:+13369997123"
                    className="block w-full bg-white border-2 border-[#561D7E] text-[#561D7E] text-center py-4 rounded-full hover:bg-[#eee5f5] transition-colors"
                  >
                    Call (336) 999-7123
                  </a>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-[#101828] mb-3">How to Enroll</h4>
                    <ul className="space-y-2 text-sm text-[#6a7282]">
                      <li>- Complete the School Application Form (required for all programs)</li>
                      {hasFullPayment ? (
                        <li>- Pay in full or choose a plan — processed securely through Stripe</li>
                      ) : (
                        <li>- Contact admissions to arrange tuition payment</li>
                      )}
                      <li>
                        - Send any other requested documents to{" "}
                        <a
                          href={documentEmailHref}
                          className="text-[#561D7E] underline break-all"
                        >
                          {ADMISSION_EMAIL}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Enroll */}
        <section className="py-12 sm:py-16 lg:py-20 bg-[#f7f2fb] border-y border-[#eee5f5]">
          <div className="max-w-[1600px] mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-medium text-[#101828] mb-4">
                How to Enroll
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] max-w-2xl mx-auto">
                Three simple steps to get started in the {course.title}.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              {/* Step 1 */}
              <div className="bg-white rounded-2xl border border-[#dfd1eb] p-8 flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-[#561D7E] text-white size-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                    1
                  </div>
                  <FileText className="size-8 text-[#561D7E]" />
                </div>
                <h3 className="text-xl font-medium text-[#101828] mb-2">
                  Complete the Forms
                </h3>
                <p className="text-[#4a5565] mb-6 flex-1">
                  Fill out the <strong>School Application Form</strong>. It is required for all programs.
                </p>
                <div className="flex flex-col gap-3">
                  <a
                    href={APPLICATION_LINKS.schoolApplication}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-[#561D7E] text-white text-center py-3 rounded-full hover:bg-[#461464] transition-colors font-medium"
                  >
                    School Application Form
                  </a>
                  {/* Enrollment Agreement Forms — temporarily disabled while the Populi flow is confirmed.
                  <a
                    href={APPLICATION_LINKS.enrollmentAgreement}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-white border-2 border-[#561D7E] text-[#561D7E] text-center py-3 rounded-full hover:bg-[#eee5f5] transition-colors font-medium"
                  >
                    Enrollment Agreement Forms
                  </a>
                  */}
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-2xl border border-[#dfd1eb] p-8 flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-[#561D7E] text-white size-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                    2
                  </div>
                  <CreditCard className="size-8 text-[#561D7E]" />
                </div>
                <h3 className="text-xl font-medium text-[#101828] mb-2">
                  Pay Your Tuition
                </h3>
                {hasFullPayment ? (
                  <>
                    <p className="text-[#4a5565] mb-6 flex-1">
                      Pay in full or choose a payment plan. All payments are processed
                      securely through <strong>Stripe</strong>.
                    </p>
                    <div className="flex flex-col gap-3">
                      <a
                        href={course.payments.fullPaymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block w-full bg-[#561D7E] text-white text-center py-3 rounded-full hover:bg-[#461464] transition-colors font-medium"
                      >
                        Pay In Full
                      </a>
                      {hasPaymentPlans ? (
                        <button
                          type="button"
                          onClick={() => setIsPlanModalOpen(true)}
                          className="block w-full bg-white border-2 border-[#561D7E] text-[#561D7E] text-center py-3 rounded-full hover:bg-[#eee5f5] transition-colors font-medium"
                        >
                          Choose Payment Plan
                        </button>
                      ) : null}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-[#4a5565] mb-6 flex-1">
                      Contact our admissions team to arrange tuition payment for this program.
                    </p>
                    <a
                      href="tel:+13369997123"
                      className="block w-full bg-[#561D7E] text-white text-center py-3 rounded-full hover:bg-[#461464] transition-colors font-medium"
                    >
                      Call (336) 999-7123
                    </a>
                  </>
                )}
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-2xl border border-[#dfd1eb] p-8 flex flex-col shadow-sm">
                <div className="flex items-center gap-4 mb-5">
                  <div className="bg-[#561D7E] text-white size-12 rounded-full flex items-center justify-center text-xl font-bold shrink-0">
                    3
                  </div>
                  <Mail className="size-8 text-[#561D7E]" />
                </div>
                <h3 className="text-xl font-medium text-[#101828] mb-2">
                  Send Your Documents
                </h3>
                <p className="text-[#4a5565] mb-6 flex-1">
                  Email any other requested documents to{" "}
                  <a href={documentEmailHref} className="text-[#561D7E] underline break-all font-medium">
                    {ADMISSION_EMAIL}
                  </a>
                  . Click below and just attach your files.
                </p>
                <a
                  href={documentEmailHref}
                  className="flex w-full items-center justify-center gap-2 bg-[#561D7E] text-white text-center py-3 rounded-full hover:bg-[#461464] transition-colors font-medium"
                >
                  <Mail className="size-5" />
                  Send Documents by Email
                </a>
              </div>
            </div>

            <p className="text-center text-[#6a7282]">
              Questions about enrolling?{" "}
              <a href="tel:+13369997123" className="text-[#561D7E] font-medium hover:underline">
                Call (336) 999-7123
              </a>{" "}
              and our admissions team will help.
            </p>
          </div>
        </section>

        {/* Related Courses */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-[#f7f2fb]">
          <div className="max-w-[1600px] mx-auto px-4">
            <h2 className="text-3xl font-medium text-[#101828] mb-8">
              Other Programs You Might Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses
                .filter((c) => c.id !== courseId)
                .slice(0, 3)
                .map((relatedCourse) => (
                  <Link
                    key={relatedCourse.id}
                    to={`/courses/${relatedCourse.id}`}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-[#eee5f5] to-[#f7f2fb]">
                      <img
                        src={relatedCourse.image}
                        alt={relatedCourse.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-lg text-[#101828] mb-2">
                      {relatedCourse.title}
                    </h3>
                    <p className="text-[#6a7282] text-sm mb-4">
                      {relatedCourse.duration} | {relatedCourse.nextStart}
                    </p>
                    <div className="text-[#561D7E] text-sm font-medium">
                      Learn More {"->"}
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      {isPlanModalOpen && hasPaymentPlans ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close payment plan selector"
            onClick={() => setIsPlanModalOpen(false)}
            className="absolute inset-0 bg-black/55"
          />

          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-6 mb-5">
              <div>
                <h3 className="text-2xl font-medium text-[#101828]">Choose A Payment Plan</h3>
                <p className="text-[#6a7282] mt-1">
                  Select one plan, then continue to secure Stripe checkout.
                </p>
                {installmentAmount !== null ? (
                  <p className="text-sm text-[#561D7E] mt-2">
                    {`${installmentCount} equal payments of ${currencyFormatter.format(installmentAmount)} (${currencyFormatter.format(totalCostAmount ?? installmentAmount * installmentCount)} total)`}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsPlanModalOpen(false)}
                className="text-sm text-[#561D7E] hover:text-[#461464] font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1 mb-6">
              {paymentPlans.map((plan, index) => {
                const planOptionLabel = `Installment ${index + 1} of ${installmentCount}`;
                const isSelected = selectedPlanUrl === plan.url;
                const isOpened = openedInstallmentUrls.includes(plan.url);

                return (
                  <label
                    key={plan.url}
                    className={`flex gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      isSelected
                        ? "border-[#561D7E] bg-[#eee5f5]"
                        : "border-gray-200 hover:border-[#c6b0d8] hover:bg-[#f7f2fb]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected-payment-plan"
                      className="mt-1 accent-[#561D7E]"
                      checked={isSelected}
                      onChange={() => setSelectedPlanUrl(plan.url)}
                    />
                    <span className="flex flex-col">
                      <span className="font-medium text-[#101828] flex flex-wrap items-center gap-2">
                        <span>{planOptionLabel}</span>
                        {isOpened ? (
                          <span className="text-xs bg-[#daf5e8] text-[#156545] px-2 py-0.5 rounded-full">
                            Opened
                          </span>
                        ) : null}
                      </span>
                      <span className="text-sm text-[#6a7282]">{plan.label}</span>
                    </span>
                  </label>
                );
              })}
            </div>

            <p className="text-xs text-[#6a7282] mb-4">
              {`Opened installments in this browser: ${openedInstallmentCount}/${installmentCount}. This tracks link opens only, not completed Stripe payments.`}
            </p>

            <a
              href={selectedPlanUrl ?? paymentPlans[0].url}
              target="_blank"
              rel="noreferrer"
              onClick={() => {
                if (selectedPlanUrl) {
                  markInstallmentAsOpened(selectedPlanUrl);
                }
                setIsPlanModalOpen(false);
              }}
              className="block w-full bg-[#561D7E] text-white text-center py-4 rounded-full hover:bg-[#461464] transition-colors"
            >
              Continue to Stripe
            </a>
          </div>
        </div>
      ) : null}

      <Footer />
    </div>
  );
}





