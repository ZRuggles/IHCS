import { Link } from "react-router-dom";
import { Heart, Activity, Droplet, Ambulance, PillBottle, Stethoscope, Pill, RefreshCw } from "lucide-react";

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  duration: string;
  nextStart: string;
  image: string;
  badge?: string;
  icon?: string;
}

const iconMap: Record<string, any> = {
  heart: Heart,
  medical: Activity,
  droplet: Droplet,
  ambulance: Ambulance,
  tooth: PillBottle,
  stethoscope: Stethoscope,
  pill: Pill,
  "refresh-cw": RefreshCw,
};

export function CourseCard({
  id,
  title,
  description,
  duration,
  nextStart,
  image,
  badge,
  icon = "heart",
}: CourseCardProps) {
  const IconComponent = iconMap[icon] || Heart;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#f3e8ff] to-[#faf5ff]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        
        {/* Icon Badge */}
        <div className="absolute bottom-4 right-4 bg-white/95 p-3 rounded-2xl">
          <IconComponent className="size-6 text-[#561D7E]" strokeWidth={2} />
        </div>

        {/* Badge */}
        {badge && (
          <div className="absolute top-4 left-4 bg-[#ffb71b] text-[#461464] px-3 py-1 rounded-full text-sm shadow-lg">
            {badge}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-7">
        <h3 className="font-medium text-xl text-[#101828] mb-2">
          {title}
        </h3>
        <p className="text-[#4a5565] text-base leading-relaxed mb-6 min-h-[52px]">
          {description}
        </p>

        {/* Info Grid */}
        <div className="border-t border-[#f3f4f6] pt-4 pb-6 flex justify-between items-center">
          <div>
            <p className="text-sm text-[#6a7282]">Duration</p>
            <p className="text-base text-[#561D7E] font-normal">{duration}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[#6a7282]">Next Start</p>
            <p className="text-base text-[#561D7E] font-normal">{nextStart}</p>
          </div>
        </div>

        {/* Button */}
        <Link
          to={`/courses/${id}`}
          className="block w-full bg-[#561D7E] text-white text-center py-3 rounded-full hover:bg-[#461464] transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
