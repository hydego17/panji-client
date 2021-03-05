import client, { previewClient } from './sanity';

const postFields = `
title,
subtitle,
'slug':slug.current,
'author': author->name,
mainImage,
'categories': categories[]->title,
publishedAt,
body,
`;

export async function getFeaturedPosts() {
  const results = await client.fetch(
    `*[_type == "post"] 
      | order(_createdAt desc)
      {${postFields}}[0...3]
     `,
  );

  return results;
}

export async function getAllPosts() {
  const results = await client.fetch(
    `*[_type == "post"] 
      | order(_createdAt desc)
      {${postFields}}
     `,
  );

  return results;
}

export async function getPaginatedPosts({ offset = 0 } = { offset: 0 }) {
  const data = await client.fetch(
    `*[_type == "post"] 
    | order(_createdAt desc)
    {${postFields}}[${offset}...${offset + 10}]
   `,
  );

  return data;
}

export async function getSinglePost(slug, preview) {
  // const currClient = getClient(preview);
  const result = await client
    .fetch(
      `*[_type== "post" && slug.current == $slug]
    { ${postFields}
      body[]{..., "asset": asset-> }
    }`,
      { slug },
    )
    .then(res => (preview ? (res?.[1] ? res[1] : res[0]) : res?.[0]));

  return result;
}