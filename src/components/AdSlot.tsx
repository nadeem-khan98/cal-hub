import React from "react";

export default function AdSlot({ position = "default" }: { position?: string }) {
  return (
    <div 
      className="w-full min-h-[90px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 p-4 my-8"
      aria-hidden="true"
    >
      Ad Placeholder ({position})
    </div>
  );
}
