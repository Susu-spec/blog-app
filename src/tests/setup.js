import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

vi.mock("@/lib/supabase", () => {
  return import("./__mocks__/supabaseMock");
});

window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
};
