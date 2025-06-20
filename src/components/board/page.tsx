'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Board() {
  const initialBoard: number[][] = [
    [2, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const directions = [
    { x: 0, y: -1 }, // 上
    { x: 1, y: 0 }, // 右
    { x: 0, y: 1 }, // 下
    { x: -1, y: 0 }, // 左
  ];
  const [board, setBoard] = useState(initialBoard);

  function knockdownObstacle() {
    const newBoard = structuredClone(initialBoard);
    const result = newBoard.flatMap((row, y) =>
      row.flatMap((cell, x) => (cell === 1 ? [{ x, y }] : [])),
    );
    result.forEach((pos) => {
      const randomNumber = Math.floor(Math.random() * 4);
      const randomDirection = directions[randomNumber];
      const newX = pos.x + randomDirection.x;
      const newY = pos.y + randomDirection.y;
      if (newBoard[newY]) {
        newBoard[newY][newX] = 1;
      }
    });

    setBoard(newBoard);
  }

  return (
    <div>
      <button onClick={knockdownObstacle}>迷路生成</button>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <div key={cellIndex} className={cell === 0 ? styles.road : styles.obstacle} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
