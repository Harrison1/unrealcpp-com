import React from 'react'
import { graphql } from 'gatsby'
import Layout from '../layouts'
import Footer from '../components/Footer'
import HomeNav from '../components/HomeNav'
import author from '../author/harrison.json'
import BlogCard from '../components/BlogCard'

const Tags = ({ pageContext, data }) => {
  const { tag } = pageContext
  const { edges, totalCount } = data.allMarkdownRemark
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } tagged with "${tag}"`

  return (
    <Layout>
      <div className="home-template">
        <header className="site-header outer" style={{backgroundImage: 'url(https://res.cloudinary.com/several-levels/image/upload/v1513954790/cover-photo_axvhnu.jpg)' }}>
          <div className="inner">
            <div className="site-header-content">
              <h1 className="site-title">
                {/* {post.length} post{post.length === 1 ? "" : "s"} tagged with{" "} */}
                <span style={{fontStyle: 'italic'}}>{ tagHeader }</span>
              </h1>
            </div>
            <HomeNav />
          </div>
        </header>
        <main id="site-main" className="site-main outer" role="main">
            <div className="inner">
            <div className="post-feed">
              {edges.map(({ node }) => (
                  <BlogCard 
                  key={ node.fields.slug } 
                  path={ node.fields.slug } 
                  image={ node.frontmatter.image }  
                  tag={ node.frontmatter.tags[0] } 
                  title={ node.frontmatter.title } 
                  date ={ node.frontmatter.date } 
                  description={ node.frontmatter.description } 
                  authorImage={ author.cardimage } 
                  authorName={ author.name } 
                  />
              ))}
            </div>
            </div>
        </main>

        <Footer />

        </div>
        </Layout>
  )
}

export default Tags

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            date(formatString: "DD MMMM, YYYY")
            title
            description
            image
            tags
          }
        }
      }
    }
  }
`
