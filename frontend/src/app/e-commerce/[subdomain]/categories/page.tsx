/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { GridCategoryTemplate } from "@/components/e-commerce/category-lists";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCategoryManagement } from "@/hooks/useCategoryManagement";
import { BackendCategory, getCategories } from "@/lib/categories";

export default function CategoriesPage({
  // Text configuration props
  mainTitle = "Jewelry Collections",
  subtitle = "Discover our exquisite range of handcrafted jewelry pieces, each telling its own unique story",
  ctaText = "Explore Collection",

  // Pagination props
  itemsPerPage = 12,
  showPagination = true,

  // Other template props
  columns = { sm: 1, md: 2, lg: 3 },
  showTitle = false,
  hoverEffect = true,
  gap = "gap-8",
  imageHeight = "aspect-[4/3]",
  titlePosition = "overlay" as "overlay" | "top" | "bottom",
  showCta = true,
  cornerRadius = "large" as "large" | "small" | "none" | "medium",
  cardShadow = "shadow-xl hover:shadow-2xl",
  showSubtitle = false,
  borderColor = "border-white/20",
  cardVariant = "overlay" as
    | "overlay"
    | "default"
    | "minimal"
    | "hover"
    | "featured",
  showCardTitle = true,
  titleColor = "text-white",
  titleFontSize = "text-3xl",
  showMoreButton = false,
}) {
  const [backendCategories, setBackendCategories] = useState<BackendCategory[]>(
    []
  );

  // Add initialColors state
  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setBackendCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemsPerPage, setSelectedItemsPerPage] =
    useState(itemsPerPage);

  // Calculate pagination
  const totalItems = backendCategories.length;
  const totalPages = Math.ceil(totalItems / selectedItemsPerPage);
  const startIndex = (currentPage - 1) * selectedItemsPerPage;
  const endIndex = startIndex + selectedItemsPerPage;
  const currentCategories = backendCategories
    .slice(startIndex, endIndex)
    .map((category) => ({
      name: category.name,
      images: [{ id: category.id, url: category.image, alt: category.name }],
      id: category.id,
      Description: category.description,
      link: `/${category.id}`,
    }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setSelectedItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className={`min-h-screen bg-[#ffffff] pt-20`}>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-5xl font-bold mb-4`} style={{ color: initialColors.primary }}>
            {mainTitle}
          </h1>
          <p className={`text-xl font-light max-w-2xl mx-auto`} style={{ color: initialColors.primary }}>
            {subtitle}
          </p>
        </div>

        {/* Items per page selector and results info */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="text-sm" style={{ color: initialColors.primary }}>
            {Math.min(endIndex, totalItems)} out of {totalItems} categories
          </div>
        </div>

        <GridCategoryTemplate
          categories={currentCategories}
          columns={columns}
          bgColor="bg-transparent"
          textColor={initialColors.primary}
          borderRadius="rounded-2xl"
          showTitle={showTitle}
          fontFamily="font-sans"
          hoverEffect={hoverEffect}
          gap={gap}
          imageHeight={imageHeight}
          titlePosition={titlePosition}
          showCta={showCta}
          ctaText={ctaText}
          cornerRadius={cornerRadius}
          cardShadow={cardShadow}
          overlayColor="bg-black/50"
          showSubtitle={showSubtitle}
          accentColor={initialColors.accent}
          borderColor={borderColor}
          cardVariant={cardVariant}
          showCardTitle={showCardTitle}
          titleColor={titleColor}
          titleFontSize={titleFontSize}
          titleFont="font-bold"
          showMoreButton={showMoreButton}
        />

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="flex flex-col sm:flex-row justify-center items-center mt-12 gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-md border transition-colors ${
                  currentPage === 1
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : `border-current ${initialColors.primary} hover:bg-black/5`
                }`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      typeof page === "number" ? handlePageChange(page) : null
                    }
                    disabled={page === "..."}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      page === currentPage
                        ? `bg-[#4A102A] text-white`
                        : page === "..."
                        ? "text-gray-400 cursor-default"
                        : `${initialColors.primary} hover:bg-black/5 border border-current`
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-md border transition-colors ${
                  currentPage === totalPages
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : `border-current ${initialColors.primary} hover:bg-black/5`
                }`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <div className={`text-sm`} style={{ color: initialColors.primary }}>
              Page {currentPage} of {totalPages}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
