"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 }
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  immediate = false
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /**
   * Render without the reveal, as plain markup.
   *
   * Set this on anything inside the first viewport — above all on whatever the
   * browser picks as the Largest Contentful Paint element. framer-motion
   * serialises the `hidden` variant into the server HTML, so a revealed element
   * ships as `opacity:0` and physically cannot paint until the bundle has
   * downloaded, parsed, hydrated and run an IntersectionObserver. Below the fold
   * that is invisible to the user and to Lighthouse; on the hero it *is* the
   * Largest Contentful Paint, and it measured 4.2s on a throttled phone.
   */
  immediate?: boolean;
}) {
  if (immediate) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.08
          }
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={variants}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
