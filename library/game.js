App = function() {
    this.can = document.getElementById("screen")
    this.ctx = this.can.getContext("2d")

    this.shiftX = 0
    this.shiftY = 0

    this.input = new Input(this)
    this.gfx = new GFX(this)
    this.systems = new StarSystems(this)

    this.framerate = 20
    this.simSpeed = 1
    this.fadeProgress = 0
    this.fadeSpeed = 1 / (5 * this.framerate)

    this.gameIsWon = false

    this.loop = window.setInterval('app.gameLoop()', 1000 / this.framerate);
}

App.prototype.gameLoop = function() {
    this.draw()
    this.systems.update()

    if (this.gameIsWon) {
        this.fadeProgress += this.fadeSpeed
    }
}

App.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.can.width, this.can.height)

    this.ctx.font = "17px Consolas"
    this.ctx.fillStyle = "#ffffff"
    this.ctx.strokeStyle = "#ffffff"
    this.ctx.lineWidth = 1

    this.systems.draw()
    this.gfx.drawMinimap(this.systems.systems)

    if (this.gameIsWon) {
        if (this.fadeProgress < 1) {
            this.gfx.drawFade(this.fadeProgress)
        } else {
            this.gfx.drawEndScreen()
        }
    }
}

App.prototype.triggerWin = function() {
    this.gameIsWon = true
}