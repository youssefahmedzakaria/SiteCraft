"use client"

import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PricingCards() {
  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold text-center mb-10">Choose Your Subscription Plan</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <Card className="border-logo-border">
          <CardHeader>
            <CardTitle>
              <h3 className="text-2xl font-bold">Basic</h3>
              <div className="text-3xl font-bold mt-2">
                100EGP<span className="text-lg font-normal">/month</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Up to 50 products</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Standard support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>1 user account</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-muted-foreground">Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-muted-foreground">Multiple user accounts</span>
              </li>
            </ul>
            <Button className="w-full bg-logo-dark-button">Select Plan</Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="relative border-logo-border">
          <div className="absolute -top-4 right-4 bg-logo-dark-button px-4 py-1 rounded-full text-sm text-white">
            Most Popular
          </div>
          <CardHeader>
            <CardTitle>
              <h3 className="text-2xl font-bold">Pro</h3>
              <div className="text-3xl font-bold mt-2">
                300EGP<span className="text-lg font-normal">/month</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Up to 200 products</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Analytics</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Reports</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>Priority support</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                <span>5 user accounts</span>
              </li>
              <li className="flex items-center gap-2">
                <X className="h-5 w-5 text-red-500" />
                <span className="text-muted-foreground">Unlimited products</span>
              </li>
            </ul>
            <Button className="w-full bg-logo-dark-button">Select Plan</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 