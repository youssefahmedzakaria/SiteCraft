import { siteCraftCache } from "./cache";
import { CustomizedTemplate } from "./customization";

// Authentication API utilities for SiteCraft admin/store owner

export async function login(email: string, password: string) {
  console.log("🔐 Logging in...", { email, password });
  const res = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  console.log("🔐 Login response status:", res.status);
  console.log("🔐 Login response ok:", res.ok);
  if (!res.ok) {
    let msg = "Login failed";
    try {
      const data = await res.json();
      msg = data.message || data || msg;
    } catch {
      // If response is not JSON, try to get text
      try {
        msg = (await res.text()) || msg;
      } catch {
        // Keep default message
      }
    }
    throw msg;
  }
  return true;
}

export async function logout() {
  console.log("🔐 Logging out...");
  const res = await fetch("http://localhost:8080/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    console.log("❌ Logout failed");
    throw "Failed to logout";
  }
  console.log("✅ Logged out successfully!");
  return true;
}

export async function getSession() {
  console.log("🔐 Getting session from backend...");
  const res = await fetch("http://localhost:8080/auth/getSession", {
    credentials: "include",
  });
  console.log("📡 getSession response status:", res.status);
  console.log("📡 getSession response ok:", res.ok);

  if (!res.ok) {
    console.log("❌ getSession failed");
    return null;
  }

  const sessionData = await res.json();
  console.log("✅ getSession successful, data:", sessionData);
  return sessionData;
}

export async function setSession(
  userId: number,
  storeId: number | null,
  role?: string | null
) {
  console.log("🔐 Setting session...", { userId, storeId, role });

  const res = await fetch("http://localhost:8080/auth/setSession", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ userId, storeId, role }),
  });

  console.log("📡 Set session response status:", res.status);
  console.log("📡 Set session response ok:", res.ok);

  if (!res.ok) {
    console.log("❌ Failed to set session");
    throw "Failed to set session";
  }

  console.log("✅ Session set successfully!");
  return true;
}

export async function register(user: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  gender?: string;
}) {
  console.log("🚀 Starting registration process...", {
    email: user.email,
    name: user.name,
  });

  const requestBody = JSON.stringify(user);
  console.log("📤 Sending request body:", requestBody);

  const res = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: requestBody,
  });

  console.log("📡 Registration response status:", res.status);
  console.log("📡 Registration response ok:", res.ok);

  if (!res.ok) {
    let msg = "Registration failed";
    const responseClone = res.clone();

    try {
      const data = await res.json();
      msg = data.message || data || msg;
      console.log("❌ Registration error response:", data);
    } catch (jsonError) {
      try {
        const textResponse = await responseClone.text();
        msg = textResponse || msg;
        console.log("❌ Registration error text:", textResponse);
      } catch (textError) {
        console.log("❌ Registration failed with unknown error");
        console.log("❌ JSON parse error:", jsonError);
        console.log("❌ Text parse error:", textError);
      }
    }
    throw msg;
  }

  const data = await res.json();
  console.log("✅ Registration successful! Response data:", data);
  console.log("👤 User ID from response:", data.userId);
  console.log("🏪 Store ID from response:", data.storeId);
  console.log("👑 Role from response:", data.role);

  // Return the complete response data including userId, storeId, and role
  return {
    userId: data.userId,
    storeId: data.storeId,
    role: data.role,
  };
}

export async function sendForgotPasswordOTP(email: string) {
  console.log("📧 Sending forgot password OTP to:", email);

  const res = await fetch("http://localhost:8080/auth/forgotPassword/sendOTP", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  console.log("📡 Send OTP response status:", res.status);
  console.log("📡 Send OTP response ok:", res.ok);

  if (!res.ok) {
    let msg = "Failed to send OTP";
    try {
      const data = await res.json();
      msg = data.message || data || msg;
      console.log("❌ Send OTP error response:", data);
    } catch {
      try {
        msg = (await res.text()) || msg;
        console.log("❌ Send OTP error text:", msg);
      } catch {
        console.log("❌ Send OTP failed with unknown error");
      }
    }
    throw msg;
  }

  console.log("✅ OTP sent successfully!");
  return true;
}

export async function verifyForgotPasswordOTP(email: string, otp: string) {
  console.log("🔐 Verifying OTP for:", email);

  const res = await fetch(
    "http://localhost:8080/auth/forgotPassword/verifyOTP",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    }
  );

  console.log("📡 Verify OTP response status:", res.status);
  console.log("📡 Verify OTP response ok:", res.ok);

  if (!res.ok) {
    let msg = "Failed to verify OTP";
    try {
      const data = await res.json();
      msg = data.message || data || msg;
      console.log("❌ Verify OTP error response:", data);
    } catch {
      try {
        msg = (await res.text()) || msg;
        console.log("❌ Verify OTP error text:", msg);
      } catch {
        console.log("❌ Verify OTP failed with unknown error");
      }
    }
    throw msg;
  }

  console.log("✅ OTP verified successfully!");
  return true;
}

