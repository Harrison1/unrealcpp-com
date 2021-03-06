import React from 'react'
import { Link } from 'gatsby'

const TagList = ({ tag }) =>
  <Link to={ `tags/${ tag }` }>
    <div className="post-card post">
      <div className="post-card-content">
        <h2 className="post-card-title">
          { tag }
        </h2>
      </div>
    </div>
  </Link>

export default TagList
