import { test, expect } from '@playwright/test'

let postsLength = 0

test.describe.configure({ mode: 'serial' })

test('Get all posts', async ({ request }) => {
const response = await request.get('/posts')
expect(response.status()).toBe(200)
expect(response.ok()).toBeTruthy()

postsLength = JSON.parse(await response.text()).length
console.log('Number of posts: ' + postsLength)
})

test('Create post', async ({ request }) => {
const newPostData = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    data: {
        userId: 1,
        title: 'New Post Title',
        body: 'New Post Body',
    }
}

const response = await request.post('/posts', newPostData)
expect(response.status()).toEqual(201)

const newPost = await response.json()
expect(newPost.userId).toBe(1)
expect(newPost.title).toContain('New Post Title')
expect(newPost.body).toEqual('New Post Body')
expect(newPost.id).toBe(postsLength + 1)
console.log(newPost)
})
