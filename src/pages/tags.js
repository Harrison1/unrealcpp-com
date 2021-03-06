import React from "react"
import { Link, graphql } from "gatsby"
import Header from '../components/Header'
import Footer from '../components/Footer'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
}) => (

<div className="home-template">
  <Header image='https://res.cloudinary.com/several-levels/image/upload/v1513954790/cover-photo_axvhnu.jpg' title="Tags" />
  <main id="site-main" className="site-main outer" role="main">
    <div className="inner">
      <div className="post-feed">
        <ul className="tag-container">
          {group.map(tag => (
            <li key={tag.fieldValue}>
              <Link to={ `/tags/${tag.fieldValue.toLowerCase()}` }>
                <div className="post-card post">
                  <div className="post-card-content">
                    <h2 className="post-card-title">
                      {tag.fieldValue} ({tag.totalCount})
                    </h2>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </main>
  <Footer />
</div>

)

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
