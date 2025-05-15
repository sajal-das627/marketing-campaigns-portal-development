// src/__tests__/Template.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Template from '../components/Templates/Templates'; // Adjust if needed
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import * as ReactRouterDOM from 'react-router-dom';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

// ✅ Optional: spy on navigation if needed
const mockNavigate = jest.fn();
jest.spyOn(ReactRouterDOM, 'useNavigate').mockImplementation(() => mockNavigate);

// ✅ Mock useMediaQuery from MUI
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    useMediaQuery: () => false,
  };
});

// ✅ Configure mock store
const mockStore = configureMockStore([thunk as any]);

describe('Template Component', () => {
  let store: ReturnType<typeof mockStore>;

  beforeEach(() => {
    store = mockStore({
      templates: {
        allTemplates: [
          { _id: 't1', name: 'Welcome Email', tags: ['intro'] },
          { _id: 't2', name: 'Abandoned Cart', tags: ['sales'] },
        ],
        recentlyUsed: [
          { _id: 't3', name: 'Follow-up Email', tags: ['engagement'] },
        ],
        favorites: [
          { _id: 't4', name: 'Holiday Offer', tags: ['holiday'] },
        ],
        loading: false,
        error: null,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks(); // ✅ important for test isolation
  });

  it('renders the Template tab headings', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Template />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/All Templates/i)).toBeInTheDocument();
    expect(screen.getByText(/Recently Used/i)).toBeInTheDocument();
    expect(screen.getByText(/Favourites/i)).toBeInTheDocument();
  });

  it('displays templates under All Templates tab by default', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Template />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Welcome Email')).toBeInTheDocument();
    expect(screen.getByText('Abandoned Cart')).toBeInTheDocument();
  });

  it('switches to Recently Used tab and displays templates', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Template />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Recently Used/i));

    await waitFor(() => {
      expect(screen.getByText('Follow-up Email')).toBeInTheDocument();
    });
  });

  it('switches to Favourites tab and displays templates', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Template />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Favourites/i));

    await waitFor(() => {
      expect(screen.getByText('Holiday Offer')).toBeInTheDocument();
    });
  });

  it('filters search results correctly', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Template />
        </MemoryRouter>
      </Provider>
    );

    const searchInput = screen.getByPlaceholderText(/Search templates/i);
    fireEvent.change(searchInput, { target: { value: 'Welcome' } });

    expect(screen.getByText('Welcome Email')).toBeInTheDocument();
    expect(screen.queryByText('Abandoned Cart')).not.toBeInTheDocument();
  });
});
