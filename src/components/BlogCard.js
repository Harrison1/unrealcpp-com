import React from 'react'
import { Link } from 'gatsby'

const BlogCard = ({ path, image, tag, title, date, description, authorImage, authorName}) =>
  <li className="post-card post">
    <Link className="post-card-image-link" to={ path }>
      <div className='post-card-image'>
        <div className="iron-image-loaded iron-image-fade-in" style={{ backgroundImage: `url(${ image.replace('/upload/', '/upload/w_700/') })` }}></div>
      </div>
    </Link>
    <div className="post-card-content">
      <Link className="post-card-content-link" to={ path }> 
        <header className="post-card-header">
          <span className="post-card-tags">{ tag }</span>
          <h2 className="post-card-title">{ title }</h2>
          <p className="post-card-author">{ date }</p>
        </header>
        <section className="post-card-excerpt">
          <p>{ description }</p>
        </section>
      </Link>
      <footer className="post-card-meta">
        <img className="author-profile-image m5" src={ authorImage } alt="Harrison McGuire" />
        <span className="post-card-author">{ authorName }</span>
      </footer>
    </div>
  </li>

export default BlogCard
