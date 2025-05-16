/**
 * @file: auth.test.tsx
 * @description: Unit tests for Okta login functionality using email and password
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../features/auth/Login"; // Adjust the import path as necessary
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("🔐 Okta User Login", () => {
  it("✅ should render login form fields", () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("✅ should call Okta login API and redirect on success", async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        success: true,
        localToken: "mocked-jwt-token",
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "testuser@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "Test@123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() =>
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "/api/auth/okta-login",
        {
          email: "testuser@example.com",
          password: "Test@123",
        }
      )
    );

    // Simulate redirection or localStorage update
    expect(localStorage.getItem("token")).toBe("mocked-jwt-token");
  });

  it("❌ should show error message on login failure", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { message: "Invalid credentials" },
      },
    });

    render(<Login />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
