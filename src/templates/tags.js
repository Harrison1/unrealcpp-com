import React from "react"
import Link from "gatsby-link"
import Header from '../components/Header'
import HomeNav from '../components/HomeNav'
import BlogCard from '../components/BlogCard'
import Footer from '../components/Footer'
import TagList from '../components/TagList'
import author from '../author/harrison.json'

export default function Tags({ pathContext }) {

    const { posts, post, tag } = pathContext
    const sortedTags = Object.keys(posts).sort();

    if (tag) {
        return (
            <div className="home-template">

                <header className="site-header outer" style={{backgroundImage: 'url(https://res.cloudinary.com/several-levels/image/upload/v1513954790/cover-photo_axvhnu.jpg)' }}>
                    <div className="inner">
                        <div className="site-header-content">
                            <h1 className="site-title">
                                {post.length} post{post.length === 1 ? "" : "s"} tagged with{" "}
                                <span style={{fontStyle: 'italic'}}>{tag}</span>
                            </h1>
                        </div>
                        <HomeNav />
                    </div>
                </header>
            
                <main id="site-main" className="site-main outer" role="main">
            
                    <div className="inner">
            
                        <div className="post-feed">

                            {post.map(post => (

                                    <BlogCard key={ post.id } path={ post.frontmatter.path } image={ post.frontmatter.image }  tag={ post.frontmatter.tags[0] } title={ post.frontmatter.title } date ={ post.frontmatter.date } description={ post.frontmatter.description } authorImage={ author.cardimage } authorName={ author.name } />
                            ))}

                        </div>

                    </div>
                </main>

                <Footer />

            </div>
        )
    }
  return (

    <div>

        <div className="home-template">

            <Header image='https://res.cloudinary.com/several-levels/image/upload/v1513954790/cover-photo_axvhnu.jpg' title="Tags" />
        
                <main id="site-main" className="site-main outer" role="main">
                
                    <div className="inner">

                        <div className="post-feed">

                            <div className="tag-container">
                                                    
                                { sortedTags.map((n, i) => (

                                    <TagList tag={ n } key={ i } />

                                ))}

                            </div>

                        </div>

                    </div>
                </main>

            <Footer />

        </div>

    </div>
  );
}