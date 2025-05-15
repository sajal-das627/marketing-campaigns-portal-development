// src/__tests__/Filter.test.tsx

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Filter from '../components/FilterBuilder/FilterBuilder'; // ✅ Adjust path if needed
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as ReactRouterDOM from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// ✅ Spy on useNavigate instead of mocking entire module
const mockNavigate = jest.fn();
jest.spyOn(ReactRouterDOM, 'useNavigate').mockImplementation(() => mockNavigate);

// ✅ Mock useMediaQuery if MUI breakpoints are used
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});

// ✅ Set up mock Redux store
const mockStore = configureMockStore([thunk as any]);

describe('Filter Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      filters: {
        list: [
          {
            _id: 'f1',
            name: 'Active Users',
            tags: ['email', 'engagement'],
            estimatedAudience: 1200,
            lastUsed: '2025-05-05',
          },
          {
            _id: 'f2',
            name: 'Recent Buyers',
            tags: ['purchase'],
            estimatedAudience: 980,
            lastUsed: '2025-04-20',
          },
        ],
        loading: false,
        error: null,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the Filters heading', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });

  it('displays each filter with name and audience count', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Active Users')).toBeInTheDocument();
    expect(screen.getByText('Recent Buyers')).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
    expect(screen.getByText(/980/i)).toBeInTheDocument();
  });

  it('renders all tags for each filter', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filter />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('email')).toBeInTheDocument();
    expect(screen.getByText('engagement')).toBeInTheDocument();
    expect(screen.getByText('purchase')).toBeInTheDocument();
  });

  it('calls navigate when "Create Filter" button is clicked', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Filter />
        </MemoryRouter>
      </Provider>
    );

    const createBtn = screen.getByRole('button', { name: /Create Filter/i });
    fireEvent.click(createBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/filters/create');
  });
});
