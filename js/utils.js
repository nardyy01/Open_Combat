const player1Position = { position: { x: 200, y: 0 }, directionFacing: 1 };
const player2Position = { position: { x: 750, y: 0 }, directionFacing: -1 };

function rectangleCollision({ rectangle1, rectangle2 }) {
    return (
        rectangle1.attackBox.width + rectangle1.attackBox.position.x >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function determineWinner({ player, enemy }) {
    clearTimeout(timerID);
    document.querySelector('#matchResultText').style.display = 'flex';

    if (player.health === enemy.health) {
        document.querySelector('#matchResultText').innerHTML = 'DRAW!';
    } else if (player.health >= enemy.health) {
        document.querySelector('#matchResultText').innerHTML = 'Player 1 Wins!';
    } else {
        document.querySelector('#matchResultText').innerHTML = 'Player 2 Wins!';
    }
}

let timer = 60;
let timerID;
function decreaseTimer() {
    if (timer > 0) {
        timerID = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#fightTimer').innerHTML = timer;
    } else {
        determineWinner({ player, enemy });
    }
}