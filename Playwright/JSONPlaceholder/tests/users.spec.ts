import { test, expect } from '@playwright/test'


test.describe.parallel('Users', () => {
  test('Get all users', async ({ request }) => {
    const response = await request.get('/users')
    expect(response.status()).toBe(200)

    const body = JSON.parse(await response.text())
    console.log(body)
  })
})