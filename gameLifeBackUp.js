const canvas      = document.querySelector("canvas");
const ctx         = canvas.getContext("2d");
const screenSize  = [screen.width, screen.height];
// const screenSize  = [window.innerWidth, window.innerHeight];
const cellsSize   = 10;
const gap         = 0;
const cellsRep    = [window.innerWidth/cellsSize, window.innerHeight/cellsSize];
const cellsColor  = ["black", "white"];
const timeWait    = 0;
const setManually = false;
const randomValue = 0.5;


// TODO faire pause quand barre espace préssée 

//! voir comment appeler une fonction stockée dans une string 
const isCalled    = "drawPixel";



const giveRandom     = (n)    => Math.random() > n;
const getState       = (i, j) => "cellule " + i + " " + j + " : " + cells[i][j];
const inPeripheral   = (i, j) => i == 0 || j == 0 || i == cellsRep[0] - 1 || j == cellsRep[1] - 1;
const afficheTableau = (t)    => {  
    for(let i = 0; i < t.length; i++) {
        console.log("");
            for(let j = 0; j < t[i].length; j++)
                console.log(i + " " + j + " : " + t[i][j]);
    }
}

ctx.canvas.width  = screenSize[0];
ctx.canvas.height = screenSize[1];

if(setManually) 
    var cells = setCellsManually();
else 
    var cells = new Array(cellsRep[0]);


var cellsNeighbours = new Array(cellsRep[0]);
createGrid();
setCells_neighbour();

// afficheTableau(cellsNeighbours);




function createGrid() {
    for(let i = 0; i < cellsRep[0]; i++) {
        cells[i] = new Array(cellsRep[1]);
        for(let j = 0; j < cellsRep[1]; j++) {
            let random = giveRandom(randomValue);
    
            cells[i][j]   = (random) ? 'd' : 'a';
            ctx.fillStyle = (random) ? cellsColor[0] : cellsColor[1];
            drawPixel(i , j);
        }
    }
}

function setCells_neighbour() {

    for(let i = 0; i < cellsRep[0]; i++) {
        cellsNeighbours[i] = new Array(cellsRep[1]);

        for(let j = 0; j < cellsRep[1]; j++) 
            cellsNeighbours[i][j] = willNextTurn(i, j);
    }

    setTimeout(changeState, timeWait, cellsNeighbours, cells)
}

function willNextTurn(i, j) {
    var c_alive = 0;
    for(let y = -1; y < 2; y++) {
        for(let x = -1; x < 2; x++) {
            
            if(i + x != i || j + y != j) {
                try {
                    if(cells[i + x][j + y] == 'a') 
                        c_alive++;       
                } catch(e) {}
            }

        }
    }

    return c_alive;
}

function changeState(cellsNeighbours, cells) {
    
    // Effacer tous les anciennes cellules
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let i = 0; i < cellsRep[0]; i++) {
        for(let j = 0; j < cellsRep[1]; j++) {
            
            // console.log(cells[i][j])

            // Cellule vivante reste vivante
            if(cells[i][j] === 'a' && (cellsNeighbours[i][j] == 2 || cellsNeighbours[i][j] == 3)) {
                ctx.fillStyle = cellsColor[1];
                drawPixel(i , j);
                cells[i][j] = 'a';
            } 
            
            // Cellule morte prend vie
            if(cells[i][j] === 'd' && cellsNeighbours[i][j] == 3) {
                ctx.fillStyle = cellsColor[1];
                drawPixel(i , j);
                cells[i][j] = 'a';
            } 

            // Cellule vivante meurt
            if(cells[i][j] === 'a' && (cellsNeighbours[i][j] < 2 || cellsNeighbours[i][j] > 3)) {
                ctx.fillStyle = cellsColor[0];
                drawPixel(i , j);
                cells[i][j] = 'd';
            } 

            // Cellule morte reste morte
            if(cells[i][j] === 'd' && cellsNeighbours[i][j] != 3) {
                ctx.fillStyle = cellsColor[0];
                drawPixel(i , j);
                cells[i][j] = 'd';
            } 
        }
    }

    setCells_neighbour();
}

function drawPixel(i , j) {
    ctx.fillRect(i * cellsSize + i * gap,  j * cellsSize + j * gap, cellsSize, cellsSize);
}

//! Faire fonctionner fonction ecriture cellules
function drawText(i , j) {
    ctx.strokeText(i + " " + j, 10 + i * gap, 10 + j * gap);
}

function setCellsManually() {
    var cells = [
        ['d','d','d','d','d','d','d','d'],
        ['d','d','d','d','d','d','d','d'],
        ['d','d','d','a','d','d','d','d'],
        ['d','d','d','d','a','d','d','d'],
        ['d','d','a','a','a','d','d','d'],
        ['d','d','d','d','d','d','d','d'],
        ['d','d','d','d','d','d','d','d'],
        ['d','d','d','d','d','d','d','d']
    ];

    for(let i = 0; i < cells.length; i++) {
        for(let j = 0; j < cells[i].length; j++) {
            ctx.fillStyle = (cells[i][j] === 'd') ? cellsColor[0] : cellsColor[1];
            ctx.fillRect(i * cellsSize + i * gap,  j * cellsSize + j * gap, cellsSize, cellsSize);
        }
    }

    return cells;
}