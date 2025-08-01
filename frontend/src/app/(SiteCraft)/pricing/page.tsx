"use client";

import { PricingCards } from "@/components/SiteCraft/pricing/pricing-cards";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="container pt-24 pb-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Choose the perfect plan for your business. No hidden fees, no
          surprises.
        </p>
      </div>

      <PricingCards />

      <div className="mt-16">
        <h2 className="text-2xl font-bold text-center mb-8">
          All Plans Include
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* First row benefits */}
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Analytics Dashboard</h3>
              <p className="text-sm text-muted-foreground">
                Track visitors, sales metrics, and store performance
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Secure Hosting</h3>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade security and reliable hosting infrastructure
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Local Payment Methods</h3>
              <p className="text-sm text-muted-foreground">
                Support for ValU, Meeza, MasterCard, and Fawry
              </p>
            </div>
          </div>

          {/* Second row benefits */}
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Arabic Support</h3>
              <p className="text-sm text-muted-foreground">
                Full Arabic language support and RTL compatibility
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">24/7 Support</h3>
              <p className="text-sm text-muted-foreground">
                Access to our dedicated support team
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 mt-1" />
            <div>
              <h3 className="font-semibold mb-1">Mobile Optimization</h3>
              <p className="text-sm text-muted-foreground">
                Fully responsive design for all devices
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
