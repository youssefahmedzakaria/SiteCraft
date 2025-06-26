"use client"

import React, { useState, createContext, useContext, type ReactNode, type FormEvent } from "react"
import { User, Package, Settings, MapPin, Bell, LogOut, Eye, EyeOff, CreditCard } from "lucide-react"

// Types
interface UserData {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
}

interface AuthContextType {
  user: UserData | null
  login: (email: string, password: string) => Promise<{ success: boolean }>
  register: (userData: Partial<UserData>) => Promise<{ success: boolean }>
  logout: () => void
  isLoading: boolean
}

interface CartContextType {
  state: { items: any[] }
  addToCart: (item: any) => void
}

interface FavoritesContextType {
  state: { items: any[] }
  removeFromFavorites: (id: string) => void
}

// Auth Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider
function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const login = async (email: string, password: string): Promise<{ success: boolean }> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful login
    const mockUser: UserData = {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      email: email,
      phone: "+1 234 567 890",
      avatar: "/placeholder.svg?height=100&width=100",
    }
    setUser(mockUser)
    setIsLoading(false)
    return { success: true }
  }

  const register = async (userData: Partial<UserData>): Promise<{ success: boolean }> => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock successful registration
    const newUser: UserData = {
      id: Date.now(),
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      avatar: "/placeholder.svg?height=100&width=100",
    }
    setUser(newUser)
    setIsLoading(false)
    return { success: true }
  }

  const logout = (): void => {
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

// Hook to use auth context
function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined)
function useCart(): CartContextType {
  const context = useContext(CartContext)
  return context || { state: { items: [] }, addToCart: () => {} }
}

// Mock Favorites Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)
function useFavorites(): FavoritesContextType {
  const context = useContext(FavoritesContext)
  return context || { state: { items: [] }, removeFromFavorites: () => {} }
}

// UI Components
type ButtonVariant = "default" | "outline" | "destructive";
type ButtonSize = "default" | "sm" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
}

function Button({
  children,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variants: Record<ButtonVariant, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  }
  const sizes: Record<ButtonSize, string> = {
    default: "h-10 py-2 px-4",
    sm: "h-8 px-3 text-sm",
    lg: "h-12 px-8",
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

function Input({ className = "", ...props }: any) {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  )
}

function Label({ children, className = "", ...props }: any) {
  return (
    <label
      className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}
      {...props}
    >
      {children}
    </label>
  )
}

function Tabs({ children, value, onValueChange, className = "" }: any) {
  return (
    <div
      className={className}
      data-value={value}
      onClick={(e: any) => {
        const trigger = e.target.closest("[data-trigger]")
        if (trigger && onValueChange) {
          onValueChange(trigger.dataset.trigger)
        }
      }}
    >
      {children}
    </div>
  )
}

function TabsList({ children, className = "" }: any) {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 ${className}`}
    >
      {children}
    </div>
  )
}

function TabsTrigger({ children, value, className = "" }: any) {
  return (
    <button
      data-trigger={value}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm hover:bg-white hover:text-gray-900 ${className}`}
    >
      {children}
    </button>
  )
}

function TabsContent({ children, value, className = "" }: any) {
  return (
    <div
      className={`mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
    >
      {children}
    </div>
  )
}

function Separator({ className = "" }: any) {
  return <div className={`shrink-0 bg-gray-200 h-[1px] w-full ${className}`} />
}

function Switch({ checked, onCheckedChange, className = "" }: any) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-blue-600" : "bg-gray-200"} ${className}`}
    >
      <span
        className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  )
}

// Login Component Props
interface LoginPageProps {
  backgroundColor?: string
  textColor?: string
  onSwitchToRegister: () => void
}

