import clsx, { ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
import { z } from "zod";

const COMMON_UNITS = ["small", "medium", "large"];
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      opacity: ["disabled"],
      spacing: ["divider"],
      borderWidth: COMMON_UNITS,
      borderRadius: COMMON_UNITS,
    },
    classGroups: {
      shadow: [{ shadow: COMMON_UNITS }],
      "font-size": [{ text: ["tiny", ...COMMON_UNITS] }],
      "bg-image": ["bg-stripe-gradient"],
    },
  },
});

export const cn = (...inputs: Array<ClassValue>) => {
  return twMerge(clsx(inputs));
};

export const nonBacktickedString = z
  .string()
  .refine((val) => !val.startsWith("```") && !val.endsWith("```"), {
    message: "The string shouldn't start or end with backticks",
  });
