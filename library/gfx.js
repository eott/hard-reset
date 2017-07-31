GFX = function(app) {
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
