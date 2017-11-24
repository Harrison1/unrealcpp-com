import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default ({ data }) => {
  const { markdownRemark: post } = data;
  return (
    <div>

        <Navbar />
    
        <div className="home-template">
        
            <main id="site-main" className="site-main outer" role="main">
            
                <div className="inner">

                  <h1 className="title is-size-3 has-text-primary is-bold-light">{post.frontmatter.title}</h1>
                  <div className="content" dangerouslySetInnerHTML={{ __html: post.html }} />

                </div>
            </main>

            <Footer />

        </div>

    </div>
  );
};

export const aboutPageQuery = graphql`
  query AboutPage($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        path
        title
      }
    }
  }
`;