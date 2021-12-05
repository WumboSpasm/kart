let init = true;

// Handled by init
const array = {
    map: 0,
    collision: 0,
    
    hyp: 0
};

// Helpful functions
const getPixel = (x, y, w, c) => (x * 4) + (y * (w * 4)) + c;
const convertImage = (n, i) => {
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        img = track[n].image[i];
    
    canvas.width  = img.width;
    canvas.height = img.height;
    
    ctx.drawImage(img, 0, 0);
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
};
const scaleImage = (img) => {
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');
    
    canvas.width  = Math.trunc(img.width * game.scale);
    canvas.height = Math.trunc(img.height * game.scale);
    
    ctx.imageSmoothingEnabled = false;
    
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    return canvas;
};
function getCoords(x, y) {
    /*
    let mapY = game.cam.y + (y - render.lower),
        mapX = game.cam.x + (x - (canvas.width / 2)),
    */
    let mapX = game.cam.x + ((x - (game.width / 2)) / ((1 + y) * (render.rise / array.hyp))),
        mapY = game.cam.y + ((y - render.lower) / ((1 + y) * (render.rise / array.hyp))) + game.cam.d,
        
        rotX = Math.floor(turn.x(mapX, mapY, game.cam.x, game.cam.y, -game.cam.a)),
        rotY = Math.floor(turn.y(mapX, mapY, game.cam.x, game.cam.y, -game.cam.a));
        
    return [rotX, rotY];
}

// Draw map
function render() {
    let canvas = document.querySelector('#render'),
        ctx = canvas.getContext('2d');
    
    if (init) {
        array.map       = convertImage(game.track, 0);
        array.collision = convertImage(game.track, 1);
        
        array.hyp = Math.hypot(array.map.width, array.map.height);
        
        // Height of area below horizon
        render.lower = canvas.height / 2;
        // Z offset of render
        render.rise = array.map.width / game.cam.z;
        
        render.img = ctx.createImageData(canvas.width, render.lower);
        
        ctx.imageSmoothingEnabled = false;
        
        init = false;
    }
    if (game.cam.vel.z)
        render.rise = array.map.width / game.cam.z;
    if (game.cam.vel.r)
        render.img = ctx.createImageData(canvas.width, render.lower);
    
    for (let y = 0; y < render.lower; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let coords = getCoords(x, y);
            
            if (coords[0] >= array.map.width || coords[0] < 0 || coords[1] >= array.map.height || coords[1] < 0)
                render.img.data[getPixel(x, y, canvas.width, 3)] = 0;
            else
                for (let c = 0; c < 4; c++)
                    render.img.data[getPixel(x, y, canvas.width, c)] = array.map.data[getPixel(coords[0], coords[1], array.map.width, c)];
        }
    }
    
    ctx.putImageData(render.img, 0, canvas.height - render.lower);
    
    if (document.querySelector('#debug'))
        document.querySelector('#debug').textContent = 'FPS: ' + Math.trunc(60 / game.cam.time) + '\n' + 
                                                       'Multiplier: ' + game.cam.time + '\n\n' + 
                                                       'X: ' + game.cam.x + '\n' + 
                                                       'Y: ' + game.cam.y + '\n' + 
                                                       'Z: ' + game.cam.z + '\n' +
                                                       'Angle: ' + game.cam.a + '\n' + 
                                                       'Dist: ' + game.cam.d + '\n\n' +
                                                       'X Velocity: ' + game.cam.vel.x * game.cam.time + '\n' +
                                                       'Y Velocity: ' + game.cam.vel.y * game.cam.time + '\n' +
                                                       'Angle Velocity: ' + game.cam.vel.a * game.cam.time + '\n\n' +
                                                       'Freefly: ' + game.cam.freefly;
    
    requestAnimationFrame(render);
}
// Draw background
function background() {
    let canvas = document.querySelector('#background'),
        ctx = canvas.getContext('2d');
    
    if (typeof background.img == 'undefined')
        background.img = scaleImage(track[game.track].image[2]);
    
    if (game.cam.vel.a || init) {
        ctx.fillStyle = ctx.createPattern(background.img, 'repeat-x');
        ctx.save();
        ctx.translate(Math.trunc(background.img.width * (game.cam.a / 360)) + ((canvas.width - background.img.width) / 2), 0);
        ctx.fillRect(-Math.trunc(background.img.width * (game.cam.a / 360)) - ((canvas.width - background.img.width) / 2), 0,
                      Math.max(canvas.width, background.img.width), Math.max(canvas.height, background.img.height));
        ctx.restore();
    }
    
    requestAnimationFrame(background);
}