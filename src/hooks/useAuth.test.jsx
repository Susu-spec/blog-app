import { AuthProvider } from "@/providers/AuthProvider";
import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAuth } from "./useAuth";

describe("useAuth", () => {
  it("throws if used outside provider", () => {
    expect(() => renderHook(() => useAuth()))
      .toThrow("useAuth must be used within AuthProvider");
  });

  it("returns context when used inside provider", () => {
    const mockValue = { user: { id: "123" }, loading: false };

    const wrapper = ({ children }) => (
      <AuthProvider value={mockValue}>{children}</AuthProvider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper })
  })
})