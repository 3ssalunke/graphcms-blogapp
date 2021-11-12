import { gql, request } from "graphql-request";

const GraphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

export const getPosts = async () => {
  const query = gql`
    query MyQuery {
      postsConnection {
        edges {
          node {
            author {
              name
              description
              id
              photo {
                url
              }
            }
            createdAt
            slug
            excerpt
            title
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  const res = await request(GraphqlAPI, query);

  return res.postsConnection.edges;
};

export const getRecentPosts = async () => {
  const query = gql`
        query GetPostDetails(){
            posts(orderBy: createdAt_ASC, last: 3){
                title
                featuredImage{
                    url
                }
                createdAt
                slug
            }
        }
    `;

  const res = await request(GraphqlAPI, query);

  return res.posts;
};

export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {
      posts(
        where: {
          slug_not: $slug
          AND: { categories_some: { slug_in: $categories } }
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `;

  const res = await request(GraphqlAPI, query, { slug, categories });

  return res.posts;
};

export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `;

  const res = await request(GraphqlAPI, query);

  return res.categories;
};

export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug: String!) {
      post(where: { slug: $slug }) {
        author {
          name
          description
          id
          photo {
            url
          }
        }
        createdAt
        slug
        excerpt
        title
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
        content {
          raw
        }
      }
    }
  `;

  const res = await request(GraphqlAPI, query, { slug });
  return res.post;
};

export const submitComment = async (obj) => {
  const res = await fetch("/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(obj),
  });

  return res.json();
};

export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug: String!) {
      comments(where: { post: { slug: $slug } }) {
        name
        createdAt
        comment
      }
    }
  `;

  const res = await request(GraphqlAPI, query, { slug });

  return res.comments;
};
