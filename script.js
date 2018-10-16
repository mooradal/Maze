var canvas = document.getElementById("canvas");
width = canvas.width
var ctx = canvas.getContext("2d");
var cols = 20;
var w = width/cols;
var Done = false;
var keys = {right:false,left:false,up:false,down:false}
var grid = [];
var stack = [];
var velocity = {x:0,y:0}
for (var e = 0;e < width;e+=w) {
    for (var i = 0;i < width;i+=w) {
        grid.push(new Cell(i,e))
    }
}

player = {x:0,y:0,size:10}

var current = grid[0];
update();

function update() {
    window.requestAnimationFrame(update)
    ctx.clearRect(0,0,width,width)
    ctx.fillStyle = "#121212"
    ctx.fillRect(0,0,width,width)
    drawCell();
    movement()
    player.x += velocity.x
    player.y += velocity.y
    // player.x = Math.floor(player.x)
    // player.y = Math.floor(velocity.y)
    velocity.x *= 0.9
    velocity.y *= 0.9
    current.visited = true
    next = current.checkNeighbors()
    if (next) {
    stack.push(current)
    removeWalls(current,next)
    current = next
    } else if (stack.length > 0) {
        current = stack.pop();
    } else {
        ctx.fillStyle = "#ff0000"
        ctx.fillRect(player.x,player.y,player.size,player.size)
    }
}

function index(x,y)  {
    if (x/w < 0 || y/w < 0 || x/w> cols-1 || y/w > cols-1) {
        return -1
    }

    return x + y * cols; 
}

function Cell(x,y) {
    this.x = x;
    this.y = y;
    this.walls = [true,true,true,true];
    this.visited = false

    this.checkNeighbors = function() {
        var neighbors = []

        var top = grid[index(x/w,(y/w)-1)]
        var bottom = grid[index(x/w,(y/w)+1)]
        var left = grid[index((x/w)-1,y/w)]
        var right = grid[index((x/w)+1,y/w)]

        if (top && !top.visited) {
            neighbors.push(top)
        } if (bottom && !bottom.visited) {
            neighbors.push(bottom)
        } if (right && !right.visited) {
            neighbors.push(right)
        } if (left && !left.visited) {
            neighbors.push(left)
        }

        if (neighbors.length > 0) {
            r =  Math.floor(Math.random()*neighbors.length)
            return neighbors[r];
        } else {
            return undefined
        }
    }
    this.hightlight = function() {
        ctx.fillStyle = "#FF0000"
        ctx.fillRect(x,y,w,w)
    }
}

function drawCell() {  
for (var i = 0;i < grid.length;i++) {
    if (grid[i].walls[0]) {
        ctx.beginPath();
        ctx.moveTo(grid[i].x,grid[i].y)
        ctx.lineTo(grid[i].x+w,grid[i].y)
        ctx.stroke()
        } if (grid[i].walls[1]) {
        ctx.beginPath();
        ctx.moveTo(grid[i].x+w,grid[i].y)
        ctx.lineTo(grid[i].x+w,grid[i].y+w)
        ctx.stroke()
        } if (grid[i].walls[2]) {
        ctx.beginPath();
        ctx.moveTo(grid[i].x+w,grid[i].y+w)
        ctx.lineTo(grid[i].x,grid[i].y+w)
        ctx.stroke()
        } if (grid[i].walls[3]) {
        ctx.strokeStyle = "#ffffff"
        ctx.beginPath();
        ctx.moveTo(grid[i].x,grid[i].y)
        ctx.lineTo(grid[i].x,grid[i].y+w)
        ctx.stroke()
        }

        if (grid[i].visited == true) {
            ctx.fillStyle = "#242424"
            ctx.fillRect(grid[i].x,grid[i].y,w,w)
        }

    }
}

function removeWalls(cell1,cell2) {
    var x = cell1.x/w - cell2.x/w;
    if (x === 1) {
        cell1.walls[3] = false;
        cell2.walls[1] = false;
    } else if (x === -1) {
        cell1.walls[1] = false;
        cell2.walls[3] = false;
    } 

    var y = cell1.y/w - cell2.y/w;
    if (y === 1) {
        cell1.walls[0] = false;
        cell2.walls[2] = false;
    } else if (y === -1) {
        cell1.walls[2] = false
        cell2.walls[0] = false
    }
}

document.onkeydown = function(e) {
    if (e.keyCode == 38) {
        keys.up = true;
    } if (e.keyCode == 40) {
        keys.down = true;
    } if (e.keyCode == 37) {
        keys.left = true;
    } if (e.keyCode == 39) {
        keys.right = true;
    } 
};


document.onkeyup =  function(e) {
    if (e.keyCode == 38) {
        keys.up = false;
    } if (e.keyCode == 40) {
        keys.down = false;
    } if (e.keyCode == 37) {
        keys.left = false;
    } if (e.keyCode == 39) {
        keys.right = false;
    } 
}

function movement() {
    if (keys.up) {
        velocity.y -= 0.8
    } if (keys.down) {
        velocity.y += 0.8
    } if (keys.left) {
        velocity.x -= 0.8
    } if (keys.right) {
        velocity.x += 0.8
    } 
}

// function collision() {
//     for (var i = 0;i < grid.length;i++) {
//         if (grid[i].walls[1] &&  grid[i].y <= player.y <= grid[i].y+w && player.x+player.size == grid[i].x+w) {
//             velocity.x = 0
//             right = false
//             player.x = (grid[i].x+w)-player.size
//             console.log("Touched it")
//         }
//     }
// }