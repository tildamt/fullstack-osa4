const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

test('a user without valid requirements cannot be added', async () => {

    const newUser = {
        name: "Jae",
        password: "12345"
    }

    const response = await api
      .post('/api/users')
      .send(newUser)

    expect(response.status).toBe(400)
})

afterAll(async() => {
    await mongoose.connection.close()
})