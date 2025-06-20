'use client';

import { useState } from 'react';
import styles from './page.module.css';

export default function Board() {
  const initialBoard: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const [user, setUser] = useState({ x: 0, y: 0, direction: 1 });

  const directionNames = ['Up', 'Right', 'Down', 'Left'];
  const directions = [
    { x: 0, y: -1 }, // 上
    { x: 1, y: 0 }, // 右
    { x: 0, y: 1 }, // 下
    { x: -1, y: 0 }, // 左
  ];
  const [board, setBoard] = useState(initialBoard);

  // 迷路生成
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
    setUser({ x: 0, y: 0, direction: 1 });
  }

  return (
    <div>
      <button onClick={knockdownObstacle}>迷路生成</button>
      <button>プレイヤーを進める</button>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, cellIndex) => {
              const isUser = user.x === cellIndex && user.y === rowIndex;
              const cellClass = cell === 1 ? styles.obstacle : styles.road;
              const directionName = directionNames[user.direction];
              return (
                <div key={cellIndex} className={`${cellClass}`}>
                  {isUser && (
                    <div className={styles.user}>
                      <div className={styles[`user${directionName}` as keyof typeof styles]} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
