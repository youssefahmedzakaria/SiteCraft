import Image from "next/image";
import { Button } from "@/components/SiteCraft/ui/button";
import Link from "next/link";
import { CustomizedTemplate } from "@/lib/customization";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/SiteCraft/ui/dialog";
import { useState } from "react";

export interface Template {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export function TemplateCard({ template }: { template: CustomizedTemplate }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-4 border border-black-border rounded-lg overflow-hidden shadow-sm bg-background transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <div className="relative w-full h-40 overflow-hidden items-center justify-center">
        <div>
          <iframe
            src={`/templates/${template.id}`}
            scrolling="no"
            style={{
              width: "1024px",
              height: "768px",
              transform: "scale(0.4)", // Adjust scale to fit h-40
              transformOrigin: "top left",
              border: "none",
            }}
            className="absolute top-0 left-0"
          />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-end">
          <div className="space-x-2">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  className="hover:bg-logo-light-button-hover border border-gray hover:bg-gray-100 transition-colors"
                >
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-6xl max-h-[90vh] overflow-hidden sm:w-[90vw] sm:max-w-4xl md:w-[85vw] md:max-w-5xl lg:w-[80vw] lg:max-w-6xl sm:max-h-[85vh] md:max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Template Preview</DialogTitle>
                </DialogHeader>
                <div className="relative w-full h-[70vh] sm:h-[60vh] md:h-[65vh] lg:h-[70vh] overflow-hidden flex items-center justify-center bg-gray-50 rounded-lg">
                  <iframe
                    src={`/templates/${template.id}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      border: "none",
                      borderRadius: "8px",
                    }}
                    className="w-full h-full"
                  />
                </div>
              </DialogContent>
            </Dialog>
            <Link href={"/dashboard"}>
              <Button
                size="sm"
                className="bg-black text-primary-foreground hover:bg-gray-800 transition-colors"
              >
                Select
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
