// frontend/src/components/dashboard/account-settings/StoreInformationSection.tsx
'use client'

import React from 'react'
import Link from 'next/link'
import { CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export function StoreInformationSection() {
  return (
    <form className="space-y-6">
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
            />
            <p className="text-xs text-gray-400 mt-1">
              This will be displayed on your storefront and receipts
            </p>
          </div>

          <div>
            <label
              htmlFor="storeUrl"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Web Address <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <Input
                id="storeUrl"
                name="storeUrl"
                required
                className="rounded-l-none"
                placeholder="yourstore.example.com"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              This is your store's unique web address
            </p>
          </div>

          <div className="md:col-span-2">
            <label
              htmlFor="storeDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Store Description
            </label>
            <Textarea
              id="storeDescription"
              name="storeDescription"
              placeholder="Brief description of your store"
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-400 mt-1">
              A short description that appears in search results (150 characters
              max)
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
            />
            <p className="text-xs text-gray-400 mt-1">
              This number will be visible on your storefront and can help
              customers reach you.
            </p>
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Input
              id="email"
              name="email"
              required
              placeholder="youremail@example.com"
            />
            <p className="text-xs text-gray-400 mt-1">
              This email will be visible on your storefront and can help
              customers reach you.
            </p>
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
              />
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="submit"
          className="bg-logo-dark-button text-primary-foreground hover:bg-logo-dark-button-hover"
        >
          Save Changes
        </Button>
        <Link href="/dashboard/account-settings">
          <Button
            variant="outline"
            className="w-full sm:w-auto text-logo-txt hover:text-logo-txt-hover hover:bg-logo-light-button-hover border-logo-border"
          >
            Cancel
          </Button>
        </Link>
      </div>
    </form>
  );
}