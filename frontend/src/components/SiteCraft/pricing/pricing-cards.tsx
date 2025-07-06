"use client";

import { Check, Star, X } from "lucide-react";
import { Button } from "@/components/SiteCraft/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/SiteCraft/ui/card";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, Smartphone, Receipt, CheckCircle2, Shield, Lock } from "lucide-react";
import SimulatedPaymobIframe from "./SimulatedPaymobIframe";
import PaymentSuccessMessage from "./PaymentSuccessMessage";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<null | {name: string, price: number, period: string}>(null);
  const [paymobUrl, setPaymobUrl] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [paymentDetails, setPaymentDetails] = useState<any>({});
  const { isAuthenticated, checkSession } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subscriptionResult, setSubscriptionResult] = useState<any>(null);

  // Define pricing
  const basicMonthly = 100;
  const proMonthly = 300;
  const annualDiscount = 0.15; // 15% discount for annual billing

  const basicAnnual = Math.round(basicMonthly * 12 * (1 - annualDiscount));
  const proAnnual = Math.round(proMonthly * 12 * (1 - annualDiscount));

  if (selectedPlan && !paymentSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Paymob Iframe */}
          <SimulatedPaymobIframe 
            planName={selectedPlan.name} 
            planPrice={selectedPlan.price} 
            onSuccess={async (method) => {
              setLoading(true);
              try {
                const res = await fetch("http://localhost:8080/api/subscription", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  credentials: "include",
                  body: JSON.stringify({
                    plan: selectedPlan.name,
                    period: selectedPlan.period,
                    price: selectedPlan.price,
                    method
                  })
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                setSubscriptionResult(data);
                
                // Refresh session to get updated store status
                await checkSession();
                
                setPaymentSuccess(true);
              } catch (e) {
                alert("Subscription failed: " + e);
                setSelectedPlan(null);
                setPaymobUrl(null);
              } finally {
                setLoading(false);
              }
            }}
            onCancel={() => {
              setSelectedPlan(null);
              setPaymobUrl(null);
            }}
          />
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-10">
              <div className="text-lg font-semibold text-primary">Processing subscription...</div>
            </div>
          )}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span>Powered by Paymob</span>
              <span>•</span>
              <span>PCI DSS Compliant</span>
              <span>•</span>
              <span>CBE Licensed</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
        <PaymentSuccessMessage 
          planName={selectedPlan?.name} 
          transactionId={subscriptionResult?.paymentLog?.transactionId}
          onBack={() => {
            setPaymobUrl(null);
            setPaymentSuccess(false);
            setSelectedPlan(null);
            setPaymentMethod("");
            setPaymentDetails({});
            setSubscriptionResult(null);
          }} 
        />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h2 className="text-3xl font-bold text-center mb-6">
        Choose Your Subscription Plan
      </h2>

      {/* Enhanced Billing toggle */}
      <div className="flex flex-col items-center justify-center mb-12">
        <div
          className="bg-muted/50 p-1 rounded-full flex items-center mb-2 relative shadow-sm"
          style={{ width: "360px" }}
        >
          <button
            onClick={() => setIsAnnual(false)}
            className={`relative z-10 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-1 text-center ${
              !isAnnual
                ? "text-primary-foreground"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`relative z-10 py-2 text-sm font-medium rounded-full transition-all duration-200 flex-1 text-center ${
              isAnnual
                ? "text-primary-foreground"
                : "text-foreground/70 hover:text-foreground"
            }`}
          >
            Annual{" "}
            <span className="bg-green-100 text-green-700 text-xs px-1.5 py-0.5 rounded-full ml-1">
              15% off
            </span>
          </button>
          <div
            className="absolute top-1 bottom-1 rounded-full bg-primary shadow-md transition-all duration-300 ease-in-out"
            style={{
              width: "50%",
              left: isAnnual ? "50%" : "0%",
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {isAnnual
            ? "Save money with annual billing"
            : "Pay month-to-month with no long-term commitment"}
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
                  key={isAnnual ? "annual" : "monthly"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold mt-2"
                >
                  {isAnnual ? (
                    <>
                      {basicAnnual}EGP
                      <span className="text-lg font-normal text-muted-foreground">
                        /year
                      </span>
                    </>
                  ) : (
                    <>
                      {basicMonthly}EGP
                      <span className="text-lg font-normal text-muted-foreground">
                        /month
                      </span>
                    </>
                  )}
                </motion.div>
                {isAnnual && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="line-through">{basicMonthly * 12}EGP</span>
                    <span className="ml-2 text-green-600 font-medium">
                      You save {basicMonthly * 12 - basicAnnual}EGP
                    </span>
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
                {/* <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Standard support</span>
                </li> */}
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
                  <span className="text-muted-foreground">
                    Multiple user accounts
                  </span>
                </li>
              </ul>
              <Button
                className="w-full bg-logo-dark-button hover:bg-logo-dark-button/90 transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push("/signup");
                    return;
                  }
                  setSelectedPlan({
                    name: "Basic",
                    price: isAnnual ? basicAnnual : basicMonthly,
                    period: isAnnual ? "annual" : "monthly"
                  });
                  setPaymobUrl("https://accept.paymob.com/api/acceptance/iframes/your_iframe_id?payment_token=your_token");
                }}
              >
                Select Plan
              </Button>
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
                  key={isAnnual ? "pro-annual" : "pro-monthly"}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl font-bold mt-2"
                >
                  {isAnnual ? (
                    <>
                      {proAnnual}EGP
                      <span className="text-lg font-normal text-muted-foreground">
                        /year
                      </span>
                    </>
                  ) : (
                    <>
                      {proMonthly}EGP
                      <span className="text-lg font-normal text-muted-foreground">
                        /month
                      </span>
                    </>
                  )}
                </motion.div>
                {isAnnual && (
                  <p className="text-sm text-muted-foreground mt-1">
                    <span className="line-through">{proMonthly * 12}EGP</span>
                    <span className="ml-2 text-green-600 font-medium">
                      You save {proMonthly * 12 - proAnnual}EGP
                    </span>
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
                {/* <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Priority support</span>
                </li> */}
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>5 user accounts</span>
                </li>
                {/* <li className="flex items-center gap-2">
                  <X className="h-5 w-5 text-red-500" />
                  <span className="text-muted-foreground">Unlimited products</span>
                </li> */}
              </ul>
              <Button
                className="w-full bg-primary hover:bg-primary/90 transform hover:-translate-y-0.5 transition-all duration-200"
                onClick={() => {
                  if (!isAuthenticated) {
                    router.push("/signup");
                    return;
                  }
                  setSelectedPlan({
                    name: "Pro",
                    price: isAnnual ? proAnnual : proMonthly,
                    period: isAnnual ? "annual" : "monthly"
                  });
                  setPaymobUrl("https://accept.paymob.com/api/acceptance/iframes/your_iframe_id?payment_token=your_token");
                }}
              >
                Select Plan
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
