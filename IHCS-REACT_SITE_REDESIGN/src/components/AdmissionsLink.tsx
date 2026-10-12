import { Link } from "react-router-dom";

export function AdmissionsLink() {
  return (
    <div className="border-b border-[#561D7E]/10 bg-[#f8f5fa] px-4 py-3 text-center text-sm text-gray-600">
      Planning your next step?{" "}
      <Link
        to="/how-to-apply"
        className="font-medium text-[#561D7E] underline underline-offset-4"
      >
        Follow our seven-step application guide →
      </Link>
    </div>
  );
}
