
import { GET, POST } from '../route';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

jest.mock('next/server', () => ({
  NextResponse: Object.assign(jest.fn((body, init) => ({
    status: init?.status || 200,
    json: jest.fn(() => Promise.resolve(body)),
  })), {
    json: jest.fn((data) => ({ status: 200, json: () => Promise.resolve(data) })),
  }),
  NextRequest: jest.fn((input, init) => ({
    ...init,
    json: jest.fn(() => Promise.resolve(JSON.parse(init.body))),
    text: jest.fn(() => Promise.resolve(init.body)),
    headers: {
      get: jest.fn((header) => {
        if (header === 'content-type') return 'application/json';
        return undefined;
      }),
    },
  })),
}));

// Mock the @vercel/kv module
jest.mock('@vercel/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

describe('/api/roles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return the roles from KV if they exist', async () => {
      const mockRoles = ['Role 1', 'Role 2'];
      const mockedKvGet = kv.get as jest.Mock;
      mockedKvGet.mockResolvedValue(mockRoles);

      const response = await GET();
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(mockRoles);
      expect(kv.get).toHaveBeenCalledWith('sacrament-roles');
    });

    it('should return default roles and set them in KV if they do not exist', async () => {
      const mockedKvGet = kv.get as jest.Mock;
      mockedKvGet.mockResolvedValue(null);

      const response = await GET();
      const body = await response.json();

      const defaultRoles = ['祝福パン', '祝福水', 'パス1', 'パス2', 'パス3', 'パス4'];
      expect(response.status).toBe(200);
      expect(body).toEqual(defaultRoles);
      expect(kv.get).toHaveBeenCalledWith('sacrament-roles');
      expect(kv.set).toHaveBeenCalledWith('sacrament-roles', defaultRoles);
    });
  });

  describe('POST', () => {
    it('should save the roles to KV and return them', async () => {
      const newRoles = ['New Role 1', 'New Role 2'];
      const request = new NextRequest('http://localhost/api/roles', {
        method: 'POST',
        body: JSON.stringify({ roles: newRoles }),
      });

      const response = await POST(request);
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(body).toEqual(newRoles);
      expect(kv.set).toHaveBeenCalledWith('sacrament-roles', newRoles);
    });

    it('should return a 400 error if roles are not provided', async () => {
        const request = new NextRequest('http://localhost/api/roles', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const response = await POST(request);

        expect(response.status).toBe(400);
    });
  });
});
