// Defines object within the game
class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, framesHold = 1, offsetImg = { x: 0, y: 0 }, directionFacing = 1 }) {
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
        this.directionFacing = directionFacing;
    }

    draw() {
        context.save();
        context.translate(
            this.position.x + this.width / 2,
            this.position.y + this.height / 2
        )

        context.scale(this.directionFacing, 1);

        // Crop the image if needed for animation
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            -this.width / 2 - this.offsetImg.x,
            -this.height / 2 - this.offsetImg.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )

        context.restore();
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
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        framesHold = 1,
        offsetImg,
        sprites,
        attackBox = { offset: { x: 0, y: 0 }, width: 100, height: 50 },
        directionFacing
    }) {
        super({ position, imageSrc, scale, framesMax, framesHold, offsetImg, directionFacing });
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offsetAttack: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.sprites = sprites;
        this.alive = true;

        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc;
        }
    }

    update() {
        this.draw();
        if (this.alive) {
            this.animateFrames();

            if (this.directionFacing == 1) {
                this.attackBox.position.x = this.position.x + this.attackBox.offsetAttack.x
                this.attackBox.position.y = this.position.y + this.attackBox.offsetAttack.y;
            } else {
                this.attackBox.position.x = this.position.x - (this.width + this.attackBox.offsetAttack.x)
                this.attackBox.position.y = this.position.y + this.attackBox.offsetAttack.y;
            }

            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            if (this.height + this.position.y + this.velocity.y >= canvas.height) {
                this.velocity.y = 0;
                this.position.y = 426;
            } else this.velocity.y += gravity;
        }
    }

    attack(type) {
        this.setAnimation(type)
        this.isAttacking = true;
    }

    takeHit() {
        this.health -= 20;
        if (this.health <= 0) this.setAnimation('death');
        else this.setAnimation('takeHit');
    }

    setAnimation(action) {
        // Make sure the action is valid
        if (action in this.sprites) {
            /* OVERRIDES BEGIN*/

            // Death
            if (this.image === this.sprites.death.image) {
                if (this.framesCurrent === this.framesMax - 1) this.alive = false;
                return
            }

            // Take Hit
            if (this.image === this.sprites.takeHit.image &&
                this.framesCurrent < this.framesMax - 1) { return }

            // Attack 
            if ((this.image === this.sprites.attack1.image ||
                this.image === this.sprites.attack2.image) &&
                this.framesCurrent < this.framesMax - 1) { return }

            /* OVERRIDES END*/

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