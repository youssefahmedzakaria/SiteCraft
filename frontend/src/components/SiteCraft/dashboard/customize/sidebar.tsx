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
  Plus,
  CheckCircle,
  Image,
  LayoutGrid,
  ShoppingBag,
  Info,
  FileText,
  Phone,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/SiteCraft/ui/dialog";
import { Button } from "@/components/SiteCraft/ui/button";
import { CenteredPromo } from "@/components/e-commerce/promo";
import { FeaturedGridCategoryTemplate } from "@/components/e-commerce/category-lists";
import { ProductList } from "@/components/e-commerce/product-lists";
import { TopImageAbout } from "@/components/e-commerce/about-us";
import { MinimalRightContact } from "@/components/e-commerce/contact";
import { TitleLeftContentCenterPolicies } from "@/components/e-commerce/policies";

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
  aboutImage: File | undefined;
  setAboutImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  contactImage: File | undefined;
  setContactImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  policiestImage: File | undefined;
  setPoliciesImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  promoImages: File[] | undefined;
  setPromoImages: React.Dispatch<React.SetStateAction<File[] | undefined>>;
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
  aboutImage,
  setAboutImage,
  contactImage,
  setContactImage,
  policiestImage,
  setPoliciesImage,
  promoImages,
  setPromoImages,
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

  const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);

  // List of available sections to add (excluding Header&Menu and Footer)
  const availableSections: {
    id: keyof typeof sectionPreviews;
    title: string;
  }[] = [
    { id: "PromoSlider", title: "Promo Slider" },
    { id: "Categories", title: "Categories" },
    { id: "Products", title: "Products" },
    { id: "AboutUs", title: "About Us" },
    { id: "Policies", title: "Policies" },
    { id: "ContactUs", title: "Contact Us" },
  ];

  // Section preview components (minimal, use initial attributes)
  const sectionPreviews = {
    PromoSlider: (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <Image size={20} className="text-blue-500" />
          <span className="font-semibold">Promo Slider</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Showcase promotional banners or slides to highlight offers and news.
        </div>
      </div>
    ),
    Categories: (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <LayoutGrid size={20} className="text-yellow-500" />
          <span className="font-semibold">Categories</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Display product categories for easy navigation.
        </div>
      </div>
    ),
    Products: (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <ShoppingBag size={20} className="text-green-500" />
          <span className="font-semibold">Products</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Showcase featured or new products to attract customers.
        </div>
      </div>
    ),
    AboutUs: (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <Info size={20} className="text-indigo-500" />
          <span className="font-semibold">About Us</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Share your brand story and values with visitors.
        </div>
      </div>
    ),
    Policies: (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <FileText size={20} className="text-gray-500" />
          <span className="font-semibold">Policies</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Display your store's shipping, return, and privacy policies.
        </div>
      </div>
    ),
    ContactUs: (
      <div className="p-2">
        <div className="flex items-center gap-2 mb-1">
          <Phone size={20} className="text-pink-500" />
          <span className="font-semibold">Contact Us</span>
        </div>
        <div className="text-xs text-gray-500 mb-2">
          Let customers reach out with questions or feedback.
        </div>
      </div>
    ),
  };

  // Add section handler
  const [selectedSectionIds, setSelectedSectionIds] = useState<
    (keyof typeof sectionPreviews)[]
  >([]);
  const handleSaveAddSection = () => {
    if (!selectedSectionIds.length) return;
    const newSectionsToAdd = availableSections.filter(
      (s) =>
        selectedSectionIds.includes(s.id) &&
        !sections.some((sec) => sec.id === s.id)
    );
    if (!newSectionsToAdd.length) return;
    // Insert before Footer
    const newSections = [
      ...sections.slice(0, sections.length - 1),
      ...newSectionsToAdd.map((section) => ({
        id: section.id,
        title: section.title,
        expanded: false,
      })),
      sections[sections.length - 1],
    ];
    setSections(newSections);
    setAddSectionDialogOpen(false);
    setSelectedSectionIds([]);
  };

  // Handler to delete a section and go back to the list
  const handleDeleteSection = (sectionId: string) => {
    // Only allow deleting non-header/footer
    if (sectionId === "Header&Menu" || sectionId === "Footer") return;
    setSections(sections.filter((s) => s.id !== sectionId));
    setDetailedSection(null);
  };

  return (
    <div className="w-full h-full">
      {/* Main Sidebar or Detailed Section Sidebar */}
      {detailedSection ? (
        // Detailed Section Sidebar
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } w-full h-full border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0 flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200 hidden md:flex items-center h-16 flex-shrink-0">
            <h1 className="text-lg font-bold">
              {detailedSection
                ? `Edit ${detailedSection.title}`
                : "Customize Template"}
            </h1>
          </div>

          {/* Header */}
          <div className="p-4 border-b border-gray-200 h-16 flex items-center flex-shrink-0">
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
          <div className="flex border-b border-gray-200 flex-shrink-0">
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
          <div className="flex-1 min-h-0 flex flex-col">
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
                onDeleteSection={() => handleDeleteSection(detailedSection.id)}
                promoImages={promoImages}
                setPromoImages={setPromoImages}
              />
            ) : detailedSection.id === "AboutUs" ? (
              <RenderAboutSection
                detailedSectionTab={detailedSectionTab}
                aboutAttributes={aboutAttributes}
                updateAboutAttributes={updateAboutAttributes}
                onDeleteSection={() => handleDeleteSection(detailedSection.id)}
                aboutImage={aboutImage}
                setAboutImage={setAboutImage}
              />
            ) : detailedSection.id === "Policies" ? (
              <RenderPoliciesSection
                detailedSectionTab={detailedSectionTab}
                policiesAttributes={policiesAttributes}
                updatePoliciesAttributes={updatePoliciesAttributes}
                onDeleteSection={() => handleDeleteSection(detailedSection.id)}
                policiesImage={policiestImage}
                setPoliciesImage={setPoliciesImage}
              />
            ) : detailedSection.id === "ContactUs" ? (
              <RenderContactSection
                detailedSectionTab={detailedSectionTab}
                contactAttributes={contactAttributes}
                updateContactAttributes={updateContactAttributes}
                onDeleteSection={() => handleDeleteSection(detailedSection.id)}
                contactImage={contactImage}
                setContactImage={setContactImage}
              />
            ) : detailedSection.id === "Footer" ? (
              <RenderFooterSection
                detailedSectionTab={detailedSectionTab}
                footerAttributes={footerAttributes}
                updateFooterAttributes={updateFooterAttributes}
              />
            ) : null}
          </div>
        </div>
      ) : (
        // Main Sidebar
        <div
          className={`${
            sidebarOpen ? "block" : "hidden"
          } w-full h-full border-r border-gray-200 bg-white overflow-y-auto flex-shrink-0 flex flex-col`}
        >
          <div className="p-4 border-b border-gray-200 hidden md:flex items-center h-16">
            <h1 className="text-lg font-bold">Customize Template</h1>
          </div>

          {/* Add Section Dialog */}
          <Dialog
            open={addSectionDialogOpen}
            onOpenChange={(open) => {
              setAddSectionDialogOpen(open);
              if (!open) setSelectedSectionIds([]);
            }}
          >
            <DialogContent className="max-w-4xl flex flex-col">
              <DialogHeader>
                <DialogTitle>Add a Section</DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto mt-2 pr-2">
                {(() => {
                  const sectionButtons = availableSections.map(
                    (section: {
                      id: keyof typeof sectionPreviews;
                      title: string;
                    }) => {
                      const isSelected = selectedSectionIds.includes(
                        section.id
                      );
                      const isAdded = sections.some((s) => s.id === section.id);
                      return !isAdded ? (
                        <button
                          key={section.id}
                          type="button"
                          className={`flex items-center gap-2 w-full border rounded py-2 px-4 transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-white"
                          } hover:border-blue-400`}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSectionIds(
                                selectedSectionIds.filter(
                                  (id) => id !== section.id
                                )
                              );
                            } else {
                              setSelectedSectionIds([
                                ...selectedSectionIds,
                                section.id,
                              ]);
                            }
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            readOnly
                            className="mr-2 accent-blue-500"
                          />
                          <div className="flex-1 text-left">
                            {sectionPreviews[section.id]}
                          </div>
                        </button>
                      ) : null;
                    }
                  );
                  const hasContent = sectionButtons.some((s) => s !== null);
                  if (hasContent) {
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sectionButtons}
                      </div>
                    );
                  } else {
                    return (
                      <div className="flex flex-col items-center justify-center h-full py-12 text-center text-gray-500">
                        <CheckCircle
                          size={56}
                          className="text-green-500 mb-4"
                        />
                        <div className="text-xl font-semibold mb-2">
                          All sections added!
                        </div>
                        <div className="text-base">
                          You have already added all available sections to your
                          template.
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                <Button
                  onClick={() => setAddSectionDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveAddSection}
                  disabled={
                    !selectedSectionIds.some(
                      (id) => !sections.some((s) => s.id === id)
                    )
                  }
                  className="bg-black text-white"
                >
                  Save
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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
                    {sections
                      .slice(1, sections.length - 1)
                      .map((section, index) => (
                        <Draggable
                          key={section.id}
                          draggableId={section.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`border-b border-gray-200 ${
                                snapshot.isDragging ? "opacity-50" : ""
                              }`}
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
                                    <span className="font-medium">
                                      {section.title}
                                    </span>
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
                  onClick={() =>
                    toggleSection(sections[sections.length - 1].id)
                  }
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

            <div className="my-6 mx-2">
              <button
                onClick={() => setAddSectionDialogOpen(true)}
                className="flex items-center justify-center gap-2 bg-gray-100 border border-gray-400 rounded-md w-full h-10"
              >
                <Plus size={18} />
                Add Section
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
