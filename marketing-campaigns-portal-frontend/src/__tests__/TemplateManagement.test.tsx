import { render, screen, fireEvent } from "@testing-library/react";
import TemplateManagement from "../components/Templates/TemplateManagement";

describe("🚀 Template Management", () => {
  it("should render the template management page correctly", () => {
    render(<TemplateManagement />);
    expect(screen.getByText(/Template Management/i)).toBeInTheDocument();
  });

  it("should show an error when saving an empty template", () => {
    render(<TemplateManagement />);
    const saveButton = screen.getByText(/Save Template/i);
    fireEvent.click(saveButton);
    expect(screen.getByText(/All fields are required/i)).toBeInTheDocument();
  });
});
