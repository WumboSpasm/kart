let getSpriteOrder = () => {
    let copy = [...game.player],
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
    
    for (let i = 0; i < game.player.length; i++) {
        let id = order[i];
        
        sprites.offset = (
            Math.round((game.cam.a + game.player[id].a) * (char[game.player[id].char].angles / 360)) * char[game.player[id].char].size
        ) % char[game.player[id].char].image.width;
        
        let x = turn.x(game.player[id].x, game.player[id].y, game.cam.x, game.cam.y, game.cam.a) - game.cam.x,
            y = game.cam.y - turn.y(game.player[id].x, game.player[id].y, game.cam.x, game.cam.y, game.cam.a),
            my  = (game.cam.z / (y + game.cam.z)) * (game.height / 2),
            mx  = (x * (my / game.cam.z)) + (game.width / 2),
        
            distSize = (my / (game.height / 2)) * (char[game.player[id].char].size * char[game.player[id].char].scale) * (20 / game.cam.z) * game.scale;
        
        if (mx >= -(distSize / 2) && mx < game.width + (distSize / 2) && my >= 0 && my < game.height)
            ctx.drawImage(
                char[game.player[id].char].image, sprites.offset, 0, 
                char[game.player[id].char].size, char[game.player[id].char].size, 
                mx - (Math.trunc(distSize + (game.cam.z / my)) / 2),
                my - distSize + Math.trunc((game.height + (game.cam.z / my)) / 2),
                distSize, distSize
            );
    }
    
    if (document.querySelector('#debug2'))
        document.querySelector('#debug2').textContent = 
            'Players: ' + game.player.length + '\n\n' +
            'Render order: ' + '\n' + getSpriteOrder().join(' ') + '\n\n' +
            'Active player: ' + game.control;
    
    requestAnimationFrame(sprites);
}