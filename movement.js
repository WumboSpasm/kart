const player = {
    x: 0,
    y: 0,
    a: 0,
    r: 20,
    vel: {
        x: 0,
        y: 0,
        a: 0,
        r: 0
    },
    speed: 2,
    freefly: false,
    time: 0,
    get mult() { 
        if (!this.freefly)
            return data.collision.data[getPixel(Math.trunc(player.x), Math.trunc(player.y), data.map.width, 1)] / 255;
        else
            return 1;
    }
}
const time = {
    then: Date.now(),
    now: 0,
    dif: 0
}

document.addEventListener('keydown', key => {
    if (!key.repeat) {
        switch (key.code) {
            case 'ArrowLeft':
                player.vel.a = -player.speed;
                break;
            case 'ArrowRight':
                player.vel.a = player.speed;
                break;
            case 'ArrowUp':
                player.vel.y = -player.speed;
                break;
            case 'ArrowDown':
                player.vel.y = player.speed;
                break;
            case 'KeyW':
                player.vel.r = player.speed;
                break;
            case 'KeyS':
                player.vel.r = -player.speed;
                break;
            case 'KeyA':
                player.vel.x = -player.speed;
                break;
            case 'KeyD':
                player.vel.x = player.speed;
                break;
        }
    }
});
document.addEventListener('keyup', key => {
    switch (key.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
            player.vel.a = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            player.vel.y = 0;
            break;
        case 'KeyW':
        case 'KeyS':
            player.vel.r = 0;
            break;
        case 'KeyA':
        case 'KeyD':
            player.vel.x = 0;
            break;
    }
});

const dmath = {
    sin(d)  { return Math.sin(d * (Math.PI / 180)) },    // get x to point on circle
    cos(d)  { return Math.cos(d * (Math.PI / 180)) },    // get y to point on circle
    tan(d)  { return Math.tan(d * (Math.PI / 180)) },
    // inverse
    asin(y, h) { return Math.asin(y / h) * (180 / Math.PI) },
    acos(x, h) { return Math.acos(x / h) * (180 / Math.PI) },
    atan(x, y) { return Math.atan(y / x) * (180 / Math.PI) }    // get angle to point on circle
}
const turn = {
    x(x, y, cx, cy, a) { return (dmath.cos(a) * (x - cx)) - (dmath.sin(a) * (y - cy)) + cx },
    y(x, y, cx, cy, a) { return (dmath.cos(a) * (y - cy)) + (dmath.sin(a) * (x - cx)) + cy }
}
const bound = {
    width(i)  { return Math.max(0, Math.min(data.map.width, i)) },
    height(i) { return Math.max(0, Math.min(data.map.height, i)) }
}

function updatePos() {
    time.now = Date.now();
    time.dif = time.now - time.then;
    time.then = time.now;
    
    player.time = time.dif / (1000 / 60);
    
    if (player.vel.x || player.vel.y) {
        let tempX = bound.width (player.x + turn.x((player.vel.x * player.mult) * player.time, (player.vel.y * player.mult) * player.time, 0, 0, -player.a)),
            tempY = bound.height(player.y + turn.y((player.vel.x * player.mult) * player.time, (player.vel.y * player.mult) * player.time, 0, 0, -player.a))
        
        if (data.collision.data[getPixel(Math.trunc(tempX), Math.trunc(player.y), data.map.width, 2)] != 255 || player.freefly)
            player.x = tempX;
        if (data.collision.data[getPixel(Math.trunc(player.x), Math.trunc(tempY), data.map.width, 2)] != 255 || player.freefly)
            player.y = tempY;
    }
    if (player.vel.a)
        player.a = ((player.a - (player.vel.a * player.time)) + 360) % 360;
    if (player.vel.r)
        player.r += player.vel.r;
    
    requestAnimationFrame(updatePos);
}