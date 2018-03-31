import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import Navbar from '../components/Navbar'
import Tag from '../components/Tag'
import UnrealVersion from '../components/UnrealVersion'
import YouTubeVideo from '../components/YouTubeVideo'
import CommentNotice from '../components/CommentNotice'
import AuthorCard from '../components/AuthorCard'
import Footer from '../components/Footer'
import author from '../author/harrison.json'

const Template = ({ data }) => {

  const { markdownRemark: post } = data
  let tags = ''

  if(Array.isArray(post.frontmatter.tags)) {
    
    tags = post.frontmatter.tags.map((n, i) => {
        return <Tag key={ i } tag= { n } />
    })

  } else {
    tags = <div></div>
  }


  return (
    <div>

      <Navbar />

      <Helmet title={`Unreal C++ | ${post.frontmatter.title}`} />

      <div className="blog-post-header" style={{ backgroundImage: `url(${ post.frontmatter.image })` }}>

      { tags }

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

                      <h3>Author</h3>
                      <AuthorCard image={ author.image } name={ author.name } twitter={ author.twitter } email={ author.email } />

                      <CommentNotice video={ post.frontmatter.video }/>

                  </div>

              </article>

          </div>

      </main>

      <Footer />

    </div>
  );
}

export default Template

export const blogPageQuery = graphql`
query BlogPostByPath($path: String!) {
  markdownRemark(frontmatter: { path: { eq: $path } }) {
    html
    frontmatter {
      date(formatString: "MMMM DD, YYYY")
      image
      video
      path
      tags
      title
      uev
    }
  }
}
`;