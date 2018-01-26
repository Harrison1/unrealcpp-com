const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const createPaginatedPages = require('gatsby-paginate')

const createTagPages = (createPage, edges) => {

  const tagTemplate = path.resolve(`src/templates/tags.js`);

  const posts = {};

  edges.forEach(({ node }) => {
    if (node.frontmatter.tags) {
      node.frontmatter.tags.forEach(tag => {
        if (!posts[tag]) {
          posts[tag] = [];
        }
        posts[tag].push(node);
      });
    }
  });

  createPage({
    path: "/tags",
    component: tagTemplate,
    context: {
      posts,
    },
  });

  Object.keys(posts).forEach(tagName => {
    const post = posts[tagName];
    createPage({
      path: `/tags/${tagName}`,
      component: tagTemplate,
      context: {
        posts,
        post,
        tag: tagName,
      },
    });
  });
};

exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators

  return new Promise((resolve, reject) => {
    const blogPost = path.resolve('./src/templates/blog-post.js')
    resolve(
      graphql(
        `
          {
            allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }, limit: 1000) {
              edges {
                node {
                  excerpt(pruneLength: 200)
                  html
                  id
                  frontmatter {
                    date(formatString: "MMMM DD, YYYY")
                    description
                    image
                    video
                    path
                    tags
                    templateKey
                    title
                    uev
                  }
                }
              }
            }
          }
        `
      ).then(result => {

        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        const posts = result.data.allMarkdownRemark.edges;
        const blogposts = posts.filter(post => post.node.frontmatter.templateKey === 'blog-post');

        createTagPages(createPage, blogposts);

        createPaginatedPages({
          edges: blogposts,
          createPage: createPage,
          pageTemplate: "src/templates/index.js",
          pageLength: 12
        });

        // Create blog posts pages.
        // const posts = result.data.allMarkdownRemark.edges;

        _.each(posts, (post, index) => {
          const previous = index === posts.length - 1 ? false : posts[index + 1].node;
          const next = index === 0 ? false : posts[index - 1].node;

          createPage({
            path: post.node.frontmatter.path,
            component: blogPost,
            context: {
              slug: post.node.frontmatter.path,
              previous,
              next,
            },
          })
        })
      })
    )
  })
}

exports.onCreateNode = ({ node, boundActionCreators, getNode }) => {
  const { createNodeField } = boundActionCreators

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      node,
      value,
    })
  }
}