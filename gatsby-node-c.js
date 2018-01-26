const _ = require('lodash')
const Promise = require('bluebird')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const createPaginatedPages = require('gatsby-paginate');


const createTagPages = (createPage, edges) => {
  const tagTemplate = path.resolve(`src/templates/tags.js`);
  const posts = {};

  _.each(edges, ({ node }) => {
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
      posts
    }
  });

  Object.keys(posts).forEach(tagName => {
    const post = posts[tagName];
    createPage({
      path: `/tags/${tagName}`,
      component: tagTemplate,
      context: {
        posts,
        post,
        tag: tagName
      }
    });
  });
};

exports.createPages = ({ boundActionCreators, graphql }) => {
  const { createPage } = boundActionCreators;

    return new Promise((resolve, reject) => {

      const blogPost = path.resolve('./src/templates/blog-post.js')

      resolve(

        graphql(`
          {
            allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }, limit: 1000) {
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
        `).then(result => {

          const posts = result.data.allMarkdownRemark.edges;
          const blogposts = posts.filter(post => post.node.frontmatter.templateKey === 'blog-post');

          createTagPages(createPage, blogposts);

          createPaginatedPages({
            edges: blogposts,
            createPage: createPage,
            pageTemplate: "src/templates/index.js",
            pageLength: 12
          });

          if (result.errors) {
            return Promise.reject(result.errors);
          }

          _.each(posts, ({ node }) => {
            createPage({
              path: node.frontmatter.path,
              component: path.resolve(`src/templates/${String(node.frontmatter.templateKey)}.js`),
              context: {}
            });
          });
        }));
    });
};

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