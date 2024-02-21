import clases from './TaTeTi.module.css'
import Square from './Square'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'
import Swal from 'sweetalert2'

const renderFrom = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

const TaTeTi = () => {

    const [gameState, setGameState] = useState(renderFrom);
    const [currentPlayer, setCurrentPlayer] = useState('circle');
    const [finish, setFinish] = useState(false);
    const [finishArray, setFinishArray] = useState([]);
    const [playOnline, setPlayOnline] = useState(false);
    const [socket, setSocket] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [opponentName, setOpponentName] = useState(null);
    const [playingAs, setPlayingAs] = useState(null)
    
    
    const checkWinner = () => {
        for (let row = 0; row < gameState.length; row++) {
            if( 
                gameState[row][0] === gameState[row][1] && 
                gameState[row][1] === gameState[row][2]
                ) {
                    setFinishArray([row * 3 + 0, row * 3 + 1, row * 3 + 2])
                    return gameState[row][0]
                }
        };
        for (let col = 0; col < gameState[0].length; col++) {
            if (
                gameState[0][col] === gameState[1][col] &&
                gameState[1][col] === gameState[2][col]
                ) {
                    setFinishArray( [0 * 3 + col, 1 * 3 + col, 2 * 3 + col] )
                    return gameState[0][col];
                }
        };
        if (
            gameState[0][0] === gameState[1][1] &&
            gameState[1][1] === gameState[2][2]
            ) {
                return gameState[0][0];
            };
        if (
            gameState[0][2] === gameState[1][1] &&
            gameState[1][1] === gameState[2][0]
            ) {
                return gameState[0][2];
            };
                        
        const isDraw = gameState.flat().every((e) => {
            if(e === 'circle' || e === 'cross')
            return true;
        });
        
        if (isDraw) return 'draw';
        return null;
    };
                    
    useEffect(() => {
        const winner = checkWinner();
        if (winner){
            setFinish(winner);
        } 
    }, [gameState])

    const inputName = async () => {
        const result = await Swal.fire({
            title: "Ingresa tu Nombre",
            input: "text",
            inputLabel: "Nombre del jugador",
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return ("Necesitas escribir algo!")
                }
            },
        });
        return result;
    };

    
    socket?.on("opponentLeftMatch", () => {
        oppLeft();
        setFinish('opponentLeftMatch');
    })
    
    const oppLeft = () => {
        Swal.fire({
            icon: "warning",
            text: "Tu oponente abandono el juego"
        })
    } 

    socket?.on("playerMoveFromServer", (data) => {
        const id = data.state.id;
        setGameState((prevState) => {
            let newState = [...prevState]
            const rowindex = Math.floor(id/3)
            const colIndex = id % 3
            newState[rowindex][colIndex] = data.state.sign;
            return newState;
        });
        setCurrentPlayer(data.state.sign === "circle" ? "cross" : "circle");
    })

    socket?.on("connect", function (){
        setPlayOnline(true);
    });

    socket?.on('OpponentNotFound', function (){
        setOpponentName(false);
    }); 

    socket?.on('OpponentFound', function (data){
        setPlayingAs(data.playingAs);
        setOpponentName(data.opponentName);
    });

    async function playOnlineClick() {

        const result = await inputName()
        console.log(result)

        if (!result.isConfirmed) {
            return;
        }

        const userName = result.value
        setPlayerName(userName)

        const newSocket = io("http://localhost:3000/", {
            autoConnect: true
        });

        newSocket?.emit("request_to_play", {
            playerName: userName,
        })

        setSocket(newSocket)
    };

    
    if (!playOnline){
        return(
            <div className={clases.containerBtn}>
                <button onClick={playOnlineClick} className={clases.btnOnline}>Jugar Online</button>
            </div>
        )
    };
    if (playOnline && !opponentName) {
        return (
            <div className={clases.espera}>
               <p>Esperando un oponente...</p> 
            </div>
        )    
    };

    return (
        <>
        <div className={clases.container}>
            <div className={clases.deteccionMov}>
                <div className={`${clases.left} ${currentPlayer === playingAs ? "current-move-" + currentPlayer : '' }`}>{playerName}</div>
                <div className={`${clases.right} ${currentPlayer !== playingAs ? "current-move-" + currentPlayer : '' }`}>{opponentName}</div>
            </div>
            <h4 className={clases.subTitulo}>Ta Te Ti</h4>
            <div className={clases.containerSquare}>
                {
                    gameState.map(( arr, rowIndex ) => 
                        arr.map((e, colIndex) => {
                            return <Square 
                                    playingAs={playingAs}
                                    socket={socket}
                                    gameState={gameState}
                                    finishArray={finishArray}
                                    setFinish={setFinish} 
                                    finish={finish} 
                                    currentPlayer={currentPlayer} 
                                    setCurrentPlayer={setCurrentPlayer} 
                                    id={rowIndex * 3 + colIndex} 
                                    key={rowIndex * 3 + colIndex} 
                                    setGameState={setGameState}
                                    currentElement={e}    
                                />
                        })
                    )
                }
            </div>
            {finish && finish !== 'opponentLeftMatch' && finish !== 'draw' && (
                <h3 className={clases.txtWin}>{finish === playingAs ? playerName + ' ganó el juego' : 'Has perdido el juego' }</h3>
            )}
            {finish && finish !== 'opponentLeftMatch' && finish === 'draw' && (
                <h3 className={clases.txtWin}>Es un empate!</h3>
            )}
        </div>
            { !finish && opponentName && (
                <h3 className={clases.txtWin}>Estas jugando contra {opponentName}!</h3>
            )}
            {finish && finish === 'opponentLeftMatch' && (
                <h3 className={clases.txtWin}>Tu oponente abandonó el juego! Tu Ganaste!</h3>
            )}
        </>
    )
}

export default TaTeTi