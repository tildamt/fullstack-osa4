const dummy = (blogs) => {
    // ...
  }
  
const totalLikes = (blogs) => {
    const likes = blogs.reduce((sum, blog) => sum + blog.likes, 0)
    return likes
}

const favoriteBlog = (blogs) => {
    const mostLikedBlog = blogs.reduce((maxLikes, currentBlog) => {
        return currentBlog.likes > maxLikes.likes ? currentBlog : maxLikes
    }, blogs[0])
    return mostLikedBlog
}

const mostBlogs = (blogs) => {
    const numberOfBlogs = blogs.reduce((counts, currentBlog) => {
        const author = currentBlog.author
        counts[author] = (counts[author] || 0) + 1
        return counts
    }, {})

    const authorWithMostBlogs = Object.entries(numberOfBlogs).reduce((maxAuthor, currentAuthor) => {
        return currentAuthor[1] > maxAuthor.blogs ? { author: currentAuthor[0], blogs: currentAuthor[1] } : maxAuthor
      }, { author: '', blogs: 0 })

    return authorWithMostBlogs
}

const mostLikes = (blogs) => {
    const authorLikes = blogs.reduce((likes, current) => {
        const author = current.author
        likes[author] = (likes[author] || 0) + current.likes
        return likes
    }, {})

    const authorWithMostLikes = Object.entries(authorLikes)
        .reduce((max, current) => {
            return current[1] > max.likes ? {author: current[0], likes: current[1]} : max
        }, {author: '', likes: 0})
    
    return authorWithMostLikes
}


module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
  }