const track = [
    {
        name: 'Test Track',
        path: [
            'track.png',
            'collision.png',
            'upper.png',
            'lower.png'
        ]
    }
];

function checkLoaded() {
    for (let t = 0; t < track.length; t++) {
        for (let p = 0; p < track[t].path.length; p++) {
            if (typeof track[t].image[p] != 'undefined' && track[t].image[p].naturalWidth != 0) {
                if (t == track.length - 1 && p == track[t].path.length - 1) {
                    requestAnimationFrame(updatePos);
                    requestAnimationFrame(display);
                    
                    return;
                } else
                    continue;
            } else
                break;
        }
    }
    requestAnimationFrame(checkLoaded);
}
function loadImages() {
    for (let t = 0; t < track.length; t++) {
        track[t].image = new Array(track[t].path.length);
        
        for (let p = 0; p < track[t].path.length; p++) {
            let img = new Image();
            img.src = track[t].path[p];
            
            img.onload = function() {
                track[t].image[p] = img;
                
                if (t == track.length - 1 && p == track[t].path.length - 1)
                    checkLoaded();
            };
        }
    }
}
loadImages();