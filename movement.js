document.addEventListener('keydown', key => {
    if (!key.repeat) {
        switch (key.code) {
            case 'ArrowLeft':
                game.cam.vel.a = -game.cam.speed;
                break;
            case 'ArrowRight':
                game.cam.vel.a = game.cam.speed;
                break;
            case 'ArrowUp':
                game.cam.vel.y = -game.cam.speed;
                break;
            case 'ArrowDown':
                game.cam.vel.y = game.cam.speed;
                break;
            case 'KeyW':
                game.cam.vel.z = game.cam.speed;
                break;
            case 'KeyS':
                game.cam.vel.z = -game.cam.speed;
                break;
            case 'KeyA':
                game.cam.vel.x = -game.cam.speed;
                break;
            case 'KeyD':
                game.cam.vel.x = game.cam.speed;
                break;
            case 'Space':
                game.cam.freefly = !game.cam.freefly;
                break;
        }
    }
});
document.addEventListener('keyup', key => {
    switch (key.code) {
        case 'ArrowLeft':
        case 'ArrowRight':
            game.cam.vel.a = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            game.cam.vel.y = 0;
            break;
        case 'KeyW':
        case 'KeyS':
            game.cam.vel.z = 0;
            break;
        case 'KeyA':
        case 'KeyD':
            game.cam.vel.x = 0;
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
};
const turn = {
    x(x, y, cx, cy, a) { return (dmath.cos(a) * (x - cx)) - (dmath.sin(a) * (y - cy)) + cx },
    y(x, y, cx, cy, a) { return (dmath.cos(a) * (y - cy)) + (dmath.sin(a) * (x - cx)) + cy }
};
const collision = (x, y, c) => array.collision.data[getPixel(Math.trunc(x), Math.trunc(y), array.map.width, c)];

function updatePos() {
    game.frame.now = Date.now();
    game.frame.dif = game.frame.now - game.frame.then;
    game.frame.then = game.frame.now;
    
    game.cam.time = game.frame.dif / (1000 / 60);
    
    if (game.cam.vel.x || game.cam.vel.y) {
        let tx = game.cam.x + turn.x((game.cam.vel.x * game.cam.mult) * game.cam.time, (game.cam.vel.y * game.cam.mult) * game.cam.time, 0, 0, -game.cam.a),
            ty = game.cam.y + turn.y((game.cam.vel.x * game.cam.mult) * game.cam.time, (game.cam.vel.y * game.cam.mult) * game.cam.time, 0, 0, -game.cam.a)
        
        if (collision(tx, game.cam.y, 2) != 255 || game.cam.freefly)
            game.cam.x = tx;
        if (collision(game.cam.x, ty, 2) != 255 || game.cam.freefly)
            game.cam.y = ty;
    }
    if (game.cam.vel.z)
        game.cam.z = Math.max(1, game.cam.z + (game.cam.vel.z * game.cam.time));
    if (game.cam.vel.a)
        game.cam.a = ((game.cam.a - (game.cam.vel.a * game.cam.time)) + 360) % 360;
    
    requestAnimationFrame(updatePos);
}