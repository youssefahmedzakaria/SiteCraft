"use client"

import { Check, Star, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { motion } from "framer-motion"

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false)

  // Define pricing
  const basicMonthly = 100
  const proMonthly = 300
  const annualDiscount = 0.15 // 15% discount for annual billing

  const basicAnnual = Math.round(basicMonthly * 12 * (1 - annualDiscount))
  const proAnnual = Math.round(proMonthly * 12 * (1 - annualDiscount))

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Choose Your Subscription Plan</h2>

      {/* Enhanced Billing toggle */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="bg-muted/50 p-1 rounded-full flex items-center mb-2 relative shadow-sm" style={{ width: "360px" }}>
          <button
            onClick={() => setIsAnnual(false)}
            className={`relative z-10 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-1 text-center ${!isAnnual ? 'text-primary-foreground' : 'text-foreground/70 hover:text-foreground'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`relative z-10 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-1 text-center ${isAnnual ? 'text-primary-foreground' : 'text-foreground/70 hover:text-foreground'}`}
          >
            Annual <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full ml-1">15% off</span>
          </button>
          <div
            className="absolute top-1 bottom-1 rounded-full bg-primary shadow-md transition-all duration-300 ease-in-out"
            style={{
              width: '50%',
              left: isAnnual ? '50%' : '0%'
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {isAnnual
            ? "Save money with annual billing"
            : "Pay month-to-month with no long-term commitment"
          }
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Basic Plan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-logo-border h-full hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle>
                <h3 className="text-2xl font-bold">Basic</h3>
                <motion.div
                  key={isAnnual ? 'annual' : 'monthly'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold mt-2"
                >
                  {isAnnual ? (
                    <>
                      {basicAnnual}EGP<span className="text-lg font-normal text-muted-foreground">/year</span>
                    </>
                  ) : (
                    <>
                      {basicMonthly}EGP<span className="text-lg font-normal text-muted-foreground">/month</span>
                    </>
                  )}
                </motion.div>
                {isAnnual && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="line-through">{basicMonthly * 12}EGP</span>
                    <span className="ml-2 text-green-600 font-medium">You save {basicMonthly * 12 - basicAnnual}EGP</span>
                  </p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Up to 50 products</span>
                </li>
                {/* <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Analytics</span>
                </li> */}
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Standard support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>1 user account</span>
                </li>
                {/* <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground">Reports</span>
                </li> */}
                <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground">Multiple user accounts</span>
                </li>
              </ul>
              <Button className="w-full bg-logo-dark-button hover:bg-logo-dark-button/90 transform hover:-translate-y-0.5 transition-all duration-200">Select Plan</Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Pro Plan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-logo-border h-full hover:border-primary/50 hover:shadow-md transition-all duration-300">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold">Pro</h3>
                  <div className="ml-3 bg-primary text-primary-foreground rounded-full px-3 py-0.5 text-xs font-medium shadow-sm flex items-center">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    Most Popular
                  </div>
                </div>
                <motion.div
                  key={isAnnual ? 'pro-annual' : 'pro-monthly'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold mt-2"
                >
                  {isAnnual ? (
                    <>
                      {proAnnual}EGP<span className="text-lg font-normal text-muted-foreground">/year</span>
                    </>
                  ) : (
                    <>
                      {proMonthly}EGP<span className="text-lg font-normal text-muted-foreground">/month</span>
                    </>
                  )}
                </motion.div>
                {isAnnual && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="line-through">{proMonthly * 12}EGP</span>
                    <span className="ml-2 text-green-600 font-medium">You save {proMonthly * 12 - proAnnual}EGP</span>
                  </p>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Up to 200 products</span>
                </li>
                {/* <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Analytics</span>
                </li> */}
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
                {/* <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground">Unlimited products</span>
                </li> */}
              </ul>
              <Button className="w-full bg-primary hover:bg-primary/90 transform hover:-translate-y-0.5 transition-all duration-200">Select Plan</Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}