import './input.css';
import { useEffect, useRef, useState } from 'react';
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
import { moveAudio, captureAudio, castleAudio, checkAudio } from './data/fields';


function App() {

  // Sounds
  const moveSound = new Audio(moveAudio);
  const captureSound = new Audio(captureAudio);
  const castleSound = new Audio(castleAudio);
  const checkSound = new Audio(checkAudio);

  // Rotation des Bretts
  const [isBoardRotated, setIsBoardRotated] = useState(false);
  // ohne useState
  // var isBoardRotatedVar = false
  // function setIsBoardRotatedVar(bool) {
  //   isBoardRotatedVar = bool
  // }

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
  const [pieceIsSelected, setSelectPiece] = useState(false)

  // Welche Figur ist grad ausgewählt?
  const [currentField, setCurrentField] = useState(null)

  // Wenn Schach gesetzt wird

  //const [whiteIsChecked, setWhiteIsChecked] = useState(false);
  //const [blackIsChecked, setBlackIsChecked] = useState(false);


  // Die aktuelle Position des schwarzen oder weißen Königs 
  const [whiteKingPosition, setWhiteKingPosition] = useState("")
  const [blackKingPosition, setBlackKingPosition] = useState("");


  // Züge werden gespeichert
  const [moves, setMoves] = useState([])

  // drag drop
  // doubleRenderFix = useRef(false)

  const [mouseDown, setMouseDown] = useState(false)



  const [checked, setChecked] = useState(false);


  var whiteIsChecked = false
  var blackIsChecked = false



  const showMovableFields = (field, highlight = true, testFields = null) => {
    var possibleFields = []

    let cur_fields;

    if (testFields) {
      cur_fields = testFields;
      //console.log("cur Fields: ",cur_fields);
    } else {
      cur_fields = fields
    }

    // X und Y sind die aktuelle Position
    var x = parseInt(field[0])
    var y = parseInt(field[1])

    let f1 = ""; let f2 = ""; let f3 = ""; let f4 = ""; let f5 = ""; let f6 = ""; let f7 = ""; let f8 = "";

    let f1_prev = true; let f2_prev = true; let f3_prev = true; let f4_prev = true; let f5_prev = true; let f6_prev = true; let f7_prev = true; let f8_prev = true;

    let f1_prevT = true; let f2_prevT = true; let f3_prevT = true; let f4_prevT = true; let f5_prevT = true; let f6_prevT = true; let f7_prevT = true; let f8_prevT = true;



    switch (cur_fields[field]) {
      case pawn_white:
        console.log("pawn_white");
        // Prüfen ob Pawn in der Startposition ist & ob vor ihm eine Figur steht
        f1 = x + (y + 1).toString()
        f2 = x + (y + 2).toString()

        // Prüfen ob das Feld leer ist bzw. undefined
        if (cur_fields[f1] === undefined) {
          possibleFields.push(f1)
          if (cur_fields[f2] === undefined) {
            if (y === 2) {
              possibleFields.push(f2)
            }
          }
        }

        // Prüfen ob er Schlagen kann
        f3 = (x - 1).toString() + (y + 1).toString()
        f4 = (x + 1).toString() + (y + 1).toString()
        if (blackPieces.includes(cur_fields[f3])) {
          possibleFields.push(f3)
        }
        if (blackPieces.includes(cur_fields[f4])) {
          possibleFields.push(f4)
        }


        //highlightMovableFields(possibleFields)
        break;

      case pawn_black:
        console.log("pawn_black");
        // Prüfen ob Pawn in der Startposition ist & ob vor ihm eine Figur steht
        f1 = x + (y - 1).toString()
        f2 = x + (y - 2).toString()

        // Prüfen ob das Feld leer ist bzw. undefined
        if (cur_fields[f1] === undefined) {
          possibleFields.push(f1)
          if (cur_fields[f2] === undefined) {
            if (y === 7) {
              possibleFields.push(f2)
            }
          }
        }

        // Prüfen ob er Schlagen kann
        f3 = (x - 1).toString() + (y - 1).toString()
        f4 = (x + 1).toString() + (y - 1).toString()
        if (whitePieces.includes(cur_fields[f3])) {
          possibleFields.push(f3)
        }
        if (whitePieces.includes(cur_fields[f4])) {
          possibleFields.push(f4)
        }
        //highlightMovableFields(possibleFields)
        break;

      case knight_white:
      case knight_black:
        console.log("knight");
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
          if (isValidField(possibleMoves[i], cur_fields)) possibleFields.push(possibleMoves[i]);
        }
        //highlightMovableFields(possibleFields)
        break;
      case bishop_white:
      case bishop_black:
        console.log("bisshop")
        // Berechne die möglichen Felder für den Läufer
        // iteration durch 7 weil nur 7 maximal gelaufen werden können
        for (let i = 1; i <= 7; i++) {
          // 1 nach rechts 1 nach oben usw.
          if (f1_prev === true && f1_prevT === true) {
            f1 = (x + i).toString() + (y + i).toString();
            f1_prevT = isTakeableField(f1, cur_fields)
            if (isValidField(f1, cur_fields)) {
              possibleFields.push(f1)
            } else {
              f1_prev = false
            }
          }
          if (f2_prev === true && f2_prevT === true) {
            f2 = (x + i).toString() + (y - i).toString();
            f2_prevT = isTakeableField(f2, cur_fields)
            if (isValidField(f2, cur_fields)) {
              possibleFields.push(f2)
            } else {
              f2_prev = false
            }
          }
          if (f3_prev === true && f3_prevT === true) {
            f3 = (x - i).toString() + (y + i).toString();
            f3_prevT = isTakeableField(f3, cur_fields)
            if (isValidField(f3, cur_fields)) {
              possibleFields.push(f3)
            } else {
              f3_prev = false
            }
          }
          if (f4_prev === true && f4_prevT === true) {
            f4 = (x - i).toString() + (y - i).toString();
            f4_prevT = isTakeableField(f4, cur_fields)
            if (isValidField(f4, cur_fields)) {
              possibleFields.push(f4)
            } else {
              f4_prev = false
            }
          }
        }
        //highlightMovableFields(possibleFields)
        break;
      case rook_black:
      case rook_white:
        console.log("rook")
        for (let i = 1; i <= 7; i++) {
          // 1 nach rechts 1 nach oben usw.
          if (f1_prev === true && f1_prevT === true) {
            f1 = (x + i).toString() + y.toString();
            f1_prevT = isTakeableField(f1, cur_fields)
            if (isValidField(f1, cur_fields)) {
              possibleFields.push(f1)
            } else {
              f1_prev = false
            }
          }
          if (f2_prev === true && f2_prevT === true) {
            f2 = (x - i).toString() + y.toString();
            f2_prevT = isTakeableField(f2, cur_fields)
            if (isValidField(f2, cur_fields)) {
              possibleFields.push(f2)
            } else {
              f2_prev = false
            }
          }
          if (f3_prev === true && f3_prevT === true) {
            f3 = (x).toString() + (y + i).toString();
            f3_prevT = isTakeableField(f3, cur_fields)
            if (isValidField(f3, cur_fields)) {
              possibleFields.push(f3)
            } else {
              f3_prev = false
            }
          }
          if (f4_prev === true && f4_prevT === true) {
            f4 = (x).toString() + (y - i).toString();
            f4_prevT = isTakeableField(f4, cur_fields)
            if (isValidField(f4, cur_fields)) {
              possibleFields.push(f4)
            } else {
              f4_prev = false
            }
          }
        }
        //highlightMovableFields(possibleFields)
        break;
      case king_black:
      case king_white:
        console.log("king")
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

          if (isValidField(f1, cur_fields)) possibleFields.push(f1);
          if (isValidField(f2, cur_fields)) possibleFields.push(f2);
          if (isValidField(f3, cur_fields)) possibleFields.push(f3);
          if (isValidField(f4, cur_fields)) possibleFields.push(f4);
        }
        // Check castling possibility prüfen
        let cur_field = x.toString() + y.toString()
        if (turn % 2 === 0) {
          // castle short with white
          if (cur_field === "51" && cur_fields[81] === rook_white && cur_fields[61] === undefined && cur_fields[71] === undefined) {
            possibleFields.push("71")
          }
          // castle long with white
          if (cur_field === "51" && cur_fields[11] === rook_white && cur_fields[21] === undefined && cur_fields[31] === undefined && cur_fields[41] === undefined) {
            possibleFields.push("31")
          }
        } else {
          // castle short with black
          if (cur_field === "58" && cur_fields[88] === rook_black && cur_fields[68] === undefined && cur_fields[78] === undefined) {
            possibleFields.push("78")
          }
          // castle long with black
          if (cur_field === "58" && cur_fields[88] === rook_black && cur_fields[28] === undefined && cur_fields[38] === undefined && cur_fields[48] === undefined) {
            possibleFields.push("38")
          }
        }
        //highlightMovableFields(possibleFields)
        break;
      case queen_black:
      case queen_white:
        console.log("queen")
        for (let i = 1; i <= 7; i++) {
          if (f1_prev === true && f1_prevT === true) {
            f1 = (x + i).toString() + y.toString();
            f1_prevT = isTakeableField(f1, cur_fields)
            if (isValidField(f1, cur_fields)) {
              possibleFields.push(f1)
            } else {
              f1_prev = false
            }
          }
          if (f2_prev === true && f2_prevT === true) {
            f2 = (x - i).toString() + y.toString();
            f2_prevT = isTakeableField(f2, cur_fields)
            if (isValidField(f2, cur_fields)) {
              possibleFields.push(f2)
            } else {
              f2_prev = false
            }
          }
          if (f3_prev === true && f3_prevT === true) {
            f3 = (x).toString() + (y + i).toString();
            f3_prevT = isTakeableField(f3, cur_fields)
            if (isValidField(f3, cur_fields)) {
              possibleFields.push(f3)
            } else {
              f3_prev = false
            }
          }
          if (f4_prev === true && f4_prevT === true) {
            f4 = (x).toString() + (y - i).toString();
            f4_prevT = isTakeableField(f4, cur_fields)
            if (isValidField(f4, cur_fields)) {
              possibleFields.push(f4)
            } else {
              f4_prev = false
            }
          }
          if (f5_prev === true && f5_prevT === true) {
            f5 = (x + i).toString() + (y + i).toString();
            f5_prevT = isTakeableField(f5, cur_fields)
            if (isValidField(f5, cur_fields)) {
              possibleFields.push(f5);
            } else {
              f5_prev = false;
            }
          }

          if (f6_prev === true && f6_prevT === true) {
            f6 = (x + i).toString() + (y - i).toString();
            f6_prevT = isTakeableField(f6, cur_fields)
            if (isValidField(f6, cur_fields)) {
              possibleFields.push(f6);
            } else {
              f6_prev = false;
            }
          }

          if (f7_prev === true && f7_prevT === true) {
            f7 = (x - i).toString() + (y + i).toString();
            f7_prevT = isTakeableField(f7, cur_fields)
            if (isValidField(f7, cur_fields)) {
              possibleFields.push(f7);
            } else {
              f7_prev = false;
            }
          }

          if (f8_prev === true && f8_prevT === true) {
            f8 = (x - i).toString() + (y - i).toString();
            f8_prevT = isTakeableField(f8, cur_fields)
            if (isValidField(f8, cur_fields)) {
              possibleFields.push(f8);
            } else {
              f8_prev = false;
            }
          }

        }

        break;
      default:
        break;
    }
    if (highlight) {
      if (checked) {
        // Erstellt eine Kopie des cur_fields-Objekts

        let checkedFields = []
        console.log("Checked prüfen...")
        console.log("Possible fields: ", possibleFields)
        for (let i = 0; i < possibleFields.length; i++) {
          let testFields = { ...fields };
          // In das geklonte Feld wird zur Prüfung ob es den Check verhindert der Zug gespielt
          console.log("possible Field: ", possibleFields[i], "aktuelles Feld: ", testFields[field])

          testFields[possibleFields[i]] = testFields[field]
          testFields[field] = undefined
          // Prüfe ob im neuen Feld ein Check möglich ist
          // Wenn nicht dann soll das Feld als zulässig markiert werden
          console.log("klonfeld: ", testFields)
          if (!isChecked2(testFields)) {
            console.log("Verteidigendes Feld: ", possibleFields[i])
            checkedFields.push(possibleFields[i])
          }
        }
        console.log("Checked Fields:", checkedFields)
        highlightMovableFields(checkedFields)
      } else {
        highlightMovableFields(possibleFields)
      }
    } else {
      // Prüfen ob die möglichen Felder den König angreifen können
      if (turn % 2 === 0) {
        console.log("fields ü field", possibleFields, field)
        if (testFields && possibleFields.includes(whiteKingPosition)) {
          console.log("poss fields: ", possibleFields, "und das field: ", field)
          return true;
        } else if (possibleFields.includes(blackKingPosition)) {
          return true;
        } else {
          return false
        }
      } else {
        if (testFields && possibleFields.includes(blackKingPosition)) {
          return true;
        } else if (possibleFields.includes(whiteKingPosition)) {
          return true;
        } else {
          return false
        }
      }
    }
  }




  const isTakeableField = (field, curFields) => {
    // weiß
    if (turn % 2 === 0) {
      if (blackPieces.includes(curFields[field])) {
        return false
      } else {
        return true
      }
    } else {
      if (whitePieces.includes(curFields[field])) {
        return false
      } else {
        return true
      }
    }
  }

  const isValidField = (field, curFields) => {
    const fieldKeys = Object.keys(squareNames).map(Number);
    // Es wird geschaut ob das jeweilige markierte Feld, welches geprüft wird innerhalb auf dem Brett liegt
    // + das feld muss in eine number umgewandelt werden, da die fieldKeys vom Typ number sind 
    if (fieldKeys.includes(parseInt(field))) {
      // Prüfe ob das angezeigte Ziel-Feld eine Schwarze Figur ist
      if (turn % 2 === 0) {
        // Prüfe ob das angezeigte Ziel-Feld eine Weiße Figur ist
        if (whitePieces.includes(curFields[field])) {
          return false
        } else {
          return true
        }
      }
      // Prüfe falls es eine weiße Figur ist  
      else {
        // Wenn schwarz => Schaue ob das Feld von einer Schwarzen Figur besetzt ist
        if (blackPieces.includes(curFields[field])) {
          return false
        }
        else {
          return true
        }
      }
    }
  };

  const handleClick = (field) => {
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
        showMovableFields(field)
        setSelectPiece(true)
        setCurrentField(field)
      } else return
    } else {
      if (blackPieces.includes(fields[field])) {
        //movePiece(field)
        console.log(field)
        setCurrentField(field)
        showMovableFields(field)
        setSelectPiece(true)
        setCurrentField(field)
        //console.log("Figur ausgewählt", field)
      } else return
    }
  }

  const movePiece = (newField) => {
    // Prüfen ob der zu bewegende Square besetzbar ist von der aktuellen Figur 
    // console.log('piece can be place here:', curMovableFields.includes(newField))
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

      // Zugreihenfolge 
      var playedMove = ""
      if (turn % 2 === 0) {
        playedMove = squareNames[newField] + ""
      } else {
        playedMove = " " + squareNames[newField]
      }
      setMoves([...moves, playedMove])


      // Neuer Field wird mit der ausgewählten Figur besetzt
      fields[newField] = fields[`${currentField}`]
      // Das davorige Feld wird leer, also undefined gesetzt
      fields[currentField] = undefined

      var castled = false


      if (turn % 2 === 0) {
        if (fields[newField] === king_white && currentField === "51" && newField === "71") {
          // castle short white
          fields["61"] = rook_white
          fields["81"] = undefined
          castled = true

        } else if ((fields[newField] === king_white) && currentField === "51" && newField === "31") {
          // castle long white
          fields["41"] = rook_white
          fields["11"] = undefined
          castled = true
        }
      } else {
        // castle short
        if (fields[newField] === king_black && currentField === "58" && newField === "78") {
          fields["68"] = rook_black
          fields["88"] = undefined
          castled = true
        } else if (fields[newField] === king_black && currentField === "58" && newField === "38") {
          // castle long black
          fields["48"] = rook_black
          fields["18"] = undefined
          castled = true
        }
      }

      isChecked(fields)

      // Rochade prüfen => Der Rook muss sich auch bewegen
      // Wir prüfen vorher bei showMovableFields ob eine Rochade überhaupt möglich ist
      // Hier muss nur noch der Rook mitbewegt werden
      if (turn % 2 === 0) {
        if (blackIsChecked) {
          checkSound.play()
        }
        else if (castled) {
          castleSound.play()
        } else {
          // Normaler Zug Sound
          moveSound.play();
        }
      } else {
        // Während schwarz noch dran ist prüfen ob Weiß gecheckt wurde
        if (whiteIsChecked) {
          checkSound.play()
        } else if (castled) {
          castleSound.play()
        } else {
          // Normaler Zug Sound
          moveSound.play();
        }
      }

      setFields({ ...fields })
      // Figur wird vom alten Field gelöscht 
      setSelectPiece(false)
      resetHighlights()
      setTurn(turn + 1)
      setIsBoardRotated(!isBoardRotated)

      if (checked) {
        setChecked(false)
      }
    }
  }

  const isChecked2 = (fieldsInput) => {
    // Schwarz greift an 
    console.log("Reihe: ", turn)
    if (turn % 2 === 0) {
      console.log("Wo ist der weiße König?", whiteKingPosition)
      for (const [field, piece] of Object.entries(fieldsInput)) {
        if (blackPieces.includes(piece)) {
          if (showMovableFields(field, false, fieldsInput)) {
            return true
          }
        }
      }
    } else {
      for (const [field, piece] of Object.entries(fieldsInput)) {
        if (whitePieces.includes(piece)) {
          if (showMovableFields(field, false, fieldsInput)) {
            return true
          }
        }
      }
    }
    return false;
  }

  // Prüfen ob die Königsfigur im nächsten Zug von IRGENDEINER Figur 
  // geschlagen werden kann (! nicht nur von der angreifenden Figur)
  const isChecked = (fieldsInput) => {
    // Den Weißen König suchen
    for (const [field, piece] of Object.entries(fieldsInput)) {
      if (piece === king_white) {
        setWhiteKingPosition(field)
        break;
      }
    }
    // Den Schwarzen König suchen
    for (const [field, piece] of Object.entries(fieldsInput)) {
      if (piece === king_black) {
        setBlackKingPosition(field)
        break;
      }
    }
    // Schwarz greift an 
    if (turn % 2 === 0) {
      for (const [field, piece] of Object.entries(fieldsInput)) {
        if (whitePieces.includes(piece)) {
          if (showMovableFields(field, false)) {
            //setBlackIsChecked(true); 
            console.log()
            blackIsChecked = true
            setChecked(true)
            return true
            // break;
          }
        }
      }
    } else {
      // Weiß greift an
      for (const [field, piece] of Object.entries(fieldsInput)) {
        if (blackPieces.includes(piece)) {
          if (showMovableFields(field, false)) {
            setChecked(true)
            whiteIsChecked = true
            return true
            //break;
          }
        }
      }
    }
    return false;
  }


  const newGame = () => {

    setTurn(2)
    setFields(fieldsData)
    console.log("new Gam")
    //jsakdn
  }


  // drag drop feature AL-Original
  const pieceFollow = useRef(null);
  const fieldsGrid = useRef(null);

  const mouseDownCB = (event) => {
    if (event.type === 'mousedown') event.preventDefault()
    setMouseDown(true)
    event.target.click()

    pieceFollow.current.style.opacity = 0
    let currentMoveTarget = document.querySelector('.move-target')
    if (currentMoveTarget) currentMoveTarget.classList.remove('move-target')
  }

  const mouseUpCB = (event) => {
    setMouseDown(false)

    if (event.type === 'touchend') {
      document.elementFromPoint(
        event.changedTouches[0].pageX,
        event.changedTouches[0].pageY
      ).click()
    }
    else event.target.click()

    pieceFollow.current.style.opacity = 0
    let currentMoveTarget = document.querySelector('.move-target')
    if (currentMoveTarget) currentMoveTarget.classList.remove('move-target')
  }

  const mouseEnterCB = (event) => {
    if (!mouseDown) return

    // checke, ob Figur sich ins Feld bewegen kann...
    var highlighted = false
    const field = event.target
    for (const child of field.children) {
      if (!highlighted && child.classList.contains('highlighter')) highlighted = true
    }

    // ... wenn ja, soll Feld grünlich markiert werden ...
    if (highlighted) {
      field.classList.add('valid-move')
    }
    // ansonsten rötlich
    else {
      field.classList.add('invalid-move')
    }
  }

  const mouseLeaveCB = (event) => {
    const fieldClasses = event.target.classList
    fieldClasses.remove('valid-move')
    fieldClasses.remove('invalid-move')
  }

  const GridLeaveCB = () => {
    setMouseDown(false)
  }

  const MouseMoveCB = (event) => {
    if (!mouseDown) return

    let fieldTarget
    if (event.type === 'touchmove') {
      fieldTarget = document.elementFromPoint(
        event.changedTouches[0].pageX,
        event.changedTouches[0].pageY
      )
    } else fieldTarget = event.target
    let field = fieldTarget.tagName === 'IMG' ? fieldTarget.parentElement : fieldTarget

    console.log(field)

    // drag drop effect
    let fieldsGridOffset = fieldsGrid.current.getBoundingClientRect()
    let x, y
    if (event.type === 'mousemove') {
      y = event.clientY - fieldsGridOffset.y
      x = event.clientX - fieldsGridOffset.x
    } else if (event.type === 'touchmove') {
      y = event.touches[0].clientY - fieldsGridOffset.y
      x = event.touches[0].clientX - fieldsGridOffset.x
    }

    let newY = isBoardRotated ? fieldsGrid.current.offsetHeight - y : y
    let newX = isBoardRotated ? fieldsGrid.current.offsetWidth - x : x
    pieceFollow.current.style.top = `${newY}px`
    pieceFollow.current.style.left = `${newX}px`
    pieceFollow.current.style.opacity = 1

    // field marker
    if (field.classList.contains('move-target')) return
    let currentMoveTarget = document.querySelector('.move-target')
    if (currentMoveTarget) currentMoveTarget.classList.remove('move-target')
    field.classList.add('move-target')
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
      <div className={`fields relative grid-cols-8 inline-grid m-auto ${isBoardRotated ? 'rotate-board' : ''}`}
        ref={fieldsGrid}
        onMouseMove={MouseMoveCB}
        onTouchMove={MouseMoveCB}
        onMouseLeave={GridLeaveCB}
      >
        {cordY.map((number) => {
          return cordX.map((letter, index) => {
            let color, rotation;
            if (number % 2 === 0) {
              color = (index % 2 === 0) ? "bg-teal-900" : "bg-white";
              rotation = isBoardRotated ? "rotate(180deg)" : "";
            } else {
              color = (index % 2 === 0) ? "bg-white" : "bg-teal-900";
              rotation = isBoardRotated ? "rotate(180deg)" : "";
            }
            return (
              <div
                className={`field ${color}`}
                id={`${letter}${number}`}
                style={{
                  backgroundImage: `url(${fields[`${letter}${number}`]})`,
                  backgroundSize: "cover",
                  cursor: "pointer",
                  transform: rotation // Hier wird die Rotation angewendet
                }}
                onClick={() => handleClick(`${letter}${number}`)}

                onMouseDown={mouseDownCB}
                onTouchStart={mouseDownCB}

                onMouseUp={mouseUpCB}
                onTouchEnd={mouseUpCB}
              ></div>
            );
          });
        })}


        {/** drag and drop effect */}
        <div className={`piece-follow absolute top-0 bottom-0 w-24 h-24 bg-transparent -translate-x-[50%] -translate-y-[50%] place-items-center flex pointer-events-none bg-cover ${isBoardRotated ? 'rotate-180' : ''}`}
          style={{
            backgroundImage: 'url(' + fields[currentField] + ')'
          }}
          ref={pieceFollow}
        ></div>


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
