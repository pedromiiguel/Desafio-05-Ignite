/* eslint-disable react/no-danger */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { RichText } from 'prismic-dom';
import {
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }

  return (
    <div className={commonStyles.container}>
      <article className={styles.post}>
        <img
          className={styles.banner}
          src={post.data.banner.url}
          alt="Banner"
        />
        <h1 className={styles.title}>{post.data.title}</h1>
        <div className={styles.details}>
          <span>
            <AiOutlineCalendar size={18} />
            {format(new Date(post.first_publication_date), 'd LLL y', {
              locale: ptBR,
            })}
          </span>
          <span>
            <AiOutlineUser size={18} />
            {post.data.author}
          </span>

          <span>
            <AiOutlineClockCircle size={18} /> 4 min
          </span>
        </div>

        <div className={styles.content}>
          {post.data.content.map(content => {
            return (
              <div key={content.heading}>
                <h2 className={styles.heading}>{content.heading}</h2>
                {content.body.map(p => {
                  return (
                    <div
                      className={styles.body}
                      dangerouslySetInnerHTML={{ __html: p.text }}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </article>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.subtitle', 'post.author'],
    }
  );

  const paths = postsResponse.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const { slug } = context.params;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  if (!response) {
    return {
      notFound: true,
    };
  }

  const post: Post = response;

  // const post = {
  //   first_publication_date: response.first_publication_date,
  //   data: {
  //     title: response.data.title,
  //     banner: {
  //       url: response.data.banner.url,
  //     },
  //     author: response.data.author,
  //     content: [
  //       {
  //         heading: response.data.content[0].heading,
  //         body: [
  //           {
  //             text: RichText.asHtml(response.data.content[0].body),
  //           },
  //         ],
  //       },
  //     ],
  //   },
  // };

  return {
    props: {
      post,
    },
  };
};
