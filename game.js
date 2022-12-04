let vel = { default: 8, x: 0, y: 0, z: 0, a: 0 },
    fps = { last: performance.now(), dif: 0, mult: 0 },
    focus = 0,
    timer = 0;

function gameLoop() {
    let now  = performance.now();
    fps.dif  = now - fps.last;
    fps.last = now;
    fps.mult = fps.dif / 60;
    
    if (focus < 0) {
        map.pos.x += Map.turn.x(vel.x, vel.y, 0, 0, map.pos.a) * fps.mult;
        map.pos.y += Map.turn.y(vel.x, vel.y, 0, 0, map.pos.a) * fps.mult;
        map.pos.z  = Math.max(1, map.pos.z + (vel.z * fps.mult));
        map.pos.a  = Map.wrap(map.pos.a + (vel.a * fps.mult), 360);
    }
    else {
        map.sprites[focus].pos.x += Map.turn.x(vel.x, vel.y, 0, 0, map.sprites[focus].pos.a) * fps.mult;
        map.sprites[focus].pos.y += Map.turn.y(vel.x, vel.y, 0, 0, map.sprites[focus].pos.a) * fps.mult;
        map.sprites[focus].pos.a = Map.wrap(map.sprites[focus].pos.a + (vel.a * fps.mult), 360);
        
        map.pos.z = Math.max(1, map.pos.z + (vel.z * fps.mult));
        map.pos.a = map.sprites[focus].pos.a;
        map.pos.x = Map.turn.x(map.sprites[focus].pos.x, map.sprites[focus].pos.y + (map.pos.z / 2), map.sprites[focus].pos.x, map.sprites[focus].pos.y, map.pos.a);
        map.pos.y = Map.turn.y(map.sprites[focus].pos.x, map.sprites[focus].pos.y + (map.pos.z / 2), map.sprites[focus].pos.x, map.sprites[focus].pos.y, map.pos.a);
    }
    
    timer += fps.mult;
    if (timer > 5) {
        map.tiles[0].row = (map.tiles[0].row + 1) % map.tiles[0].frames;
        timer = 0;
    }
    
    map.render(document.querySelector('#map'));
    
    document.querySelector('#debug').textContent =
       `FPS: ${Math.trunc(1000 / fps.dif)}
        Focus: ${focus}\n\n` + (focus < 0
     ? `X: ${Math.trunc(map.pos.x * 10) / 10}
        Y: ${Math.trunc(map.pos.y * 10) / 10}
        Z: ${Math.trunc(map.pos.z * 10) / 10}
        A: ${Math.trunc(map.pos.a * 10) / 10}`
     : `X: ${Math.trunc(map.sprites[focus].pos.x * 10) / 10}
        Y: ${Math.trunc(map.sprites[focus].pos.y * 10) / 10}
        Z: ${Math.trunc(map.sprites[focus].pos.z * 10) / 10}
        A: ${Math.trunc(map.sprites[focus].pos.a * 10) / 10}\n\n`)
     + `Timer: ${Math.trunc(timer)}`;
    
    requestAnimationFrame(gameLoop);
}

const loadImage = url => new Promise((resolve, reject) => {
    let img = new Image();
    img.src = url;
    img.onload = function() { resolve(img) };
});

(async function() {
    let imageArray = await Promise.all([
        loadImage('track.png'),
        loadImage('background.png'),
        loadImage('background2.png'),
        loadImage('water.png'),
        loadImage('coin.png'),
        loadImage('mario.png')
    ]);
    
    map = new Map(imageArray[0], 920, 594, 20, 0);
    map.background.layers.push(imageArray[1], imageArray[2]);
    map.tiles.push(
        new Tile(imageArray[3]), 
        new Tile(imageArray[4], 916, 492),
        new Tile(imageArray[4], 932, 492),
        new Tile(imageArray[4], 948, 492),
        new Tile(imageArray[4], 916, 484),
        new Tile(imageArray[4], 924, 484),
        new Tile(imageArray[4], 932, 484),
        new Tile(imageArray[4], 948, 484),
        new Tile(imageArray[4], 916, 476),
        new Tile(imageArray[4], 932, 476),
        new Tile(imageArray[4], 948, 476),
    );
    
    map.boundTile = 0;
    map.renderHalf = true;
    
    map.sprites.push(
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 920, 584, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 952, 608, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 920, 632, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 952, 656, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 920, 680, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 952, 704, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 920, 728, 0, 0),
        new Sprite(imageArray[5], 32, 32, 0, 0.4, 952, 752, 0, 0)
    );
    
    gameLoop();
})();

document.addEventListener('keydown', key => {
    if (!key.repeat) {
        switch (key.code) {
            case 'ArrowLeft':  vel.a = -vel.default; break;
            case 'ArrowRight': vel.a =  vel.default; break;
            case 'ArrowUp':    vel.y = -vel.default; break;
            case 'ArrowDown':  vel.y =  vel.default; break;
            case 'KeyW':       vel.z =  vel.default; break;
            case 'KeyS':       vel.z = -vel.default; break;
            case 'KeyA':       vel.x = -vel.default; break;
            case 'KeyD':       vel.x =  vel.default; break;
            
            case 'KeyQ': focus = Math.max(-1, focus - 1); break;
            case 'KeyE': focus = Math.min(map.sprites.length - 1, focus + 1); break;
        }
    }
});
document.addEventListener('keyup', key => {
    switch (key.code) {
        case 'ArrowLeft':  vel.a = Math.max(vel.a, 0); break;
        case 'ArrowRight': vel.a = Math.min(vel.a, 0); break;
        case 'ArrowUp':    vel.y = Math.max(vel.y, 0); break;
        case 'ArrowDown':  vel.y = Math.min(vel.y, 0); break;
        case 'KeyW':       vel.z = Math.min(vel.z, 0); break;
        case 'KeyS':       vel.z = Math.max(vel.z, 0); break;
        case 'KeyA':       vel.x = Math.max(vel.x, 0); break;
        case 'KeyD':       vel.x = Math.min(vel.x, 0); break;
    }
});