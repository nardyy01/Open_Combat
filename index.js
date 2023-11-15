// General canvas - drawing space (Start)
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);
// General canvas - drawing space (End)

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./resources/BG_Forest.png"
});

const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offsetAttack: {
        x: 0,
        y: 0
    },
    imageSrc: './resources/Samurie/Sprites/Idle.png',
    framesMax: 8,
    scale: 2,
    framesHold: 5,
    offsetImg: {
        x: 165,
        y: 105
    },
    sprites: {
        idle: {
            imageSrc: './resources/Samurie/Sprites/Idle.png',
            framesMax: 8,
        },
        run: {
            imageSrc: './resources/Samurie/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './resources/Samurie/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './resources/Samurie/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './resources/Samurie/Sprites/Attack1.png',
            framesMax: 6,
        },
        attack2: {
            imageSrc: './resources/Samurie/Sprites/Attack2.png',
            framesMax: 6,
        }
    }
});

const enemy = new Fighter({
    position: {
        x: 700,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offsetAttack: {
        x: -50,
        y: 0
    },
    imageSrc: './resources/Obito/Sprites/Idle.png',
    framesMax: 4,
    scale: 2,
    framesHold: 5,
    offsetImg: {
        x: 165,
        y: 120
    },
    sprites: {
        idle: {
            imageSrc: './resources/Obito/Sprites/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './resources/Obito/Sprites/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './resources/Obito/Sprites/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './resources/Obito/Sprites/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './resources/Obito/Sprites/Attack1.png',
            framesMax: 4,
        },
        attack2: {
            imageSrc: './resources/Obito/Sprites/Attack2.png',
            framesMax: 4,
        }
    }
});

const keys = {
    'a': { pressed: false },
    'd': { pressed: false },
    'ArrowLeft': { pressed: false },
    'ArrowRight': { pressed: false }
}

decreaseTimer();

function animate() {
    // Simulate frame ticks
    window.requestAnimationFrame(animate);

    // Visualize next frame
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();

    // Stablize players
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Check for key strokes
    if (keys.a.pressed && player.lastKey == 'a') {
        player.setAnimation('run');
        player.velocity.x = -5;
    }
    else if (keys.d.pressed && player.lastKey == 'd') {
        player.setAnimation('run');
        player.velocity.x = 5;
    } else {
        player.setAnimation('idle');
    }

    if (player.velocity.y < 0) player.setAnimation('jump');
    else if (player.velocity.y > 0) player.setAnimation('fall');

    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.setAnimation('run');
        enemy.velocity.x = -5;
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.setAnimation('run');
        enemy.velocity.x = 5;
    } else {
        enemy.setAnimation('idle');
    }

    if (enemy.velocity.y < 0) enemy.setAnimation('jump');
    else if (enemy.velocity.y > 0) enemy.setAnimation('fall');

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
            player.attack('attack1');
            break;
        case 'e':
            player.attack('attack2');
            break;
    }
})

// Enemy Movement ~ Actions
window.addEventListener('keydown', (event) => {
    console.log(event.key)
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
            enemy.attack('attack1');
            break;
        case '0':
            enemy.attack('attack2');
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