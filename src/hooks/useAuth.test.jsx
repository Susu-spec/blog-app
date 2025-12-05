import { renderHook } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { AuthContext } from "@/providers/AuthProvider";
import { describe, expect, it } from "vitest";


describe("useAuth", () => {
  it("throws error when used outside AuthProvider", () => {
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within AuthProvider"
    );
  });


  it("returns context when used inside AuthProvider", () => {
    const mockContext = { user: { id: "123" }, login: vi.fn() };
    const wrapper = ({ children }) => (
      <AuthContext.Provider value={mockContext}>
        {children}
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current).toBe(mockContext);
  });
});
