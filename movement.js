document.addEventListener('keydown', key => {
    if (!key.repeat) {
        switch (key.code) {
            case 'ArrowLeft':
                player[game.control].vel.a = -player[game.control].speed;
                break;
            case 'ArrowRight':
                player[game.control].vel.a = player[game.control].speed;
                break;
            case 'ArrowUp':
                player[game.control].vel.y = -player[game.control].speed;
                break;
            case 'ArrowDown':
                player[game.control].vel.y = player[game.control].speed;
                break;
            case 'KeyW':
                game.cam.vel.z = game.cam.speed;
                break;
            case 'KeyS':
                game.cam.vel.z = -game.cam.speed;
                break;
            case 'KeyA':
                game.cam.vel.a = game.cam.speed;
                break;
            case 'KeyD':
                game.cam.vel.a = -game.cam.speed;
                break;
            case 'KeyQ':
                game.control = (((game.control - 1) + player.length) % player.length);
                break;
            case 'KeyE':
                game.control = (((game.control + 1) + player.length) % player.length);
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
            player[game.control].vel.a = 0;
            break;
        case 'ArrowUp':
        case 'ArrowDown':
            player[game.control].vel.y = 0;
            break;
        case 'KeyW':
        case 'KeyS':
            game.cam.vel.z = 0;
            break;
        case 'KeyA':
        case 'KeyD':
            game.cam.vel.a = 0;
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
    
    game.cam.x = turn.x(
        player[game.control].x, player[game.control].y + game.cam.dist,
        player[game.control].x, player[game.control].y, -game.cam.a
    );
    game.cam.y = turn.y(
        player[game.control].x, player[game.control].y + game.cam.dist,
        player[game.control].x, player[game.control].y, -game.cam.a
    );
    
    for (let i = 0; i < player.length; i++) {
        if (player[i].vel.x || player[i].vel.y) {
            let tx = player[i].x + turn.x(
                    (player[i].vel.x * game.cam.friction(game.control)) * game.cam.time,
                    (player[i].vel.y * game.cam.friction(game.control)) * game.cam.time, 
                    0, 0, -player[i].a),
                ty = player[i].y + turn.y(
                    (player[i].vel.x * game.cam.friction(game.control)) * game.cam.time,
                    (player[i].vel.y * game.cam.friction(game.control)) * game.cam.time,
                    0, 0, -player[i].a);
            
            if (collision(tx, player[i].y, 2) != 255 || game.cam.freefly)
                player[i].x = tx;
            if (collision(player[i].x, ty, 2) != 255 || game.cam.freefly)
                player[i].y = ty;
        }
        if (player[i].vel.a)
            player[i].a = ((player[i].a - (player[i].vel.a * game.cam.time)) + 360) % 360;
    }
    
    if (game.cam.vel.z)
        game.cam.z = Math.max(1, game.cam.z + (game.cam.vel.z * game.cam.time));
    if (game.cam.vel.a)
        game.cam.a = ((game.cam.a - (game.cam.vel.a * game.cam.time)) + 360) % 360;
    
    requestAnimationFrame(updatePos);
}