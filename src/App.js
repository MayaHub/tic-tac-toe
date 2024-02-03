import { useState } from "react";

//click event for X/O input changes value of square
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board( { xIsNext, squares, onPlay } ) {// props that control gameplay

  //when the square is clicked, put an X/O in the square
  function handleClick(i) {
    //if square already has a value, it doesn't update state
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    //call slice to create a copy of the squares array
    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let x;
  if (winner) {
    x = "Winner: " + winner;
  } else {
    x = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="x">{x}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function Game() {

  const [history, setHistory] = useState([Array(9).fill(null)]);

  //keeps track of move being viewed when using jumpTo method
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;

  //array of currently occupied squares on the board
  const currentSquares = history[currentMove];

  //function called to update the game
  function handlePlay(nextSquares) {
    //when going back in time with jumpTo, then making a new move, we only keep the history up to that point
    const nextHistory = [...history.slice(0, currentMove +1), nextSquares];

    //creates a new array that contains all the items in history, followed by nextSquares
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length-1);
  }

  //jump back to a previous move
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }
    return (
      <li key={move}>
        <button onClick={ () => jumpTo(move) } >{description}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol> {moves} </ol>

      </div>
    </div>
  );
}

//doesn't matter if this is before or after the Board
function calculateWinner(squares) {
  // arrays to represent lines on board - horizontal (3), vertical (3), and diagonal (2)
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    //if the lines have the same character, (Xs or Os) the winner is declared
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
