import React, { useReducer, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import { fetchMainPosts } from '../utils/api'
import Loading from './Loading'
import PostsList from './PostsList'

const postsReducer = (state, action) => {
  switch (action.type) {
    case 'success':
      return {
        ...state,
        posts: action.posts,
        error: null,
        loading: false
      }
    case 'error':
      return {
        ...state,
        error: action.error,
        posts: null,
        loading: false
      }
  }
}

const initialState = {
  posts: null,
  error: null,
  loading: true
}

export default function Posts({ type }) {
  const [state, dispatch] = useReducer(postsReducer, initialState);
  const { error, posts, loading } = state;

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const posts = await fetchMainPosts(type);
        dispatch({ type: 'success', posts })
      } catch ({ message }) {
        dispatch({ type: 'error', error: message })
      }
    }
    handleFetch()
  }, [type])

  if (loading === true) {
    return <Loading />
  }

  if (error) {
    return <p className='center-text error'>{error}</p>
  }

  return <PostsList posts={posts} />
}

Posts.propTypes = {
  type: PropTypes.oneOf(['top', 'new'])
}
