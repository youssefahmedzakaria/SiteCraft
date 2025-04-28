"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Paintbrush,
} from "lucide-react";
import { Sidebar } from "@/components/dashboard/customize/sidebar";

export default function CustomizeTemplatePage() {
  const [selectedTab, setSelectedTab] = useState("desktop");

  // Define sections in an array to make them orderable
  const [sections, setSections] = useState([
    {
      id: "Header&Menu",
      title: "Header & Menu",
      icon: <Paintbrush size={18} />,
      expanded: false,
    },
  ]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [draggedSectionIndex, setDraggedSectionIndex] = useState(null);

  // New state for the detailed section view
  const [detailedSection, setDetailedSection] = useState(null);
  const [detailedSectionTab, setDetailedSectionTab] = useState("content");

  // Reference for section DOM elements
  const sectionRefs = useRef({});

  // Modified section to make the entire section clickable
  const toggleSection = (sectionId) => {
    // For Header&Menu section, instead of toggling expansion, open the detailed view
    if (sectionId === "Header&Menu") {
      const section = sections.find((s) => s.id === sectionId);
      openDetailedSection(section);
      return;
    }

    // For other sections, keep the original toggle behavior
    setSections(
      sections.map((section) =>
        section.id === sectionId
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // New function to open detailed section view
  const openDetailedSection = (section) => {
    setDetailedSection(section);
    setDetailedSectionTab("content");
  };

  // New function to close detailed section view
  const closeDetailedSection = () => {
    setDetailedSection(null);
  };

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = (e) => {
    if (
      draggedSectionIndex !== null &&
      sectionRefs.current[sections[draggedSectionIndex].id]
    ) {
      sectionRefs.current[sections[draggedSectionIndex].id].classList.remove(
        "opacity-50"
      );
    }
    setDraggedSectionIndex(null);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    return false;
  };

  const handleDrop = (e, dropIndex) => {
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

  // Render section content based on section ID
  const renderSectionContent = (section) => {
    switch (section.id) {
      case "Header&Menu":
        return <></>;
      default:
        return null;
    }
  };

  // Render detailed section content
  const renderDetailedSectionContent = () => {
    if (!detailedSection) return null;

    if (detailedSectionTab === "content") {
      return (
        <div className="p-4">

        </div>
      );
    } else if (detailedSectionTab === "design") {
      return (
        <div className="p-4">
          
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar></Sidebar>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 p-3 flex flex-col sm:flex-row justify-between items-center h-16">
          <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
            <Button variant="outline" className="bg-white">
              <span className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Preview
              </span>
            </Button>
            <div className="flex border border-gray-200 rounded-md overflow-hidden">
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "desktop" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("desktop")}
              >
                Desktop
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "tablet" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("tablet")}
              >
                Tablet
              </button>
              <button
                className={`px-2 sm:px-4 py-2 text-sm ${
                  selectedTab === "mobile" ? "bg-gray-100" : "bg-white"
                }`}
                onClick={() => setSelectedTab("mobile")}
              >
                Mobile
              </button>
            </div>
          </div>
          <Button className="bg-black text-white hover:bg-gray-800 w-full sm:w-auto">
            Save Changes
          </Button>
        </div>

        {/* Content preview area */}
        <div className="flex-1 p-4 bg-gray-100">
          {/* Preview content would go here */}
          <div className="bg-white rounded-md shadow-sm p-4 h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="mb-2">Preview Area</div>
              <div className="text-sm">
                {detailedSection
                  ? `Editing ${detailedSection.title}`
                  : "Customize your template"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
