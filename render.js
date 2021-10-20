const render = {
    init: true,
    
    width: 320,
    height: 200,
    
    // handled by init
    img: 0,
    
    spread: 0,
    horizon: 0
};
const data = {
    num: 0,
    
    // handled by init
    map: 0,
    collision: 0,
    bg: {
        upper: 0,
        lower: 0
    },
    
    center: {
        x: 0,
        y: 0
    },
    
    hyp: 0
}

const getPixel = (x, y, w, c) => (x * 4) + (y * (w * 4)) + c;
const convertImage = (n, i) => {
    let canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        data = track[n].image[i];
        
    canvas.width  = data.width;
    canvas.height = data.height;
    
    ctx.imageSmoothingEnabled = false;
    
    ctx.drawImage(data, 0, 0);
    
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
};

function display() {
    let canvas = document.querySelector('canvas'),
        ctx = canvas.getContext('2d');
    
    // Calculate properties dependent on own object so they don't need to be re-calculated each time
    if (render.init) {
        data.map       = convertImage(data.num, 0);
        data.collision = convertImage(data.num, 1);
        data.bg.upper  = track[data.num].image[2];
        data.bg.lower  = convertImage(data.num, 3);
        
        canvas.width  = render.width;
        canvas.height = render.height;
        
        ctx.imageSmoothingEnabled = false;
        
        render.img = ctx.createImageData(render.width, render.height - render.horizon);
        
        ctx.drawImage(data.bg.upper, 0, 0);
        
        data.center.x = data.map.width  / 2;
        data.center.y = data.map.height / 2;
        
        player.x = 919.5;
        player.y = 581.5;
        
        render.spread = data.map.width / player.r;
        render.horizon = render.height / 2;
        
        data.hyp = Math.hypot(data.map.width, data.map.height);
        
        render.init = false;
    }
    
    if (player.vel.a) {
        ctx.fillStyle = ctx.createPattern(data.bg.upper, 'repeat-x');
        ctx.save();
        ctx.translate(Math.trunc(render.width * (player.a / 360)), 0)
        ctx.fillRect(-Math.trunc(render.width * (player.a / 360)), 0, render.width, render.height - render.horizon);
        ctx.restore();
    }
    if (player.vel.r)
        render.spread = data.map.width / player.r;
    
    for (let y = 0; y < render.height - render.horizon; y++) {
        let mapY = player.y + ((y - (render.height - render.horizon)) / ((1 + y) * (render.spread / data.hyp)));
        //let mapY = player.y + (y - (render.height - render.horizon));
        
        for (let x = 0; x < render.width; x++) {
            let mapX = player.x + ((x - (render.width / 2)) / ((1 + y) * (render.spread / data.hyp))),
            //let mapX = player.x + (x - (render.width / 2)),
                
                // Math.trunc screws up pixels with zeroed coordinates
                rotX = Math.floor(turn.x(mapX, mapY, player.x, player.y, -player.a)),
                rotY = Math.floor(turn.y(mapX, mapY, player.x, player.y, -player.a));
            
            if (rotX >= data.map.width || rotX < 0 || rotY >= data.map.height || rotY < 0)
                for (let c = 0; c < 4; c++)
                    render.img.data[getPixel(x, y, render.width, c)] = data.bg.lower.data[getPixel(
                        ((Math.trunc(x + (render.width * (player.a / 360))) % render.width) + render.width) % render.width,
                    y, render.width, c)];
            else
                for (let c = 0; c < 4; c++)
                    render.img.data[getPixel(x, y, render.width, c)] = data.map.data[getPixel(rotX, rotY, data.map.width, c)];
        }
    }
    
    ctx.putImageData(render.img, 0, render.horizon);
    
    document.querySelector('div').textContent = 'FPS: ' + Math.trunc(60 / player.time) + '\n' + 
                                                'Multiplier: ' + player.time + '\n\n' + 
                                                'X: ' + player.x + '\n' + 
                                                'Y: ' + player.y + '\n' + 
                                                'Angle: ' + player.a + '\n\n' + 
                                                'X Velocity: ' + player.vel.x * player.time + '\n' +
                                                'Y Velocity: ' + player.vel.y * player.time + '\n' +
                                                'Angle Velocity: ' + player.vel.a * player.time + '\n\n' +
                                                /*'X Acceleration: ' + player.accel.x + '\n' +
                                                'Y Acceleration: ' + player.accel.y + '\n' +
                                                'Rot Acceleration: ' + player.accel.r + '\n\n' +*/
                                                'Rise: ' + player.r;
    
    requestAnimationFrame(display);
}