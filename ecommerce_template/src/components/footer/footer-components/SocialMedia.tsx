"use client";
import { Facebook, Instagram, Mail, Twitter, Youtube, } from "lucide-react";
import Link from "next/link";
import React from "react";

interface SocialMediaProps {
  socialMedia: Record<string, string | undefined>;
  styles?: {
    iconSize?: number;
    iconColor?: string;
    hoverColor?: string;
  };
  textColor?: string;
  className?: string;
}

export const SocialMedia = ({ 
  socialMedia, 
  styles = {
    iconSize: 24,
    iconColor: "text-gray-600",
    hoverColor: "text-primary-500"
  }, 
  textColor = "text-black",
  className = ""
}: SocialMediaProps) => {
  const iconComponents = {
    facebook: Facebook,
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    email: Mail
  };

  return (
    <div className={`flex gap-4 md:gap-6 ${className}`}>
      {Object.entries(socialMedia).map(([platform, url]) => {
        if (!url) return null;
        
        const Icon = iconComponents[platform as keyof typeof iconComponents];
        if (!Icon) return null;

        const iconElement = (
          <Icon
            size={styles.iconSize}
            className={`${styles.iconColor} hover:${styles.hoverColor} transition-colors duration-200 ${
              textColor === 'text-white' ? 'text-white hover:text-gray-200' : ''
            }`}
          />
        );

        if (platform === 'email') {
          return (
            <a 
              key={platform}
              href={`mailto:${url}`}
              rel="noopener noreferrer"
              aria-label={`Email ${url}`}
              className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
            >
              {iconElement}
            </a>
          );
        }
        
        return (
          <Link
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit our ${platform}`}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-full"
          >
            {iconElement}
          </Link>
        );
      })}
    </div>
  );
};