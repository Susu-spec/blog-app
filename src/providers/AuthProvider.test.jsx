import { render, screen, act } from "@testing-library/react";
import { AuthProvider, AuthContext } from "./AuthProvider";
import { vi } from "vitest";

const { mockGetSession, mockOnAuthStateChange, mockSignOut } = vi.hoisted(() => ({
  mockGetSession: vi.fn(),
  mockOnAuthStateChange: vi.fn(),
  mockSignOut: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signOut: mockSignOut,
    },
  },
}));


const { mockToaster } = vi.hoisted(() => ({
  mockToaster: { create: vi.fn() },
}))

vi.mock("@/components/ui/toaster", () => ({ toaster: mockToaster }));


describe("AuthProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockOnAuthStateChange.mockReturnValue({
            data: { subscription: { unsubscribe: vi.fn() } },
        });
    });

    it("restores user from session", async () => {
        mockGetSession.mockResolvedValueOnce({ data: { user: { id: "123" } }, error: null });

        let context;
        render(
            <AuthProvider>
                <AuthContext.Consumer>{(value) => { context = value; return null; }}</AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {});

        expect(context.user).toEqual({ id: "123" });
        expect(context.loading).toBe(false);
    });

    it("handles session error", async () => {
        mockGetSession.mockResolvedValueOnce({ data: null, error: { message: "fail" } });

        let context;
        render(
            <AuthProvider>
                <AuthContext.Consumer>{(value) => { context = value; return null; }}</AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {});

        expect(context.error).toEqual({ message: "fail" });
        expect(context.user).toBe(null);
    });

    it("logout success", async () => {
        mockSignOut.mockResolvedValueOnce({ error: null });

        let context;
        render(
            <AuthProvider>
                <AuthContext.Consumer>{(value) => { context = value; return null; }}</AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {
            await context.logout();
        });

        expect(context.user).toBe(null);
        expect(mockToaster.create).toHaveBeenCalledWith(
            expect.objectContaining({ description: "You have been logged out successfully" })
        );
    });

    it("logout failure", async () => {
        mockSignOut.mockResolvedValueOnce({ error: { message: "fail" } });

        let context;
        render(
            <AuthProvider>
                <AuthContext.Consumer>{(value) => { context = value; return null; }}</AuthContext.Consumer>
            </AuthProvider>
        );

        await act(async () => {
            await context.logout();
        });

        expect(context.error).toEqual({ message: "fail" });
        expect(mockToaster.create).toHaveBeenCalledWith(
            expect.objectContaining({ type: "error" })
        );
    });
});
