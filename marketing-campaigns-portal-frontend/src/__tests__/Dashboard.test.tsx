// src/__tests__/Dashboard.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { MemoryRouter } from 'react-router-dom';
import * as ReactRouterDOM from 'react-router-dom'; // Required for spyOn

// ✅ Mock chart components
jest.mock('../components/Charts/CampaignPerformanceChart', () => () => (
  <div data-testid="mock-campaign-performance-chart">Mocked CampaignPerformanceChart</div>
));
jest.mock('../components/Charts/EmailSent', () => () => (
  <div data-testid="mock-email-sent-chart">Mocked EmailSent Chart</div>
));

// ✅ Setup mock store
const mockStore = configureMockStore([thunk as any]);

describe('Dashboard Component', () => {
  const store = mockStore({
    dashboard: {
      data: {
        activeCampaigns: {
          daily: { count: 10, percentage: 50 },
          weekly: { count: 20, percentage: 60 },
          monthly: { count: 30, percentage: 70 },
        },
        scheduledCampaigns: {
          daily: { count: 5, percentage: 10 },
          weekly: { count: 15, percentage: 20 },
          monthly: { count: 25, percentage: 30 },
        },
        totalAudience: {
          daily: { count: 1000, percentage: 10 },
          weekly: { count: 5000, percentage: 20 },
          monthly: { count: 10000, percentage: 30 },
        },
        emailsSent: {
          monthlyStats: [],
          yAxisMax: 2000,
        },
        campaignPerformance: {
          weekly: [],
          monthly: [],
        },
        engagementMetrics: {
          openRate: '70%',
          clickRate: '40%',
        },
        recentActivity: [
          {
            _id: '1',
            name: 'Spring Super Sale 2025',
            createdAt: new Date().toISOString(),
            userId: {
              firstName: 'Michael',
              lastName: 'Scott',
              email: 'michael@example.com',
            },
          },
        ],
      },
      loading: false,
      error: null,
    },
  });

  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // ✅ Setup mock for useNavigate before each test
    mockNavigate = jest.fn();
    jest.spyOn(ReactRouterDOM, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    // ✅ Clean up all mocks
    jest.restoreAllMocks();
  });

  it('renders the dashboard title', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });

  it('displays KPI cards with values', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Active Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Scheduled Campaigns')).toBeInTheDocument();
    expect(screen.getByText('Total Audience')).toBeInTheDocument();

    expect(screen.getByText('10')).toBeInTheDocument(); // Active
    expect(screen.getByText('5')).toBeInTheDocument();  // Scheduled
    expect(screen.getByText('1000')).toBeInTheDocument(); // Audience
  });

  it('renders mocked chart components', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('mock-campaign-performance-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-email-sent-chart')).toBeInTheDocument();
  });

  it('renders recent activity from mock data', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Spring Super Sale 2025/)).toBeInTheDocument();
    });
  });

  it('calls useNavigate when +Create Campaign button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Dashboard />
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByRole('button', { name: /\+ Create Campaign/i });
    button.click();

    expect(mockNavigate).toHaveBeenCalledWith('/create-campaign');
  });
});
