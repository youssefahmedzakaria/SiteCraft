import { cn } from "@/lib/utils"
import { Policies } from "../policies";

export interface TitleLeftContentCenterPoliciesProbs{
    id?: string;
    title?: string;
    sections?: Array<{
        title: string;
        content: string;
    }>;
    variant?: "centered" | "default" | "titleLeftContentRight" | "left" |"titleLeftContentCenter";
    backgroundColor?: string;
    titleColor?: string;
    titleSize?: string;
    sectionTitleColor?: string;
    sectionTitleSize?: string;
    sectionContentColor?: string;
    sectionContentSize?: string;
    sectionContentFont?: string;
    sectionContentFontSize?: string;
    sectionContentFontWeight?: string;
}

export function TitleLeftContentCenterPolicies( { 
    id,
    title = "Policies",
    sections = [
        {
            title: "Privacy Policy",
            content: "Your privacy is important to us. We are committed to protecting your personal information and your right to privacy. This policy explains how we collect, use, disclose, and safeguard your information when you visit our website.",
        },
        {
            title: "Terms of Service",
            content: "By using our website, you agree to comply with and be bound by these terms of service. If you do not agree with these terms, please do not use our website.",
        },
        {
            title: "Return Policy",
            content: "We want you to be completely satisfied with your purchase. If you are not satisfied, you may return the item within 30 days of receipt for a full refund.",
        },
    ],
    backgroundColor = "bg-[#F5ECD5]",
    titleColor = "text-[#4A102A]",
    titleSize = "text-4xl",
    sectionTitleColor = "text-[#4A102A]",
    sectionTitleSize = "text-2xl",
    sectionContentColor = "text-gray-600",
    sectionContentSize = "text-lg",
    sectionContentFont = "font-serif",
    sectionContentFontSize = "text-lg",
    sectionContentFontWeight = "font-medium",
}: TitleLeftContentCenterPoliciesProbs) {
    return (
        <Policies
            id={id}
            title={title}
            sections={sections}
            variant="titleLeftContentCenter"
            backgroundColor={backgroundColor}
            titleColor={titleColor}
            titleSize={titleSize}
            sectionTitleColor={sectionTitleColor}
            sectionTitleSize={sectionTitleSize}
            sectionContentColor={sectionContentColor}
            sectionContentSize={sectionContentSize}
            sectionContentFont={sectionContentFont}
            sectionContentFontSize={sectionContentFontSize}
            sectionContentFontWeight={sectionContentFontWeight}
        />
    )
}
    
 
