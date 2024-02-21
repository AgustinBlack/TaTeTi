import clases from './Square.module.css'
import React, { useState } from 'react'
import Swal from 'sweetalert2';

const circleSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

const crossSvg = (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g
      id="SVGRepo_tracerCarrier"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></g>
    <g id="SVGRepo_iconCarrier">
      {" "}
      <path
        d="M19 5L5 19M5.00001 5L19 19"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></path>{" "}
    </g>
  </svg>
);

const Square = ({ id, finishArray, gameState, setGameState, currentPlayer, setCurrentPlayer, setFinish, finish, socket, currentElement, playingAs }) => {

  const [icon, setIcon] = useState(null)

  const onClick = () => {

    if(playingAs !== currentPlayer) {
      error();
      return;
    }
    
    if (finish) {
      return;
    }

    if(!icon){
      if(currentPlayer === "circle"){
        setIcon(circleSvg)
      } else {
        setIcon(crossSvg)
      }

      const myCurrentPlayer = currentPlayer
      
      socket.emit("playerMoveFromClient", {
        state: {
          id, 
          sign: myCurrentPlayer,
        }
      })

      setCurrentPlayer(currentPlayer === 'circle' ? 'cross' : 'circle')
      
      setGameState((prevState) => {
        let newState = [...prevState]
        const rowindex = Math.floor(id/3)
        const colIndex = id % 3
        newState[rowindex][colIndex] = myCurrentPlayer
        return newState
      })
    }
  }
  
  const error = () => {
    Swal.fire({
      icon: "error",
      text: "No es tu turno!",
    });
  } 
  
  return (
    <div onClick={onClick} className={`${clases.container} ${finish ? clases.notAllowed : ''} ${currentPlayer !== playingAs ? "notAllowed" : ''} ${finishArray && finishArray.includes(id) ? (currentPlayer === "circle" ? clases.circleWon : clases.crossWon) : ''} `}>
      {currentElement === "circle"
        ? circleSvg
        : currentElement === "cross"
        ? crossSvg
        : icon}
    </div>
  );
  
}

export default Square

