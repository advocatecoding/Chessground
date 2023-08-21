// Einzelnes Spiel-Objekt
class ChessGame {
    constructor(metadata) {
      this.metadata = metadata;
      this.moves = [];
    }
  
    addMove(move) {
      this.moves.push(move);
    }
  }
  
  // Einzelner Zug
  class ChessMove {
    constructor(moveNumber, notation) {
      this.moveNumber = moveNumber;
      this.notation = notation;
    }
  }
  
  // Erstelle ein neues Schachspiel
  const gameMetadata = {
    event: "Example Game",
    site: "Here",
    date: "2023.08.21",
    round: "1",
    white: "Player 1",
    black: "Player 2",
    result: "1/2-1/2",
  };
  
  
  const chessGame = new ChessGame(gameMetadata);
  
  chessGame.addMove(new ChessMove(1, "e4 e5"));
  chessGame.addMove(new ChessMove(2, "Nf3 Nc6"));
  
  const gameList = [];
  gameList.push(chessGame);
  
  // Ausgabe des gespeicherten Spiels
  console.log(JSON.stringify(gameList, null, 2));
  
  