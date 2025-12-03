import { Provider } from "@/components/ui/provider";
import { render } from "@testing-library/react";
import { createBrowserRouter, createMemoryRouter, RouterProvider } from "react-router";

export function renderWithProviders(ui, options = {}) {
  const router = createBrowserRouter(
    [{ path: "*", element: ui }],
    { initialEntries: options.routes || ["/"] }
  );

  return render(
    <Provider>
      <RouterProvider router={router} />
    </Provider>
  );
}

