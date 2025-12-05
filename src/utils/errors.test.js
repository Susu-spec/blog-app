import {
  parseSignupError,
  parseLoginError,
  parseLogoutError,
  parseError,
  parseFetchPostsError,
} from "./errors";

describe("parseSignupError", () => {
  it("handles non-object input", () => {
    expect(parseSignupError(null)).toEqual({
      title: "Signup failed",
      description: "Something went wrong. Please try again.",
    });
  });

  it("handles email already in use", () => {
    const result = parseSignupError({ message: "Email already exists" });
    expect(result.title).toBe("Email already in use");
  });

  it("handles weak password", () => {
    const result = parseSignupError({ message: "Password is too short" });
    expect(result.title).toBe("Weak password");
  });

  it("handles signup disabled", () => {
    const result = parseSignupError({ message: "Signup disabled" });
    expect(result.title).toBe("Signup disabled");
  });

  it("handles network error", () => {
    const result = parseSignupError({ message: "Failed to fetch" });
    expect(result.title).toBe("Network error");
  });

  it("falls back to generic", () => {
    const result = parseSignupError({ message: "Unknown error" });
    expect(result.title).toBe("Signup failed");
    expect(result.description).toBe("Unknown error");
  });
});

describe("parseLoginError", () => {
  it("handles invalid credentials", () => {
    const result = parseLoginError({ message: "Invalid login credentials" });
    expect(result.title).toBe("Invalid credentials");
  });

  it("handles email not confirmed", () => {
    const result = parseLoginError({ message: "Please confirm your email" });
    expect(result.title).toBe("Email not confirmed");
  });

  it("handles network error", () => {
    const result = parseLoginError({ message: "Network error" });
    expect(result.title).toBe("Network error");
  });

  it("handles rate limit", () => {
    const result = parseLoginError({ message: "Rate limit exceeded" });
    expect(result.title).toBe("Too many attempts");
  });

  it("falls back to generic", () => {
    const result = parseLoginError({ message: "Something else" });
    expect(result.title).toBe("Login failed");
  });
});

describe("parseLogoutError", () => {
  it("handles network error", () => {
    const result = parseLogoutError({ message: "Failed to fetch" });
    expect(result.title).toBe("Network error");
  });

  it("handles session expired", () => {
    const result = parseLogoutError({ message: "Token expired" });
    expect(result.title).toBe("Session expired");
  });

  it("handles not authenticated", () => {
    const result = parseLogoutError({ message: "Not authenticated" });
    expect(result.title).toBe("Logout failed");
  });

  it("falls back to generic", () => {
    const result = parseLogoutError({ message: "Other error" });
    expect(result.title).toBe("Logout failed");
    expect(result.description).toBe("Other error");
  });
});

describe("parseError", () => {
  it("handles null input", () => {
    expect(parseError(null)).toEqual({
      title: "Something went wrong",
      description: "An unexpected error occurred. Please try again.",
    });
  });

  it("handles string input", () => {
    expect(parseError("Bad")).toEqual({ title: "Error", description: "Bad" });
  });

  it("handles Postgres duplicate code", () => {
    const result = parseError({ message: "duplicate", code: "23505" });
    expect(result.title).toBe("Duplicate Entry");
  });

  it("handles permission denied code", () => {
    const result = parseError({ message: "denied", code: "42501" });
    expect(result.title).toBe("Permission Denied");
  });

  it("handles HTTP status 400", () => {
    const result = parseError({ status: 400 });
    expect(result.title).toBe("Invalid Request");
  });

  it("handles HTTP status 401", () => {
    const result = parseError({ status: 401 });
    expect(result.title).toBe("Unauthorized");
  });

  it("handles HTTP status 403", () => {
    const result = parseError({ status: 403 });
    expect(result.title).toBe("Forbidden");
  });

  it("handles HTTP status 404", () => {
    const result = parseError({ status: 404 });
    expect(result.title).toBe("Not Found");
  });

  it("handles HTTP status 409", () => {
    const result = parseError({ status: 409 });
    expect(result.title).toBe("Conflict");
  });

  it("handles HTTP status 429", () => {
    const result = parseError({ status: 429 });
    expect(result.title).toBe("Too Many Requests");
  });

  it("handles HTTP status 500", () => {
    const result = parseError({ status: 500 });
    expect(result.title).toBe("Server Error");
  });

  it("handles unknown status", () => {
    const result = parseError({ status: 418, statusText: "I'm a teapot" });
    expect(result.title).toBe("Error 418");
    expect(result.description).toBe("I'm a teapot");
  });

  it("handles failed to fetch message", () => {
    const result = parseError({ message: "Failed to fetch" });
    expect(result.title).toBe("Network Error");
  });

  it("handles generic network message", () => {
    const result = parseError({ message: "Network unreachable" });
    expect(result.title).toBe("Network Error");
  });

  it("handles duplicate key message", () => {
    const result = parseError({ message: "duplicate key value" });
    expect(result.title).toBe("Duplicate Entry");
  });

  it("falls back to generic", () => {
    const result = parseError({ message: "Other error" });
    expect(result.title).toBe("Something went wrong");
  });
});

describe("parseFetchPostsError", () => {
  it("handles network error", () => {
    const result = parseFetchPostsError({ message: "Network error" });
    expect(result.title).toBe("Network error");
  });

  it("falls back to generic", () => {
    const result = parseFetchPostsError({});
    expect(result.title).toBe("An error occured.");
  });
});
