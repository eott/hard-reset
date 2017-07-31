GFX = function(app) {
    this.app = app
    this.ctx = app.ctx
}

GFX.prototype.circle = function(x, y, radius, color, width, fill) {
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

GFX.prototype.drawMinimap = function(systems) {
    this.ctx.fillStyle = "#000000"
    this.ctx.strokeStyle = "#999999"
    this.ctx.lineWidth = 3

    // Draw background and outer box
    this.ctx.fillRect(650, 0, 150, 150)
    this.ctx.beginPath()
    this.ctx.moveTo(650, 0)
    this.ctx.lineTo(800, 0)
    this.ctx.lineTo(800, 150)
    this.ctx.lineTo(650, 150)
    this.ctx.closePath()
    this.ctx.stroke()

    // Draw systems
    for (var i = 0; i < systems.length; i++) {
        if (i == 0) {
            this.circle(725 + 150 * systems[i].x / 2000, 75 + 150 * systems[i].y / 2000, 2, "#ff0000", 1, true)
        } else {
            this.circle(725 + 150 * systems[i].x / 2000, 75 + 150 * systems[i].y / 2000, 2, "#ffffff", 1, true)
        }
    }

    // Draw shift rectangle
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = "#888888"
    var dx = 75 - this.app.shiftX * 75 / 1000
    var dy = 75 - this.app.shiftY * 75 / 1000
    this.ctx.beginPath()
    this.ctx.moveTo(650 + dx, 0 + dy)
    this.ctx.lineTo(710 + dx, 0 + dy)
    this.ctx.lineTo(710 + dx, 45 + dy)
    this.ctx.lineTo(650 + dx, 45 + dy)
    this.ctx.closePath()
    this.ctx.stroke()
}

GFX.prototype.drawFade = function(percent) {
    this.ctx.fillStyle = "rgba(0,0,0," + percent + ")"
    this.ctx.fillRect(0, 0, 800 ,600)
}

GFX.prototype.drawEndScreen = function() {
    this.ctx.clearRect(0, 0, 800, 600)

    this.ctx.fillStyle = "#ffffff"
    this.ctx.font = "24px Consolas"
    this.ctx.fillText("You did it! The Q-Pinch worked flawlessly", 120, 200)
    this.ctx.fillText("and the universe gets another chance. It's", 120, 230)
    this.ctx.fillText("just too bad that we can't get any message", 120, 260)
    this.ctx.fillText("across. Maybe we should've written something", 120, 290)
    this.ctx.fillText("into Pi. Oh, well. There's always next time!", 120, 320)
}