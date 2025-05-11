/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  ImageIcon,
  Plus,
} from "lucide-react";
import { useState, useRef, DragEvent } from "react";
import Image from "next/image";
import { AboutLayoutItems } from "./aboutLayoutItems";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface RenderFooterSectionProps {
  detailedSectionTab: string;
}

export function RenderFooterSection({
  detailedSectionTab,
}: RenderFooterSectionProps) {
  return (
    <div>
      {detailedSectionTab === "content" ? (
        <div className="p-4 space-y-5"></div>
      ) : (
        <div className="p-4 space-y-6"></div>
      )}
    </div>
  );
}
