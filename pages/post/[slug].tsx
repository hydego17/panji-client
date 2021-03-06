import React, { useEffect } from 'react';
import { InferGetStaticPropsType } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styled from '@emotion/styled';
import BlockContent from '@sanity/block-content-to-react';

import { formatDate } from 'utils';
import { urlFor } from 'lib/api';
import { getSinglePost, getLatestPosts } from 'lib/post';
import { TPopularPosts, TPost, TPosts } from 'types/post';

import PageViews from 'components/PageViews';
import PreviewAlert from 'components/PreviewAlert';
import SeoContainer from 'components/SeoContainer';

export default function PostDetail({
  post,
  preview,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter();

  if (router.isFallback) {
    return <h2> Loading... </h2>;
  }

  const {
    author,
    title,
    subtitle,
    body,
    categories,
    publishedAt,
    mainImage,
    slug,
  } = post;

  const dev = process.env.NODE_ENV === 'development';

  // Fetch views
  useEffect(() => {
    // Only count views if not in Dev/Preview Mode
    if (!dev && !preview) {
      fetch(`/api/views/${slug}`, {
        method: 'POST',
      });
    }
  }, [slug, dev, preview]);

  const ImageRenderer = props => {
    const {
      node: { asset, alt },
    } = props;
    return (
      <div className="post-image">
        <Image
          alt={alt || title}
          src={asset.url}
          objectFit="cover"
          height={500}
          width={800}
        />
        {alt && <small className="post-image-desc">{alt}</small>}
      </div>
    );
  };

  return (
    <>
      <SeoContainer
        title={`${title} – Rahmat Panji`}
        description={`${subtitle} | ${categories.map(c => c + ' ')}`}
        image={urlFor(mainImage).url()}
        date={publishedAt}
        type="article"
        author={author}
        tag={categories[0]}
      />

      <ProjectDetailStyled>
        <section className="post">
          {preview && <PreviewAlert />}

          <div className="meta">
            <div className="category">
              {categories?.map((category, index) => (
                <small
                  className={`category-text ${
                    index === categories.length - 1 && 'no-border'
                  }`}
                  key={category}
                >
                  {category}
                </small>
              ))}
            </div>

            <small>{formatDate(publishedAt)}</small>
          </div>

          <header className="title">
            <h1>{title} </h1>
          </header>

          <p className="subtitle">{subtitle}</p>

          <div className="meta">
            <small className="meta-author">By: {author} </small>

            <small className="meta-views">
              <PageViews slug={slug} />
            </small>
          </div>

          <figure className="image">
            <Image
              alt={title}
              src={urlFor(mainImage).url()}
              height={500}
              width={800}
            />
            {/* <img src={urlFor(mainImage).url()} alt={title} /> */}
          </figure>

          <article className="body">
            <BlockContent
              blocks={body}
              serializers={{ types: { image: ImageRenderer } }}
            />
          </article>
        </section>
      </ProjectDetailStyled>
    </>
  );
}

export async function getStaticProps({ params, preview = false, previewData }) {
  const post: TPost = await getSinglePost(params.slug, preview);

  return { props: { post, preview }, revalidate: 1 };
}

export async function getStaticPaths() {
  // Get all slugs from posts and provide it to paths
  const posts: TPosts = await getLatestPosts();
  const popularPosts: TPopularPosts = await fetch(
    `${process.env.CLIENT_URL}/api/most-popular`,
  ).then(res => res.json());

  const paths = posts
    ?.map(p => ({ params: { slug: p.slug } }))
    .concat(popularPosts?.map(p => ({ params: { slug: p.slug } })));

  return { paths, fallback: true };
}

// Style
const ProjectDetailStyled = styled.section`
  .post {
    margin-bottom: 3rem;

    .title {
      padding-top: 0.25rem;
    }

    .subtitle {
      /* padding: 1rem 0; */
      margin-bottom: 1.5rem;
    }

    .meta {
      color: var(--color-meta);
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
    }

    .image {
      position: relative;
      margin-top: 2rem;
      margin-bottom: 2rem;
    }

    .body {
      p {
        margin-top: 1.25em;
        margin-bottom: 1.25em;
      }

      ul,
      ol {
        padding: 1rem 2rem;
        list-style: initial;

        li {
          padding: 0.2rem 0;
        }
      }

      .post-image {
        position: relative;
        text-align: center;

        div {
          border-radius: 3px;
          overflow: hidden;
        }

        .post-image-desc {
          color: var(--color-meta);
        }
      }
    }

    .category {
      .category-text {
        display: inline-block;
        padding-right: 5px;
        margin-right: 5px;
        border-right: 1px solid var(--borderColor);
      }

      .no-border {
        border: 0;
      }
    }
  }

  small {
    font-size: 14px;
  }

  h2 {
    font-size: 1.2rem;
    padding-bottom: 0.5rem;
  }
`;
