const characters = {
    Samurie: ({ position, directionFacing }) => {
        return {
            position: position,
            velocity: {
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
                },
                takeHit: {
                    imageSrc: './resources/Samurie/Sprites/Take Hit.png',
                    framesMax: 4,
                },
                death: {
                    imageSrc: './resources/Samurie/Sprites/Death.png',
                    framesMax: 6,
                }
            },
            attackBox: {
                offset: {
                    x: 110,
                    y: 50
                },
                width: 115,
                height: 50
            },
            directionFacing: directionFacing,
        }
    },

    Obito: ({ position, directionFacing }) => {
        return {
            position: position,
            velocity: {
                x: 0,
                y: 0
            },
            color: 'blue',
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
                },
                takeHit: {
                    imageSrc: './resources/Obito/Sprites/TakeHit.png',
                    framesMax: 3,
                },
                death: {
                    imageSrc: './resources/Obito/Sprites/Death.png',
                    framesMax: 7,
                }
            },
            attackBox: {
                offset: {
                    x: 105,
                    y: 50
                },
                width: 100,
                height: 50
            },
            directionFacing: directionFacing,
        }
    }
}