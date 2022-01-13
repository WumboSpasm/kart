for (let i = 0; i < document.querySelectorAll('canvas').length; i++) {
    document.querySelectorAll('canvas')[i].width = game.width;
    document.querySelectorAll('canvas')[i].height = game.height;
}

function checkChars() {
    for (let p = 0; p < char.length; p++) {
        if (typeof char[p].image != 'undefined' && char[p].image.naturalWidth != 0) {
            if (p == char.length - 1) {
                gameInit();
                return;
            } else
                continue;
        } else
            break;
    }
    
    requestAnimationFrame(checkChars);
}
function loadChars() {
    for (let p = 0; p < char.length; p++) {
        char[p].image = new Image();
        char[p].image.src = char[p].path;
        
        char[p].image.onload = function() {
            if (p == char.length - 1)
                checkChars();
        }
    }
}

function checkTracks() {
    for (let t = 0; t < track.length; t++) {
        for (let p = 0; p < track[t].path.length; p++) {
            if (typeof track[t].image[p] != 'undefined' && track[t].image[p].naturalWidth != 0) {
                if (t == track.length - 1 && p == track[t].path.length - 1) {
                    loadChars();
                    return;
                } else
                    continue;
            } else
                break;
        }
    }
    requestAnimationFrame(checkTracks);
}
function loadTracks() {
    for (let t = 0; t < track.length; t++) {
        track[t].image = new Array(track[t].path.length);
        
        for (let p = 0; p < track[t].path.length; p++) {
            let img = new Image();
            img.src = track[t].path[p];
            
            img.onload = function() {
                track[t].image[p] = img;
                
                if (t == track.length - 1 && p == track[t].path.length - 1)
                    checkTracks();
            };
        }
    }
}
loadTracks();