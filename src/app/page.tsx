'use client';

import Board from '../components/board/page';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Board />
    </div>
  );
}
