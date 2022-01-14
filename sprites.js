let getSpriteOrder = () => {
    let copy = [...player],
        list = [];
    
    copy.sort((a, b) => turn.y(a.x, a.y, game.cam.x, game.cam.y, game.cam.a) - turn.y(b.x, b.y, game.cam.x, game.cam.y, game.cam.a));
    
    for (let i = 0; i < copy.length; i++)
        list.push(copy[i].id);
    
    return list;
};

function sprites() {
    let canvas = document.querySelector('#sprites'),
        ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    ctx.clearRect(0, 0, game.width, game.height);
    
    let order = getSpriteOrder();
    
    for (let i = 0; i < player.length; i++) {
        let id = order[i];
        
        sprites.offset = (
            Math.round((((game.cam.a - player[id].a) + 360) % 360) * (char[player[id].char].angles / 360)) * char[player[id].char].size
        ) % char[player[id].char].image.width;
        
        let x = turn.x(player[id].x, player[id].y, game.cam.x, game.cam.y, game.cam.a) - game.cam.x,
            y = game.cam.y - turn.y(player[id].x, player[id].y, game.cam.x, game.cam.y, game.cam.a),
            my  = (game.cam.z / (y + game.cam.z)) * (game.height / 2),
            mx  = (x * (my / game.cam.z)) + (game.width / 2),
        
            distSize = (my / (game.height / 2)) * (char[player[id].char].size * char[player[id].char].scale) * (20 / game.cam.z) * game.scale;
        
        if (mx >= -(distSize / 2) && mx < game.width + (distSize / 2) && my >= 0 && my < game.height)
            ctx.drawImage(
                char[player[id].char].image, sprites.offset, 0, 
                char[player[id].char].size, char[player[id].char].size, 
                mx - (distSize / 2), my - distSize + (game.height / 2),
                distSize, distSize
            );
    }
    
    if (document.querySelector('#debug2'))
        document.querySelector('#debug2').textContent = 
            'Players: ' + player.length + '\n\n' +
            'Render order: ' + '\n' + getSpriteOrder().join(' ') + '\n\n' +
            'Active player: ' + game.control;
    
    requestAnimationFrame(sprites);
}