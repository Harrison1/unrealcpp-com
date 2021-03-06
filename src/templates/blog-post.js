import React from 'react'
import Helmet from 'react-helmet'
import { graphql } from 'gatsby'
import Navbar from '../components/Navbar'
import Tag from '../components/Tag'
import UnrealVersion from '../components/UnrealVersion'
import YouTubeVideo from '../components/YouTubeVideo'
import CommentNotice from '../components/CommentNotice'
import AuthorCard from '../components/AuthorCard'
import Footer from '../components/Footer'
import author from '../author/harrison.json'

const BlogPostTemplate = ({ data }) => {
  const post = data.markdownRemark

  return (
    <div>
      <Navbar />
      <Helmet title={`Unreal C++ | ${post.frontmatter.title}`} />
      <div className="blog-post-header" style={{ backgroundImage: `url(${ post.frontmatter.image })` }}>
        { post.frontmatter.tags.map((n, i) => <Tag key={ i } tag= { n } />) }
      </div>
      <main id="site-main" className="site-main outer bg-white" role="main">
        <div className="inner">
          <article className="post-full">
            <div className="blog-content">
              <h1 className="post-full-title">{ post.frontmatter.title }</h1>
                <div className="date-meta">
                  <p>{ post.frontmatter.date }</p>
                  <UnrealVersion version={ post.frontmatter.uev } />
                </div>
                <YouTubeVideo id={ post.frontmatter.video } />
                <div dangerouslySetInnerHTML={{ __html: post.html }} />
                <hr />
                <AuthorCard 
                  image={ author.image } 
                  name={ author.name } 
                  website={ author.website }
                />
                <CommentNotice video={ post.frontmatter.video }/>
              </div>
            </article>
          </div>
      </main>
      <Footer />
    </div>
  );
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        image
        tags
        video
        uev
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
