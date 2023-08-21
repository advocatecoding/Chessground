import React from 'react'

export default function Piece(props) {
  return (
    <div>
        <img alt='cur_piece' onClick={props.onClick} src={props.imageUrl} style={{cursor:"pointer"}}></img>
    </div>
  )
}
