/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/SiteCraft/ui/input";
import { CategoryLayoutItems } from "./categoryLayoutItems";
import { CategoryCustomizationAttributes } from "@/lib/customization";
import { useState } from "react";

interface RenderCategorySectionProps {
  detailedSectionTab: string;
  categoryAttributes: CategoryCustomizationAttributes;
  updateCategoryAttributes: (
    updates: Partial<CategoryCustomizationAttributes>
  ) => void;
  onDeleteSection?: () => void;
}

export function RenderCategorySection({
  detailedSectionTab,
  categoryAttributes,
  updateCategoryAttributes,
  onDeleteSection,
}: RenderCategorySectionProps) {
  const [expandedSections, setExpandedSections] = useState<{ title: boolean }>({
    title: false,
  });

  const toggleSection = (section: "title") => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle layout selection and update template
  const handleLayoutSelection = (layoutId: number) => {
    const templateNames = [
      "grid-template",
      "list-view-template",
      "featured-grid-template",
      "horizontal-scroll-template",
    ];
    const templateName = templateNames[layoutId - 1] || "grid-template";
    updateCategoryAttributes({ template: templateName });
  };

  return (
    <div className="flex flex-col h-full w-full min-h-0">
      {detailedSectionTab === "content" ? (
        <div className="flex flex-col flex-1 min-h-0 p-4">
          <div className="space-y-8 flex-1 min-h-0 overflow-y-auto">
            <div className="space-y-1">
              <h1 className="text-lg font-semibold tracking-tight">
                Categories
              </h1>
              {/* You can add category list editing here */}
            </div>
          </div>
          <div className="pt-8 flex justify-start">
            {onDeleteSection && (
              <button
                className="flex justify-start items-center w-full gap-2 px-4 py-2 text-[#FF0000] border-t border-t-[#FF0000] hover:bg-red-100 transition"
                onClick={onDeleteSection}
              >
                Delete Section
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-6 flex-1 min-h-0 overflow-y-auto">
          <CategoryLayoutItems
            selectedLayout={
              [
                "grid-template",
                "list-view-template",
                "featured-grid-template",
                "horizontal-scroll-template",
              ].indexOf(categoryAttributes.template) + 1
            }
            onLayoutSelect={handleLayoutSelection}
          />
          {/* Title Section */}
          <div className="flex items-center">
            <button
              className="flex-1 flex items-center justify-between text-left"
              onClick={() => toggleSection("title")}
            >
              <span className="font-medium">Title</span>
            </button>
          </div>
          {expandedSections.title && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Title</label>
                <Input
                  value={categoryAttributes.title}
                  onChange={(e) =>
                    updateCategoryAttributes({ title: e.target.value })
                  }
                  className="w-full bg-background"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
