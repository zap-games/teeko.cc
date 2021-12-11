import { FunctionComponent, h } from "preact";
import { Board, EmptyBoard } from "./model";
import { useState } from "preact/hooks";
import { BoardView } from "./BoardView";
import { Help } from "./Help";

export const LocalGame: FunctionComponent<{
  initial: Board;
}> = ({ initial }: { initial: Board }) => {
  const [board, setBoard] = useState(initial);
  const [showHelp, setShowHelp] = useState(false);

  function moveToBoard(board: Board) {
    location.replace(
      `#${JSON.stringify([board.a, board.b, board.t, board.l])}`
    );
    setBoard(board);
  }

  function move(from: number, to: number) {
    let { a, b } = board;
    const { t, p } = board;
    const isA = t % 2 === 0;

    const target = isA ? a : b;
    const result = (target & ~(1 << from)) | (1 << to);
    if (isA) {
      a = result;
    } else {
      b = result;
    }
    moveToBoard({ a, b, t: (t + 1) % 2, p, l: [from, to] });
  }

  function drop(pos: number) {
    let { a, b } = board;
    const { t, p } = board;
    const isA = t % 2 === 0;

    const target = isA ? a : b;
    const result = target | (1 << pos);
    if (isA) a = result;
    else b = result;
    moveToBoard({ a, b, t: (t + 1) % 2, p, l: pos });
  }

  function undo() {
    let { a, b } = board;
    const { t, p } = board;
    const last = board.l;
    if (last === null) return;
    const wasA = board.t % 2 === 1;
    const target = wasA ? a : b;
    if (Array.isArray(last)) {
      const [to, from] = last;
      const result = (target & ~(1 << from)) | (1 << to);
      if (wasA) a = result;
      else b = result;
      moveToBoard({ a, b, t: t - 1, p, l: null });
    } else {
      const result = target & ~(1 << last);
      if (wasA) a = result;
      else b = result;
      moveToBoard({ a, b, t: t - 1, p, l: null });
    }
  }

  if (showHelp) return <Help close={() => setShowHelp(false)} />;

  return (
    <>
      <BoardView
        board={board}
        drop={drop}
        move={move}
        klass="full"
        showStatus={true}
      />
      <p>
        {board.l !== null ? <button onClick={undo}>Undo</button> : <></>}
        {board.a !== 0 ? (
          <button onClick={() => moveToBoard({ ...EmptyBoard })}>Reset</button>
        ) : (
          <></>
        )}
        <button onClick={() => setShowHelp(true)}>Help</button>
      </p>
      <h1>TEEKO by John Scarne</h1>
    </>
  );
};
