const game = {
    width: 320,
    height: 200,
    get scale() { return this.height / 200 },
    
    track: 0,
    control: 0,
    depth: [],
    
    frame: {
        then: Date.now(),
        now: 0,
        dif: 0
    },
    
    cam: {
        x: 919.5,
        y: 611.5,
        z: 20,
        a: 0,
        get dist() { return this.z / 2 },
        vel: {
            x: 0,
            y: 0,
            z: 0,
            a: 0
        },
        speed: 2,
        freefly: false,
        time: 0,
        friction(p) { 
            if (!this.freefly)
                return array.collision.data[getPixel(
                    Math.trunc(player[p].x), Math.trunc(player[p].y), 
                array.map.width, 1 )] / 255;
            else
                return 1;
        }
    },
};

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

const char = [
    {
        name: 'Mario',
        path: 'mario.png',
        size: 32,
        scale: 2,
        angles: 16
    }
];

const player = [];

function addPlayer(c, x, y, a = 0) {
    player.push(
        {
            id: player.length,
            char: c,
            x: x,
            y: y,
            a: a,
            vel: {
                x: 0,
                y: 0,
                a: 0
            },
            speed: 2
        }
    );
}