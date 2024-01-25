const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })

blogsRouter.post('/', (request, response) => {
    const { title, url, likes, ...params} = request.body

    if (!title || !url) {
        return response.status(400).json({error: 'title and url are required'})
    }
    const data = {
        likes: likes !== undefined ? likes : 0,
        title,
        url,
        ...params
    }

    const blog = new Blog(data)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })

module.exports = blogsRouter