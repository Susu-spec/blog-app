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


/**
 * Parses an error object or response into a standard format.
 *
 * @param {Object|Error|string|null} error - The error object or message.
 * @returns {{ title: string, description: string }}
 */
export function parseError(error) {
  let title = "Something went wrong";
  let description = "An unexpected error occurred. Please try again.";

  if (!error) {
    return { title, description };
  }


  if (typeof error === "string") {
    return { title: "Error", description: error };
  }


  if (error.message && error.code) {
    switch (error.code) {
      case "23505":
        title = "Duplicate Entry";
        description = "A record with this value already exists.";
        break;
      case "42501":
        title = "Permission Denied";
        description = "You don’t have permission to perform this action.";
        break;
      case "400":
        title = "Invalid Request";
        description = error.message || "Some fields are missing or invalid.";
        break;
      case "401":
        title = "Unauthorized";
        description = "Your session may have expired. Please log in again.";
        break;
      case "404":
        title = "Not Found";
        description = "The requested resource could not be found.";
        break;
      
      case "500":
        title = "Server Error";
        description = "We’re having trouble on our end. Please try again later.";
        break;
      default:
        title = "Error";
        description = error.message || "An unknown error occurred.";
    }

    return { title, description };
  }

  if (error.status) {
    switch (error.status) {
      case 400:
        title = "Invalid Request";
        description = "Please check your inputs and try again.";
        break;
      case 401:
        title = "Unauthorized";
        description = "Your session has expired. Please log in again.";
        break;
      case 403:
        title = "Forbidden";
        description = "You don’t have permission to perform this action.";
        break;
      case 404:
        title = "Not Found";
        description = "The requested item could not be found.";
        break;
      case 409:
        title = "Conflict";
        description = "This item already exists.";
        break;
      case 429:
        title = "Too Many Requests";
        description = "You’re doing that too often. Please slow down.";
        break;
      case 500:
        title = "Server Error";
        description = "Our servers are having trouble. Please try again later.";
        break;
      default:
        title = `Error ${error.status}`;
        description = error.statusText || "An error occurred with the request.";
    }

    return { title, description };
  }

  if ((/failed to fetch/i).test(error.message)) {
    return {
      title: "Network Error",
      description: "Please check your internet connection and try again.",
    };
  }


  if ((/network/i).test(error.message)) {
    return {
      title: "Network Error",
      description: "We couldn’t reach the server. Try again later.",
    };
  }

  if ((/duplicate key/i).test(error.message)) {
    return {
      title: "Duplicate Entry",
      description: "This item already exists"
    }
  }

  return { title, description };
}


export const parseFetchPostsError = (error) => {
  const message = error?.message
  if (/failed to fetch|network error/i.test(message)) {
    return {
      title: "Network error",
      description: "We couldn't connect. Please check your internet connection and try again.",
    }
  }

  return {
    title: "An error occured.",
    description: "Please reload the page.",
  }
}