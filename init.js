function gameInit() {
    addPlayer(0, 919.5, 581.5, 0);
    addPlayer(0, 951.5, 609.5, 45);
    addPlayer(0, 919.5, 629.5, 90);
    addPlayer(0, 951.5, 653.5, 135);
    addPlayer(0, 919.5, 677.5, 180);
    addPlayer(0, 951.5, 701.5, 225);
    addPlayer(0, 919.5, 725.5, 270);
    addPlayer(0, 951.5, 749.5, 315);
    
    requestAnimationFrame(updatePos);
    requestAnimationFrame(background);
    requestAnimationFrame(render);
    requestAnimationFrame(sprites);
}