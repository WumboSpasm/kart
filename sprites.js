function sprites() {
    let canvas = document.querySelector('#sprites'),
        ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    sprites.offset = (Math.round(game.cam.a / (360 / char[game.char].angles)) * char[game.char].size) % char[game.char].image.width;
    
    ctx.clearRect(0, 0, game.width, game.height);
    
    let y  = (game.cam.z / (game.cam.y - game.player.y)) * (game.height / 2),
        x  = ((game.player.x - game.cam.x) * (y / game.cam.z)) + (game.width / 2),
        ry = Math.round(turn.y(x, y, game.width / 2, game.height, game.cam.a)),
        rx = Math.round(turn.x(x, y, game.width / 2, game.height, game.cam.a)),
    
        distSize = (ry / (game.height / 2)) * (char[game.char].size * char[game.char].scale) * (20 / game.cam.z) * game.scale;
    
    if (rx >= -(distSize / 2) && rx < game.width + (distSize / 2) && ry >= 0 && ry < game.height)
        ctx.drawImage(
            char[game.char].image, sprites.offset, 0, char[game.char].size, char[game.char].size, 
            rx - (Math.trunc(distSize + (game.cam.z / ry)) / 2),
            ry - distSize + Math.trunc((game.height + (game.cam.z / ry)) / 2),
            distSize, distSize
        );
    
    requestAnimationFrame(sprites);
}