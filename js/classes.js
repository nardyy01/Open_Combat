// Defines object within the game
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, framesHold = 1, offsetImg = { x: 0, y: 0 } }) {
        this.position = position
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.offsetImg = offsetImg;
    }

    draw() {
        // Crop the image if needed for animation
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offsetImg.x,
            this.position.y - this.offsetImg.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    update() {
        this.draw();
        this.animateFrames();
    }

    animateFrames() {
        this.framesElapsed++;

        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) this.framesCurrent++
            else this.framesCurrent = 0;
        }
    }
}

class Fighter extends Sprite {
    constructor({ position, velocity, color = 'red', offsetAttack, imageSrc, scale = 1, framesMax = 1, framesHold = 1, offsetImg, sprites }) {
        super({ position, imageSrc, scale, framesMax, framesHold, offsetImg });
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offsetAttack,
            width: 100,
            height: 50
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.sprites = sprites;

        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offsetAttack.x;
        this.attackBox.position.y = this.position.y;

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if (this.height + this.position.y + this.velocity.y >= canvas.height) {
            this.velocity.y = 0;
            this.position.y = 426;
        } else this.velocity.y += gravity;
    }

    attack(type) {
        this.setAnimation(type)
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    setAnimation(action) {
        // Make sure the action is valid
        if (action in this.sprites) {
            // If we are attacking, we want to complete that action first
            if ((this.image === this.sprites.attack1.image ||
                this.image === this.sprites.attack2.image) &&
                this.framesCurrent < this.framesMax - 1) { return }

            // Play requested animation
            if (this.image !== this.sprites[action].image) {
                this.image = this.sprites[action].image;
                this.framesMax = this.sprites[action].framesMax;
                this.framesCurrent = 0;
            }
        } else {
            console.log(`Action ${action} was not found for player ${this}.`);
            this.image = this.sprites.idle.image;
            this.framesMax = this.sprites.idle.framesMax;
        }

    }

}