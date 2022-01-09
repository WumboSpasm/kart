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
/*
    Steps taken to produce pseudo-3D render:
    
    1. Game iterates through every pixel in lower half of screen each frame
    2. Map position at given pixel is calculated
    3. Color values of pixel at map position are applied to screen pixel
*/
function getCoords(x, y) {
    /*
    let mx = game.cam.x + x - (game.width  / 2),
        my = game.cam.y + y - (game.height / 2),
    */
    let mx = game.cam.x + ((x - (game.width  / 2)) * (game.cam.z / y)),
        my = game.cam.y + ((y - (game.height / 2)) * (game.cam.z / y)),
    
        rx = Math.round(turn.x(mx, my, game.cam.x, game.cam.y, -game.cam.a)),
        ry = Math.round(turn.y(mx, my, game.cam.x, game.cam.y, -game.cam.a));
    
    return [rx, ry];
}

// Draw map
function render() {
    let canvas = document.querySelector('#render'),
        ctx = canvas.getContext('2d');
    
    if (init) {
        array.map       = convertImage(game.track, 0);
        array.collision = convertImage(game.track, 1);
        
        render.img = ctx.createImageData(canvas.width, game.height / 2);
        
        init = false;
    }
    
    for (let y = 1; y <= game.height / 2; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let coords = getCoords(x, y);
            
            if (coords[0] >= array.map.width || coords[0] < 0 || coords[1] >= array.map.height || coords[1] < 0)
                render.img.data[getPixel(x, y - 1, canvas.width, 3)] = 0;
            else
                for (let c = 0; c < 4; c++)
                    render.img.data[getPixel(x, y - 1, canvas.width, c)] = array.map.data[getPixel(coords[0], coords[1], array.map.width, c)];
        }
    }
    
    ctx.putImageData(render.img, 0, canvas.height - game.height / 2);
    
    if (document.querySelector('#debug'))
        document.querySelector('#debug').textContent = 
            'FPS: ' + Math.trunc(60 / game.cam.time) + '\n' + 
            'Multiplier: ' + game.cam.time + '\n\n' + 
            'X: ' + game.cam.x + '\n' + 
            'Y: ' + game.cam.y + '\n' + 
            'Z: ' + game.cam.z + '\n' +
            'Angle: ' + game.cam.a + '\n' + 
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