const path = require('path');
const pagination = require('gatsby-paginate');

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

  return graphql(`
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

    pagination({
      edges: blogposts,
      createPage: createPage,
      pageTemplate: "src/templates/index.js",
      pageLength: 12
    });
    if (result.errors) {
      return Promise.reject(result.errors);
    }
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.frontmatter.path,
        component: path.resolve(`src/templates/${String(node.frontmatter.templateKey)}.js`),
        context: {}
      });
    });
  });
};
