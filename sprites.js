function sprites() {
    let canvas = document.querySelector('#sprites'),
        ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    sprites.offset = (Math.round(game.cam.a / (360 / char[game.char].angles)) * char[game.char].size) % char[game.char].image.width;
    
    ctx.clearRect(0, 0, game.width, game.height);
    
    let x  = game.player.x - game.cam.x,
        y  = game.player.y - game.cam.y + (game.height / 2),
        mx = (x / (game.cam.z / y)) + (game.width / 2),
        my = y,
        rx = Math.round(turn.x(mx, my, game.width / 2, game.height, game.cam.a)),
        ry = Math.round(turn.y(mx, my, game.width / 2, game.height, game.cam.a));
    
    if (rx >= 0 && rx < game.width && ry >= 0 && ry < game.height) {
        let distSize = (ry / (game.height / 2)) * (char[game.char].size * char[game.char].scale) * (20 / game.cam.z) * game.scale;
        
        ctx.drawImage(
            char[game.char].image, sprites.offset, 0, char[game.char].size, char[game.char].size, 
            rx - (distSize / 2) + Math.trunc((game.cam.z / ry) / 2),
            ry + (game.height / 2) - distSize + Math.trunc((game.cam.z / ry) / 2),
            distSize, distSize
        );
    }
    
    requestAnimationFrame(sprites);
}