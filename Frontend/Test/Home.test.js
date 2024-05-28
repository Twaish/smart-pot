import React from "react";
import '@testing-library/jest-dom'
import { render, fireEvent, screen, waitFor} from '@testing-library/react';
import Home from "../src/Pages/Home";
import { BrowserRouter } from "react-router-dom";


jest.mock('../src/Util/AuthProvider', () => ({
  useAuth: () => ({
    token: 'fake-token',
    setToken: jest.fn(),
  })
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
};

// Mock JSON.parse and localStorage.getItem
jest.spyOn(JSON, 'parse').mockImplementation((string) => {
  // Directly return an object with the expected structure
  return {
    name: 'Ditte',
    lastName: 'Hej',
    email: 'Hej@Test.com',
    phoneNumber: '12345678'
  };
});



jest.mock("../src/Util/apiClient", () => ({
  getAllPots: jest.fn().mockResolvedValue([
    { nameOfPot: "Pot_1", email: "kalle@da.ag", machineId: "123", enable: true, nameOfPlant: 'Lilje' },
    { nameOfPot: "Pot_2", email: "kalle@da.ag", machineId: "456", enable: false, nameOfPlant: null },
    // Add more mock data as needed
  ]),
}));


beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
});

test('Home-page renders correctly', async () => {
  localStorageMock.getItem.mockReturnValue('{"name": "Ditte", "lastName": "Hej", "email":"Hej@Test.com","phoneNumber":"12345678"}');

  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  // Profile Section
  expect(screen.getByText('Profile')).toBeInTheDocument();
  expect(screen.getByText((content, element) => {
    return element.textContent === 'Name: Ditte Hej';
  })).toBeInTheDocument();
  expect(screen.getByText((content, element) => {
    return element.textContent === 'Email: Hej@Test.com';
  })).toBeInTheDocument();
  expect(screen.getByText((content, element) => {
    return element.textContent === 'Phone: 12345678';
  })).toBeInTheDocument();

  // Navigation Buttons
  const connectPotButton = screen.getByText('Connect pot');
  const overviewButton = screen.getByText('Plant Overview');
  expect(connectPotButton).toBeInTheDocument();
  expect(overviewButton).toBeInTheDocument();
  expect(connectPotButton.closest('a')).toHaveAttribute('href', '/smart-pot/connect_pot');
  expect(overviewButton.closest('a')).toHaveAttribute('href', '/smart-pot/plant_overview');

  // Pots Section
  await waitFor(() => expect(require('../src/Util/apiClient').getAllPots).toHaveBeenCalled());

  // SmartPot component
  const potContainers = await screen.findAllByTestId("smartPodContainer");
  expect(potContainers.length).toBeGreaterThan(0);
  expect(potContainers[0]).toHaveTextContent('Pot_1');
  expect(potContainers[1]).toHaveTextContent('Pot_2');

  // Simulate user typing "1" into the search field
  const searchInput = screen.getByPlaceholderText('search for pot or plant');
  fireEvent.change(searchInput, { target: { value: '1' } });

  // Wait for the search results to be filtered
  await waitFor(() => {
    expect(screen.getByText('Pot_1')).toBeInTheDocument();
    expect(screen.queryByText('Pot_2')).not.toBeInTheDocument();
  });
});



test("renders 'No pots yet' message when no pots are available", async () => {
  require('../src/Util/apiClient').getAllPots.mockResolvedValueOnce([]);
  render(
    <BrowserRouter>
      <Home />
    </BrowserRouter>
  );

  await waitFor(() => expect(require('../src/Util/apiClient').getAllPots).toHaveBeenCalled());

  expect(screen.queryByText("No pots yet")).toBeInTheDocument();
});
