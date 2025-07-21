import { test, expect } from '@playwright/test';
import { getAPIContext } from '../utils/apiClient';

test.describe('Booking API', () => {
  let token: string;
  let bookingId: number;

  const bookingData = {
      firstname: 'Kate',
      lastname: 'Dryha',
      totalprice: 100,
      depositpaid: true,
      bookingdates: {
        checkin: '2025-08-01',
        checkout: '2025-08-10'
      },
      additionalneeds: 'Breakfast'
    };

  test.beforeAll(async () => {
    const api = await getAPIContext();
    const tokenresponse = await api.post('/auth', {
      data: { username: 'admin', password: 'password123' },
      headers: { 'Content-Type': 'application/json' }
    });

    const responsepost = await api.post('/booking', {
      data: bookingData,
      headers: { 'Content-Type': 'application/json' }
    });

    const tokenbody = await tokenresponse.json();
    token = tokenbody.token;

    const body = await responsepost.json();
    bookingId = body.bookingid;
  });

  test('отримання бронювання', async () => {
    const api = await getAPIContext();
    const response = await api.get(`/booking/${bookingId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(bookingData);
  });

  test('оновлення бронювання', async () => {
    const api = await getAPIContext();
    const updatedData = { ...bookingData, firstname: 'UpdatedName' };

    const response = await api.put(`/booking/${bookingId}`, {
      data: updatedData,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(expect.objectContaining(updatedData));
  });

  test('видалення бронювання', async () => {
    const api = await getAPIContext();
    const response = await api.delete(`/booking/${bookingId}`, {
      headers: { 'Cookie': `token=${token}` }
    });

    expect(response.status()).toBe(201);
  });
});