function LoginPage({ backgroundColor = "bg-white", textColor = "text-gray-900", onSwitchToRegister }: LoginPageProps) {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const { login, isLoading } = useAuth()

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      const result = await login(email, password)
      if (!result.success) {
        setError("Invalid credentials")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${backgroundColor} px-4`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${textColor}`}>Welcome Back</h2>
          <p className={`mt-2 ${textColor} opacity-60`}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="email" className={textColor}>
                Email address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: any) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className={textColor}>
                Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className={`text-sm ${textColor} opacity-60 hover:opacity-100`}>
              Forgot your password?
            </button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-center">
            <p className={`text-sm ${textColor} opacity-60`}>
              {"Don't have an account? "}
              <button type="button" onClick={onSwitchToRegister} className={`font-medium ${textColor} hover:underline`}>
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

// Register Component Props
interface RegisterPageProps {
  backgroundColor?: string
  textColor?: string
  onSwitchToLogin: () => void
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

function RegisterPage({
  backgroundColor = "bg-white",
  textColor = "text-gray-900",
  onSwitchToLogin,
}: RegisterPageProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
  const [error, setError] = useState<string>("")
  const { register, isLoading } = useAuth()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    try {
      const result = await register(formData)
      if (!result.success) {
        setError("Registration failed")
      }
    } catch (err) {
      setError("Registration failed. Please try again.")
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center ${backgroundColor} px-4 py-8`}>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className={`text-3xl font-bold ${textColor}`}>Create Account</h2>
          <p className={`mt-2 ${textColor} opacity-60`}>Join us today</p>
        </div>

        <form onSubmit={handleRegister} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className={textColor}>
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First name"
                  className="mt-1"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName" className={textColor}>
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last name"
                  className="mt-1"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email" className={textColor}>
                Email address *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className={textColor}>
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password" className={textColor}>
                Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="confirmPassword" className={textColor}>
                Confirm Password *
              </Label>
              <div className="relative mt-1">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>

          <div className="text-center">
            <p className={`text-sm ${textColor} opacity-60`}>
              Already have an account?{" "}
              <button type="button" onClick={onSwitchToLogin} className={`font-medium ${textColor} hover:underline`}>
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

// Enhanced Profile Component
function ProfileContent() {
  const { user, logout } = useAuth()
  const { state: cartState, addToCart } = useCart()
  const { state: favoritesState, removeFromFavorites } = useFavorites()
  const [activeTab, setActiveTab] = useState<string>("profile")
  const [profileData, setProfileData] = useState<UserData | null>(user)
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
  })

  // Mock orders data
  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Delivered",
      total: 299.99,
      items: [{ name: "Diamond Ring", quantity: 1, price: 299.99 }],
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "Shipped",
      total: 599.98,
      items: [
        { name: "Gold Necklace", quantity: 1, price: 399.99 },
        { name: "Pearl Earrings", quantity: 1, price: 199.99 },
      ],
    },
    {
      id: "ORD-003",
      date: "2024-01-05",
      status: "Processing",
      total: 149.99,
      items: [{ name: "Silver Bracelet", quantity: 1, price: 149.99 }],
    },
  ]

  const handleProfileUpdate = (field: keyof UserData, value: string) => {
    setProfileData((prev) => (prev ? { ...prev, [field]: value } : null))
  }

  const handleNotificationChange = (field: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [field]: value }))
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "Delivered":
        return "text-green-600 bg-green-100"
      case "Shipped":
        return "text-blue-600 bg-blue-100"
      case "Processing":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const handleLogout = (): void => {
    logout()
  }

  const handleSaveProfile = () => {
    // Here you would typically make an API call to save the profile data
    alert("Profile updated successfully!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {profileData?.firstName} {profileData?.lastName}
                </h1>
                <p className="text-gray-600">{profileData?.email}</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Orders
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {activeTab === "profile" && (
              <TabsContent value="profile" className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                    <p className="text-gray-600">Update your personal details</p>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData?.firstName || ""}
                          onChange={(e: any) => handleProfileUpdate("firstName", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData?.lastName || ""}
                          onChange={(e: any) => handleProfileUpdate("lastName", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData?.email || ""}
                        onChange={(e: any) => handleProfileUpdate("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData?.phone || ""}
                        onChange={(e: any) => handleProfileUpdate("phone", e.target.value)}
                      />
                    </div>
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <h2 className="text-xl font-semibold">Addresses</h2>
                      <p className="text-gray-600">Manage your shipping addresses</p>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Home</p>
                        <p className="text-sm text-gray-600">
                          123 Main Street
                          <br />
                          New York, NY 10001
                          <br />
                          United States
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Add New Address
                  </Button>
                </div>
              </TabsContent>
            )}

            {activeTab === "orders" && (
              <TabsContent value="orders" className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold">Order History</h2>
                    <p className="text-gray-600">View your past orders and track current ones</p>
                  </div>
                  <div className="space-y-4">
                    {mockOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium">Order {order.id}</p>
                            <p className="text-sm text-gray-600">
                              Placed on {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                            >
                              {order.status}
                            </span>
                            <p className="text-lg font-semibold mt-1">${order.total}</p>
                          </div>
                        </div>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p key={index} className="text-sm text-gray-600">
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          {order.status === "Delivered" && (
                            <Button variant="outline" size="sm">
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            )}

            {activeTab === "settings" && (
              <TabsContent value="settings" className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-5 h-5" />
                    <div>
                      <h2 className="text-xl font-semibold">Notifications</h2>
                      <p className="text-gray-600">Manage your notification preferences</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Order Updates</p>
                        <p className="text-sm text-gray-600">Get notified about order status changes</p>
                      </div>
                      <Switch
                        checked={notifications.orderUpdates}
                        onCheckedChange={(checked: boolean) => handleNotificationChange("orderUpdates", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promotions</p>
                        <p className="text-sm text-gray-600">Receive promotional offers and discounts</p>
                      </div>
                      <Switch
                        checked={notifications.promotions}
                        onCheckedChange={(checked: boolean) => handleNotificationChange("promotions", checked)}
                      />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-gray-600">Stay updated with our latest news</p>
                      </div>
                      <Switch
                        checked={notifications.newsletter}
                        onCheckedChange={(checked: boolean) => handleNotificationChange("newsletter", checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <h2 className="text-xl font-semibold">Payment Methods</h2>
                      <p className="text-gray-600">Manage your payment options</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Existing Card */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-12 h-8 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">Visa ending in 4242</p>
                            <p className="text-sm text-gray-600">Expires 12/25</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Another Card Example */}
                    <div className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="bg-gradient-to-r from-gray-700 to-gray-900 w-12 h-8 rounded-md flex items-center justify-center">
                            <span className="text-white text-xs font-bold">MC</span>
                          </div>
                          <div>
                            <p className="font-medium">Mastercard ending in 8888</p>
                            <p className="text-sm text-gray-600">Expires 09/26</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Add New Payment Method Button */}
                    <Button className="w-full flex items-center justify-center gap-2">
                      <span className="text-lg">+</span> Add New Payment Method
                    </Button>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Main App Component with Navigation Logic
function StoreApp() {
  const { user } = useAuth()
  const [currentView, setCurrentView] = useState<"profile" | "login" | "register">("profile")

  // Navigation logic: if user is not logged in and tries to access profile, show login
  React.useEffect(() => {
    if (!user && currentView === "profile") {
      setCurrentView("login")
    }
  }, [user, currentView])

  const handleSwitchToLogin = () => setCurrentView("login")
  const handleSwitchToRegister = () => setCurrentView("register")

  // If user is logged in, always show profile
  if (user) {
    return <ProfileContent />
  }

  // If user is not logged in, show login or register based on current view
  if (currentView === "login") {
    return (
      <LoginPage
        backgroundColor="bg-gradient-to-br from-blue-50 to-indigo-100"
        textColor="text-gray-800"
        onSwitchToRegister={handleSwitchToRegister}
      />
    )
  }

  if (currentView === "register") {
    return (
      <RegisterPage
        backgroundColor="bg-gradient-to-br from-purple-50 to-pink-100"
        textColor="text-gray-800"
        onSwitchToLogin={handleSwitchToLogin}
      />
    )
  }

  return null
}

// Main Export Component
export default function Component() {
  return (
    <AuthProvider>
      <StoreApp />
    </AuthProvider>
  )
}
