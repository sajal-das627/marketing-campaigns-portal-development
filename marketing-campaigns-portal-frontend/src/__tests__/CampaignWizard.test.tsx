import { render, screen, fireEvent } from "@testing-library/react";
import Step1CampaignDetails from "../components/CampaignWizard/Step1CampaignDetails";

describe("🚀 Campaign Wizard - Step 1", () => {
  it("should show an error when campaign name is empty", () => {
    render(<Step1CampaignDetails onNext={jest.fn()} />);
    const nextButton = screen.getByRole("button", { name: /next/i });
    fireEvent.click(nextButton);
    expect(screen.getByText(/Campaign name cannot be empty/i)).toBeInTheDocument();
  });
});
