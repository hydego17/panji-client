import BlockContent from '@sanity/block-content-to-react';
import styled from '@emotion/styled';

import { getHomePageContent } from 'lib/page';
import { getFeaturedPosts } from 'lib/post';

import Post from 'components/Post';

export default function Home({ content, posts }) {
  console.log(posts);

  return (
    <>
      <HomeStyled>
        <section className="intro">
          <h1>{content.title}</h1>

          <article>
            <BlockContent blocks={content.description} />
          </article>
        </section>
        {/* {preview && <PreviewAlert />}
        {content} */}

        <h2>Latest posts</h2>
        <article className="projects-list">
          {posts.map(post => (
            <Post key={post.slug} post={post} />
          ))}
        </article>
      </HomeStyled>
    </>
  );
}

export async function getStaticProps() {
  const result = await getHomePageContent();
  const posts = await getFeaturedPosts();
  // Pass data to the page via props
  return {
    props: {
      content: result,
      posts,
    },
  };
}

const HomeStyled = styled.section`
  min-height: 100vh;

  .intro {
    margin-bottom: 4rem;
    h1 {
      padding-right: 2rem;
    }
    p {
      font-size: 1.1rem;
    }
  }

  article {
    p {
      padding-bottom: 1rem;
    }
  }

  .projects-list {
    min-height: 30vh;
  }

  h2 {
    font-size: clamp(1.4rem, 5vw, 1.6rem);
  }
`;