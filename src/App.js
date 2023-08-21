import './input.css';
import { useState } from 'react';
import squareNames from './data/squareName';
import {
  rook_white,
  knight_white,
  bishop_white,
  queen_white,
  king_white,
  pawn_white
} from './data/fields';
// Importiere die Pfade zu den schwarzen Bildern aus der entsprechenden Datei
import {
  rook_black,
  knight_black,
  bishop_black,
  queen_black,
  king_black,
  pawn_black
} from './data/fields';
import fieldsData from './data/fields';


function App() {

  const cordY = [8, 7, 6, 5, 4, 3, 2, 1];

  const cordX = [1, 2, 3, 4, 5, 6, 7, 8];

  const whitePieces = [rook_white, knight_white, bishop_white, queen_white, king_white, pawn_white]

  const blackPieces = [rook_black, knight_black, bishop_black, queen_black, king_black, pawn_black]

  // Ob weiß oder schwarz dran ist
  const [turn, setTurn] = useState(2);

  // Wo die Figur hin kann
  const [curMovableFields, setCurMovableFields] = useState([])

  // Geschlagene Figuren speichern 
  const [blackPiecesTaken, setBlackPiecesTaken] = useState([king_black])
  const [whitePiecesTaken, setWhitePiecesTaken] = useState([queen_white])

  // Die Figurenverteilung auf dem Feld 
  const [fields, setFields] = useState(fieldsData)

  // Ist eine Figur ausgewählt?
  const [pieceIsSelected, setSelectPiece] = useState(false);
  // Welche Figur ist grad ausgewählt?
  const [currentPiece, setCurrentPiece] = useState(null);

  const showMovableFields = (field) => {
    var x = parseInt(field[0])
    var y = parseInt(field[1])
    switch (fields[field]) {

      case pawn_white:

        var possibleFields = []

        // Prüfen ob Pawn in der Startposition ist & ob vor ihm eine Figur steht
        var f1 = x + (y + 1).toString()

        var f2 = x + (y + 2).toString()

        // Prüfen ob das Feld leer ist bzw. undefined
        if (fields[f1] === undefined) {
          possibleFields.push(f1)
          if (fields[f2] === undefined) {
            if (y === 2) {
              possibleFields.push(f2)
            }
          }
        }

        // Prüfen ob er Schlagen kann
        var f3 = (x - 1).toString() + (y + 1).toString()
        var f4 = (x + 1).toString() + (y + 1).toString()
        if (blackPieces.includes(fields[f3])) {
          possibleFields.push(f3)
        }
        if (blackPieces.includes(fields[f4])) {
          possibleFields.push(f4)
        }


        highlightMovableFields(possibleFields)
        break;

      case pawn_black:
        var possibleFields = []

        // Prüfen ob Pawn in der Startposition ist & ob vor ihm eine Figur steht
        var f1 = x + (y - 1).toString()

        var f2 = x + (y - 2).toString()

        // Prüfen ob das Feld leer ist bzw. undefined
        if (fields[f1] === undefined) {
          possibleFields.push(f1)
          if (fields[f2] === undefined) {
            if (y === 7) {
              possibleFields.push(f2)
            }
          }
        }

        // Prüfen ob er Schlagen kann
        var f3 = (x - 1).toString() + (y - 1).toString()
        var f4 = (x + 1).toString() + (y - 1).toString()
        if (whitePieces.includes(fields[f3])) {
          possibleFields.push(f3)
        }
        if (whitePieces.includes(fields[f4])) {
          possibleFields.push(f4)
        }
        highlightMovableFields(possibleFields)
        break;

      case knight_white:
      case knight_black:
        var possibleFields = []

        // Alle theoretisch bewegbaren Felder
        var f1 = (x + 1).toString() + (y - 2).toString()
        var f2 = (x + 2).toString() + (y - 1).toString()
        var f3 = (x + 2).toString() + (y + 1).toString()
        var f4 = (x + 1).toString() + (y + 2).toString()
        var f5 = (x - 1).toString() + (y + 2).toString()
        var f6 = (x - 2).toString() + (y + 1).toString()
        var f7 = (x - 2).toString() + (y - 1).toString()
        var f8 = (x - 1).toString() + (y - 2).toString()

        let possibleMoves = [f1, f2, f3, f4, f5, f6, f7, f8]

        // Prüfen ob das Feld leer ist bzw. undefined
        for (let i = 0; i < possibleMoves.length; i++) {
          //console.log(possibleMoves)
          if (fields[field] === knight_black) {
            if (!blackPieces.includes(fields[possibleMoves[i]])) {
              possibleFields.push(possibleMoves[i])
            }

          } else {
            if (!whitePieces.includes(fields[possibleMoves[i]])) {
              possibleFields.push(possibleMoves[i])
            }
          }
        }

        highlightMovableFields(possibleFields)
        break;
      default:
        break;
    }
  }


  const [moves, setMoves] = useState([]);

  const handleClick = (field) => {
    console.log(squareNames[field])

    // Prüfen ob noch keine Figur ausgewählt ist
    if (!pieceIsSelected) {
      selectPiece(field)
    } else {
      // Wenn schon eins ausgewählt ist soll er bewegt werden => movePiece(field)
      // Außer es ist eine Figur gleicher Farbe -> Man will doch eine andere Figur bewegen
      if (whitePieces.includes(fields[field])) {
        console.log("Neue Figur")
        resetHighlights()
        selectPiece(field)
      }
      movePiece(field)
    }
  }

  const highlightMovableFields = (movableFields) => {
    // Setze die möglichen Felder die besetzt werden können 
    setCurMovableFields(movableFields)

    for (let i = 0; i < movableFields.length; i++) {
      var img = document.createElement("img");
      img.setAttribute("src", "/images/highlighter.png");
      img.setAttribute("class", "highlighter")
      var field = document.getElementById(movableFields[i])
      if (field !== null) {
        field.appendChild(img)
      }
    }
  }

  const resetHighlights = () => {
    // Speichert alle Squares und werden danach alle demarkiert  
    var allFields = document.querySelectorAll(".highlighter")
    for (let i = 0; i < allFields.length; i++) {
      allFields[i].remove()
    }
  }

  const selectPiece = (field) => {
    // Prüfen ob weiß dran ist 
    if (turn % 2 === 0) {
      console.log("----", fields[field])
      // Prüfen ob auch eine weiße Figur ausgewählt wurde
      if (whitePieces.includes(fields[field])) {
        //movePiece(field)
        showMovableFields(field)
        setSelectPiece(true)
        setCurrentPiece(field)
      } else {
        return
      }
    } else {
      if (blackPieces.includes(fields[field])) {
        //movePiece(field)
        showMovableFields(field)
        setSelectPiece(true)
        setCurrentPiece(field)
        //console.log("Figur ausgewählt", field)
      } else {
        return
      }
    }
  }

  const movePiece = (newField) => {
    console.log("wird bewegt nach", squareNames[newField])

    // Prüfen ob der zu bewegende Square besetzbar ist von der aktuellen Figur 
    if (curMovableFields.includes(newField)) {
      // Geschlagene Figur speichern in der geschlagenen Liste
      const takenPiece = fields[newField]
      // Schauen ob das besetzte Feld aktuell eine Figur hatte 
      if (takenPiece !== undefined) {
        if (blackPieces.includes(takenPiece)) {
          // Liste erweitern um takenPiece
          setBlackPiecesTaken([...blackPiecesTaken, takenPiece])
        } else {
          setWhitePiecesTaken([...whitePiecesTaken, takenPiece])
        }
      }

      var playedMove = ""
      if (turn % 2 === 0) {
        console.log("turn = 1")
        playedMove = squareNames[newField] + ""
      } else {
        playedMove = " " + squareNames[newField]
      }


      setMoves([...moves, playedMove])
      console.log(moves)
      // Neuer Field wird mit der ausgewählten Figur besetzt
      fields[newField] = fields[`${currentPiece}`]
      // Das davorige Feld wird leer, also undefined gesetzt
      fields[currentPiece] = undefined
      setFields({ ...fields })
      // Figur wird vom alten Field gelöscht 
      setSelectPiece(false)
      resetHighlights()
      setTurn(turn + 1)
    }
  }

  const newGame = () => {
    setFields(fieldsData)
    setTurn(2)
    console.log("new Game")
  }


  return (
    <>
      {/** Wer ist an der Reihe?*/}

      <div className='absolute right-8 bottom-8 h-16 w-16 flex flex-wrap content-center justify-center text-4xl'
        style={turn % 2 !== 0 ? { backgroundColor: "black", color: "white" } : { backgroundColor: "white", color: "black" }}>
        <p>
          {Math.floor(turn / 2)}
        </p>
      </div>


      <div className="grid grid-cols-6 gap-2 absolute right-8 top-8">
  {moves.length > 0 && (
    moves.map((move, index) => (
      <div key={index} className="col-span-3 text-white">
                {index % 2 === 0 ? `${index / 2 + 1}. ${move}` : move}

      </div>
    ))
  )}
</div>



      <div className='absolute left-8 top-8'>
        <button
          onClick={newGame}
          className="bg-teal-600 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded">
          Neues Spiel
        </button>
      </div>


      {/** Feld */}
      <div className="relative grid-cols-8 inline-grid m-auto">
        {cordY.map((number) => {
          if (number % 2 === 0) {
            return cordX.map((letter, index) => {
              let color = ((index) % 2 === 0) ? "bg-teal-900" : "bg-white"
              return (<div className={`w-24 h-24 field ${color}`} id={`${letter}${number}`}
                style={{
                  backgroundImage: "url(" + fields[`${letter}${number}`] + ")",
                  backgroundSize: "cover", cursor: "pointer"
                }}
                onClick={() => handleClick(`${letter}${number}`)}>
              </div>)
            })
          } else {
            return cordX.map((letter, index) => {
              let color = ((index) % 2 === 0) ? "bg-white" : "bg-teal-900"
              return (<div className={`w-24 h-24 field ${color}`} id={`${letter}${number}`}
                style={{
                  backgroundImage: "url(" + fields[`${letter}${number}`] + ")",
                  backgroundSize: "cover", cursor: "pointer"
                }}
                onClick={() => handleClick(`${letter}${number}`)}>
              </div>)
            })
          }
        })
        }

        {/** Geschlagene Figuren am Rand anzeigen */}
        <div className='absolute bottom-0 flex flex-col-reverse -left-10' >
          {
            blackPiecesTaken.map((piece) => {
              return <img className='w-8' src={piece}></img>
            })
          }
        </div>

        <div className='absolute top-0 flex flex-col-reverse -left-10' >
          {
            whitePiecesTaken.map((piece) => {
              return <img className='w-8' src={piece}></img>
            })
          }
        </div>

      </div>
    </>
  );
}

export default App;
