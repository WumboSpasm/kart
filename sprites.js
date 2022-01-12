function sprites() {
    let canvas = document.querySelector('#sprites'),
        ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    sprites.offset = (Math.round(game.cam.a / (360 / char[game.char].angles)) * char[game.char].size) % char[game.char].image.width;
    
    ctx.clearRect(0, 0, game.width, game.height);
    
    let x = turn.x(game.player.x, game.player.y, game.cam.x, game.cam.y, game.cam.a) - game.cam.x,
        y = game.cam.y - turn.y(game.player.x, game.player.y, game.cam.x, game.cam.y, game.cam.a),
        my  = (game.cam.z / (y + game.cam.z)) * (game.height / 2),
        mx  = (x * (my / game.cam.z)) + (game.width / 2),
    
        distSize = (my / (game.height / 2)) * (char[game.char].size * char[game.char].scale) * (20 / game.cam.z) * game.scale;
    
    if (mx >= -(distSize / 2) && mx < game.width + (distSize / 2) && my >= 0 && my < game.height)
        ctx.drawImage(
            char[game.char].image, sprites.offset, 0, char[game.char].size, char[game.char].size, 
            mx - (Math.trunc(distSize + (game.cam.z / my)) / 2),
            my - distSize + Math.trunc((game.height + (game.cam.z / my)) / 2),
            distSize, distSize
        );
    
    requestAnimationFrame(sprites);
}