export async function resetForgotPassword(email: string, newPassword: string) {
  console.log("🔐 Resetting password for:", email);

  const res = await fetch(
    "http://localhost:8080/auth/forgotPassword/resetPassword",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, newPassword }),
    }
  );

  console.log("📡 Reset password response status:", res.status);
  console.log("📡 Reset password response ok:", res.ok);

  if (!res.ok) {
    let msg = "Failed to reset password";
    try {
      const data = await res.json();
      msg = data.message || data || msg;
      console.log("❌ Reset password error response:", data);
    } catch {
      try {
        msg = (await res.text()) || msg;
        console.log("❌ Reset password error text:", msg);
      } catch {
        console.log("❌ Reset password failed with unknown error");
      }
    }
    throw msg;
  }

  console.log("✅ Password reset successfully!");
  return true;
}

export async function createStore(
  storeData: {
    storeName: string;
    storeType: string;
    description?: string;
    phoneNumber?: string;
    emailAddress?: string;
    address?: string;
    addressLink?: string;
    openingHours?: string;
    logo?: File;
  },
  userId: number
) {
  const formData = new FormData();

  // Add store data as JSON
  const storeJson = JSON.stringify({
    storeName: storeData.storeName,
    storeType: storeData.storeType,
    description: storeData.description || "",
    phoneNumber: storeData.phoneNumber || "",
    emailAddress: storeData.emailAddress || "",
    address: storeData.address || "",
    addressLink: storeData.addressLink || "",
    openingHours: storeData.openingHours || "",
  });

  formData.append("store", storeJson);

  // Add logo if provided
  if (storeData.logo) {
    formData.append("logo", storeData.logo);
  }

  // Use the existing endpoint with userId as path parameter
  const url = `http://localhost:8080/api/store/${userId}`;

  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    if (res.status === 413) {
      // 413 Payload Too Large
      throw "Logo image is too large. Please upload files smaller than 5 MB each.";
    }
    // for other errors, pull the server's message if available
    let msg = "Failed to create store";
    try {
      const data = await res.json();
      msg = data.message || data || msg;
    } catch {
      try {
        msg = (await res.text()) || msg;
      } catch {
        // Keep default message
      }
    }
    throw msg;
  }

  return res.json();
}

const stripBackendFields = (sectionId: string, value: any) => {
  switch (sectionId) {
    case "Header": {
      const { brandName, logo, ...rest } = value;
      return {
        ...rest,
        logo: logo ? { ...logo, src: undefined } : undefined,
      };
    }
    case "PromoSlider":
      return value;
    case "Categories": {
      const { categories, ...rest } = value;
      return rest;
    }
    case "Products": {
      const { products, ...rest } = value;
      return rest;
    }
    case "AboutUs": {
      const { sections, ...rest } = value;
      return rest;
    }
    case "Policies": {
      const { sections, ...rest } = value;
      return rest;
    }
    case "ContactUs": {
      const { contactEmail, socialLinks, ...rest } = value;
      return rest;
    }
    case "Footer": {
      const { brandName, logo, socialMedia, ...rest } = value;
      return {
        ...rest,
        logo: logo ? { ...logo, src: undefined } : undefined,
      };
    }
    default:
      return value;
  }
};

