/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';

import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

import Link from 'next/link';
import styles from './posts.module.scss';

interface IPosts {
  post: {
    uid?: string;
    first_publication_date: string | null;
    data: {
      title: string;
      subtitle: string;
      author: string;
    };
  };
}

export function Posts({ post }: IPosts) {
  return (
    <Link href={`/post/${post.uid}`}>
      <a>
        <div className={styles.container}>
          <h2 className={styles.title}>{post.data.title}</h2>
          <p className={styles.description}>{post.data.subtitle}</p>
          <div className={styles.informations}>
            <span>
              <AiOutlineCalendar size={18} />{' '}
              {format(new Date(post.first_publication_date), 'd LLL y', {
                locale: ptBR,
              })}
            </span>
            <span>
              <AiOutlineUser size={18} />
              {post.data.author}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}
