import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const styles = {
  content: {
    fontSize: '35px',
    position: 'absolute',
    left: '0',
    right: '0',
    marginTop: '20px',
    textAlign: 'center',
  }
}

export default function Loading({ text = 'Loading', speed = 300 }) {
  const [content, setContent] = useState(text);

  useEffect(() => {
    const id = window.setInterval(() => {
      setContent((c) => {
        return c === `${text}...`
          ? text 
          : `${c}.`
      })
    }, speed)
    return () => {
      window.clearInterval(id)
    }
  }, [text, speed])

  return (
    <p style={styles.content}>
      {content}
    </p>
  )
}

Loading.propTypes = {
  text: PropTypes.string.isRequired,
  speed: PropTypes.number.isRequired,
}

Loading.defaultProps = {
  text: 'Loading',
  speed: 300
}
