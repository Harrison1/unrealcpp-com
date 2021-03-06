import React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../layouts'
import Header from '../components/Header'
import Footer from '../components/Footer'
import author from '../author/harrison.json'
import BlogCard from '../components/BlogCard'

const BlogIndex = ({ data, pageContext }) => {
  const posts = data.allMarkdownRemark.edges
  const { currentPage, numPages } = pageContext
  const isFirst = currentPage === 1
  const isLast = currentPage === numPages
  const prevPage = currentPage - 1 === 1 ? '' : (currentPage - 1).toString()
  const nextPage = (currentPage + 1).toString()

  return (
    <Layout>
      <div className="home-template">
        <Header 
          image='https://res.cloudinary.com/several-levels/image/upload/v1513954790/cover-photo_axvhnu.jpg' 
          title="Unreal C++" 
          tagline="Unreal Engine 4 C++ Tutorials" 
        />
        <main id="site-main" className="site-main outer" role="main">
          <div className="inner">
            <ul className="post-feed">
                {posts.map(({ node }) => (
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
            </ul>
          </div>

          <div className="paginatation">
            <div className="previousLink">
              {!isFirst && <Link to={ `/${prevPage}` } rel="prev">Prev</Link> }
            </div>
            { currentPage }
            <div className="nextLink">
              {!isLast && <Link to={ `/${nextPage}` } rel="next">Next</Link> }
            </div>
          </div>
        </main>

        <Footer />

      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query blogPageQuery($skip: Int!, $limit: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
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
