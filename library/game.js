App = function() {
    this.can = document.getElementById("screen")
    this.ctx = this.can.getContext("2d")

    this.shiftX = 0
    this.shiftY = 0

    this.input = new Input(this)

    this.debugPoints = []
    for (var i = 0; i < 100; i++) {
        this.debugPoints[i] = [Math.random() * 2000 - 1000, Math.random() * 2000 - 1000]
    }

    this.loop = window.setInterval('app.gameLoop()', 50);
}

App.prototype.gameLoop = function() {
    this.draw()
}

App.prototype.circle = function(x, y, radius, color, width, fill) {
    this.ctx.beginPath()
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    this.ctx.lineWidth = width
    this.ctx.strokeStyle = color
    this.ctx.fillStyle = color
    if (fill) {
        this.ctx.fill()
    } else {
        this.ctx.stroke()
    }
}

App.prototype.draw = function() {
    this.ctx.clearRect(0, 0, this.can.width, this.can.height)

    for (var i = 0; i < 100; i++) {
        // Draw aura
        var x = this.shiftX + this.debugPoints[i][0]
        var y = this.shiftY + this.debugPoints[i][1]
        var grad = this.ctx.createRadialGradient(x, y, 0, x, y, 50)
        grad.addColorStop(0, 'rgba(255,40,40,0.2)')
        grad.addColorStop(1, 'rgba(255,40,40,0.0)')
        this.circle(x, y, 50, grad, 1, true)
        // Draw body
        this.circle(x, y, 3, '#ff2828', 1, true)
    }

    this.ctx.font = "17px Consolas"
    this.ctx.fillStyle = "#ffffff"
}