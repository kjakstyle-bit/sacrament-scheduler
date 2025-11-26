require('@testing-library/jest-dom');

global.Request = jest.fn((input, init) => ({
  ...init,
  json: jest.fn(() => Promise.resolve(input)),
  text: jest.fn(() => Promise.resolve(String(input))),
}));
global.Response = jest.fn((body, init) => ({
  json: jest.fn(() => Promise.resolve(body)),
  text: jest.fn(() => Promise.resolve(String(body))),
  ...init,
}));