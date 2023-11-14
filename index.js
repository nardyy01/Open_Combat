// General canvas - drawing space (Start)
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);
// General canvas - drawing space (End)

const gravity = 0.7;

// Defines object within the game
class Sprite {
    constructor({ position, velocity, color = 'red', offset }) {
        this.position = position;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
    }

    draw() {
        // Character box
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);

        // Attack box
        if (this.isAttacking) {
            context.fillStyle = 'yellow';
            context.fillRect(
                this.attackBox.position.x,
                this.attackBox.position.y,
                this.attackBox.width,
                this.attackBox.height
            )
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.height + this.position.y + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
        } else {
            this.velocity.y += gravity;
            this.position.y += this.velocity.y;
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0
    }
});

const enemy = new Sprite({
    position: {
        x: 700,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    }
});

const keys = {
    'a': { pressed: false },
    'd': { pressed: false },
    'ArrowLeft': { pressed: false },
    'ArrowRight': { pressed: false }
}

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

decreaseTimer();

function animate() {
    // Simulate frame ticks
    window.requestAnimationFrame(animate);

    // Visualize next frame
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    // Stablize players
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Check for key strokes
    if (keys.a.pressed && player.lastKey == 'a') player.velocity.x = -5;
    else if (keys.d.pressed && player.lastKey == 'd') player.velocity.x = 5;

    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') enemy.velocity.x = -5;
    else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') enemy.velocity.x = 5;

    // Detect Collision for Player
    if (rectangleCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector('#enemyHealth').style.width = enemy.health + '%';
    }

    // Detect Collision for Enemy
    if (rectangleCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.querySelector('#playerHealth').style.width = player.health + '%';
    }

    // End game based on health
    if (player.health <= 0 || enemy.health <= 0) determineWinner({ player, enemy });

}

animate();

// Player Movement ~ Actions
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'a':
        case 'd':
            keys[event.key].pressed = true;
            player.lastKey = event.key;
            break;
        case 'w':
            player.velocity.y = -15;
            break;
        case ' ':
            player.attack();
            break;
    }
})

// Enemy Movement ~ Actions
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
            keys[event.key].pressed = true;
            enemy.lastKey = event.key;
            break;
        case 'ArrowUp':
            enemy.velocity.y = -15;
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
})

// Key releases
window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'a':
        case 'd':
            keys[event.key].pressed = false;
            break;
    }
})