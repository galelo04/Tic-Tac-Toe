const GameBoard = (function(){
    const gameBoard= new Array(9).fill(null);
    const isCellEmpty = index => gameBoard[index]===null;
    const setCell = (mark , index) =>{
        gameBoard[index]=mark;
    };
    const reset= () => gameBoard.fill(null) ;
    const checkWin = () =>{
        for(let i = 0 ; i < 3 ;i++){
            //check rows
            if(gameBoard[0+i*3]===gameBoard[1+i*3] && gameBoard[1+i*3]===gameBoard[2+i*3] && gameBoard[0+i*3]!==null)
                return {
                    winnerMark:gameBoard[0+i*3],
                    winType:{
                        type:"row",
                        number:i
                    }
                };
            //check columns
            if(gameBoard[1+i]===gameBoard[3+i] && gameBoard[3+i]===gameBoard[6+i] && gameBoard[1+i]!==null)
                return {
                    winnerMark:gameBoard[1+i],
                    winType:{
                        type:"column",
                        number:i
                    }
                }
        }
        //check diagonals
        if(gameBoard[0]===gameBoard[4] && gameBoard[4]===gameBoard[8] && gameBoard[0]!==null) //diagonal 1
            return {
                winnerMark:gameBoard[0],
                winType:{
                    type:"diagonal",
                    number:1
                }
            }
        if(gameBoard[2]===gameBoard[4] && gameBoard[4]===gameBoard[6] && gameBoard[2]!==null) //diagonal 2
            return {
                winnerMark:gameBoard[2],
                winType:{
                    type:"diagonal",
                    number:2
                }
            }
        return null;
    };
    return {isCellEmpty , setCell , checkWin ,reset};
})();

const Game = (function(){
    const init = () =>{
        const player1 = createPlayer(prompt("Enter Player1 Name: "),"X");
        const player2 = createPlayer(prompt("Enter Player2 Name: "),"O");
        gameLoop(player1,player2);
    };
    const gameLoop = (player1,player2) =>{
        let gameCondition;
        for(let i = 0 ;i < 9 ; i++){
            if(i%2===0){
                player1.play();
            }
            else{
                player2.play();
            }
            if((gameCondition=GameBoard.checkWin())!==null)
                break;
        }
        if(gameCondition===null)
            alert("Draw");
        else{
            alert(`${gameCondition.winnerMark==="X"?player1.getName():player2.getName()} wins`);
        }
        if(confirm("play Again ?"))
            playAgain();
    };
    const playAgain = ()=>{
        GameBoard.reset();
        Game.init();
    }
    return {init};
})();
function createPlayer(name , mark){
    const _name = name;
    const _mark = mark;
    const getName = () =>_name;
    const getMark = () =>_mark;
    const play = () =>{
        let cellIndex = +prompt(`Enter cellIndex ${_name}: `);
        while(cellIndex>8 || cellIndex<0 || !GameBoard.isCellEmpty(cellIndex)){
            cellIndex = +prompt(`Enter a proper cellIndex ${_name}`);
        }
        GameBoard.setCell(_mark,cellIndex);
};
    return {getName,getMark,play};
}

Game.init();