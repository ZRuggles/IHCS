import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { courses } from "../data/courses";
import { Clock, Calendar, DollarSign, Award, CheckCircle, ArrowLeft, Heart, Activity, Droplet, Ambulance, PillBottle, Stethoscope, Pill, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2
});

const parseCurrencyAmount = (value: string) => {
  const numericValue = Number.parseFloat(value.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : null;
};
const COURSE_APPLICATION_URL = "https://www.hovn.app/innovation-healthcare-solutions";

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
  const course = courses.find((c) => c.id === courseId);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  const IconComponent = iconMap[course.icon] || Heart;
  const paymentPlans = course.payments.paymentPlans ?? [];
  const hasPaymentPlans = paymentPlans.length > 0;
  const installmentCount = paymentPlans.length;
  const totalCostAmount = parseCurrencyAmount(course.details.cost);
  const installmentAmount =
    totalCostAmount !== null && installmentCount > 0
      ? totalCostAmount / installmentCount
      : null;
  const installmentsStorageKey = `ihcs-installment-clicks-${course.id}`;
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
  }, [course.id, hasPaymentPlans, paymentPlans]);

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
                  {course.title}
                </h1>
                <p className="text-base sm:text-lg lg:text-xl text-[#4a5565] leading-relaxed mb-8">
                  {course.description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <Clock className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Duration</div>
                    <div className="text-lg font-medium text-[#101828]">{course.duration}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <Calendar className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Next Start</div>
                    <div className="text-lg font-medium text-[#101828]">{course.nextStart}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <DollarSign className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Total Cost</div>
                    <div className="text-lg font-medium text-[#101828]">{course.details.cost}</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#eee5f5] to-white border border-[#eee5f5] p-4 rounded-xl">
                    <Award className="size-6 text-[#561D7E] mb-2" />
                    <div className="text-sm text-[#6a7282]">Certification</div>
                    <div className="text-lg font-medium text-[#101828]">State Approved</div>
                  </div>
                </div>
              </div>
              <div className="relative">
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
                  {course.details.overview}
                </p>

                <h3 className="text-2xl font-medium text-[#101828] mb-4 mt-12">
                  Curriculum
                </h3>
                <div className="space-y-3">
                  {course.details.curriculum.map((item, index) => (
                    <div key={index} className="flex gap-3 items-start">
                      <CheckCircle className="size-6 text-[#561D7E] shrink-0 mt-0.5" />
                      <span className="text-[#4a5565] text-lg">{item}</span>
                    </div>
                  ))}
                </div>

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
                    href={COURSE_APPLICATION_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-[#6b2d94] text-white text-center py-4 rounded-full hover:bg-[#4a1a6d] transition-colors mb-3"
                  >
                    Apply for This Course
                  </a>
                  <a
                    href={course.payments.fullPaymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full bg-[#561D7E] text-white text-center py-4 rounded-full hover:bg-[#461464] transition-colors mb-3"
                  >
                    Pay In Full
                  </a>
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
                    href="tel:+13369997123"
                    className="block w-full bg-white border-2 border-[#561D7E] text-[#561D7E] text-center py-4 rounded-full hover:bg-[#eee5f5] transition-colors"
                  >
                    Call (336) 999-7123
                  </a>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-[#101828] mb-3">Payment Notes</h4>
                    <ul className="space-y-2 text-sm text-[#6a7282]">
                      <li>- Payments are processed securely through Stripe</li>
                      <li>- Choose full payment or select a plan in the payment modal</li>
                      <li>- Contact us if you need enrollment or billing support</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
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





