/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticProps } from 'next';

import Prismic from '@prismicio/client';

import { useState } from 'react';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { Posts } from '../components/Posts';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [publications, setPublications] = useState(postsPagination.results);
  const [isNextPage, setIsNextPage] = useState(postsPagination.next_page);

  const handleNextPage = async () => {
    const response = await fetch(isNextPage);
    const data = await response.json();

    setPublications(prevState => [...prevState, ...data.results]);
    setIsNextPage(data.next_page);
  };

  return (
    <div className={commonStyles.container}>
      <main>
        {publications.map(post => {
          return <Posts key={post.uid} post={post} />;
        })}
        {isNextPage && (
          <div
            className={styles.button}
            onClick={() => {
              handleNextPage();
            }}
          >
            Carregar mais posts
          </div>
        )}
      </main>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
      pageSize: 1,
    }
  );

  const posts = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return {
    props: {
      postsPagination: {
        results: posts,
        next_page: postsResponse.next_page,
      },
    },
  };
};
