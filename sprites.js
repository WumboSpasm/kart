function ugh(x, y) {
    let mapX = game.cam.x + ((x - (game.width / 2)) / ((1 + y) * (render.rise / array.hyp))),
        mapY = game.cam.y + ((y - render.lower) / ((1 + y) * (render.rise / array.hyp))) + game.cam.d,
        
        rotX = turn.x(mapX, mapY, game.cam.x, game.cam.y, -game.cam.a),
        rotY = turn.y(mapX, mapY, game.cam.x, game.cam.y, -game.cam.a);
        
    return [rotX, rotY];
}

function sprites() {
    let canvas = document.querySelector('#sprites'),
        ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    sprites.offset = (Math.round(game.cam.a / (360 / char[game.char].angles)) * char[game.char].size) % char[game.char].image.width;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    nest: // what the heck javascript
    for (let y = 0; y < render.lower; y++) {
        let mapY = game.cam.y + ((y - render.lower) / ((1 + y) * (render.rise / array.hyp))) + game.cam.d;
        
        for (let x = 0; x < canvas.width; x++) {
            let mapX = game.cam.x + ((x - (canvas.width / 2)) / ((1 + y) * (render.rise / array.hyp))),
            
                rotX = turn.x(mapX, mapY, game.cam.x, game.cam.y, -game.cam.a),
                rotY = turn.y(mapX, mapY, game.cam.x, game.cam.y, -game.cam.a);
            
            if (Math.trunc(rotX) == Math.trunc(game.player.x) && Math.trunc(rotY) == Math.trunc(game.player.y)) {
                let distSize = (y / render.lower) * (char[game.char].size * char[game.char].scale);
                
                ctx.drawImage(
                    char[game.char].image,
                    sprites.offset, 0, 
                    char[game.char].size, char[game.char].size, 
                    x - (distSize / 2) + Math.trunc(((1 + y) * (render.rise / array.hyp)) / 2),
                    y + render.lower - distSize + Math.trunc(((1 + y) * (render.rise / array.hyp)) / 2),
                    distSize, distSize
                );
                
                break nest;
            }
        }
    }
    
    requestAnimationFrame(sprites);
}