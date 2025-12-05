import { Provider } from "@/components/ui/provider"; // ensure this alias is valid
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router";


export function renderWithChakra(ui) {
  return render(
    <Provider>
      <MemoryRouter>
        {ui}
      </MemoryRouter>
    </Provider>
  );
}