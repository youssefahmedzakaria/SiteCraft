"use client";
import React, { useState, useRef, DragEvent } from "react";
import {
  ChevronDown,
  ChevronRight,
  Paintbrush,
  Menu,
  X,
  GripVertical,
  ArrowLeft,
} from "lucide-react";
import { RenderPromoSection } from "./renderPromoSction";
import { RenderHeaderSection } from "./renderHeaderSection";

interface Section {
  id: string;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
}

export function Sidebar() {
  // Define sections in an array to make them orderable
  const [sections, setSections] = useState<Section[]>([
    {
      id: "Header&Menu",
      title: "Header & Menu",
      icon: <Paintbrush size={18} />,
      expanded: false,
    },
    {
      id: "PromoSlider",
      title: "Promo Slider",
      icon: <GripVertical size={18} />,
      expanded: false,
    },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(
    null
  );

  // New state for the detailed section view
  const [detailedSection, setDetailedSection] = useState<Section | null>(null);
  const [detailedSectionTab, setDetailedSectionTab] = useState<
    "content" | "design"
  >("content");

  // Reference for section DOM elements
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // New function to open detailed section view
  const openDetailedSection = (section: Section) => {
    setDetailedSection(section);
    setDetailedSectionTab("content");
  };

  // Modified section to make the entire section clickable
  const toggleSection = (sectionId: string) => {
    // For Header&Menu section, instead of toggling expansion, open the detailed view
    const section = sections.find((s) => s.id === sectionId);
    if (section) {
      // Toggle expansion
      setSections(
        sections.map((section) =>
          section.id === sectionId
            ? { ...section, expanded: !section.expanded }
            : section
        )
      );
      // Open detailed view
      openDetailedSection(section);
    }
    return;
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // New function to close detailed section view
  const closeDetailedSection = (sectionId: string) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
    setDetailedSection(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e: DragEvent<HTMLDivElement>) => {
    if (
      draggedSectionIndex !== null &&
      sectionRefs.current[sections[draggedSectionIndex].id]
    ) {
      const el = sectionRefs.current[sections[draggedSectionIndex].id];
      if (el) {
        el.classList.remove("opacity-50");
      }
    }
    setDraggedSectionIndex(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    return false;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();

    if (draggedSectionIndex === null) return;
    if (draggedSectionIndex === dropIndex) return;

    const newSections = [...sections];
    const draggedSection = newSections[draggedSectionIndex];

    // Remove the dragged item
    newSections.splice(draggedSectionIndex, 1);

    // Add it at the new position
    newSections.splice(dropIndex, 0, draggedSection);

    setSections(newSections);
    setDraggedSectionIndex(null);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between h-16">
        <h1 className="text-lg font-bold">
          {detailedSection
            ? `Edit ${detailedSection.title}`
            : "Customize Template"}
        </h1>
        <button onClick={toggleSidebar} className="p-1">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Main Sidebar or Detailed Section Sidebar */}
      {detailedSection ? (
        // Detailed Section Sidebar
        <div className="w-full md:w-64 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 h-16 flex items-center">
            <button
              onClick={() => {
                closeDetailedSection(detailedSection.id);
              }}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={18} />
              <span>Back to Sections</span>
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 py-3 text-center text-sm ${
                detailedSectionTab === "content"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setDetailedSectionTab("content")}
            >
              Content
            </button>
            <button
              className={`flex-1 py-3 text-center text-sm ${
                detailedSectionTab === "design"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600"
              }`}
              onClick={() => setDetailedSectionTab("design")}
            >
              Design
            </button>
          </div>

          {/* Detailed Section Content */}
          {detailedSection.id === "Header&Menu" ? (
            <RenderHeaderSection detailedSectionTab={detailedSectionTab} />
          ) : detailedSection.id === "PromoSlider" ? (
            <RenderPromoSection detailedSectionTab={detailedSectionTab} />
          ) : null}
        </div>
      ) : (
        // Main Sidebar
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } md:block w-full md:w-64 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0 ${
            sidebarOpen &&
            "h-screen md:h-auto fixed md:static z-10 top-16 left-0 right-0 md:top-0"
          }`}
        >
          <div className="p-4 border-b border-gray-200 hidden md:flex items-center h-16">
            <h1 className="text-lg font-bold">Customize Template</h1>
          </div>

          <div className="sections-container">
            {sections.map((section, index) => (
              <div
                key={section.id}
                ref={(el) => {
                  sectionRefs.current[section.id] = el;
                }}
                className={`border-b border-gray-200 ${
                  draggedSectionIndex === index ? "opacity-50" : ""
                }`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
              >
                <div className="flex items-center">
                  <div
                    className="px-2 py-4 cursor-grab flex items-center text-gray-400 hover:text-gray-600"
                    title="Drag to reorder"
                  >
                    <GripVertical size={18} />
                  </div>

                  <button
                    className="flex-1 flex items-center justify-between text-left pr-4"
                    onClick={() => toggleSection(section.id)}
                  >
                    <div className="flex items-center gap-2">
                      {section.icon}
                      <span className="font-medium">{section.title}</span>
                    </div>
                    {section.expanded ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
