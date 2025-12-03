import { RouterProvider, createMemoryRouter } from "react-router-dom";

export function renderWithRouter(ui, { route = "/", path = "/" } = {}) {
  const router = createMemoryRouter(
    [
      {
        path,
        element: ui,
      },
    ],
    {
      initialEntries: [route],
    }
  );

  return <RouterProvider router={router} />;
}
