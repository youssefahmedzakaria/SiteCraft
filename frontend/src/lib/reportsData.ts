// src/lib/reportsData.ts

export type Report = {
    id: string;
    name: string;
    category: string;
    description: string;
  }
  
  export const reportsData: Report[] = [
    {
      id: "rep-001",
      name: "Session Creation Report",
      category: "Site Insights",
      description: "Tracks the total number of sessions created on the platform, providing insights into platform usage."
    },
    {
      id: "rep-002",
      name: "Product Analytics",
      category: "Product Performance",
      description: "Detailed analysis of product views, sales, and inventory status across all categories."
    },
    {
      id: "rep-003",
      name: "Customer Engagement",
      category: "User Activity",
      description: "Metrics on user interactions, time spent on site, and conversion rates from visits to purchases."
    },
    {
      id: "rep-004",
      name: "Sales Summary",
      category: "Financial",
      description: "Overview of sales performance, revenue trends, and top-selling products for the selected period."
    },
    {
      id: "rep-005",
      name: "Inventory Status",
      category: "Product Management",
      description: "Current stock levels, restocking alerts, and inventory turnover rates by product category."
    }
  ];