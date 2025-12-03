export const supabaseMock = {
    from: vi.fn(() => ({
      insert: vi.fn(),
      update: vi.fn(() => ({
        eq: vi.fn()
      }))
    })),
    storage: {
      from: vi.fn(() => ({
        upload: vi.fn(),
        getPublicUrl: vi.fn(() => ({ data: { publicUrl: "mock-url" } }))
      }))
    }
  }