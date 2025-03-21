import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LoginPage from "../components/Auth/LoginPage";

describe("🚀 Authentication Component", () => {
  it("should render the login page correctly", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Login with Okta/i)).toBeInTheDocument();
  });
});
