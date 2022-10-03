class Map {
    constructor(image, posX = 0, posY = 0, posZ = 0, posA = 0) {
        this.image = Map.toImageData(image);
        
        this.pos = {
            x: posX,
            y: posY,
            z: posZ,
            a: posA
        };
        
        this.background = [];
        this.sprites    = [];
        this.tiles      = [];
        
        this.boundTile  = -1;
        this.renderHalf = true;
    }
    
    static toImageData = image => {
        let canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d');
        
        canvas.width  = image.width;
        canvas.height = image.height;
        
        ctx.drawImage(image, 0, 0);
        
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
    
    static getPixel = (x, y, w, c) => ((Math.trunc(x) + (Math.trunc(y) * w)) * 4) + c;
    
    static wrap = (a, n) => a - (n * Math.floor(a / n));
    
    static math = {
        sin(d)  { return Math.sin(d * (Math.PI / 180)) },
        cos(d)  { return Math.cos(d * (Math.PI / 180)) }
    };
    
    static turn = {
        x(x, y, cx, cy, a) { return (Map.math.cos(a) * (x - cx)) - (Map.math.sin(a) * (y - cy)) + cx },
        y(x, y, cx, cy, a) { return (Map.math.cos(a) * (y - cy)) + (Map.math.sin(a) * (x - cx)) + cy }
    };
    
    render(canvas) {
        let ctx = canvas.getContext('2d'),
            renderHeight = this.renderHalf ? (canvas.height / 2) : canvas.height,
            output = ctx.createImageData(canvas.width, renderHeight);
        
        ctx.imageSmoothingEnabled = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (this.renderHalf || this.boundTile < 0) {
            for (let layer of this.background) {
                let scaleFactor = canvas.height / layer.height,
                    transFactor = Math.trunc((this.pos.a / 360) * layer.width),
                    transOffset = ((canvas.width / scaleFactor) - layer.width) / 2;
                
                ctx.fillStyle = ctx.createPattern(layer, 'repeat-x');
                
                ctx.save();
                
                ctx.scale(scaleFactor, scaleFactor);
                ctx.translate(transOffset - transFactor, 0);
                ctx.fillRect(transFactor - transOffset, 0, canvas.width / scaleFactor, canvas.height / scaleFactor);
                
                ctx.restore();
            }
        }
        
        let pixel = ctx.getImageData(0, canvas.height - renderHeight, canvas.width, renderHeight);
        
        for (let y = 1; y <= renderHeight; y++) {
            for (let x = 0; x < canvas.width; x++) {
                let mx = this.pos.x + ((x - (canvas.width  / 2)) * (this.pos.z / y)),
                    my = this.pos.y + ((y - renderHeight) * (this.pos.z / y)),
                    
                    rx = Map.turn.x(mx, my, this.pos.x, this.pos.y, this.pos.a),
                    ry = Map.turn.y(mx, my, this.pos.x, this.pos.y, this.pos.a),
                    
                    sourceIndex = Map.getPixel(rx, ry, this.image.width, 0),
                    outputIndex = Map.getPixel(x, y - 1, canvas.width, 0);
                
                if (this.image.data[sourceIndex + 3] > 0 && rx >= 0 && rx < this.image.width && ry >= 0 && ry < this.image.height) {
                    for (let c = 0; c < 4; c++)
                        output.data[outputIndex + c] = this.image.data[sourceIndex + c];
                }
                else if (this.boundTile > -1) {
                    let tile = this.tiles[this.boundTile].image,
                        tileIndex = Map.getPixel(Map.wrap(rx, tile.width), Map.wrap(ry, tile.height), tile.width, 0);
                    
                    for (let c = 0; c < 4; c++)
                        output.data[outputIndex + c] = tile.data[tileIndex + c];
                }
                else {
                    for (let c = 0; c < 4; c++)
                        output.data[outputIndex + c] = pixel.data[outputIndex + c];
                }
            }
        }
        
        ctx.putImageData(output, 0, canvas.height - renderHeight);
        
        const spriteOrder = this.sprites.map((sprite, index) => ({
            depth: Map.turn.y(sprite.pos.x, sprite.pos.y, this.pos.x, this.pos.y, -this.pos.a),
            index: index
        })).sort((a, b) => a.depth - b.depth).map(sprite => sprite.index);
        
        for (let index of spriteOrder) {
            let sprite  = this.sprites[index],
                offsetX = Math.trunc(Map.wrap((sprite.pos.a - this.pos.a) + ((360 / sprite.rotations) / 2), 360) * (sprite.rotations / 360)) * sprite.width,
                offsetY = sprite.row * sprite.height;
            
            let heightDiff = this.pos.z - sprite.pos.z + (this.pos.z - sprite.pos.z == 0 ? 0.1 : 0),
                
                rx = Map.turn.x(sprite.pos.x, sprite.pos.y, this.pos.x, this.pos.y, -this.pos.a) - this.pos.x,
                ry = this.pos.y - Map.turn.y(sprite.pos.x, sprite.pos.y, this.pos.x, this.pos.y, -this.pos.a),
                my = (heightDiff / (ry + this.pos.z)) * renderHeight,
                mx = (rx * (my / heightDiff)) + (canvas.width / 2),
                
                dw = (my / heightDiff) * sprite.scale * sprite.width,
                dh = (my / heightDiff) * sprite.scale * sprite.height,
                dx = mx - (dw / 2),
                dy = my - dh + (canvas.height - renderHeight);
            
            if (dx >= -dw && dx < canvas.width && dy >= -dh && dy < canvas.height
             && dw > 0 && dw <= canvas.width && dh > 0 && dh <= canvas.height)
                ctx.drawImage(sprite.sheet, offsetX, offsetY, sprite.width, sprite.height, dx, dy, dw, dh);
        }
    }
}

class Sprite {
    constructor(sheet, width = 32, height = 32, row = 0, scale = 0.5, posX = 0, posY = 0, posZ = 0, posA = 0) {
        this.sheet  = sheet;
        this.width  = width;
        this.height = height;
        this.row    = row;
        this.scale  = scale;
        
        this.pos = {
            x: posX,
            y: posY,
            z: posZ,
            a: posA
        };
    }
    
    get rotations() { return Math.floor(this.sheet.width  /  this.width) }
    get frames()    { return Math.floor(this.sheet.height / this.height) }
}

class Tile {
    constructor(image, posX = 0, posY = 0) {
        this.image = Map.toImageData(image);
        this.pos = { x: posX, y: posY };
    }
}