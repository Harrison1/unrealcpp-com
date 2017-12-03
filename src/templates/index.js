import React from "react"
import Link from "gatsby-link"
import Helmet from 'react-helmet'
import Header from '../components/Header'
import BlogCard from '../components/BlogCard'
import PaginateLink from '../components/PaginateLink'
import Footer from '../components/Footer'
import author from '../author/harrison.json'
 
const IndexPage = ({ data, pathContext }) => {
  const { group, index, first, last } = pathContext
  const previousUrl = index - 1 == 1 ? "" : (index - 1).toString()
  const nextUrl = (index + 1).toString()
  const total = data.allMarkdownRemark.edges.filter(post => post.node.frontmatter.templateKey === 'blog-post').length

  return (

      <div className="home-template">

        <Header image='https://res.cloudinary.com/several-levels/image/upload/v1512221876/night-road_ulziln.jpg' title="Unreal 4 C++" tagline="C++ Tutorials for Unreal Engine 4" />
      
        <main id="site-main" className="site-main outer" role="main">

            <div className="inner">

                <div className="post-feed">

                    {group.map(({ node }) => (

                        <BlogCard key={ node.id } path={ node.frontmatter.path } image={ node.frontmatter.image }  tag={ node.frontmatter.tags[0] } title={ node.frontmatter.title } date ={ node.frontmatter.date } description={ node.frontmatter.description } authorImage={ author.cardimage } authorName={ author.name } />

                    ))}

                </div>

                <div className="paginatation">
                    <div className="previousLink">
                        <PaginateLink tag={ first } url={ previousUrl } text="Prev" />
                    </div>

                    <p>{index} of { Math.ceil(total/12)}</p>

                    <div className="nextLink">
                        <PaginateLink tag={ last } url={ nextUrl } text="Next" />
                    </div>

                </div>

            </div>
        </main>

        <Footer />

    </div>
    
  )
}

export default IndexPage

export const pageQuery = graphql`
query IndexQuery {
  allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
    totalCount
    edges {
      node {
        excerpt(pruneLength: 40)
        id
        frontmatter {
          title
          templateKey
          date(formatString: "MMMM DD, YYYY")
          path
        }
      }
    }
  }
}
`;