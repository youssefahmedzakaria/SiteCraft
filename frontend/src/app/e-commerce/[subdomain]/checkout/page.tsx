/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, Truck, Shield, Check } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { Label } from "@/components/e-commerce/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/e-commerce/ui/select";
import { Checkbox } from "@/components/e-commerce/ui/checkbox";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/e-commerce/ui/radio-group";
import { Separator } from "@/components/e-commerce/ui/separator";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function CheckoutPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [initialColors, setInitialColors] = useState({
    primary: "#000000",
    secondary: "#000000",
    accent: "#000000",
  });

  const { state, clearCart } = useCart();
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  const [formData, setFormData] = useState({
    // Shipping Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    // Payment Information
    paymentMethod: "card",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
    // Billing same as shipping
    billingSameAsShipping: true,
  });

  const shipping = state.total > 500 ? 0 : 25;
  const tax = state.total * 0.08;
  const total = state.total + shipping + tax;

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    // Here you would typically submit the order to your backend
    console.log("Order submitted:", { formData, items: state.items, total });
    clearCart();
    setStep(3);
  };

  if (state.items.length === 0 && step !== 3) {
    return (
      <div
        className={cn("min-h-screen pt-20 px-8 bg-[#ffffff]")}
        style={{ color: initialColors.primary }}
      >
        <div className="text-center pt-16 py-16">
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.primary }}
          >
            No items to checkout
          </h1>
          <p className="mb-8" style={{ color: initialColors.secondary }}>
            Your cart is empty. Add some items before proceeding to checkout.
          </p>
          <Link href={`/e-commerce/${subdomain}/products`}>
            <Button
              size="lg"
              style={{
                backgroundColor: initialColors.secondary,
                color: initialColors.accent,
              }}
            >
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Order Confirmation Step
  if (step === 3) {
    return (
      <div
        className={cn("min-h-screen pt-20 px-8 bg-[#ffffff]")}
        style={{ color: initialColors.primary }}
      >
        <div className="max-w-2xl pt-16 mx-auto text-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: initialColors.accent }}
          >
            <Check
              className="w-8 h-8"
              style={{ color: initialColors.secondary }}
            />
          </div>
          <h1
            className="text-3xl font-bold mb-4"
            style={{ color: initialColors.primary }}
          >
            Order Confirmed!
          </h1>
          <p className="mb-8" style={{ color: initialColors.secondary }}>
            Thank you for your purchase. Your order has been confirmed and will
            be shipped soon.
          </p>
          <div
            className="p-6 rounded-lg mb-8"
            style={{ backgroundColor: initialColors.accent }}
          >
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p className="text-sm" style={{ color: initialColors.secondary }}>
              Order #: ORD-{Date.now()}
            </p>
            <p className="text-sm" style={{ color: initialColors.secondary }}>
              Total: ${total.toFixed(2)}
            </p>
            <p className="text-sm" style={{ color: initialColors.secondary }}>
              Estimated delivery:{" "}
              {new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Link href={`/e-commerce/${subdomain}/products`}>
              <Button
                size="lg"
                style={{
                  backgroundColor: initialColors.secondary,
                  color: initialColors.accent,
                }}
              >
                Continue Shopping
              </Button>
            </Link>
            <Link href={`/e-commerce/${subdomain}/profile`}>
              <Button
                size="lg"
                style={{
                  backgroundColor: initialColors.secondary,
                  color: initialColors.accent,
                }}
              >
                View Orders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("min-h-screen pt-20 px-8 bg-[#ffffff]")}
      style={{ color: initialColors.primary }}
    >
      <div className="flex items-center pt-16 gap-4 mb-8">
        <h1 className="text-3xl font-bold" style={{ color: initialColors.primary }}>
          Checkout
        </h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center`}
            style={{
              backgroundColor: step >= 1 ? initialColors.secondary : "#e5e5e5",
              color: step >= 1 ? initialColors.accent : initialColors.secondary,
              border: `2px solid ${initialColors.secondary}`,
            }}
          >
            1
          </div>
          <span
            className="ml-2 text-sm font-medium"
            style={{ color: initialColors.secondary }}
          >
            Shipping
          </span>
        </div>
        <div
          className="w-16 h-px mx-4"
          style={{ backgroundColor: initialColors.secondary }}
        />
        <div className="flex items-center">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{
              backgroundColor:
                step === 2 ? initialColors.secondary : "transparent",
              color: step === 2 ? initialColors.accent : initialColors.secondary,
              border: `2px solid ${initialColors.secondary}`,
            }}
          >
            2
          </div>
          <span
            className="ml-2 text-sm font-medium"
            style={{ color: initialColors.secondary }}
          >
            Payment
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: initialColors.secondary }}
              >
                Shipping Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    value={formData.zipCode}
                    onChange={(e) =>
                      handleInputChange("zipCode", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={(value) => handleInputChange("country", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="ca">Canada</SelectItem>
                    <SelectItem value="uk">United Kingdom</SelectItem>
                    <SelectItem value="eg">Egypt</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={() => setStep(2)}
                className="w-full"
                size="lg"
                style={{
                  backgroundColor: initialColors.secondary,
                  color: initialColors.accent,
                }}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2
                className="text-xl font-semibold"
                style={{ color: initialColors.secondary }}
              >
                Payment Information
              </h2>

              <RadioGroup
                value={formData.paymentMethod}
                onValueChange={(value: string | boolean) =>
                  handleInputChange("paymentMethod", value)
                }
              >
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit/Debit Card
                  </Label>
                </div>
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal">PayPal</Label>
                </div>
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="cash" id="cash" />
                  <Label htmlFor="cash">Cash on Delivery</Label>
                </div>
              </RadioGroup>

              {formData.paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input
                      id="cardName"
                      value={formData.cardName}
                      onChange={(e) =>
                        handleInputChange("cardName", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        handleInputChange("cardNumber", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={(e) =>
                          handleInputChange("expiryDate", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={(e) =>
                          handleInputChange("cvv", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="billingSame"
                  checked={formData.billingSameAsShipping}
                  onCheckedChange={(checked) =>
                    handleInputChange("billingSameAsShipping", checked)
                  }
                />
                <Label htmlFor="billingSame">
                  Billing address same as shipping
                </Label>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                  style={{
                    borderColor: initialColors.secondary,
                    color: initialColors.secondary,
                  }}
                >
                  Back to Shipping
                </Button>
                <Button
                  onClick={handleSubmitOrder}
                  className="flex-1"
                  size="lg"
                  style={{
                    backgroundColor: initialColors.secondary,
                    color: initialColors.accent,
                  }}
                >
                  Place Order
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div
            className={cn("p-6 rounded-lg sticky top-24")}
            style={{
              backgroundColor: `${initialColors.secondary}20`,
              boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)",
            }}
          >
            <h2
              className="text-xl font-semibold mb-6"
              style={{ color: initialColors.secondary }}
            >
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div
                    className="relative w-12 h-12 rounded overflow-hidden"
                    style={{ backgroundColor: initialColors.accent }}
                  >
                    <Image
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p
                      className="text-sm font-medium"
                      style={{ color: initialColors.primary }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: initialColors.secondary }}
                    >
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p
                    className="text-sm font-medium"
                    style={{ color: initialColors.primary }}
                  >
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${state.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: initialColors.secondary }}
              >
                <Truck className="w-4 h-4" />
                <span>Free shipping on orders over $500</span>
              </div>
              <div
                className="flex items-center gap-2 text-sm"
                style={{ color: initialColors.secondary }}
              >
                <Shield className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
