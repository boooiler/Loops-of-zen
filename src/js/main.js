const board = document.getElementById("board")
const counterDiv = document.getElementById("counter")
let markerPosition = {
    x: 0, y: 0
}
let currentLevel = 0
let boardElements = []
let completedLevels = []

document.addEventListener("DOMContentLoaded", () => {
    loadGame(currentLevel)

    document.addEventListener("keyup", onKeyUp, false)
})

const loadGame = (level) => {
    console.log('level: ', level)
    board.innerHTML = ""
    counterDiv.innerHTML = `Level: ${completedLevels.length + 1} / ${allLevels.length}`
    boardElements = []
    markerPosition = { x: 0, y: 0 }

    for (let i = 0; i < allLevels[level].default.length; i++) {
        const t = []
        boardElements.push(t)

        for (let j = 0; j < allLevels[level].default[i].length; j++) {
            const img = document.createElement("img")
            const boxSize = 70
            const positionX = boxSize * j
            const positionY = boxSize * i

            img.setAttribute("style", `
                position: absolute; 
                left: ${positionX}px; 
                top: ${positionY}px; 
                width: ${boxSize}px; 
                height: ${boxSize}px;
            `)

            img.classList.add("image")
            img.id = `${i}${j}`
            img.src = `images/box${allLevels[level].default[i][j]}.png`
            t.push(img)

            switch (allLevels[level].rotation[i][j]) {
                case 1:
                    img.className += " rotated-image"
                    break

                case 2:
                    img.className += " rotated-image2"
                    break

                case 3:
                    img.className += " rotated-image3"
                    break
            }

            boardElements[0][0].style.background = 'rgba(0, 255, 0, 0.4)'

            board.appendChild(img)
        }
    }

    const boardWidth = boardElements[0].length * 70
    const boardHeight = boardElements.length * 70
    board.style.width = `${boardWidth}px`
    board.style.height = `${boardHeight}px`
}

const handleImgClick = (clickedImg) => {
    const id = clickedImg.id
    const i = Number(id[0])
    const j = Number(id[1])
    const level = allLevels[currentLevel]
    let rotation = level.rotation[i][j]

    if (level.default[i][j] === 0) return

    const rotatedClasses = ["rotated-image", "rotated-image2", "rotated-image3", "rotated-image4"]
    const currentClassIndex = rotatedClasses.indexOf(clickedImg.classList[1])
    const newClassIndex = (currentClassIndex + 1) % 4
    clickedImg.classList.remove(rotatedClasses[currentClassIndex])
    clickedImg.classList.add(rotatedClasses[newClassIndex])

    level.rotation[i][j] = (rotation + 1) % 4

    checkEndLevel()
}

const checkEndLevel = () => {
    const level = allLevels[currentLevel]

    for (let i = 0; i < level.default.length; i++) {
        for (let j = 0; j < level.default[i].length; j++) {
            const block = level.default[i][j]
            const currentRotation = level.rotation[i][j]
            const targetRotation = level.result[i][j]

            if (block != 0) { // skip empty blocks
                if (currentRotation != targetRotation) { // check rotation
                    if (block == 2) { // if is straight block   
                        const isCorrectRotation = ( // check if it is vertical or horizontal
                            (currentRotation === 0 && targetRotation === 2) ||
                            (currentRotation === 2 && targetRotation === 0) ||
                            (currentRotation === 1 && targetRotation === 3) ||
                            (currentRotation === 3 && targetRotation === 1)
                        )

                        if (!isCorrectRotation) {
                            return
                        }
                    } else {
                        return
                    }
                }
            }
        }
    }
    completedLevels.push(currentLevel)

    checkEndGame()
}

const checkEndGame = () => {
    if (completedLevels.length < allLevels.length) {
        let isReapeted = false
        do {
            isReapeted = false
            randomLevel = Math.floor(Math.random() * allLevels.length)
            for (let i = 0; i < completedLevels.length; i++) {
                if (randomLevel == completedLevels[i]) {
                    randomLevel = Math.floor(Math.random() * allLevels.length)
                    isReapeted = true
                    break
                }
            }

        }
        while (isReapeted)
        currentLevel = randomLevel
        loadGame(currentLevel)
    } else {
        document.getElementById("board").remove()
        document.getElementById("instructions").remove()
        console.warn("End of levels")
        console.warn("You won the game!")
        const endGameImage = document.createElement("img")
        endGameImage.className += "win"
        endGameImage.src = "images/win.png"
        document.body.appendChild(endGameImage)
    }
}

const onKeyUp = (event) => {
    const keyCode = event.which
    boardElements[markerPosition.y][markerPosition.x].style.background = "rgba(0,0,0,0.0)"

    switch (keyCode) {
        case 32:
            handleImgClick(boardElements[markerPosition.y][markerPosition.x])
            break
        case 38:
            // console.log("pressed up")
            if (markerPosition.y > 0) markerPosition.y--
            break
        case 40:
            // console.log("pressed down")
            if (markerPosition.y < boardElements.length - 1) markerPosition.y++
            break
        case 37:
            // console.log("pressed left")
            if (markerPosition.x > 0) markerPosition.x--
            break
        case 39:
            // console.log("pressed right")
            if (markerPosition.x < boardElements[0].length - 1) markerPosition.x++
            break
    }
    boardElements[markerPosition.y][markerPosition.x].style.backgroundColor = "rgba(0, 255, 0, 0.4)"
}