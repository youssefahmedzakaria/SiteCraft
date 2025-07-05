/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { User, Package, Settings, MapPin, Bell, LogOut } from "lucide-react";
import { Button } from "@/components/e-commerce/ui/button";
import { Input } from "@/components/e-commerce/ui/input";
import { Label } from "@/components/e-commerce/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/e-commerce/ui/tabs";
import { Separator } from "@/components/e-commerce/ui/separator";
import { Switch } from "@/components/e-commerce/ui/switch";
import { usePathname, useRouter } from "next/navigation";
import { Session } from "inspector/promises";
import { getSession } from "@/lib/e-commerce/ecommerceAuth";

// Theme configuration matching product page
const defaultTheme = {
  backgroundColor: "white",
  textColor: "black",
  accentColor: "white",
  secondaryColor: "black",
  borderRadius: "rounded-lg",
  fontFamily: "font-sans",
};

interface UserData {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
}

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shipping?: number;
}

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
}

export default function ProfilePage() {
  const path = usePathname();
  const pathSegments = path.split("/");
  const subdomain = pathSegments[2];

  const [mock,setMock] = useState<UserData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [profileData, setProfileData] = useState<UserData | null>(null);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      type: "Home",
      city: "hdaek el kobba",
      streetNum: "ahmed shafeek street",
      buildingNum: "",
      floorNum: "",
      apartmentNum: "",
      landmark: "",
      isDefault: true,
    },
  ]);
  const [newAddress, setNewAddress] = useState({
    type: "",
    city: "",
    streetNum: "",
    buildingNum: "",
    floorNum: "",
    apartmentNum: "",
    landmark: "",
  });
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
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

  const [orders, setOrders] = useState<Order[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  useEffect(() => {
    const checkSessionAndFetch = async () => {
      setIsLoading(true);
      const session = await getSession();
      if (!session || !session.customerId) {
        router.push(`/e-commerce/${subdomain}/login`);
        return;
      }
      // If customerId exists, fetch customer data
      await fetchCustomerData();
    };
    checkSessionAndFetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchCustomerData = async () => {
    try {
      const res = await fetch("http://localhost:8080/customer/getCustomer", {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success && data.customer) {
        // Split name into firstName and lastName if possible
        let firstName = "";
        let lastName = "";
        if (data.customer.name) {
          const nameParts = data.customer.name.split(" ");
          firstName = nameParts[0] || "";
          lastName = nameParts.slice(1).join(" ") || "";
        }
        setProfileData({
          id: data.customer.id,
          firstName,
          lastName,
          email: data.customer.email,
          phone: data.customer.phone,
          avatar: data.customer.avatar || "/placeholder.png?height=100&width=100",
        });
        // Map backend addresses to frontend Address type
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
            isDefault: false, // Backend does not provide, so default to false
          }))
        );
        // Map backend orders to frontend Order type
        setOrders(
          (data.customer.orders || []).map((order: any) => ({
            id: String(order.id),
            date: order.issueDate ? order.issueDate : new Date().toISOString(),
            status: order.status || "Pending",
            total: order.price || 0,
            shipping: order.shipping?.cost ?? 0,
            items: (order.orderProducts || []).map((prod: any) => ({
              name: prod.sku || "Product",
              quantity: prod.quantity || 1,
              price: prod.price || 0,
            })),
          }))
        );
      } else {
        setProfileData(null);
        setAddresses([]);
        setOrders([]);
      }
    } catch (error) {
      setProfileData(null);
      setAddresses([]);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (field: keyof UserData, value: string) => {
    setProfileData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100";
      case "Shipped":
        return "text-blue-600 bg-blue-100";
      case "Processing":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      // Optionally handle error, but always redirect
    } finally {
      router.push(`/e-commerce/${subdomain}/login`);
    }
  };

  const handleSaveProfile = async () => {
    if (!profileData) return;
    setIsSaving(true);
    try {
      // Combine firstName and lastName into name
      const payload = {
        name: `${profileData.firstName} ${profileData.lastName}`.trim(),
        email: profileData.email,
        phone: profileData.phone,
      };
      const res = await fetch("http://localhost:8080/customer/updateCustomerInfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        alert("Profile updated successfully!");
        // Optionally, refetch profile data here
      } else {
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      alert("An error occurred while updating the profile.");
    } finally {
      setIsSaving(false);
    }
  };

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
        setNewAddress({ type: "", city: "", streetNum: "", buildingNum: "", floorNum: "", apartmentNum: "", landmark: "" });
        await fetchCustomerData();
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
    if (!window.confirm("Are you sure you want to delete this address?")) return;
    setAddressLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/customer/deleteAddress/${addressId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        await fetchCustomerData();
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
      const res = await fetch(`http://localhost:8080/customer/updateAddress/${editingAddressId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setEditingAddressId(null);
        setEditAddress({ type: "", city: "", streetNum: "", buildingNum: "", floorNum: "", apartmentNum: "", landmark: "" });
        await fetchCustomerData();
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

  const handleViewOrderDetails = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab("order-details");
  };

  const handleBackToOrders = () => {
    setSelectedOrderId(null);
    setActiveTab("orders");
  };

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${defaultTheme.fontFamily}`}
        style={{ backgroundColor: defaultTheme.backgroundColor }}
      >
        <div className="text-center">
          <div
            className="animate-spin rounded-full h-32 w-32 border-b-2 mx-auto"
            style={{ borderColor: defaultTheme.secondaryColor }}
          ></div>
          <p className="mt-4" style={{ color: defaultTheme.textColor }}>
            Loading...
          </p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  return (
    <div
      className={`min-h-screen pt-20 ${defaultTheme.fontFamily}`}
      style={{ backgroundColor: defaultTheme.backgroundColor }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 ${defaultTheme.borderRadius} flex items-center justify-center`}
                style={{
                  background: `linear-gradient(135deg, ${defaultTheme.secondaryColor} 0%, #8B4A6B 100%)`,
                }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1
                  className="text-3xl font-bold"
                  style={{ color: defaultTheme.textColor }}
                >
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                <p style={{ color: defaultTheme.textColor, opacity: 0.7 }}>
                  {profileData?.email}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`flex items-center gap-2 ${defaultTheme.borderRadius} border-2`}
              style={{
                backgroundColor: defaultTheme.backgroundColor,
                borderColor: defaultTheme.secondaryColor,
                color: defaultTheme.textColor,
              }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList
              className={`grid w-full grid-cols-2 ${defaultTheme.borderRadius}`}
              style={{ backgroundColor: defaultTheme.secondaryColor }}
            >
              <TabsTrigger
                value="profile"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="flex items-center gap-2 text-white data-[state=active]:bg-white data-[state=active]:text-black"
              >
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div
                className={`bg-white ${defaultTheme.borderRadius} shadow p-6`}
              >
                <div className="mb-6">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: defaultTheme.textColor }}
                  >
                    Personal Information
                  </h2>
                  <p style={{ color: defaultTheme.textColor, opacity: 0.7 }}>
                    Update your personal details
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="firstName"
                        style={{ color: defaultTheme.textColor }}
                      >
                        First Name
                      </Label>
                      <Input
                        id="firstName"
                        value={profileData?.firstName || ""}
                        onChange={(e) =>
                          handleProfileUpdate("firstName", e.target.value)
                        }
                        className={`border-2 ${defaultTheme.borderRadius}`}
                        style={{ borderColor: defaultTheme.secondaryColor }}
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="lastName"
                        style={{ color: defaultTheme.textColor }}
                      >
                        Last Name
                      </Label>
                      <Input
                        id="lastName"
                        value={profileData?.lastName || ""}
                        onChange={(e) =>
                          handleProfileUpdate("lastName", e.target.value)
                        }
                        className={`border-2 ${defaultTheme.borderRadius}`}
                        style={{ borderColor: defaultTheme.secondaryColor }}
                      />
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      style={{ color: defaultTheme.textColor }}
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData?.email || ""}
                      onChange={(e) => handleProfileUpdate("email", e.target.value)}
                      className={`border-2 ${defaultTheme.borderRadius}`}
                      style={{ borderColor: defaultTheme.secondaryColor }}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="phone"
                      style={{ color: defaultTheme.textColor }}
                    >
                      Phone
                    </Label>
                    <Input
                      id="phone"
                      value={profileData?.phone || ""}
                      onChange={(e) =>
                        handleProfileUpdate("phone", e.target.value)
                      }
                      className={`border-2 ${defaultTheme.borderRadius}`}
                      style={{ borderColor: defaultTheme.secondaryColor }}
                    />
                  </div>
                  <Button
                    onClick={handleSaveProfile}
                    className={`text-white hover:opacity-90 ${defaultTheme.borderRadius}`}
                    style={{ backgroundColor: defaultTheme.secondaryColor }}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              <div
                className={`bg-white ${defaultTheme.borderRadius} shadow p-6`}
              >
                <div className="flex items-center gap-2 mb-6">
                  <MapPin
                    className="w-5 h-5"
                    style={{ color: defaultTheme.textColor }}
                  />
                  <div>
                    <h2
                      className="text-xl font-semibold"
                      style={{ color: defaultTheme.textColor }}
                    >
                      Addresses
                    </h2>
                    <p style={{ color: defaultTheme.textColor, opacity: 0.7 }}>
                      Manage your shipping addresses
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="space-y-4">
                      <div
                        className={`border ${defaultTheme.borderRadius} p-4`}
                        style={{ borderColor: defaultTheme.secondaryColor }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <p
                                className="font-medium"
                                style={{ color: defaultTheme.textColor }}
                              >
                                {address.type}
                              </p>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p
                              className="text-sm mt-1"
                              style={{
                                color: defaultTheme.textColor,
                                opacity: 0.7,
                              }}
                            >
                              {address.city}<br />
                              {address.streetNum}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={`border-2 ${defaultTheme.borderRadius}`}
                              style={{
                                borderColor: defaultTheme.secondaryColor,
                                color: defaultTheme.textColor,
                              }}
                              onClick={() => handleEditAddress(address)}
                              disabled={addressLoading}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={`text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300 ${defaultTheme.borderRadius}`}
                              onClick={() => handleDeleteAddress(address.id)}
                              disabled={addressLoading}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>

                      {editingAddressId === address.id && (
                        <div className={`p-4 border ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor, backgroundColor: defaultTheme.accentColor }}>
                          <h4 className="text-lg font-semibold mb-4" style={{ color: defaultTheme.textColor }}>
                            Edit Address
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="editAddressType" style={{ color: defaultTheme.textColor }}>Title *</Label>
                              <Input
                                id="editAddressType"
                                value={editAddress.type}
                                onChange={e => setEditAddress({ ...editAddress, type: e.target.value })}
                                placeholder="e.g., Home, Work, Office"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="editCity" style={{ color: defaultTheme.textColor }}>City *</Label>
                              <Input
                                id="editCity"
                                value={editAddress.city}
                                onChange={e => setEditAddress({ ...editAddress, city: e.target.value })}
                                placeholder="City"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="editStreetNum" style={{ color: defaultTheme.textColor }}>Street Number</Label>
                              <Input
                                id="editStreetNum"
                                value={editAddress.streetNum}
                                onChange={e => setEditAddress({ ...editAddress, streetNum: e.target.value })}
                                placeholder="Street Number"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="editBuildingNum" style={{ color: defaultTheme.textColor }}>Building Number</Label>
                              <Input
                                id="editBuildingNum"
                                value={editAddress.buildingNum}
                                onChange={e => setEditAddress({ ...editAddress, buildingNum: e.target.value })}
                                placeholder="Building Number"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="editFloorNum" style={{ color: defaultTheme.textColor }}>Floor Number</Label>
                              <Input
                                id="editFloorNum"
                                value={editAddress.floorNum}
                                onChange={e => setEditAddress({ ...editAddress, floorNum: e.target.value })}
                                placeholder="Floor Number"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                            <div>
                              <Label htmlFor="editApartmentNum" style={{ color: defaultTheme.textColor }}>Apartment Number</Label>
                              <Input
                                id="editApartmentNum"
                                value={editAddress.apartmentNum}
                                onChange={e => setEditAddress({ ...editAddress, apartmentNum: e.target.value })}
                                placeholder="Apartment Number"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                            <div className="md:col-span-2">
                              <Label htmlFor="editLandmark" style={{ color: defaultTheme.textColor }}>Landmark</Label>
                              <Input
                                id="editLandmark"
                                value={editAddress.landmark}
                                onChange={e => setEditAddress({ ...editAddress, landmark: e.target.value })}
                                placeholder="Landmark"
                                className={`border-2 ${defaultTheme.borderRadius}`}
                                style={{ borderColor: defaultTheme.secondaryColor }}
                              />
                            </div>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button onClick={handleUpdateAddress} className={`text-white hover:opacity-90 ${defaultTheme.borderRadius}`}
                              style={{ backgroundColor: defaultTheme.secondaryColor }} disabled={addressLoading}>
                              Update Address
                            </Button>
                            <Button onClick={handleCancelEdit} variant="outline" className={`border-2 ${defaultTheme.borderRadius}`}
                              style={{ borderColor: defaultTheme.secondaryColor, color: defaultTheme.textColor }}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!showAddAddress ? (
                  <Button
                    onClick={() => setShowAddAddress(true)}
                    variant="outline"
                    className={`mt-4 border-2 ${defaultTheme.borderRadius}`}
                    style={{
                      borderColor: defaultTheme.secondaryColor,
                      color: defaultTheme.textColor,
                    }}
                  >
                    Add New Address
                  </Button>
                ) : (
                  <div
                    className={`mt-6 p-4 border ${defaultTheme.borderRadius}`}
                    style={{
                      borderColor: defaultTheme.secondaryColor,
                      backgroundColor: defaultTheme.accentColor,
                    }}
                  >
                    <h3
                      className="text-lg font-semibold mb-4"
                      style={{ color: defaultTheme.textColor }}
                    >
                      Add New Address
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="addressType" style={{ color: defaultTheme.textColor }}>Title *</Label>
                        <Input
                          id="addressType"
                          value={newAddress.type}
                          onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}
                          placeholder="e.g., Home, Work, Office"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city" style={{ color: defaultTheme.textColor }}>City *</Label>
                        <Input
                          id="city"
                          value={newAddress.city}
                          onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                          placeholder="City"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="streetNum" style={{ color: defaultTheme.textColor }}>Street Number</Label>
                        <Input
                          id="streetNum"
                          value={newAddress.streetNum}
                          onChange={e => setNewAddress({ ...newAddress, streetNum: e.target.value })}
                          placeholder="Street Number"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buildingNum" style={{ color: defaultTheme.textColor }}>Building Number</Label>
                        <Input
                          id="buildingNum"
                          value={newAddress.buildingNum}
                          onChange={e => setNewAddress({ ...newAddress, buildingNum: e.target.value })}
                          placeholder="Building Number"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="floorNum" style={{ color: defaultTheme.textColor }}>Floor Number</Label>
                        <Input
                          id="floorNum"
                          value={newAddress.floorNum}
                          onChange={e => setNewAddress({ ...newAddress, floorNum: e.target.value })}
                          placeholder="Floor Number"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                      <div>
                        <Label htmlFor="apartmentNum" style={{ color: defaultTheme.textColor }}>Apartment Number</Label>
                        <Input
                          id="apartmentNum"
                          value={newAddress.apartmentNum}
                          onChange={e => setNewAddress({ ...newAddress, apartmentNum: e.target.value })}
                          placeholder="Apartment Number"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="landmark" style={{ color: defaultTheme.textColor }}>Landmark</Label>
                        <Input
                          id="landmark"
                          value={newAddress.landmark}
                          onChange={e => setNewAddress({ ...newAddress, landmark: e.target.value })}
                          placeholder="Landmark"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{ borderColor: defaultTheme.secondaryColor }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        onClick={handleAddAddress}
                        className={`text-white hover:opacity-90 ${defaultTheme.borderRadius}`}
                        style={{ backgroundColor: defaultTheme.secondaryColor }}
                      >
                        Save Address
                      </Button>
                      <Button
                        onClick={() => setShowAddAddress(false)}
                        variant="outline"
                        className={`border-2 ${defaultTheme.borderRadius}`}
                        style={{
                          borderColor: defaultTheme.secondaryColor,
                          color: defaultTheme.textColor,
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <div
                className={`bg-white ${defaultTheme.borderRadius} shadow p-6`}
              >
                <div className="mb-6">
                  <h2
                    className="text-xl font-semibold"
                    style={{ color: defaultTheme.textColor }}
                  >
                    Order History
                  </h2>
                  <p style={{ color: defaultTheme.textColor, opacity: 0.7 }}>
                    View your past orders and track current ones
                  </p>
                </div>
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className={`border ${defaultTheme.borderRadius} p-4 hover:shadow-md transition-shadow`}
                      style={{ borderColor: defaultTheme.secondaryColor }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p
                            className="font-medium"
                            style={{ color: defaultTheme.textColor }}
                          >
                            Order {order.id}
                          </p>
                          <p
                            className="text-sm"
                            style={{
                              color: defaultTheme.textColor,
                              opacity: 0.7,
                            }}
                          >
                            Placed on{" "}
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          <p
                            className="text-lg font-semibold mt-1"
                            style={{ color: defaultTheme.textColor }}
                          >
                            ${order.total}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {order.items.map((item, index) => (
                          <p
                            key={index}
                            className="text-sm"
                            style={{
                              color: defaultTheme.textColor,
                              opacity: 0.7,
                            }}
                          >
                            {item.name} × {item.quantity}
                          </p>
                        ))}
                      </div>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => handleViewOrderDetails(order.id)}
                          variant="outline"
                          size="sm"
                          className={`border-2 ${defaultTheme.borderRadius}`}
                          style={{
                            borderColor: defaultTheme.secondaryColor,
                            color: defaultTheme.textColor,
                          }}
                        >
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className={`border-2 ${defaultTheme.borderRadius}`}
                            style={{
                              borderColor: defaultTheme.secondaryColor,
                              color: defaultTheme.textColor,
                            }}
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            

            <TabsContent value="order-details" className="space-y-6">
              {selectedOrderId && (
                <div
                  className={`bg-white ${defaultTheme.borderRadius} shadow p-6`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <Button
                      onClick={handleBackToOrders}
                      variant="outline"
                      size="sm"
                      className={`border-2 ${defaultTheme.borderRadius}`}
                      style={{
                        borderColor: defaultTheme.secondaryColor,
                        color: defaultTheme.textColor,
                      }}
                    >
                      ← Back to Orders
                    </Button>
                    <div>
                      <h2
                        className="text-xl font-semibold"
                        style={{ color: defaultTheme.textColor }}
                      >
                        Order Details - {selectedOrderId}
                      </h2>
                    </div>
                  </div>

                  {(() => {
                    const order = orders.find(
                      (o) => o.id === selectedOrderId
                    );
                    if (!order) return null;

                    const shipping = order.shipping ?? 0;
                    const tax = order.total * 0.08;
                    const subtotal = order.total - tax - shipping;

                    return (
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Order Items */}
                        <div className="lg:col-span-2 space-y-6">
                          <div>
                            <h3
                              className="text-lg font-semibold mb-4"
                              style={{ color: defaultTheme.textColor }}
                            >
                              Order Items ({order.items.length})
                            </h3>
                            <div className="space-y-4">
                              {order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center gap-4 p-4 border ${defaultTheme.borderRadius}`}
                                  style={{
                                    backgroundColor: `${defaultTheme.secondaryColor}20`,
                                    borderColor: defaultTheme.secondaryColor,
                                  }}
                                >
                                  <div
                                    className={`relative w-20 h-20 bg-gray-100 ${defaultTheme.borderRadius} overflow-hidden`}
                                  >
                                    <Image
                                      src="/placeholder.png?height=80&width=80"
                                      alt={item.name}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4
                                      className="font-medium"
                                      style={{ color: defaultTheme.textColor }}
                                    >
                                      {item.name}
                                    </h4>
                                    <p
                                      className="text-sm"
                                      style={{
                                        color: defaultTheme.textColor,
                                        opacity: 0.7,
                                      }}
                                    >
                                      Quantity: {item.quantity}
                                    </p>
                                    <p
                                      className="text-lg font-semibold"
                                      style={{ color: defaultTheme.textColor }}
                                    >
                                      ${item.price}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p
                                      className="font-semibold"
                                      style={{ color: defaultTheme.textColor }}
                                    >
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                          <div
                            className={`p-6 ${defaultTheme.borderRadius} sticky top-24`}
                            style={{
                              backgroundColor: `${defaultTheme.secondaryColor}20`,
                            }}
                          >
                            <h3
                              className="text-xl font-semibold mb-6"
                              style={{ color: defaultTheme.textColor }}
                            >
                              Order Summary
                            </h3>

                            <div className="space-y-4">
                              <div className="flex justify-between">
                                <span style={{ color: defaultTheme.textColor }}>
                                  Subtotal
                                </span>
                                <span style={{ color: defaultTheme.textColor }}>
                                  ${subtotal.toFixed(2)}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span style={{ color: defaultTheme.textColor }}>
                                  Shipping
                                </span>
                                <span style={{ color: defaultTheme.textColor }}>
                                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                                </span>
                              </div>

                              <div className="flex justify-between">
                                <span style={{ color: defaultTheme.textColor }}>
                                  Tax
                                </span>
                                <span style={{ color: defaultTheme.textColor }}>
                                  ${tax.toFixed(2)}
                                </span>
                              </div>

                              <hr
                                style={{
                                  borderColor: defaultTheme.secondaryColor,
                                }}
                              />

                              <div className="flex justify-between text-lg font-semibold">
                                <span style={{ color: defaultTheme.textColor }}>
                                  Total
                                </span>
                                <span style={{ color: defaultTheme.textColor }}>
                                  ${order.total.toFixed(2)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-6 space-y-4">
                              <div>
                                <h4
                                  className="font-medium mb-2"
                                  style={{ color: defaultTheme.textColor }}
                                >
                                  Order Status
                                </h4>
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                              </div>

                              <div>
                                <h4
                                  className="font-medium mb-2"
                                  style={{ color: defaultTheme.textColor }}
                                >
                                  Order Date
                                </h4>
                                <p
                                  className="text-sm"
                                  style={{
                                    color: defaultTheme.textColor,
                                    opacity: 0.7,
                                  }}
                                >
                                  {new Date(order.date).toLocaleDateString()}
                                </p>
                              </div>

                              {order.status === "Delivered" && (
                                <Button
                                  className={`w-full text-white hover:opacity-90 ${defaultTheme.borderRadius}`}
                                  style={{
                                    backgroundColor:
                                      defaultTheme.secondaryColor,
                                  }}
                                >
                                  Reorder Items
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
