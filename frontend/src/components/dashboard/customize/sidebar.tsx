"use client";
import React, { useState, useRef } from "react";
import {
  ChevronDown,
  ChevronRight,
  Paintbrush,
  Menu,
  X,
  GripVertical,
  ArrowLeft,
} from "lucide-react";
import { Upload } from "lucide-react";

export function Sidebar() {

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
        <div className="p-4 space-y-6">
          {/* Site Logo Section */}
          <div>
            <h3 className="font-medium mb-2">Site Logo</h3>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center">
                {/* Logo preview will go here */}
              </div>
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm">
                  <Upload size={16} />
                  <span>Choose Logo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        // Handle logo upload here
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          // Set logo preview
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Navigation Menu Section */}
          <div>
            <h3 className="font-medium mb-2">Menu Items</h3>
            <div className="space-y-2">
              {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 border border-gray-200 rounded"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', index.toString())}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
                    // Handle menu item reordering here
                  }}
                >
                  <GripVertical size={16} className="text-gray-400 cursor-grab" />
                  <input
                    type="text"
                    defaultValue={item}
                    className="flex-1 border-none bg-transparent focus:outline-none"
                    onChange={(e) => {
                      // Handle menu item text change here
                    }}
                  />
                </div>
              ))}
            </div>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
              + Add New Menu Item
            </button>
          </div>
        </div>
      );
    } else if (detailedSectionTab === "design") {
      return <div className="p-4"></div>;
    }
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
              onClick={closeDetailedSection}
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
          {renderDetailedSectionContent()}
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
                ref={(el) => (sectionRefs.current[section.id] = el)}
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

                {section.expanded && renderSectionContent(section)}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
