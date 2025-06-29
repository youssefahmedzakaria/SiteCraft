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
  Images,
  AppWindow,
} from "lucide-react";
import { RenderPromoSection } from "./renderPromoSection";
import { RenderHeaderSection } from "./renderHeaderSection";
import { RenderAboutSection } from "./renderAboutSection";
import { RenderFooterSection } from "./renderFooterSection";
import { RenderPoliciesSection } from "./renderPoliciesSection";
import { RenderContactSection } from "./renderContactSection";
import {
  AboutCustomizationAttributes,
  ContactCustomizationAttributes,
  FooterCustomizationAttributes,
  HeaderCustomizationAttributes,
  PoliciesCustomizationAttributes,
} from "@/lib/customization";
import { PromoCustomizationAttributes } from "@/lib/customization";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

interface Section {
  id: string;
  title: string;
  // icon: React.ReactNode;
  expanded: boolean;
}

interface SidebarProps {
  headerAttributes: HeaderCustomizationAttributes;
  updateHeaderAttributes: (
    updates: Partial<HeaderCustomizationAttributes>
  ) => void;
  promoAttributes: PromoCustomizationAttributes;
  updatePromoAttributes: (
    updates: Partial<PromoCustomizationAttributes>
  ) => void;
  aboutAttributes: AboutCustomizationAttributes;
  updateAboutAttributes: (
    updates: Partial<AboutCustomizationAttributes>
  ) => void;
  policiesAttributes: PoliciesCustomizationAttributes;
  updatePoliciesAttributes: (
    updates: Partial<PoliciesCustomizationAttributes>
  ) => void;
  contactAttributes: ContactCustomizationAttributes;
  updateContactAttributes: (
    updates: Partial<ContactCustomizationAttributes>
  ) => void;
  footerAttributes: FooterCustomizationAttributes;
  updateFooterAttributes: (
    updates: Partial<FooterCustomizationAttributes>
  ) => void;
  sections: Section[];
  setSections: React.Dispatch<React.SetStateAction<Section[]>>;
}

export function Sidebar({
  headerAttributes,
  updateHeaderAttributes,
  promoAttributes,
  updatePromoAttributes,
  aboutAttributes,
  updateAboutAttributes,
  policiesAttributes,
  updatePoliciesAttributes,
  contactAttributes,
  updateContactAttributes,
  footerAttributes,
  updateFooterAttributes,
  sections,
  setSections,
}: SidebarProps) {
  // Remove local useState for sections
  // const [sections, setSections] = useState<Section[]>([ ... ]);

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

  // Replace old drag-and-drop handlers with handleDragEnd for @hello-pangea/dnd
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const start = result.source.index;
    const end = result.destination.index;
    // Only reorder the middle sections (excluding Header&Menu and Footer)
    const fixedTop = sections[0];
    const fixedBottom = sections[sections.length - 1];
    const middle = sections.slice(1, sections.length - 1);
    const items = Array.from(middle);
    const [reorderedItem] = items.splice(start, 1);
    items.splice(end, 0, reorderedItem);
    setSections([fixedTop, ...items, fixedBottom]);
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
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } w-full md:w-64 border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0`}
        >
          <div className="p-4 border-b border-gray-200 hidden md:flex items-center h-16">
            <h1 className="text-lg font-bold">
              {detailedSection
                ? `Edit ${detailedSection.title}`
                : "Customize Template"}
            </h1>
          </div>

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
            <RenderHeaderSection
              detailedSectionTab={detailedSectionTab}
              headerAttributes={headerAttributes}
              updateHeaderAttributes={updateHeaderAttributes}
            />
          ) : detailedSection.id === "PromoSlider" ? (
            <RenderPromoSection
              detailedSectionTab={detailedSectionTab}
              promoAttributes={promoAttributes}
              updatePromoAttributes={updatePromoAttributes}
            />
          ) : detailedSection.id === "AboutUs" ? (
            <RenderAboutSection
              detailedSectionTab={detailedSectionTab}
              aboutAttributes={aboutAttributes}
              updateAboutAttributes={updateAboutAttributes}
            />
          ) : detailedSection.id === "Policies" ? (
            <RenderPoliciesSection
              detailedSectionTab={detailedSectionTab}
              policiesAttributes={policiesAttributes}
              updatePoliciesAttributes={updatePoliciesAttributes}
            />
          ) : detailedSection.id === "ContactUs" ? (
            <RenderContactSection
              detailedSectionTab={detailedSectionTab}
              contactAttributes={contactAttributes}
              updateContactAttributes={updateContactAttributes}
            />
          ) : detailedSection.id === "Footer" ? (
            <RenderFooterSection
              detailedSectionTab={detailedSectionTab}
              footerAttributes={footerAttributes}
              updateFooterAttributes={updateFooterAttributes}
            />
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
            {/* Header (fixed, not draggable) */}
            <div key="header" className="border-b border-gray-200">
              <div className="flex items-center">
                <div className="px-2 py-4 flex items-center text-gray-400 hover:text-gray-600">
                  <GripVertical size={18} className="text-white" />
                </div>
                <button
                  className="flex-1 flex items-center justify-between text-left pr-4"
                  onClick={() => toggleSection(sections[0].id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Header & Menu</span>
                  </div>
                  {sections[0].expanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              </div>
            </div>
            {/* Draggable middle sections */}
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="sidebar-sections">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {sections.slice(1, sections.length - 1).map((section, index) => (
                      <Draggable key={section.id} draggableId={section.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`border-b border-gray-200 ${snapshot.isDragging ? "opacity-50" : ""}`}
                          >
                            <div className="flex items-center">
                              <div
                                {...provided.dragHandleProps}
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
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
            {/* Footer (fixed, not draggable) */}
            <div key="footer" className="border-b border-gray-200">
              <div className="flex items-center">
                <div className="px-2 py-4 flex items-center text-gray-400 hover:text-gray-600">
                  <GripVertical size={18} className="text-white" />
                </div>
                <button
                  className="flex-1 flex items-center justify-between text-left pr-4"
                  onClick={() => toggleSection(sections[sections.length - 1].id)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Footer</span>
                  </div>
                  {sections[sections.length - 1].expanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
