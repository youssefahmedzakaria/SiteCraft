import type { SidebarElement } from '@/lib/sidebarElements'
import Image from "next/image";
import { Button } from "../ui/button";

export function SidebarElementComponent({ element }: { element: SidebarElement }) {
    return (
        <>
        <Button 
            variant="ghost"
            className="w-full text-base text-primary-foreground hover:text-logo-txt-hover hover:bg-logo-light-button-hover rounded-none flex items-center justify-start pl-4 gap-2"
        >
            <Image 
            src={element.icon} 
            alt={element.title + ' Icon'}
            width={20} 
            height={20} 
            />
            <span>{element.title}</span>
        </Button>
        </>
    )
}