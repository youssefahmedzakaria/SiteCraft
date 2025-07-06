// frontend/src/components/dashboard/account-settings/StoreInformationSection.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CardTitle } from "@/components/SiteCraft/ui/card";
import { Input } from "@/components/SiteCraft/ui/input";
import { Textarea } from "@/components/SiteCraft/ui/textarea";
import { Button } from "@/components/SiteCraft/ui/button";
import { Facebook, Instagram, Twitter, Youtube, Loader2, AlertCircle } from "lucide-react";
import { useStoreSettings } from "@/hooks/useStoreSettings";
import { Store } from "@/lib/store-info";

export function StoreInformationSection() {
  const { store, loading, error, updating, updateStore } = useStoreSettings();
  
  const [formData, setFormData] = useState<Partial<Store>>({
    storeName: '',
    description: '',
    phoneNumber: '',
    emailAddress: '',
    address: '',
    addressLink: '',
    openingHours: '',
    subdomain: '',
  });

  const [socialMedia, setSocialMedia] = useState({
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Update form data when store data loads
  useEffect(() => {
    if (store) {
      setFormData({
        storeName: store.storeName || '',
        description: store.description || '',
        phoneNumber: store.phoneNumber || '',
        emailAddress: store.emailAddress || '',
        address: store.address || '',
        addressLink: store.addressLink || '',
        openingHours: store.openingHours || '',
        subdomain: store.subdomain || '',
      });

      // Set logo preview if exists
      if (store.logo) {
        setLogoPreview(store.logo);
      }

      // Set social media data
      if (store.socialMediaAccounts) {
        const socialData = {
          facebook: '',
          instagram: '',
          twitter: '',
          youtube: '',
        };

        store.socialMediaAccounts.forEach(account => {
          if (account.platform.toLowerCase() === 'facebook') {
            socialData.facebook = account.url.replace('https://facebook.com/', '');
          } else if (account.platform.toLowerCase() === 'instagram') {
            socialData.instagram = account.url.replace('https://instagram.com/', '');
          } else if (account.platform.toLowerCase() === 'twitter') {
            socialData.twitter = account.url.replace('https://x.com/', '');
          } else if (account.platform.toLowerCase() === 'youtube') {
            socialData.youtube = account.url.replace('https://youtube.com/', '');
          }
        });

        setSocialMedia(socialData);
      }
    }
  }, [store]);

  const handleInputChange = (field: keyof Store, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (submitError) {
      setSubmitError(null);
    }
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Clear errors when a new logo is selected
      if (submitError) {
        setSubmitError(null);
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Clear any existing submit errors
    setSubmitError(null);
    
    try {
      // Prepare social media accounts
      const socialMediaAccounts = [];
      if (socialMedia.facebook) {
        socialMediaAccounts.push({
          platform: 'Facebook',
          url: `https://facebook.com/${socialMedia.facebook}`
        });
      }
      if (socialMedia.instagram) {
        socialMediaAccounts.push({
          platform: 'Instagram',
          url: `https://instagram.com/${socialMedia.instagram}`
        });
      }
      if (socialMedia.twitter) {
        socialMediaAccounts.push({
          platform: 'Twitter',
          url: `https://x.com/${socialMedia.twitter}`
        });
      }
      if (socialMedia.youtube) {
        socialMediaAccounts.push({
          platform: 'YouTube',
          url: `https://youtube.com/${socialMedia.youtube}`
        });
      }

      const updateData = {
        ...formData,
        socialMediaAccounts
      };

      await updateStore(updateData, logoFile || undefined);
      
      // Show success message (you can add a toast notification here)
      console.log('✅ Store information updated successfully!');
    } catch (error) {
      console.error('❌ Failed to update store information:', error);
      
      // Handle specific error types
      if (error instanceof Error) {
        if (error.message.includes('File size too large') || error.message.includes('image is too large')) {
          setSubmitError('The logo image you uploaded is too large. Please choose a smaller image (under 5MB) and try again.');
        } else {
          setSubmitError(error.message);
        }
      } else {
        setSubmitError('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-logo-txt" />
        <span className="ml-2 text-gray-600">Loading store settings...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Banner */}
      {(submitError || error) && (
        <div className="mb-6 p-4 border border-red-300 rounded-md bg-red-50">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-red-800">{submitError || error}</p>
            <button
              type="button"
              onClick={() => {
                setSubmitError(null);
                // You can also clear the hook error if needed
              }}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      {/* Store Information */}
      <div>
        <CardTitle className="font-bold text-2xl mb-6">
          Store Information
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="storeName"
              name="storeName"
              required
              placeholder="Your Store Name"
              value={formData.storeName}
              onChange={(e) => handleInputChange('storeName', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be displayed on your storefront and receipts
            </p>
          </div>

          <div>
            <label
              htmlFor="subdomain"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Subdomain <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <Input
                id="subdomain"
                name="subdomain"
                required
                className="rounded-l-none"
                placeholder="yourstore.example.com"
                value={formData.subdomain}
                onChange={(e) => handleInputChange('subdomain', e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              This is your store's web address.
            </p>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of your store"
              rows={4}
              className="w-full"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              A short description that appears in search results (150 characters
              max)
            </p>
          </div>

          {/* Logo Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Logo
            </label>
            <div className="flex items-center space-x-4">
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Store logo preview"
                  className="w-16 h-16 object-cover rounded border"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="max-w-xs"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Upload your store logo (recommended size: 200x200px)
            </p>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div>
        <CardTitle className="font-bold text-2xl mb-4">
          Contact Information
        </CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number <span className="text-red-500">*</span>
            </label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              required
              placeholder="Your Phone Number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              This number will be visible on your storefront and can help
              customers reach you.
            </p>
          </div>
          <div>
            <label
              htmlFor="emailAddress"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="emailAddress"
              name="emailAddress"
              required
              placeholder="youremail@example.com"
              value={formData.emailAddress}
              onChange={(e) => handleInputChange('emailAddress', e.target.value)}
            />
            <p className="text-xs text-gray-400 mt-1">
              This email will be visible on your storefront and can help
              customers reach you.
            </p>
          </div>

          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <Input
              id="address"
              name="address"
              placeholder="Your Store Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="addressLink"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address Link (Google Maps)
            </label>
            <Input
              id="addressLink"
              name="addressLink"
              placeholder="https://maps.google.com/..."
              value={formData.addressLink}
              onChange={(e) => handleInputChange('addressLink', e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="openingHours"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Opening Hours
            </label>
            <Input
              id="openingHours"
              name="openingHours"
              placeholder="Mon-Fri: 9AM-6PM, Sat: 10AM-4PM"
              value={formData.openingHours}
              onChange={(e) => handleInputChange('openingHours', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Social Media Accounts */}
      <div>
        <CardTitle className="font-bold text-2xl mb-4">
          Social Media Accounts
        </CardTitle>
        <p className="text-gray-500 mb-4">
          Connect your social media accounts to display on your storefront
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="facebook"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Facebook
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                facebook.com/
              </span>
              <Input
                id="facebook"
                name="facebook"
                placeholder="yourstorepage"
                className="rounded-l-none"
                value={socialMedia.facebook}
                onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="instagram"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Instagram
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <Instagram className="h-4 w-4 mr-2 text-pink-600" />
                instagram.com/
              </span>
              <Input
                id="instagram"
                name="instagram"
                placeholder="yourstorehandle"
                className="rounded-l-none"
                value={socialMedia.instagram}
                onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="twitter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              X (Twitter)
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                x.com/
              </span>
              <Input
                id="twitter"
                name="twitter"
                placeholder="yourstorehandle"
                className="rounded-l-none"
                value={socialMedia.twitter}
                onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="youtube"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              YouTube
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                <Youtube className="h-4 w-4 mr-2 text-red-600" />
                youtube.com/
              </span>
              <Input
                id="youtube"
                name="youtube"
                placeholder="yourchannel"
                className="rounded-l-none"
                value={socialMedia.youtube}
                onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          disabled={updating}
          className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Link href="/dashboard/account-settings">
          <Button
            type="button"
            variant="outline"
            disabled={updating}
            className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}
