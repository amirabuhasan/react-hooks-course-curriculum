import React, { useEffect, useReducer } from 'react'
import queryString from 'query-string'
import { fetchUser, fetchPosts } from '../utils/api'
import Loading from './Loading'
import { formatDate } from '../utils/helpers'
import PostsList from './PostsList'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'fetch':
      return {
        ...state,
        user: null,
        posts: null
      }
    case 'fetchUser':
      return {
        ...state,
        user: action.user
      }
    case 'fetchPosts':
      return {
        ...state,
        posts: action.posts
      }
    case 'error':
      return {
        ...state,
        posts: null,
        user: null,
        error: action.error
      }
  }
}

const initialState = {
  user: null,
  posts: null,
  error: null,
}

export default function User({ location }) {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const { id } = queryString.parse(location.search)
  const { user, posts, error } = state;
  const loadingUser = user === null;
  const loadingPosts = posts === null;

  useEffect(() => {
    const handleFetchData = async () => {
      dispatch({ type: 'fetch' })
      try {
        const user = await fetchUser(id);
        dispatch({ type: 'fetchUser', user })
        const posts = await fetchPosts(user.submitted.slice(0, 30));
        dispatch({ type: 'fetchPosts', posts })
      } catch({ message }) {
        dispatch({ type: 'error', error: message })
      }
    }
    handleFetchData()
  }, [id])

  if (error) {
      return <p className='center-text error'>{error}</p>
    }

  return (
    <React.Fragment>
      {loadingUser === true
        ? <Loading text='Fetching User' />
        : <React.Fragment>
            <h1 className='header'>{user.id}</h1>
            <div className='meta-info-light'>
              <span>joined <b>{formatDate(user.created)}</b></span>
              <span>has <b>{user.karma.toLocaleString()}</b> karma</span>
            </div>
            <p dangerouslySetInnerHTML={{__html: user.about}} />
          </React.Fragment>}
      {loadingPosts === true
        ? loadingUser === false && <Loading text='Fetching posts'/>
        : <React.Fragment>
            <h2>Posts</h2>
            <PostsList posts={posts} />
          </React.Fragment>}
    </React.Fragment>
  )
}
