const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
    try {
      const users = await User.find({})
      response.json(users)
    } catch (error) {
      response.status(500).json({ error: 'Internal server error' })
    }
  })

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    if (!username || !password) {
        return response.status(400).json({ error: 'username and password must be defined' });
    }
    
    if (username.length < 3 || password.length < 3) {
        return response.status(400).json({error: 'username and password must be at least 3 characters'})
    }

    try {

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
    } catch (error) {
        if (error.name === 'ValidationError') {
            return response.status(400).json({ error: error.message })
        }
    }
})

module.exports = usersRouter