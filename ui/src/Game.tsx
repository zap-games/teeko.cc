import { FunctionComponent, h } from "preact";
import { useEffect, useState } from "preact/hooks";
import Sockette from "sockette";

import { Board, EmptyBoard } from "./model";
import { BoardView } from "./BoardView";
import { Help } from "./Help";
import { setHash } from "./utils.ts";

export const Game: FunctionComponent<{
  initial: Board;
  wsPath?: string;
}> = ({ initial, wsPath }) => {

  const [board, setBoard] = useState(initial);
  const [showHelp, setShowHelp] = useState(false);
  const [ws, setWs] = useState<Sockette>(undefined);

  useEffect(() => {
    if (wsPath) {
      setWs(new Sockette(`wss://ws.teeko.cc/${wsPath}`, {
        onmessage: (msg) => {
          const evt = JSON.parse(msg.data);
          if (evt.state === null) {
            ws.send(JSON.stringify({ state: { board } }));
          }
          if (evt.state?.board) {
            moveToBoard(evt.state.board, false);
          }
        }
      }));
      return () => {
        ws.close();
      };
    }
  }, [wsPath]);

  function moveToBoard(board: Board, propagate = true) {
    setHash(board);
    localStorage.setItem("board", JSON.stringify(board));
    setBoard(board);
    if (propagate && ws) {
      ws.send(JSON.stringify({ state: { board } }));
    }
  }

  function move(from: number, to: number) {
    let { a, b, t, p } = board;
    const isA = t % 2 === 0;
    t = t + 1;

    const target = isA ? a : b;
    const result = (target & ~(1 << from)) | (1 << to);
    if (isA) {
      a = result;
    } else {
      b = result;
    }
    moveToBoard({ a, b, t, p, l: [from, to] });
  }

  function drop(pos: number) {
    let { a, b, t, p } = board;
    const isA = t % 2 === 0;
    t = t + 1;

    const target = isA ? a : b;
    const result = target | (1 << pos);
    if (isA) a = result;
    else b = result;
    moveToBoard({ a, b, t, p, l: pos });
  }

  function undo() {
    let { a, b, t, p } = board;
    const last = board.l;
    if (last === null) return;
    t = t - 1;
    const wasA = board.t % 2 === 1;
    const target = wasA ? a : b;
    if (Array.isArray(last)) {
      const [to, from] = last;
      const result = (target & ~(1 << from)) | (1 << to);
      if (wasA) a = result;
      else b = result;
      moveToBoard({ a, b, t: t, p, l: null });
    } else {
      const result = target & ~(1 << last);
      if (wasA) a = result;
      else b = result;
      moveToBoard({ a, b, t: t, p, l: null });
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
      <button onClick={() => setShowHelp(true)}>Rules</button>
      </p>
      <h1>Teeko by John Scarne</h1>
    </>
  );
};
