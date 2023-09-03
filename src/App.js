import './input.css';
import { useState } from 'react';
import squareNames from './data/squareName';
import {
  rook_white,
  knight_white,
  bishop_white,
  queen_white,
  king_white,
  pawn_white,
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
// Audioimport
import { moveAudio, captureAudio, castleAudio  } from './data/fields';


function App() {

  // Sounds
  const moveSound = new Audio(moveAudio);
  const captureSound = new Audio(captureAudio);
  const castleSound = new Audio(castleAudio);

  // Rotation des Bretts
  const [isBoardRotated, setIsBoardRotated] = useState(false);

  const cordY = [8, 7, 6, 5, 4, 3, 2, 1];

  const cordX = [1, 2, 3, 4, 5, 6, 7, 8];

  const whitePieces = [rook_white, knight_white, bishop_white, queen_white, king_white, pawn_white]

  const blackPieces = [rook_black, knight_black, bishop_black, queen_black, king_black, pawn_black]

  // Ob weiß oder schwarz dran ist
  const [turn, setTurn] = useState(2);

  // Wo die Figur hin kann
  const [curMovableFields, setCurMovableFields] = useState([])

  // Geschlagene Figuren speichern 
  const [blackPiecesTaken, setBlackPiecesTaken] = useState([])
  const [whitePiecesTaken, setWhitePiecesTaken] = useState([])

  // Die Figurenverteilung auf dem Feld 
  const [fields, setFields] = useState(fieldsData)

  // Ist eine Figur ausgewählt?
  const [pieceIsSelected, setSelectPiece] = useState(false);
  // Welche Figur ist grad ausgewählt?
  const [currentField, setCurrentField] = useState(null);

  // Züge werden gespeichert
  const [moves, setMoves] = useState([]);

  const showMovableFields = (field) => {
    var possibleFields = []

    // X und Y sind die aktuelle Position
    var x = parseInt(field[0])
    var y = parseInt(field[1])

    let f1 = ""
    let f2 = ""
    let f3 = ""
    let f4 = ""
    let f5 = ""
    let f6 = ""
    let f7 = ""
    let f8 = ""

    let f1_prev = true
    let f2_prev = true
    let f3_prev = true
    let f4_prev = true
    let f5_prev = true
    let f6_prev = true
    let f7_prev = true
    let f8_prev = true

    switch (fields[field]) {
      case pawn_white:
        // Prüfen ob Pawn in der Startposition ist & ob vor ihm eine Figur steht
        f1 = x + (y + 1).toString()
        f2 = x + (y + 2).toString()

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
        f3 = (x - 1).toString() + (y + 1).toString()
        f4 = (x + 1).toString() + (y + 1).toString()
        if (blackPieces.includes(fields[f3])) {
          possibleFields.push(f3)
        }
        if (blackPieces.includes(fields[f4])) {
          possibleFields.push(f4)
        }


        highlightMovableFields(possibleFields)
        break;

      case pawn_black:
        // Prüfen ob Pawn in der Startposition ist & ob vor ihm eine Figur steht
        f1 = x + (y - 1).toString()
        f2 = x + (y - 2).toString()

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
        f3 = (x - 1).toString() + (y - 1).toString()
        f4 = (x + 1).toString() + (y - 1).toString()
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
        // Alle theoretisch bewegbaren Felder
        f1 = (x + 1).toString() + (y - 2).toString()
        f2 = (x + 2).toString() + (y - 1).toString()
        f3 = (x + 2).toString() + (y + 1).toString()
        f4 = (x + 1).toString() + (y + 2).toString()
        f5 = (x - 1).toString() + (y + 2).toString()
        f6 = (x - 2).toString() + (y + 1).toString()
        f7 = (x - 2).toString() + (y - 1).toString()
        f8 = (x - 1).toString() + (y - 2).toString()

        let possibleMoves = [f1, f2, f3, f4, f5, f6, f7, f8]

        for (let i = 0; i < possibleMoves.length; i++) {
          if (isValidField(possibleMoves[i])) possibleFields.push(possibleMoves[i]);
        }
        highlightMovableFields(possibleFields)
        break;
      case bishop_white:
      case bishop_black:
        // Berechne die möglichen Felder für den Läufer
        // iteration durch 7 weil nur 7 maximal gelaufen werden können
        for (let i = 1; i <= 7; i++) {
          // 1 nach rechts 1 nach oben usw.
          f1 = (x + i).toString() + (y + i).toString();
          f2 = (x + i).toString() + (y - i).toString();
          f3 = (x - i).toString() + (y + i).toString();
          f4 = (x - i).toString() + (y - i).toString();

          if (f1_prev === true) {
            if (isValidField(f1)) {
              possibleFields.push(f1)
            } else {
              f1_prev = false
            }
          }
          if (f2_prev === true) {
            if (isValidField(f2)) {
              possibleFields.push(f2)
            } else {
              f2_prev = false
            }
          }
          if (f3_prev === true) {
            if (isValidField(f3)) {
              possibleFields.push(f3)
            } else {
              f3_prev = false
            }
          }
          if (f4_prev === true) {
            if (isValidField(f4)) {
              possibleFields.push(f4)
            } else {
              f4_prev = false
            }
          }
        }
        highlightMovableFields(possibleFields)
        break;
      case rook_black:
      case rook_white:
        for (let i = 1; i <= 7; i++) {
          // 1 nach rechts 1 nach oben usw.
          f1 = (x + i).toString() + y.toString();
          f2 = (x - i).toString() + y.toString();
          f3 = (x).toString() + (y + i).toString();
          f4 = (x).toString() + (y - i).toString();
          if (f1_prev === true) {
            if (isValidField(f1)) {
              possibleFields.push(f1)
            } else {
              f1_prev = false
            }
          }
          if (f2_prev === true) {
            if (isValidField(f2)) {
              possibleFields.push(f2)
            } else {
              f2_prev = false
            }
          }
          if (f3_prev === true) {
            if (isValidField(f3)) {
              possibleFields.push(f3)
            } else {
              f3_prev = false
            }
          }
          if (f4_prev === true) {
            if (isValidField(f4)) {
              possibleFields.push(f4)
            } else {
              f4_prev = false
            }
          }
        }
        highlightMovableFields(possibleFields)
        break;
      case king_black:
      case king_white:
        let symetry = [-1, 1]
        for (let i = 0; i < symetry.length; i++) {
          // Links und rechts
          f1 = (x + (1 * (symetry[i]))).toString() + y.toString();
          // Hoch und runter
          f2 = x.toString() + (y + (1 * (symetry[i]))).toString();
          // Diagonal rechts
          f3 = (x + (1 * (symetry[i]))).toString() + (y + (1 * (symetry[i]))).toString();
          // Diagonal links
          f4 = (x + (1 * (symetry[i]))).toString() + (y - (1 * (symetry[i]))).toString();

          if (isValidField(f1)) possibleFields.push(f1);
          if (isValidField(f2)) possibleFields.push(f2);
          if (isValidField(f3)) possibleFields.push(f3);
          if (isValidField(f4)) possibleFields.push(f4);
        }
        // Rochademöglichkeit prüfen
        let cur_field = x.toString() + y.toString()
        if (turn % 2 === 0) {
          // wenn Weiß
          if (cur_field === "51" && fields[81] === rook_white) {
              possibleFields.push("71")
          }
        } else {
          if (cur_field === "58" && fields[88] === rook_black) {
            possibleFields.push("78")
        }
        }
        highlightMovableFields(possibleFields)
        break;
      case queen_black:
      case queen_white:
        for (let i = 1; i <= 7; i++) {
          if (f1_prev === true) {
            f1 = (x + i).toString() + y.toString();
            if (isValidField(f1)) {
              possibleFields.push(f1)
            } else {
              f1_prev = false
            }
          }
          if (f2_prev === true) {
            f2 = (x - i).toString() + y.toString();
            if (isValidField(f2)) {
              possibleFields.push(f2)
            } else {
              f2_prev = false
            }
          }
          if (f3_prev === true) {
            f3 = (x).toString() + (y + i).toString();
            if (isValidField(f3)) {
              possibleFields.push(f3)
            } else {
              f3_prev = false
            }
          }
          if (f4_prev === true) {
            f4 = (x).toString() + (y - i).toString();
            if (isValidField(f4)) {
              possibleFields.push(f4)
            } else {
              f4_prev = false
            }
          }
          if (f5_prev === true) {
            f5 = (x + i).toString() + (y + i).toString();
            if (isValidField(f5)) {
              possibleFields.push(f5);
            } else {
              f5_prev = false;
            }
          }

          if (f6_prev === true) {
            f6 = (x + i).toString() + (y - i).toString();
            if (isValidField(f6)) {
              possibleFields.push(f6);
            } else {
              f6_prev = false;
            }
          }

          if (f7_prev === true) {
            f7 = (x - i).toString() + (y + i).toString();
            if (isValidField(f7)) {
              possibleFields.push(f7);
            } else {
              f7_prev = false;
            }
          }

          if (f8_prev === true) {
            f8 = (x - i).toString() + (y - i).toString();
            if (isValidField(f8)) {
              possibleFields.push(f8);
            } else {
              f8_prev = false;
            }
          }

        }
        highlightMovableFields(possibleFields)
        break;
      default:
        break;
    }
  }

  const isValidField = (field) => {
    const fieldKeys = Object.keys(squareNames).map(Number);
    // Es wird geschaut ob das jeweilige markierte Feld, welches geprüft wird innerhalb auf dem Brett liegt
    // + das feld muss in eine number umgewandelt werden, da die fieldKeys vom Typ number sind 
    if (fieldKeys.includes(parseInt(field))) {
      // Prüfe ob das angezeigte Ziel-Feld eine Schwarze Figur ist
      if (turn % 2 === 0) {
        // Prüfe ob das angezeigte Ziel-Feld eine Weiße Figur ist
        if (whitePieces.includes(fields[field])) {
          return false
        } else {
          return true
        }
      }
      // Prüfe falls es eine weiße Figur ist  
      else {
        // Wenn schwarz => Schaue ob das Feld von einer Schwarzen Figur besetzt ist
        if (blackPieces.includes(fields[field])) {
          return false
        }
        else {
          return true
        }
      }
    }
  };





  const handleClick = (field) => {
    console.log(field)

    // Prüfen ob noch keine Figur ausgewählt ist
    if (!pieceIsSelected) {
      selectPiece(field)
    } else {
      // Wenn schon eins ausgewählt ist soll er bewegt werden => movePiece(field)
      // Außer es ist eine Figur gleicher Farbe -> Man will doch eine andere Figur bewegen
      if ((whitePieces.includes(fields[field])) || (blackPieces.includes(fields[field]))) {
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
      // Prüfen ob auch eine weiße Figur ausgewählt wurde
      if (whitePieces.includes(fields[field])) {
        //movePiece(field)
        showMovableFields(field)
        setSelectPiece(true)
        setCurrentField(field)
      } else {
        return
      }
    } else {
      if (blackPieces.includes(fields[field])) {
        //movePiece(field)
        showMovableFields(field)
        setSelectPiece(true)
        setCurrentField(field)
        //console.log("Figur ausgewählt", field)
      } else {
        return
      }
    }
  }

  const movePiece = (newField) => {
    // Prüfen ob der zu bewegende Square besetzbar ist von der aktuellen Figur 
    if (curMovableFields.includes(newField)) {
      // Geschlagene Figur speichern in der geschlagenen Liste
      const takenPiece = fields[newField]
      // Schauen ob das besetzte Feld aktuell eine Figur hatte 
      if (takenPiece !== undefined) {
        // Capture Sound abspielen
        captureSound.play();
        if (blackPieces.includes(takenPiece)) {
          // Liste erweitern um takenPiece
          setBlackPiecesTaken([...blackPiecesTaken, takenPiece])
        } else {
          setWhitePiecesTaken([...whitePiecesTaken, takenPiece])
        }
      }
     

      console.log("wird bewegt nach", squareNames[newField])

      // Zugreihenfolge 
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
      fields[newField] = fields[`${currentField}`]
      // Das davorige Feld wird leer, also undefined gesetzt
      fields[currentField] = undefined

      
      // Rochade prüfen => Der Rook muss sich auch bewegen
      // Wir prüfen vorher bei showMovableFields ob eine Rochade überhaupt möglich ist
      // Hier muss nur noch der Rook mitbewegt werden
      if (turn % 2 === 0) {
      if (currentField === "51" && newField === "71") {
        fields["61"] = rook_white
        fields["81"] = undefined
        
        castleSound.play()
        
      } else {
         // Normaler Zug Sound
        moveSound.play();
      } 
      } else {
        if (currentField === "58" && newField === "78") {
          fields["68"] = rook_black
          fields["88"] = undefined
          castleSound.play()
        }
        else {
          moveSound.play();
        }
      }
      //console.log("Curren piece", typeof(currentField))

      setFields({ ...fields })
      // Figur wird vom alten Field gelöscht 
      setSelectPiece(false)
      resetHighlights()
      setTurn(turn + 1)
      setIsBoardRotated(!isBoardRotated)
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
      <div className={`relative grid-cols-8 inline-grid m-auto ${isBoardRotated ? 'rotate-board' : ''}`}>
        {cordY.map((number) => {
          if (number % 2 === 0) {
            return cordX.map((letter, index) => {
              let color = ((index) % 2 === 0) ? "bg-teal-900" : "bg-white"
              return (<div className={` field ${color}`} id={`${letter}${number}`}
                style={{
                  backgroundImage: "url(" + fields[`${letter}${number}`] + ")",
                  backgroundSize: "cover",
                  cursor: "pointer",
                  transform: isBoardRotated ? "rotate(180deg)" : null
                }}
                onClick={() => handleClick(`${letter}${number}`)}>
              </div>)
            })
          } else {
            return cordX.map((letter, index) => {
              let color = ((index) % 2 === 0) ? "bg-white" : "bg-teal-900"
              return (<div className={` field ${color}`} id={`${letter}${number}`}
                style={{
                  backgroundImage: "url(" + fields[`${letter}${number}`] + ")",
                  backgroundSize: "cover", cursor: "pointer",
                  transform: isBoardRotated ? "rotate(180deg)" : null
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
              return <img
              style={{
                transform: isBoardRotated ? "rotate(180deg)" : null
              }} 
              alt='taken_piece_black' className='w-8' src={piece}></img>
            })
          }
        </div>

        <div className='absolute top-0 flex flex-col-reverse -left-10' >
          {
            whitePiecesTaken.map((piece) => {
              return <img 
              style={{
                transform: isBoardRotated ? "rotate(180deg)" : null
              }} 
              alt='taken_piece_black' className='w-8' src={piece}></img>
            })
          }
        </div>

      </div>
    </>
  );
}

export default App;
