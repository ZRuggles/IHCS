import { motion, useReducedMotion } from "motion/react";

/** A single light pass on entry, with no looping or pointer interaction. */
export function BrandShine() {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <motion.div
        className="absolute -inset-y-10 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-150%" }}
        whileInView={{ x: "450%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}
