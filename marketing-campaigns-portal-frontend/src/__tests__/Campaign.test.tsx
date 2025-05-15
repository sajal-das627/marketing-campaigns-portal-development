// src/__tests__/Campaigns.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Campaigns from '../components/Campaigns';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ReactRouterDOM from 'react-router-dom'; // Needed for jest.spyOn()

const mockStore = configureMockStore([thunk as any]);

describe('Campaigns Component', () => {
  let store: ReturnType<typeof mockStore>;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    // ✅ Spy on useNavigate with a fresh mock
    mockNavigate = jest.fn();
    jest.spyOn(ReactRouterDOM, 'useNavigate').mockImplementation(() => mockNavigate);

    store = mockStore({
      campaign: {
        campaigns: [
          {
            _id: '1',
            name: 'Spring Campaign',
            status: 'Active',
            type: 'Scheduled',
            openRate: 45,
            ctr: 25,
            delivered: 1000,
            createdAt: new Date().toISOString(),
          },
        ],
        loading: false,
        error: null,
        pagination: {
          page: 1,
          totalPages: 1,
        },
      },
    });
  });

  afterEach(() => {
    // ✅ Reset all mocks after each test
    jest.restoreAllMocks();
  });

  it('renders Manage Campaign heading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Campaigns />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Manage Campaign/i)).toBeInTheDocument();
  });

  it('displays campaign data', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Campaigns />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Spring Campaign/i)).toBeInTheDocument();
    expect(screen.getByText(/Active/i)).toBeInTheDocument();
    expect(screen.getByText(/Scheduled/i)).toBeInTheDocument();
    expect(screen.getByText(/45%/i)).toBeInTheDocument();
    expect(screen.getByText(/25%/i)).toBeInTheDocument();
    expect(screen.getByText(/1000/i)).toBeInTheDocument();
  });

  it('navigates to Create Campaign on button click', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Campaigns />
        </MemoryRouter>
      </Provider>
    );

    const button = screen.getByRole('button', { name: /\+ Create Campaign/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/create-campaign');
  });

  it('shows empty campaign message when no campaigns exist', () => {
    store = mockStore({
      campaign: {
        campaigns: [],
        loading: false,
        error: null,
        pagination: { page: 1, totalPages: 1 },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Campaigns />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/No\s+campaigns\s+found/i)).toBeInTheDocument();
  });
});
