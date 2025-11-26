import { describe, expect, it } from "vitest";
import { parseError, parseLoginError, parseLogoutError, parseSignupError } from "./errors";

/**
 * 
 * 
 * parseSignupError
 *  
 * */
describe("parseSignupError", () => {
  it("handles email in use", () => {
    const result = parseSignupError({ message: "Email already exists" });
    expect(result.title).toBe("Email already in use");
  });

  it("handles weak passwords", () => {
    const result = parseSignupError({ message: "password too short" });
    expect(result.title).toBe("Weak password");
  });

  it("handles network errors", () => {
    const result = parseSignupError({ message: "Failed to fetch" });
    expect(result.title).toBe("Network error");
  });

  it("falls back to generic", () => {
    const result = parseSignupError({ message: "Something random" });
    expect(result.title).toBe("Signup failed");
  });
});



/**
 * 
 * 
 * parseLoginError
 *  
 * */

describe("parseLoginError", () => {
  it("handles invalid credentials", () => {
    const result = parseLoginError({ message: "Invalid login credentials" });
    expect(result.title).toBe("Invalid credentials");
  });

  it("handles email not confirmed", () => {
    const result = parseLoginError({ message: "email not confirmed" });
    expect(result.title).toBe("Email not confirmed");
  });

  it("handles network errors", () => {
    const result = parseLoginError({ message: "network error" });
    expect(result.title).toBe("Network error");
  });

  it("uses fallback", () => {
    const r = parseLoginError({ message: "unknown" });
    expect(r.title).toBe("Login failed");
  });
});



/**
 * 
 * 
 * parseLogoutError
 *  
 * */

describe("parseLogoutError", () => {
  it("handles session expired", () => {
    const r = parseLogoutError({ message: "token expired" });
    expect(r.title).toBe("Session expired");
  });

  it("handles network errors", () => {
    const r = parseLogoutError({ message: "Failed to fetch" });
    expect(r.title).toBe("Network error");
  });

  it("fallback", () => {
    const r = parseLogoutError({ message: "???" });
    expect(r.title).toBe("Logout failed");
  });
});


/**
 * 
 * 
 * parseError - general
 *  
 * */

describe("parseError", () => {
  it("handles string errors", () => {
    const r = parseError("Something happened");
    expect(r.description).toBe("Something happened");
  });

  it("handles error.code", () => {
    const r = parseError({ code: "23505", message: "dup" });
    expect(r.title).toBe("Duplicate Entry");
  });

  it("handles error.status", () => {
    const r = parseError({ status: 404 });
    expect(r.title).toBe("Not Found");
  });

  it("handles network message", () => {
    const r = parseError({ message: "failed to fetch" });
    expect(r.title).toBe("Network Error");
  });
});