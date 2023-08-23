export const  PUBLIC_URL = process.env.PUBLIC_URL;
 // Pfade für schwarze Schachfiguren
 export const  bishop_black = PUBLIC_URL + "/images/bishop_black.png";
 export const  king_black = PUBLIC_URL + "/images/king_black.png";
 export const  knight_black = PUBLIC_URL + "/images/knight_black.png";
 export const  pawn_black = PUBLIC_URL + "/images/pawn_black.png";
 export const  queen_black = PUBLIC_URL + "/images/queen_black.png";
 export const  rook_black = PUBLIC_URL + "/images/rook_black.png";

 // Pfade für weiße Schachfiguren
 export const  bishop_white = PUBLIC_URL + "/images/bishop_white.png";
 export const  king_white = PUBLIC_URL + "/images/king_white.png";
 export const  knight_white = PUBLIC_URL + "/images/knight_white.png";
 export const  pawn_white = PUBLIC_URL + "/images/pawn_white.png";
 export const  queen_white = PUBLIC_URL + "/images/queen_white.png";
 export const  rook_white = PUBLIC_URL + "/images/rook_white.png";


 // Sounds
 export const moveAudio = PUBLIC_URL + "/sounds/move.mp3"
 export const captureAudio = PUBLIC_URL + "/sounds/capture.mp3"
 export const castleAudio = PUBLIC_URL + "/sounds/castle.mp3"

const  fieldsData = {
    11: rook_white,
    21: knight_white,
    31: bishop_white,
    41: queen_white,
    51: king_white,
    
    
    81: rook_white,

    12: pawn_white,
    22: pawn_white,
    32: pawn_white,
    42: pawn_white,
    52: pawn_white,
    62: pawn_white,
    72: pawn_white,
    82: pawn_white,

    17: pawn_black,
    27: pawn_black,
    37: pawn_black,
    47: pawn_black,
    57: pawn_black,
    67: pawn_black,
    77: pawn_black,
    87: pawn_black,

    18: rook_black,
    28: knight_black,
    38: bishop_black,
    48: queen_black,
    58: king_black,
    68: bishop_black,
    78: knight_black,
    88: rook_black,

  }
  export default fieldsData