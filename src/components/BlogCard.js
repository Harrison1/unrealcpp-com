import React from 'react'
import Link from 'gatsby-link'
import IronImage from './IronImage'

const BlogCard = ({ path, image, tag, title, date, description, authorImage, authorName}) =>
    <article className="post-card post">
        <Link className="post-card-image-link" to={ path}>
            <IronImage srcLoaded={ image.replace('/upload/', '/upload/w_700/') } />
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
                <img className="author-profile-image" src={ authorImage } alt="my name" />
                <span className="post-card-author">{ authorName }</span>
            </footer>
        </div>
    </article>

export default BlogCard