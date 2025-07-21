import { test, expect } from '@playwright/test';
import { getAPIContext } from '../utils/apiClient';

test.describe('Auth API', () => {
  let data = {
    username: 'admin1',
    password: 'password123'
  };
  test('успішна авторизація повертає токен', async () => {
    const api = await getAPIContext();

    const response = await api.post('/auth', {
      data,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('token');
  });

  test('неуспішна авторизація повертає помилку', async () => {
    const api = await getAPIContext();
    const wrongData = {
      username: 'wrongUser',
      password: data.password
    }

    console.log('Testing with wrong credentials:', wrongData);

    const response = await api.post('/auth', {
      data: wrongData,
      headers: { 'Content-Type': 'application/json' }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty('reason', 'Bad credentials');
  });
});
