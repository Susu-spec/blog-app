import { render, screen } from "@testing-library/react";
import Loader from "./Loader";
import { renderWithChakra } from "@/tests/test-utils";

beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        }
    )),
  });
});

test("renders loader spinner", () => {
    renderWithChakra(<Loader />);
    const spinner = screen.getByTestId("loading-spinner");
    expect(spinner).toBeInTheDocument();
});
