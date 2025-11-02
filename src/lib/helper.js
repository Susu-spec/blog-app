/**
 * Maps numeric heading levels to their corresponding HTML heading tags.
 *
 * @type {Object<number, string>}
 * @example
 * levelMap[1] // 'h1'
 * levelMap[3] // 'h3'
 */
export const levelMap = {
  1: "h1",
  2: "h2",
  3: "h3",
  4: "h4",
  5: "h5",
  6: "h6",
};

/**
 * Maps numeric heading levels to Tailwind CSS font size classes.
 *
 * @type {Object<number, string>}
 * @example
 * levelFontSize[1] // '3xl'
 * levelFontSize[4] // 'lg'
 */
export const levelFontSize = {
  1: "3xl",
  2: "2xl",
  3: "xl",
  4: "lg",
  5: "md",
  6: "base",
};


/**
 * Parses a Supabase signup error and returns toaster metadata.
 *
 * @param {Error | { message?: string }} [error] - The Supabase error object or network error.
 * @returns {{ title: string, description: string }} Error message object.
 */

export function parseSignupError(error) {
  if (!error || typeof error !== "object") {
    return {
      title: "Signup failed",
      description: "Something went wrong. Please try again.",
    };
  }

  const message = error?.message?.toLowerCase() || "";

  if (/user already registered|already exists|email.*in use/.test(message)) {
    return {
      title: "Email already in use",
      description: "An account with this email already exists. Try logging in instead.",
    };
  }

  if (/password.*(weak|short|invalid)|at least 6/.test(message)) {
    return {
      title: "Weak password",
      description: "Password must be at least 6 characters long.",
    };
  }

  if (/signup disabled/.test(message)) {
    return {
      title: "Signup disabled",
      description: "Email/password signups are disabled for this project.",
    };
  }

  if (/failed to fetch|network error/.test(message)) {
    return {
      title: "Network error",
      description: "We couldn’t connect. Please check your internet and try again.",
    };
  }

  return {
    title: "Signup failed",
    description: error.message ?? "Something went wrong. Please try again.",
  };
}


/**
 * Parses a Supabase login error and returns toaster metadata.
 *
 * @param {Error | { message?: string }} [error] - The Supabase error object or network error.
 * @returns {{ title: string, description: string }} Error message object.
 */

export function parseLoginError(error) {
  const message = error?.message?.toLowerCase() || "";

  if (/invalid login credentials|user not found/i.test(message)) {
    return {
      title: "Invalid credentials",
      description: "Email or password is incorrect.",
    };
  }

  if (/email not confirmed|confirm your email/i.test(message)) {
    return {
      title: "Email not confirmed",
      description: "Check your inbox and confirm your account before logging in.",
    };
  }

  if (/failed to fetch|network error/i.test(message)) {
    return {
      title: "Network error",
      description: "Please check your connection and try again.",
    };
  }

  if (/rate limit/i.test(message)) {
    return {
      title: "Too many attempts",
      description: "Please wait a few moments and try again.",
    };
  }

  return {
    title: "Login failed",
    description: error.message || "Something went wrong. Please try again.",
  };
}



/**
 * Parses Supabase logout errors and returns toaster-friendly data.
 *
 * @param {Error | { message?: string }} [error]
 * @returns {{ title: string, description: string }}
 */
export function parseLogoutError(error) {
  const message = error?.message?.toLowerCase() || "";

  if (/failed to fetch|network error/i.test(message)) {
    return {
      title: "Network error",
      description: "We couldn’t connect. Please check your internet and try again.",
    };
  }

  if (/session|token|expired/i.test(message)) {
    return {
      title: "Session expired",
      description: "Your session has already ended. Please log in again.",
    };
  }

  if (/not authenticated|invalid api key/i.test(message)) {
    return {
      title: "Logout failed",
      description: "Authentication error. Please refresh and try again.",
    };
  }

  return {
    title: "Logout failed",
    description: error?.message || "Something went wrong. Please try again.",
  };
}

