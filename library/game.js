App = function() {
    this.can = document.getElementById("screen")
    this.ctx = this.can.getContext("2d")

    this.shiftX = 0
    this.shiftY = 0

    this.input = new Input(this)
    this.gfx = new GFX(this)
    this.systems = new StarSystems(this)

    this.loop = window.setInterval('app.gameLoop()', 50);
}

App.prototype.gameLoop = function() {
    this.draw()
}

App.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.can.width, this.can.height)

    this.ctx.font = "17px Consolas"
    this.ctx.fillStyle = "#ffffff"
    this.ctx.strokeStyle = "#ffffff"

    this.systems.draw()
}