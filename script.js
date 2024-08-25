const GameBoard = (function(){
    const gameBoard= new Array(9).fill(null);
    let _availableCells = 9;
    const isCellEmpty = index => gameBoard[index]===null;
    const setCell = (mark , index) =>{
        gameBoard[index]=mark;
        _availableCells--;
    };
    const availableCells = () =>_availableCells;
    const reset= () =>{ 
        gameBoard.fill(null)
        _availableCells=9; 
    };
    const checkWin = () =>{
        for(let i = 0 ; i < 3 ;i++){
            //check rows
            if(gameBoard[i*3]===gameBoard[1+i*3] && gameBoard[1+i*3]===gameBoard[2+i*3] && gameBoard[i*3]!==null)
                return {
                    winnerMark:gameBoard[i*3],
                    winType:{
                        type:"row",
                        number:i
                    }
                };
            //check columns
            if(gameBoard[i]===gameBoard[3+i] && gameBoard[3+i]===gameBoard[6+i] && gameBoard[i]!==null)
                return {
                    winnerMark:gameBoard[i],
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
    return {isCellEmpty , setCell , checkWin ,reset , availableCells};
})();

const Game = (function(){
    let currentPlayer = null;
    let player1 = null;
    let player2 = null;
    const currnetPlayerSection = document.querySelectorAll(".player");
    const init = () =>{
        player1 = createPlayer("X");
        player2 = createPlayer("O");
        currentPlayer = player1;
        currnetPlayerSection[0].lastChild.innerHTML = "your turn";
    };
    const changeCurrentPlayer = () =>{

        if(currentPlayer===player1){
            currentPlayer=player2;
            currnetPlayerSection[1].lastChild.innerHTML = "your turn";
            currnetPlayerSection[0].lastChild.innerHTML = "";
        }
        else{
            currentPlayer=player1;
            currnetPlayerSection[0].lastChild.innerHTML = "your turn";
            currnetPlayerSection[1].lastChild.innerHTML = "";
        }
    };
    const renderBoard = event => {
        event.target.classList.add(currentPlayer.getMark());
    };
    
    const gameCondition = (gameCond) => {
        if(gameCond!==null)
            UI.displayResult(gameCond);
        else if(GameBoard.availableCells()===0)
            UI.displayResult("Draw")
    };
    const play = event =>{
        if (event.target.className==="cell"){
            const cellIndex = +(event.target.id.slice(4));
            if(GameBoard.isCellEmpty(cellIndex)){
                GameBoard.setCell(currentPlayer.getMark(),cellIndex);
                renderBoard(event);
                changeCurrentPlayer();
                gameCondition(GameBoard.checkWin());
            }
        }
    }; 
    const playAgain = ()=>{
        GameBoard.reset();
        Game.init();
        UI.reset();
    }
    return {init,play,playAgain};
})();
function createPlayer(mark){
    const _mark = mark;
    const getMark = () =>_mark;
    return {getMark};
}
const UI = (function(){
    const startBtn = document.querySelector("#startGame");
    const UIboard = document.querySelector(".gameBoard");
    const cells = document.querySelectorAll(".cell");
    const dialog = document.querySelector("dialog");
    const winner = document.querySelector("dialog p");

    const reset = () =>{
        cells.forEach(element => {
            element.className = "cell";
        });
    };
    const displayResult = arg =>{
        if(typeof arg === "string")
            winner.textContent = arg;
        else
            winner.textContent = (arg.winnerMark === "X" ? "Player1" : "Player2") + " won!";
        dialog.showModal();
    }; 
    startBtn.addEventListener('click',()=>{
        startBtn.remove();
        UIboard.style.display = "grid";
        Game.init();
    });
    UIboard.addEventListener('click',Game.play);
    dialog.addEventListener('click' ,(event)=>{
        if(event.target.id==="playAgain"){
            Game.playAgain();
            dialog.close();
        }
        else if(event.target.id==="cancel"){
            dialog.close();
            UIboard.removeEventListener('click' , Game.play);
        }
    });
    return{reset,displayResult};
})();
