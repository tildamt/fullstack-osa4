const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {

    const blogs = await Blog
      .find({}).populate('user', { username: 1, name: 1 })

    response.json(blogs)
  })

blogsRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userId)

    if (!body.title || !body.url) {
        return response.status(400).json({error: 'title and url are required'})
    }
    const data = {
        likes: body.likes !== undefined ? body.likes : 0,
        user: user._id,
        title: body.title,
        url: body.url,
        author: body.author
    }

    const blog = new Blog(data)
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.json(savedBlog)
    /*blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })*/
  })

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  const data = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, data, { new: true})
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
  
})

module.exports = blogsRouter