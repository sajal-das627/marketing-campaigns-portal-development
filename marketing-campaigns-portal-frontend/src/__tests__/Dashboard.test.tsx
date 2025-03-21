import { render, screen } from "@testing-library/react";
import Dashboard from "../components/Dashboard";

describe("Dashboard Component", () => {
  it("renders the dashboard title", () => {
    render(<Dashboard />);
    const titleElement = screen.getByText(/Marketing Dashboard/i);
    expect(titleElement).toBeInTheDocument();
  });
});
