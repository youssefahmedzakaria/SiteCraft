/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
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
import { getSession } from "@/lib/e-commerce/ecommerceAuth";

interface Address {
  id: string;
  type: string;
  city: string;
  streetNum: string;
  buildingNum: string;
  floorNum: string;
  apartmentNum: string;
  landmark: string;
  isDefault: boolean;
  title?: string;
}

export default function CheckoutPage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [initialColors, setInitialColors] = useState({
    primary: "#000000", // Pure black for primary text and headings
    secondary: "#000000", // Pure black for secondary text and borders
    accent: "#000000", // Pure black for accents and highlights
    foreground: "#ffffff", // Pure white for backgrounds and buttons
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

  const [shippingPrice, setShippingPrice] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null); // You may need to fetch this from session or context

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "",
    city: "",
    streetNum: "",
    buildingNum: "",
    floorNum: "",
    apartmentNum: "",
    landmark: "",
  });
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState({
    type: "",
    city: "",
    streetNum: "",
    buildingNum: "",
    floorNum: "",
    apartmentNum: "",
    landmark: "",
  });
  const [addressLoading, setAddressLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );

  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const subtotal = state.items.reduce((sum, item) => {
    const itemPrice =
      item.discountType !== null
        ? item.discountType === "amount"
          ? (item.originalPrice || 0) - Number(item.discountValue)
          : (item.originalPrice || 0) * (1 - Number(item.discountValue))
        : item.price || 0;
    return sum + itemPrice * item.quantity;
  }, 0);
  const total = subtotal + (shippingPrice ?? 0);

  // Fetch storeId from session on mount
  useEffect(() => {
    const fetchStoreId = async () => {
      const session = await getSession();
      if (session && session.storeId) {
        setStoreId(session.storeId);
      }
    };
    fetchStoreId();
  }, []);

  // Removed Paymob iframe message listener

  // Removed handlePaymentSuccess function

  const handleCreateOrder = async () => {
    if (!selectedAddressId) {
      setOrderError("Please select a shipping address");
      return;
    }

    setOrderLoading(true);
    setOrderError(null);

    try {
      const payload = {
        paymentMethod: formData.paymentMethod,
        amount: total,
        transactionId: Date.now().toString(),
        status: "success",
      };

      console.log("Creating order with payload:", payload);

      const res = await fetch(
        `http://localhost:8080/order/create/${selectedAddressId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("Order creation response:", data);

      if (data.success) {
        clearCart();
        setStep(3);
      } else {
        setOrderError(data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      setOrderError("Failed to create order");
    } finally {
      setOrderLoading(false);
    }
  };

  // Fetch shipping price when address changes
  useEffect(() => {
    if (!selectedAddressId || !addresses.length || !storeId) return;
    const addr = addresses.find((a: Address) => a.id === selectedAddressId);
    console.log("Selected address:", addr);
    if (!addr) return;
    setShippingLoading(true);
    setShippingError(null);
    fetch(
      `http://localhost:8080/api/store/shippingPrice?storeId=${storeId}&city=${encodeURIComponent(
        addr.city
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched shipping info:", data);
        if (data.success) {
          setShippingPrice(Number(data.shippingPrice));
        } else {
          setShippingError(data.message || "Failed to fetch shipping price");
          setShippingPrice(null);
        }
      })
      .catch(() => {
        setShippingError("Failed to fetch shipping price");
        setShippingPrice(null);
      })
      .finally(() => setShippingLoading(false));
  }, [selectedAddressId, addresses, storeId]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await fetch("http://localhost:8080/customer/getCustomer", {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success && data.customer) {
          setAddresses(
            (data.customer.addresses || []).map((addr: any) => ({
              id: String(addr.id),
              type: addr.title || "Home",
              city: addr.city || "",
              streetNum: addr.streetNum || "",
              buildingNum: addr.buildingNum || "",
              floorNum: addr.floorNum || "",
              apartmentNum: addr.apartmentNum || "",
              landmark: addr.landmark || "",
              isDefault: false,
            }))
          );
        } else {
          setAddresses([]);
        }
      } catch (error) {
        setAddresses([]);
      }
    };
    fetchCustomerData();
  }, []);

  const handleAddAddress = async () => {
    if (!newAddress.type || !newAddress.city) {
      alert("Please fill in all required fields");
      return;
    }
    setAddressLoading(true);
    try {
      const payload = {
        title: newAddress.type,
        city: newAddress.city,
        streetNum: newAddress.streetNum,
        buildingNum: newAddress.buildingNum,
        floorNum: newAddress.floorNum,
        apartmentNum: newAddress.apartmentNum,
        landmark: newAddress.landmark,
      };
      const res = await fetch("http://localhost:8080/customer/addAddress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddAddress(false);
        setNewAddress({
          type: "",
          city: "",
          streetNum: "",
          buildingNum: "",
          floorNum: "",
          apartmentNum: "",
          landmark: "",
        });
        const res2 = await fetch("http://localhost:8080/customer/getCustomer", {
          credentials: "include",
        });
        const data2 = await res2.json();
        setAddresses(
          (data2.customer.addresses || []).map((addr: any) => ({
            id: String(addr.id),
            type: addr.title || "Home",
            city: addr.city || "",
            streetNum: addr.streetNum || "",
            buildingNum: addr.buildingNum || "",
            floorNum: addr.floorNum || "",
            apartmentNum: addr.apartmentNum || "",
            landmark: addr.landmark || "",
            isDefault: false,
          }))
        );
        alert("Address added successfully!");
      } else {
        alert(data.message || "Failed to add address.");
      }
    } catch (error) {
      alert("An error occurred while adding the address.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    setAddressLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/customer/deleteAddress/${addressId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      if (data.success) {
        const res2 = await fetch("http://localhost:8080/customer/getCustomer", {
          credentials: "include",
        });
        const data2 = await res2.json();
        setAddresses(
          (data2.customer.addresses || []).map((addr: any) => ({
            id: String(addr.id),
            type: addr.title || "Home",
            city: addr.city || "",
            streetNum: addr.streetNum || "",
            buildingNum: addr.buildingNum || "",
            floorNum: addr.floorNum || "",
            apartmentNum: addr.apartmentNum || "",
            landmark: addr.landmark || "",
            isDefault: false,
          }))
        );
        alert("Address deleted successfully!");
      } else {
        alert(data.message || "Failed to delete address.");
      }
    } catch (error) {
      alert("An error occurred while deleting the address.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setEditAddress({
      type: address.type,
      city: address.city,
      streetNum: address.streetNum || "",
      buildingNum: address.buildingNum || "",
      floorNum: address.floorNum || "",
      apartmentNum: address.apartmentNum || "",
      landmark: address.landmark || "",
    });
  };

  const handleUpdateAddress = async () => {
    if (!editAddress.type || !editAddress.city) {
      alert("Please fill in all required fields");
      return;
    }
    setAddressLoading(true);
    try {
      const payload = {
        title: editAddress.type,
        city: editAddress.city,
        streetNum: editAddress.streetNum,
        buildingNum: editAddress.buildingNum,
        floorNum: editAddress.floorNum,
        apartmentNum: editAddress.apartmentNum,
        landmark: editAddress.landmark,
      };
      const res = await fetch(
        `http://localhost:8080/customer/updateAddress/${editingAddressId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        setEditingAddressId(null);
        setEditAddress({
          type: "",
          city: "",
          streetNum: "",
          buildingNum: "",
          floorNum: "",
          apartmentNum: "",
          landmark: "",
        });
        const res2 = await fetch("http://localhost:8080/customer/getCustomer", {
          credentials: "include",
        });
        const data2 = await res2.json();
        setAddresses(
          (data2.customer.addresses || []).map((addr: any) => ({
            id: String(addr.id),
            type: addr.title || "Home",
            city: addr.city || "",
            streetNum: addr.streetNum || "",
            buildingNum: addr.buildingNum || "",
            floorNum: addr.floorNum || "",
            apartmentNum: addr.apartmentNum || "",
            landmark: addr.landmark || "",
            isDefault: false,
          }))
        );
        alert("Address updated successfully!");
      } else {
        alert(data.message || "Failed to update address.");
      }
    } catch (error) {
      alert("An error occurred while updating the address.");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingAddressId(null);
    setEditAddress({
      type: "",
      city: "",
      streetNum: "",
      buildingNum: "",
      floorNum: "",
      apartmentNum: "",
      landmark: "",
    });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmitOrder = () => {
    // Here you would typically submit the order to your backend
    console.log("Order submitted:", { formData, items: state.items, total });
    clearCart();
    setStep(3);
  };

  // Removed handleProceedToPayment function

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
                color: initialColors.foreground,
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
            style={{ backgroundColor: initialColors.foreground }}
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
                  color: initialColors.foreground,
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
                  color: initialColors.foreground,
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
        <h1
          className="text-3xl font-bold"
          style={{ color: initialColors.primary }}
        >
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
              color:
                step >= 1 ? initialColors.foreground : initialColors.secondary,
              border: `2px solid ${initialColors.secondary}`,
            }}
          >
            1
          </div>
          <span
            className="ml-2 text-sm font-medium"
            style={{ color: initialColors.accent }}
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
              color:
                step === 2 ? initialColors.foreground : initialColors.secondary,
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
                Shipping Address
              </h2>
              <div className="space-y-4">
                {addresses.map((address: Address) => (
                  <div
                    key={address.id}
                    className="border rounded-lg p-4 flex items-start justify-between"
                    style={{ borderColor: initialColors.secondary }}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={selectedAddressId === address.id}
                          onChange={() =>
                            setSelectedAddressId(String(address.id))
                          }
                          className="mr-2"
                        />
                        <span
                          className="font-medium"
                          style={{ color: initialColors.primary }}
                        >
                          {address.type}
                        </span>
                      </div>
                      <p
                        className="text-sm mt-1"
                        style={{ color: initialColors.primary, opacity: 0.7 }}
                      >
                        {address.city}
                        <br />
                        {address.streetNum}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          color: initialColors.primary,
                        }}
                        onClick={() => handleEditAddress(address)}
                        disabled={addressLoading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 rounded-lg"
                        onClick={() => handleDeleteAddress(address.id)}
                        disabled={addressLoading}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              {editingAddressId && (
                <div
                  className="p-4 border rounded-lg"
                  style={{ borderColor: initialColors.accent }}
                >
                  <h4
                    className="text-lg font-semibold mb-4"
                    style={{ color: initialColors.primary }}
                  >
                    Edit Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="editAddressType"
                        style={{ color: initialColors.primary }}
                      >
                        Title *
                      </Label>
                      <Input
                        id="editAddressType"
                        value={editAddress.type}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            type: e.target.value,
                          })
                        }
                        placeholder="e.g., Home, Work, Office"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="editCity"
                        style={{ color: initialColors.primary }}
                      >
                        City *
                      </Label>
                      <Input
                        id="editCity"
                        value={editAddress.city}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            city: e.target.value,
                          })
                        }
                        placeholder="City"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="editStreetNum"
                        style={{ color: initialColors.primary }}
                      >
                        Street Number
                      </Label>
                      <Input
                        id="editStreetNum"
                        value={editAddress.streetNum}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            streetNum: e.target.value,
                          })
                        }
                        placeholder="Street Number"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="editBuildingNum"
                        style={{ color: initialColors.primary }}
                      >
                        Building Number
                      </Label>
                      <Input
                        id="editBuildingNum"
                        value={editAddress.buildingNum}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            buildingNum: e.target.value,
                          })
                        }
                        placeholder="Building Number"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="editFloorNum"
                        style={{ color: initialColors.primary }}
                      >
                        Floor Number
                      </Label>
                      <Input
                        id="editFloorNum"
                        value={editAddress.floorNum}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            floorNum: e.target.value,
                          })
                        }
                        placeholder="Floor Number"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="editApartmentNum"
                        style={{ color: initialColors.primary }}
                      >
                        Apartment Number
                      </Label>
                      <Input
                        id="editApartmentNum"
                        value={editAddress.apartmentNum}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            apartmentNum: e.target.value,
                          })
                        }
                        placeholder="Apartment Number"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="editLandmark"
                        style={{ color: initialColors.primary }}
                      >
                        Landmark
                      </Label>
                      <Input
                        id="editLandmark"
                        value={editAddress.landmark}
                        onChange={(e) =>
                          setEditAddress({
                            ...editAddress,
                            landmark: e.target.value,
                          })
                        }
                        placeholder="Landmark"
                        className="border-2 rounded-lg"
                        style={{ borderColor: initialColors.secondary }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleUpdateAddress}
                      className="text-white hover:opacity-90 rounded-lg"
                      style={{ backgroundColor: initialColors.secondary }}
                      disabled={addressLoading}
                    >
                      Update Address
                    </Button>
                    <Button
                      onClick={handleCancelEdit}
                      variant="outline"
                      className="border-2 rounded-lg"
                      style={{
                        borderColor: initialColors.secondary,
                        color: initialColors.primary,
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              {!showAddAddress ? (
                <Button
                  onClick={() => setShowAddAddress(true)}
                  variant="outline"
                  className="mt-4 border-2 rounded-lg"
                  style={{
                    borderColor: initialColors.secondary,
                    color: initialColors.secondary,
                  }}
                >
                  Add New Address
                </Button>
              ) : (
                <div
                  className="mt-6 p-4 border rounded-lg"
                  style={{
                    borderColor: initialColors.secondary,
                    backgroundColor: initialColors.foreground,
                  }}
                >
                  <h3
                    className="text-lg font-semibold mb-4"
                    style={{ color: initialColors.primary }}
                  >
                    Add New Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="addressType"
                        style={{ color: initialColors.primary }}
                      >
                        Title *
                      </Label>
                      <Input
                        id="addressType"
                        value={newAddress.type}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, type: e.target.value })
                        }
                        placeholder="e.g., Home, Work, Office"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="city"
                        style={{ color: initialColors.primary }}
                      >
                        City *
                      </Label>
                      <Input
                        id="city"
                        value={newAddress.city}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, city: e.target.value })
                        }
                        placeholder="City"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="streetNum"
                        style={{ color: initialColors.primary }}
                      >
                        Street Number
                      </Label>
                      <Input
                        id="streetNum"
                        value={newAddress.streetNum}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            streetNum: e.target.value,
                          })
                        }
                        placeholder="Street Number"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="buildingNum"
                        style={{ color: initialColors.primary }}
                      >
                        Building Number
                      </Label>
                      <Input
                        id="buildingNum"
                        value={newAddress.buildingNum}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            buildingNum: e.target.value,
                          })
                        }
                        placeholder="Building Number"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="floorNum"
                        style={{ color: initialColors.primary }}
                      >
                        Floor Number
                      </Label>
                      <Input
                        id="floorNum"
                        value={newAddress.floorNum}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            floorNum: e.target.value,
                          })
                        }
                        placeholder="Floor Number"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="apartmentNum"
                        style={{ color: initialColors.primary }}
                      >
                        Apartment Number
                      </Label>
                      <Input
                        id="apartmentNum"
                        value={newAddress.apartmentNum}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            apartmentNum: e.target.value,
                          })
                        }
                        placeholder="Apartment Number"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label
                        htmlFor="landmark"
                        style={{ color: initialColors.primary }}
                      >
                        Landmark
                      </Label>
                      <Input
                        id="landmark"
                        value={newAddress.landmark}
                        onChange={(e) =>
                          setNewAddress({
                            ...newAddress,
                            landmark: e.target.value,
                          })
                        }
                        placeholder="Landmark"
                        className="border-2 rounded-lg"
                        style={{
                          borderColor: initialColors.secondary,
                          backgroundColor: initialColors.foreground,
                          color: initialColors.primary,
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      onClick={handleAddAddress}
                      className="text-white hover:opacity-90 rounded-lg"
                      style={{ backgroundColor: initialColors.secondary }}
                    >
                      Save Address
                    </Button>
                    <Button
                      onClick={() => setShowAddAddress(false)}
                      variant="outline"
                      className="border-2 rounded-lg"
                      style={{
                        borderColor: initialColors.secondary,
                        color: initialColors.secondary,
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
              <Button
                onClick={() => setStep(2)}
                className="w-full mt-6"
                size="lg"
                style={{
                  backgroundColor: initialColors.secondary,
                  color: initialColors.foreground,
                }}
                disabled={!selectedAddressId}
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
                onValueChange={(value: string | boolean) => {
                  handleInputChange("paymentMethod", value);
                  // Removed Paymob wallet selection and mobile number handling
                }}
              >
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit Card
                  </Label>
                </div>
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="valu" id="valu" />
                  <Label htmlFor="valu">Valu</Label>
                </div>
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="ewallet" id="ewallet" />
                  <Label htmlFor="ewallet">E-Wallets</Label>
                </div>
                <div
                  className="flex items-center space-x-2 p-4 border rounded-lg"
                  style={{ borderColor: initialColors.secondary }}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="flex items-center gap-2">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>
              {/* Removed Valu mobile input */}
              {/* Removed E-Wallets wallet selection and mobile input */}
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
                {/* Proceed to Payment button logic */}
                {(formData.paymentMethod === "card" ||
                  formData.paymentMethod === "valu" ||
                  formData.paymentMethod === "ewallet" ||
                  formData.paymentMethod === "cod") && (
                  <Button
                    onClick={handleCreateOrder}
                    className="flex-1"
                    size="lg"
                    style={{
                      backgroundColor: initialColors.secondary,
                      color: initialColors.foreground,
                    }}
                    disabled={orderLoading}
                  >
                    Proceed to Payment
                  </Button>
                )}
              </div>
              {/* Error Display */}
              {orderError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{orderError}</p>
                </div>
              )}
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

            {selectedAddressId && (
              <div
                className="mb-4 p-3 rounded border"
                style={{
                  borderColor: initialColors.secondary,
                  backgroundColor: "#fff",
                }}
              >
                <h3
                  className="text-base font-semibold mb-1"
                  style={{ color: initialColors.secondary }}
                >
                  Shipping To:
                </h3>
                {(() => {
                  const addr = addresses.find(
                    (a: Address) => a.id === selectedAddressId
                  );
                  if (!addr) return null;
                  return (
                    <div
                      className="text-sm"
                      style={{ color: initialColors.secondary }}
                    >
                      <div>
                        <span className="font-medium">{addr.type}</span>
                      </div>
                      <div>
                        {addr.city}, {addr.streetNum}
                      </div>
                      {addr.buildingNum && (
                        <div>Building: {addr.buildingNum}</div>
                      )}
                      {addr.floorNum && <div>Floor: {addr.floorNum}</div>}
                      {addr.apartmentNum && (
                        <div>Apartment: {addr.apartmentNum}</div>
                      )}
                      {addr.landmark && <div>Landmark: {addr.landmark}</div>}
                    </div>
                  );
                })()}
              </div>
            )}

            <div className="space-y-4 mb-6">
              {state.items.map((item) => {
                const itemPrice =
                  item.discountType !== null
                    ? item.discountType === "amount"
                      ? (item.originalPrice || 0) - Number(item.discountValue)
                      : (item.originalPrice || 0) *
                        (1 - Number(item.discountValue))
                    : item.price || 0;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div
                      className="relative w-12 h-12 rounded overflow-hidden"
                      style={{ backgroundColor: initialColors.secondary }}
                    >
                      <Image
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p
                        className="text-sm font-medium"
                        style={{ color: initialColors.secondary }}
                      >
                        {item.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: initialColors.secondary }}
                      >
                        Qty: {item.quantity}
                      </p>

                      <p
                        className="text-xs"
                        style={{ color: initialColors.secondary }}
                      >
                        Sku: {item.sku}
                      </p>
                    </div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: initialColors.secondary }}
                    >
                      ${(itemPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                );
              })}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shippingLoading
                    ? "Loading..."
                    : shippingPrice !== null
                    ? `$${shippingPrice.toFixed(2)}`
                    : "-"}
                </span>
              </div>

              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>
                  {shippingLoading || shippingPrice === null
                    ? "-"
                    : `$${total.toFixed(2)}`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
