const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')
const btnUp = document.querySelector('#up')
const btnLeft = document.querySelector('#left')
const btnRight = document.querySelector('#right')
const btnDown = document.querySelector('#down')
const spanLives = document.querySelector('#lives')
const spanTimes = document.querySelector('#time')
const spanRecord = document.querySelector('#record')
const pResult = document.querySelector('#result')

window.addEventListener('load', setCanvasSize)
window.addEventListener('resize', setCanvasSize)
window.addEventListener('keydown', moveByKeys)
btnUp.addEventListener('click', moveUp)
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)

let canvasSize
let elementSize
const playerPosition = {
    x: undefined,
    y: undefined
}
let newPosition
const giftPosition = {
    x: undefined,
    y: undefined
}
let arrayBombPosition = []
let bombPosition = {
    x: undefined,
    y: undefined
}

let level = 0
let lives = 3

let timeStart
let timePlayer
let timeInterval

function setCanvasSize() {
    if (window.innerHeight < window.innerWidth) {
        canvasSize = window.innerHeight * 0.7
    } else {
        canvasSize = window.innerWidth * 0.7
    }

    canvasSize = Number(canvasSize.toFixed(3))
    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)
    
    elementSize = canvasSize / 10
    elementSize = Number(elementSize.toFixed(3))

    playerPosition.x = undefined
    playerPosition.y = undefined

    startGame()
}

function startGame() {
    // console.log({ canvasSize, elementSize });

    game.font = elementSize+'px Verdana'
    game.textAlign = 'end'
    
    const map = maps[level]

    if (!map) {
        gameWin()
        return
    }

    if (!timeStart) {
        timeStart = Date.now()
        timeInterval = setInterval(showTimes, 100)
        showRecord()
    }

    const mapRows = map.trim().split('\n')
    const mapCols = mapRows.map(row => row.trim().split(''))

    showLives()

    game.clearRect(0,0,canvasSize, canvasSize)
    arrayBombPosition = []

    mapCols.forEach((row, rowI) => {
        row.forEach((col, colI) => {
            const emoji = emojis[col]
            const posX = Number(elementSize * (colI + 1)).toFixed(3)
            const posY = Number(elementSize * (rowI + 1)).toFixed(3)

            if(col == 'O') {
                if(!playerPosition.x && !playerPosition.y) {
                    playerPosition.x = posX
                    playerPosition.y = posY
                    console.log({posX, posY, playerPosition});
                }
            } else if (col == 'I')  {
                giftPosition.x = posX
                giftPosition.y = posY
            } else if (col == 'X') {
                arrayBombPosition.push({x: posX, y: posY})
            }
            
            game.fillText(emoji, posX, posY)
        });
    });
    
    movePlayer()

    // for (let row = 1; row <= 10; row++) {
    //     for (let col = 1; col <= 10; col++) {
    //         game.fillText(emojis[mapCols[row-1][col-1]], elementSize * col+8, elementSize * row-5)
    //     }
    // }
}

function movePlayer() {
    const giftCollisionX = playerPosition.x == giftPosition.x
    const giftCollisionY = playerPosition.y == giftPosition.y
    const giftCollision = giftCollisionX && giftCollisionY

    if ( giftCollision) {
        levelWin()
    }

    // let bombCollision = false
    // arrayBombPosition.forEach(element => {
    //     if (element.x == playerPosition.x && element.y == playerPosition.y) {
    //         bombCollision = true;
    //     }
    // });

    const bombCollision = arrayBombPosition.find(bomba => {
        return (bomba.x == playerPosition.x && bomba.y == playerPosition.y)
    })

    if (bombCollision) {
        levelFail()
    }

    game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y)
}

function levelWin() {
    console.log('Subiste de nivel!')
    level++
    startGame()
}

function showLives() {
    const vidas = Array(lives).fill("💖")

    spanLives.innerHTML = ""

    vidas.forEach(element => {
        spanLives.innerHTML += element
    });
}

function showRecord() {
    spanRecord.innerHTML = '🏁 '+ localStorage.getItem('record_time')
}

function showTimes() {
    spanTimes.innerHTML = '⏱ ' + (Date.now() - timeStart)
}

function levelFail() {
    console.log('Colision con bomba');
    lives--

    console.log(lives);

    if(lives == 0) {
        level = 0
        lives = 3
        timeStart = undefined
    } 
    playerPosition.x = undefined
    playerPosition.y = undefined
    startGame()
}

function gameWin() {
    pResult.innerHTML = 'Terminaste el juego';
    clearInterval(timeInterval)

    const recordTime = localStorage.getItem('record_time')
    const playerTime = Date.now() - timeStart
    
    if (recordTime) {
        if(recordTime > playerTime) {
            localStorage.setItem('record_time', playerTime)
            pResult.innerHTML = 'Superaste el record';
        } 
    } else {
        localStorage.setItem('record_time', playerTime)
    }
}

function moveByKeys(event) {
    elementSize = parseFloat(elementSize)
    newPosition = parseFloat(newPosition)

    switch (event.key) {
        case 'ArrowUp':
            moveUp()
            break;

        case 'ArrowLeft':
            moveLeft()
            break;

        case 'ArrowRight':
            moveRight()
            break;
        
        case 'ArrowDown':
            moveDown()
            break;
                        
        default:
            break;
    }
}

function moveUp() {
    newPosition = Number((playerPosition.y - elementSize).toFixed(3))
    console.log({
        playerPosition,
        newPosition,
        elementSize
    });

    if (newPosition < elementSize) {
        console.log('Barrera superior');
    } else {
        console.log('Me quiero mover hacia arriba');
        playerPosition.y = newPosition
        startGame()
    }
}
function moveLeft() {
    newPosition = Number((playerPosition.x - elementSize).toFixed(3))
    console.log({
        playerPosition,
        newPosition,
        elementSize
    });

    if (newPosition < elementSize) {
        console.warn('Barrera izquierda');
    } else {
        console.log('Me quiero mover hacia izquierda');
        playerPosition.x = newPosition
        startGame()
    }
}
function moveRight() {
    newPosition =  Number((parseFloat(playerPosition.x) + parseFloat(elementSize )).toFixed(3))
    console.log({
        playerPosition,
        newPosition,
        elementSize
    });
    if (newPosition > canvasSize) {
        console.warn('Barrera derecha');
    } else {
        console.log('Me quiero mover hacia derecha');
        playerPosition.x = newPosition
        startGame()
    }
}
function moveDown() {
    newPosition = Number((parseFloat(playerPosition.y) + parseFloat(elementSize)).toFixed(3))
    console.log({
        playerPosition,
        newPosition,
        elementSize
    });
    if (newPosition > canvasSize) {
        console.warn('Barrera inferior');
    } else {
        console.log('Me quiero mover hacia abajo');
        playerPosition.y = newPosition
        startGame()
    }
}

