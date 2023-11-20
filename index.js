// General canvas - drawing space (Start)
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

context.fillRect(0, 0, canvas.width, canvas.height);
// General canvas - drawing space (End)

const gravity = 0.7;

const background = new Sprite(maps.darkForest);

const player = new Fighter(characters.Samurie(player1Position));

const enemy = new Fighter(characters.Obito(player2Position));

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
        player.directionFacing = -1
    }
    else if (keys.d.pressed && player.lastKey == 'd') {
        player.setAnimation('run');
        player.velocity.x = 5;
        player.directionFacing = 1
    } else {
        player.setAnimation('idle');
    }

    if (player.velocity.y < 0) player.setAnimation('jump');
    else if (player.velocity.y > 0) player.setAnimation('fall');

    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.setAnimation('run');
        enemy.velocity.x = -5;
        enemy.directionFacing = -1
    }
    else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.setAnimation('run');
        enemy.velocity.x = 5;
        enemy.directionFacing = 1
    } else {
        enemy.setAnimation('idle');
    }

    if (enemy.velocity.y < 0) enemy.setAnimation('jump');
    else if (enemy.velocity.y > 0) enemy.setAnimation('fall');

    // Detect Collision for Player
    if (rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
        player.isAttacking && player.framesCurrent === player.framesMax - 2) {
        player.isAttacking = false;
        enemy.takeHit();
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
    }

    if (player.isAttacking && player.framesCurrent === player.framesMax - 2) {
        player.isAttacking = false;
    }

    // Detect Collision for Enemy
    if (rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
        enemy.isAttacking && enemy.framesCurrent === enemy.framesMax - 2) {
        enemy.isAttacking = false;
        player.takeHit();
        gsap.to('#playerHealth', {
            width: player.health + '%'
        });
    }

    if (enemy.isAttacking && enemy.framesCurrent === enemy.framesMax - 2) {
        enemy.isAttacking = false;
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