// src/components/dashboard/ReportCard.tsx
"use client";

import React, { FC } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/SiteCraft/ui/card";
import { Button } from "@/components/SiteCraft/ui/button";
import { Download } from "lucide-react";

export interface Report {
  id: string;
  name: string;
  category: string;
  description: string;
  iconSrc: React.ReactNode;
}

interface ReportCardProps {
  report: Report;
  onDownload: (id: string) => void;
}

export const ReportCard: FC<ReportCardProps> = ({ report, onDownload }) => (
  <Card className="border-logo-border">
    <CardContent className="flex-col h-full justify-between">
      <div>
        {/* Bigger icon */}
        {report.iconSrc}
        {/* Title bumped to text-xl */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {report.name}
        </h3>

        {/* Subtitle unchanged */}
        <p className="text-xs uppercase text-logo-txt mb-3">
          {report.category}
        </p>

        <p className="text-m text-gray-500">{report.description}</p>
      </div>

      <div className="mt-6 flex justify-end">
        <Download size={16} />
      </div>
    </CardContent>
  </Card>
);

export default ReportCard;
