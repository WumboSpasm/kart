function sprites() {
    let canvas = document.querySelector('#sprites'),
        ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    sprites.offset = (Math.round(game.cam.a / (360 / char[game.char].angles)) * char[game.char].size) % char[game.char].image.width;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    nest: // what the heck javascript
    for (let y = 0; y < render.lower; y++) {
        for (let x = 0; x < canvas.width; x++) {
            let coords = getCoords(x, y);
            
            // if (Math.abs(coords[0] - game.player.x) < 10 && Math.abs(coords[1] - game.player.y) < 10) {
            if (coords[0] == Math.trunc(game.player.x) && coords[1] == Math.trunc(game.player.y)) {
                let distSize = (y / render.lower) * (char[game.char].size * char[game.char].scale) * (20 / game.cam.z) * game.scale;
                
                ctx.drawImage(
                    char[game.char].image, sprites.offset, 0, char[game.char].size, char[game.char].size, 
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