export async function commitCachedRegistration(cachedData: {
  user: {
    email: string;
    password: string;
    name: string;
    phone: string;
    gender: string;
  };
  store: {
    storeName: string;
    storeType: string;
    description?: string;
    phoneNumber?: string;
    emailAddress?: string;
    address?: string;
    addressLink?: string;
    openingHours?: string;
    colors?: { primary: string; secondary: string; accent: string };
  };
  template: CustomizedTemplate;
}) {
  console.log("🚀 Committing cached registration data...", cachedData);

  const formDataStoreCreation = new FormData();

  // Add all data as JSON
  const registrationData = {
    user: cachedData.user,
    store: {
      storeName: cachedData.store.storeName,
      storeType: cachedData.store.storeType,
      description: cachedData.store.description || "",
      phoneNumber: cachedData.store.phoneNumber || "",
      emailAddress: cachedData.store.emailAddress || "",
      address: cachedData.store.address || "",
      addressLink: cachedData.store.addressLink || "",
      openingHours: cachedData.store.openingHours || "",
      colors: cachedData.store.colors || {
        primary: "#000000",
        secondary: "#ffffff",
        accent: "#ff6b6b",
      },
    },
  };

  formDataStoreCreation.append(
    "registrationData",
    JSON.stringify(registrationData)
  );

  // Get the cached logo file from the cache
  const cachedLogoFile = siteCraftCache.getCachedLogoFile();
  if (cachedLogoFile) {
    console.log("🖼️ Adding cached logo file to commit:", cachedLogoFile.name);
    formDataStoreCreation.append("logo", cachedLogoFile);
  } else {
    console.log("ℹ️ No logo file found in cache");
  }

  const sectionIds = Object.keys(cachedData.template);
  const sections = sectionIds.map((sectionId) => ({
    id: sectionId,
    title: sectionId,
  }));

  const dtoList = sections.map((section, idx) => {
    let value = {};
    switch (section.id) {
      case "Header":
        value = cachedData.template.Header;
        break;
      case "PromoSlider":
        value = cachedData.template.PromoSlider!;
        break;
      case "Categories":
        value = cachedData.template.Categories!;
        break;
      case "Products":
        value = cachedData.template.Products!;
        break;
      case "AboutUs":
        value = cachedData.template.AboutUs!;
        break;
      case "Policies":
        value = cachedData.template.Policies!;
        break;
      case "ContactUs":
        value = cachedData.template.ContactUs!;
        break;
      case "Footer":
        value = cachedData.template.Footer;
        break;
      default:
        break;
    }
    if (section.id != "id") {
      return {
        title: section.id,
        value: stripBackendFields(section.id, value),
        index: idx - 1,
        // storeId,
      };
    }
  });

  try {
    const responseStoreCreation = await fetch(
      "http://localhost:8080/auth/commitRegistration",
      {
        method: "POST",
        credentials: "include",
        body: formDataStoreCreation,
      }
    );

    if (!responseStoreCreation.ok) {
      const errorData = await responseStoreCreation.json();
      console.log("❌ Commit registration error response:", errorData);
      throw errorData.message || "Failed to commit registration";
    }

    const responseTemplate = await fetch(
      "http://localhost:8080/customize/addTemplate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(dtoList),
      }
    );

    if (!responseTemplate.ok) {
      const errorTemplate = await responseTemplate.json();
      console.log("❌ Commit template error response:", errorTemplate);
      throw errorTemplate.message || "Failed to commit template";
    }

    const resultStoreCreation = await responseStoreCreation.json();
    const resultTemplate = await responseTemplate.json();
    console.log("✅ Registration committed successfully:", resultStoreCreation);
    console.log("✅ Template committed successfully:", resultTemplate);

    // Clear the cache after successful commit
    siteCraftCache.clearCache();

    return resultStoreCreation + "\n" + resultTemplate;
  } catch (error) {
    console.log("❌ Error committing registration:", error);
    throw error;
  }
}

export async function checkEmail(email: string) {
  console.log("📧 Checking email availability for:", email);

  const res = await fetch("http://localhost:8080/auth/checkEmail", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email }),
  });

  console.log("📡 Check email response status:", res.status);
  console.log("📡 Check email response ok:", res.ok);

  if (!res.ok) {
    let msg = "Email check failed";
    try {
      const data = await res.json();
      msg = data.message || data || msg;
      console.log("❌ Check email error response:", data);
    } catch {
      try {
        msg = (await res.text()) || msg;
        console.log("❌ Check email error text:", msg);
      } catch {
        console.log("❌ Check email failed with unknown error");
      }
    }
    throw msg;
  }

  const data = await res.json();
  console.log("✅ Email check successful! Response data:", data);
  return data;
}
