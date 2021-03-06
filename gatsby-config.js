const config = require("./data/SiteConfig");

module.exports = {
  pathPrefix: "/unrealcpp-com",
  siteMetadata: {
    title: config.siteTitle,
    siteUrl: config.siteUrl,
    rssMetadata: {
      site_url: config.siteUrl ,
      feed_url: config.siteUrl + config.siteRss,
      title: config.siteTitle,
      description: config.siteDescription,
      image_url: `src/images/logos/unreal-cpp-logo.png`,
      author: config.userName,
      copyright: config.copyright
    }
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-catch-links`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      }
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/content/blog`,
        name: `blog`,
      }
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          `gatsby-remark-responsive-iframe`,
          {
            resolve: `gatsby-remark-prismjs`,
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              noInlineHighlight: true
            }
          }
        ]
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: config.googleAnalyticsID
      }
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: config.themeColor
      }
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: config.siteTitle,
        short_name: config.siteTitle,
        description: config.siteDescription,
        start_url: config.pathPrefix,
        background_color: config.backgroundColor,
        theme_color: config.themeColor,
        display: `minimal-ui`,
        icon: `src/images/logos/unreal-cpp-logo.png`
      }
    },
    {
      resolve: `gatsby-plugin-feed`,
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.nodes.map(node => {
                return Object.assign({}, node.frontmatter, {
                  description: node.excerpt,
                  date: node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + node.fields.slug,
                  guid: site.siteMetadata.siteUrl + node.fields.slug,
                  custom_elements: [{ "content:encoded": node.html }],
                })
              })
            },
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                ) {
                  nodes {
                    excerpt
                    html
                    fields {
                      slug
                    }
                    frontmatter {
                      title
                      date
                    }
                  }
                }
              }
            `,
            output: "/rss.xml"
          },
        ],
      },
    }
  ]
}


// feeds: [
//   {
//     serialize(ctx) {
//       const rssMetadata = ctx.query.site.siteMetadata.rssMetadata;
//       return ctx.query.allMarkdownRemark.edges.map(edge => ({
//         categories: edge.node.frontmatter.tags,
//         date: edge.node.frontmatter.date,
//         title: edge.node.frontmatter.title,
//         description: edge.node.frontmatter.description,
//         author: rssMetadata.author,
//         url: rssMetadata.site_url + edge.node.frontmatter.path,
//         guid: rssMetadata.site_url + edge.node.frontmatter.path,
//         custom_elements: [{ "content:encoded": edge.node.html }]
//       }));
//     },
//     query: `
//     {
//       allMarkdownRemark(
//         limit: 1000,
//         sort: { order: DESC, fields: [frontmatter___date] },
//       ) {
//         edges {
//           node {
//             excerpt(pruneLength: 200)
//             html
//             id
//             frontmatter {
//               path
//               description
//               title
//               image
//               date
//               tags
//             }
//           }
//         }
//       }
//     }
//   `,
//     output: config.siteRss