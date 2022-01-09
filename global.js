const game = {
    width: 320,
    height: 200,
    get scale() { return this.height / 200 },
    
    track: 0,
    char: 0,
    
    frame: {
        then: Date.now(),
        now: 0,
        dif: 0
    },
    
    cam: {
        x: 919.5,
        y: 591.5,
        z: 20,
        a: 0,
        vel: {
            x: 0,
            y: 0,
            z: 0,
            a: 0,
            d: 0
        },
        speed: 2,
        freefly: false,
        time: 0,
        get mult() { 
            if (!this.freefly)
                return array.collision.data[getPixel(
                    Math.trunc(this.x), Math.trunc(this.y), 
                array.map.width, 1 )] / 255;
            else
                return 1;
        }
    },
    
    player: {
        x: 919.5,
        y: 581.5,
        vel: {
            x: 0,
            y: 0
        },
        accel: {
            x: 0,
            y: 0
        }
    }
};

const char = [
    {
        name: 'Mario',
        path: 'mario.png',
        size: 32,
        scale: 1.5,
        angles: 16
    }
];
const track = [
    {
        name: 'Test Track',
        path: [
            'track.png',
            'collision.png',
            'background.png'
        ]
    }
];