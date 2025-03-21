import { render, screen, fireEvent } from "@testing-library/react";
import FilterBuilder from "../components/FilterBuilder/FilterBuilder";

describe("🚀 Filter Builder", () => {
  it("should render the filter builder correctly", () => {
    render(<FilterBuilder />);
    expect(screen.getByText(/Audience Filter Builder/i)).toBeInTheDocument();
  });

  it("should add a new condition", () => {
    render(<FilterBuilder />);
    const addButton = screen.getByText("+ Add Age Condition");
    fireEvent.click(addButton);
    expect(screen.getByText(/Age > 18/i)).toBeInTheDocument();
  });
});
