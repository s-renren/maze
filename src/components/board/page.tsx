'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const directionNames = ['Up', 'Right', 'Down', 'Left'];
  const directions = useMemo(
    () => [
      { x: 0, y: -1 }, // 上
      { x: 1, y: 0 }, // 右
      { x: 0, y: 1 }, // 下
      { x: -1, y: 0 }, // 左
    ],
    [],
  );
  const [user, setUser] = useState({ x: 0, y: 0, direction: 1 });
  const [board, setBoard] = useState(initialBoard);
  const isStart = board.flatMap((row) => row).filter((cell) => cell === 1).length === 16;
  const isGoal = user.x === board[0].length - 1 && user.y === board.length - 1;

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

  // 次に動く場所を決める
  const getPriorityDirections = useCallback(
    (currentDirIndex: number): number => {
      const nextDirections = [
        (currentDirIndex + 3) % 4,
        currentDirIndex,
        (currentDirIndex + 1) % 4,
      ];
      const canMove = nextDirections.find(
        (dirIndex) =>
          board[user.y + directions[dirIndex].y]?.[user.x + directions[dirIndex].x] === 0,
      );
      if (canMove === undefined) {
        return (currentDirIndex + 2) % 4;
      } else {
        return canMove;
      }
    },
    [board, user, directions],
  );

  // ユーザーから見て左、真っすぐ、右の順で進む。行き止まりは戻る
  const moveUser = useCallback(() => {
    const { x, y, direction } = user;
    const nextRoad = getPriorityDirections(direction);
    setUser({
      x: x + directions[nextRoad].x,
      y: y + directions[nextRoad].y,
      direction: nextRoad,
    });
  }, [user, directions, getPriorityDirections]);

  useEffect(() => {
    if (isGoal) {
      alert('ゴール！');
    } else if (!isStart) {
      const timer = setTimeout(() => {
        moveUser();
      }, 500);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [user, isStart, isGoal, moveUser]);

  return (
    <div>
      <button onClick={knockdownObstacle}>迷路生成</button>
      <div className={styles.board}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {row.map((cell, cellIndex) => {
              const isUser = user.x === cellIndex && user.y === rowIndex;
              const isStart = rowIndex === 0 && cellIndex === 0;
              const isGoal = rowIndex === board.length - 1 && cellIndex === row.length - 1;

              let cellClass = styles.road;
              if (cell === 1) {
                cellClass = styles.obstacle;
              } else if (isStart || isGoal) {
                cellClass = styles.startGoal;
              }
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
