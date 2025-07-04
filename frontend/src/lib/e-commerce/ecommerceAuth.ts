/* eslint-disable @typescript-eslint/no-unused-vars */
export async function login(email: string, password: string, subdomain: string) {
  let storeId = null;
  if (subdomain) {
    await fetch(`http://localhost:8080/api/store/getStoreId/${subdomain}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          storeId = data.storeId;
          console.log("storeId set in session:", data.storeId);
        } else {
          console.error("Failed to get storeId:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error calling getStoreId API", err);
      });
  }
  console.log("🔐 Logging in...", { email, password, storeId, subdomain });
  const res = await fetch("http://localhost:8080/ecommerce/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, storeId }),
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
    throw new Error(msg);
  }
  return true;
}

export async function logout() {
  console.log("🔐 Logging out...");
  const res = await fetch("http://localhost:8080/ecommerce/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    console.log("❌ Logout failed");
    throw new Error("Failed to logout");
  }
  console.log("✅ Logged out successfully!");
  return true;
}

export async function getSession() {
  console.log("🔐 Getting session from backend...");
  const res = await fetch("http://localhost:8080/ecommerce/auth/getSession", {
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

export async function register(user: {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  gender?: string;
  createdAt?: string;
  status?: string;
  updatedAt?: string;
}, subdomain: string) {
  console.log("🚀 Starting registration process...", {
    email: user.email,
    name: user.name,
    subdomain,
  });

  let storeId = null;
  if (subdomain) {
    await fetch(`http://localhost:8080/api/store/getStoreId/${subdomain}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          storeId = data.storeId;
          console.log("storeId set in session:", data.storeId);
        } else {
          console.error("Failed to get storeId:", data.message);
        }
      })
      .catch((err) => {
        console.error("Error calling getStoreId API", err);
      });
  }

  const requestBody = JSON.stringify(user);
  console.log("📤 Sending request body:", requestBody);

  const res = await fetch(`http://localhost:8080/ecommerce/auth/register?storeId=${storeId}`, {
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
    throw new Error(msg);
  }

  const data = await res.json();
  console.log("✅ Registration successful! Response data:", data);
  console.log("👤 User ID from response:", data.userId);
  console.log("🏪 Store ID from response:", data.storeId);
  console.log("👑 Role from response:", data.role);

  // Return the complete response data including userId, storeId, and role
  return {
    success: data.success,
    message: data.message,
  };
}

export async function sendForgotPasswordOTP(email: string) {
  console.log("📧 Sending forgot password OTP to:", email);

  const res = await fetch(
    "http://localhost:8080/ecommerce/auth/forgotPassword/sendOTP",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    }
  );

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
    throw new Error(msg);
  }

  console.log("✅ OTP sent successfully!");
  return true;
}

export async function verifyForgotPasswordOTP(email: string, otp: string) {
  console.log("🔐 Verifying OTP for:", email);

  const res = await fetch(
    "http://localhost:8080/ecommerce/auth/forgotPassword/verifyOTP",
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
    throw new Error(msg);
  }

  console.log("✅ OTP verified successfully!");
  return true;
}

export async function resetForgotPassword(email: string, newPassword: string) {
  console.log("🔐 Resetting password for:", email);

  const res = await fetch(
    "http://localhost:8080/ecommerce/auth/forgotPassword/resetPassword",
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
    throw new Error(msg);
  }

  console.log("✅ Password reset successfully!");
  return true;
}
