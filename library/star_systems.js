StarSystems = function(app) {
    this.app = app
    this.ctx = app.ctx
    this.gfx = app.gfx

    this.systems = []
    this.nrOfSystems = 10

    this.AMFlows = []
    this.isDrawingAMFlow = false
    this.AMFlowSource = undefined

    this.SMFlows = []
    this.isDrawingSMFlow = false
    this.SMFlowSource = undefined

    this.boundingBox = [200, 320]

    this.c_maxAMFlow = 1e4
    this.c_maxSMFlow = 1e5
    this.c_AMFlowCost = 5e2
    this.c_AMFlowCost2 = 1e-1
    this.c_SMFlowCost = 5e-3
    this.c_minFlux = 3e5
    this.c_fluxRate = 2e-2
    this.c_AMProductionRate = 3e-3
    this.c_dyswarmCostAM = 1e5
    this.c_dyswarmCostSM = 1e6
    this.c_qpinchCostAM = 8e7
    this.c_qpinchCostSM = this.c_dyswarmCostSM * 10

    this.init()
}

StarSystems.prototype.init = function() {
    var nrCreated = 0
    while (nrCreated < this.nrOfSystems) {
        newSystem = {}
        isValid = true

        newSystem.resources = {}
        newSystem.resources.flux = 1e6
        newSystem.resources.am = 0
        newSystem.resources.sm = (1 + 0.4 * Math.random() - 0.2) * this.c_dyswarmCostSM
        newSystem.resources.se = (1 + 0.4 * Math.random() - 0.2) * 1e9
        newSystem.producesAM = false
        newSystem.hasBuilding = false

        if (nrCreated == 0) {
            newSystem.x = 50
            newSystem.y = 50
            newSystem.name = "Alpha Black"
            newSystem.colorAura = [255, 255, 255]
            newSystem.colorBody = [0, 0, 0]
            newSystem.resources.se = 0
            newSystem.resources.am = 2 * this.c_dyswarmCostAM
            newSystem.resources.sm = 12 * this.c_dyswarmCostSM
            newSystem.resources.flux = 0
        } else {
            newSystem.x = Math.random() * 1600 - 800
            newSystem.y = Math.random() * 1200 - 600
            newSystem.name = this.createName()
            newSystem.colorAura = [255, 50, 0]
            newSystem.colorBody = [255, 50, 50]
        }

        for (var i = 0; i < this.systems.length; i++) {
            if (
                (
                    (
                        (newSystem.x + this.boundingBox[0] >= this.systems[i].x
                            && newSystem.x + this.boundingBox[0] <= this.systems[i].x + this.boundingBox[0]
                        )
                        || (newSystem.x >= this.systems[i].x
                            && newSystem.x <= this.systems[i].x + this.boundingBox[0]
                        )
                    )
                    && (
                        (newSystem.y + this.boundingBox[1] >= this.systems[i].y
                            && newSystem.y + this.boundingBox[1] <= this.systems[i].y + this.boundingBox[1]
                        )
                        || (newSystem.y >= this.systems[i].y
                            && newSystem.y <= this.systems[i].y + this.boundingBox[1]
                        )
                    )
                )
                || newSystem.name == this.systems[i].name
            ) {
                isValid = false
            }
        }

        if (isValid) {
            this.systems[this.systems.length] = newSystem
            nrCreated++
        }
    }
}

StarSystems.prototype.createName = function() {
    letters = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon", "Zeta", "Eta",
        "Theta", "Iota", "Kappa", "Lambda", "Mu", "Nu", "Xi", "Omikron", "Pi",
        "Rho", "Sigma", "Tau", "Upsilion", "Phi", "Xi", "Psi", "Omega"]
    colors = ["Black", "White", "Red", "Blue", "Yellow", "Violet", "Green", "Magenta",
        "Cyan", "Orange", "Brown", "Pink", "Grey", "Amber", "Lavender", "Lime",
        "Navy", "Ochre", "Scarlet"]

    return letters[Math.floor(Math.random() * letters.length)] + " "
            + colors[Math.floor(Math.random() * colors.length)]
}

StarSystems.prototype.draw = function() {
    for (var i = 0; i < this.nrOfSystems; i++) {
        var x = this.app.shiftX + this.systems[i].x
        var y = this.app.shiftY + this.systems[i].y

        // Draw bounding box
        this.ctx.strokeStyle = "#ffffff"
        this.ctx.fillStyle = "#ffffff"
        this.ctx.lineWidth = 2
        this.ctx.beginPath()
        this.ctx.moveTo(x, y)
        this.ctx.lineTo(x + this.boundingBox[0], y)
        this.ctx.lineTo(x + this.boundingBox[0], y + this.boundingBox[1])
        this.ctx.lineTo(x, y + this.boundingBox[1])
        this.ctx.closePath()
        this.ctx.stroke()

        // Write name
        this.ctx.fillText(this.systems[i].name, x + 10, y + 20)

        // Write resources
        this.ctx.fillText("Fx: " + this.systems[i].resources.flux.toExponential(2), x + 10, y + 120)
        this.ctx.fillText("AM: " + this.systems[i].resources.am.toExponential(2), x + 10, y + 140)
        this.ctx.fillText("SM: " + this.systems[i].resources.sm.toExponential(2), x + 10, y + 160)

        // Draw aura
        var grad = this.app.ctx.createRadialGradient(x + 100, y + 60, 0, x + 100, y + 60, 30)
        var c = this.systems[i].colorAura
        grad.addColorStop(0, 'rgba(' + c[0] + ','+ c[1] + ',' + c[2] + ',0.6)')
        grad.addColorStop(1, 'rgba(' + c[0] + ','+ c[1] + ',' + c[2] + ',0.0)')
        this.gfx.circle(x + 100, y + 60, 30, grad, 1, true)

        // Draw body
        c = this.systems[i].colorBody
        this.gfx.circle(x + 100, y + 60, 15, 'rgba(' + c[0] + ','+ c[1] + ',' + c[2] + ',1.0)', 1, true)

        this.ctx.fillStyle = "#ffffff"

        // Draw AM inflow/outflow sockets
        this.ctx.fillText("AM Flow:", x + 10, y + 205)
        this.gfx.circle(x + 120, y + 200, 15, "#ffffff", 2, false)
        this.gfx.circle(x + 170, y + 200, 15, "#ffffff", 2, false)

        // Draw SM inflow/outflow sockets
        this.ctx.fillText("SM Flow:", x + 10, y + 245)
        this.gfx.circle(x + 120, y + 240, 15, "#ffffff", 2, false)
        this.gfx.circle(x + 170, y + 240, 15, "#ffffff", 2, false)

        // Draw building buttons
        this.ctx.beginPath()
        this.ctx.moveTo(x + 10, y + 275)
        this.ctx.lineTo(x + this.boundingBox[0] - 10, y + 275)
        this.ctx.lineTo(x + this.boundingBox[0] - 10, y + 305)
        this.ctx.lineTo(x + 10, y + 305)
        this.ctx.closePath()
        this.ctx.stroke()

        if (i == 0) {
            if (this.systems[i].hasBuilding) {
                this.ctx.fillText("Has Q-Pinch", x + 15, y + 295)
            } else {
                this.ctx.fillText("Build Q-Pinch", x + 15, y + 295)
            }
        } else {
            if (this.systems[i].hasBuilding) {
                this.ctx.fillText("Has Dyswarm", x + 15, y + 295)
            } else {
                this.ctx.fillText("Build Dyswarm", x + 15, y + 295)
            }
        }
    }

    this.ctx.fillStyle = "#8080ff"
    this.ctx.strokeStyle = "#8080ff"
    this.ctx.lineWidth = 4

    // Draw current AM flow line
    if (this.isDrawingAMFlow) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.AMFlowSource.x + 170 + this.app.shiftX, this.AMFlowSource.y + 200 + this.app.shiftY)
        this.ctx.lineTo(this.app.input.mousePos[0], this.app.input.mousePos[1])
        this.ctx.closePath()
        this.ctx.stroke()
    }

    // Draw existing AM flow lines
    for (var i = 0; i < this.AMFlows.length; i++) {
        this.ctx.fillStyle = "#8080ff"
        this.ctx.strokeStyle = "#8080ff"
        this.ctx.lineWidth = 4

        // Line
        var from = [this.AMFlows[i][0].x + 170 + this.app.shiftX, this.AMFlows[i][0].y + 200 + this.app.shiftY]
        var to = [this.AMFlows[i][1].x + 120 + this.app.shiftX, this.AMFlows[i][1].y + 200 + this.app.shiftY]
        this.ctx.beginPath()
        this.ctx.moveTo(from[0], from[1])
        this.ctx.lineTo(to[0], to[1])
        this.ctx.closePath()
        this.ctx.stroke()

        // Cancel symbol
        this.gfx.circle(
            from[0] + 0.5 * (to[0] - from[0]),
            from[1] + 0.5 * (to[1] - from[1]),
            10, "#8080ff", 1, true
        )
        this.ctx.strokeStyle = "#000000"
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(from[0] + 0.5 * (to[0] - from[0]) - 3, from[1] + 0.5 * (to[1] - from[1]) - 3)
        this.ctx.lineTo(from[0] + 0.5 * (to[0] - from[0]) + 3, from[1] + 0.5 * (to[1] - from[1]) + 3)
        this.ctx.moveTo(from[0] + 0.5 * (to[0] - from[0]) - 3, from[1] + 0.5 * (to[1] - from[1]) + 3)
        this.ctx.lineTo(from[0] + 0.5 * (to[0] - from[0]) + 3, from[1] + 0.5 * (to[1] - from[1]) - 3)
        this.ctx.stroke()
    }

    this.ctx.fillStyle = "#80ff80"
    this.ctx.strokeStyle = "#80ff80"
    this.ctx.lineWidth = 4

    // Draw current SM flow line
    if (this.isDrawingSMFlow) {
        this.ctx.beginPath()
        this.ctx.moveTo(this.SMFlowSource.x + 170 + this.app.shiftX, this.SMFlowSource.y + 240 + this.app.shiftY)
        this.ctx.lineTo(this.app.input.mousePos[0], this.app.input.mousePos[1])
        this.ctx.closePath()
        this.ctx.stroke()
    }

    // Draw existing SM flow lines
    for (var i = 0; i < this.SMFlows.length; i++) {
        this.ctx.fillStyle = "#80ff80"
        this.ctx.strokeStyle = "#80ff80"
        this.ctx.lineWidth = 4

        // Line
        var from = [this.SMFlows[i][0].x + 170 + this.app.shiftX, this.SMFlows[i][0].y + 240 + this.app.shiftY]
        var to = [this.SMFlows[i][1].x + 120 + this.app.shiftX, this.SMFlows[i][1].y + 240 + this.app.shiftY]
        this.ctx.beginPath()
        this.ctx.moveTo(from[0], from[1])
        this.ctx.lineTo(to[0], to[1])
        this.ctx.closePath()
        this.ctx.stroke()

        // Cancel symbol
        this.gfx.circle(
            from[0] + 0.5 * (to[0] - from[0]),
            from[1] + 0.5 * (to[1] - from[1]),
            10, "#80ff80", 1, true
        )
        this.ctx.strokeStyle = "#000000"
        this.ctx.lineWidth = 1
        this.ctx.beginPath()
        this.ctx.moveTo(from[0] + 0.5 * (to[0] - from[0]) - 3, from[1] + 0.5 * (to[1] - from[1]) - 3)
        this.ctx.lineTo(from[0] + 0.5 * (to[0] - from[0]) + 3, from[1] + 0.5 * (to[1] - from[1]) + 3)
        this.ctx.moveTo(from[0] + 0.5 * (to[0] - from[0]) - 3, from[1] + 0.5 * (to[1] - from[1]) + 3)
        this.ctx.lineTo(from[0] + 0.5 * (to[0] - from[0]) + 3, from[1] + 0.5 * (to[1] - from[1]) - 3)
        this.ctx.stroke()
    }
}

StarSystems.prototype.handleMouseClick = function(ev) {
    var x = ev.layerX - this.app.shiftX
    var y = ev.layerY - this.app.shiftY

    // AM Flow lines cancel symbol
    for (var i = 0; i < this.AMFlows.length; i++) {
        var from = [this.AMFlows[i][0].x + 170 + this.app.shiftX, this.AMFlows[i][0].y + 200 + this.app.shiftY]
        var to = [this.AMFlows[i][1].x + 120 + this.app.shiftX, this.AMFlows[i][1].y + 200 + this.app.shiftY]
        var cx = from[0] + 0.5 * (to[0] - from[0]) - this.app.shiftX
        var cy = from[1] + 0.5 * (to[1] - from[1]) - this.app.shiftY
        var distance = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy))

        if (distance <= 7) {
            this.AMFlows.splice(i, 1)
        }
    }

    // AM Flow lines cancel symbol
    for (var i = 0; i < this.SMFlows.length; i++) {
        var from = [this.SMFlows[i][0].x + 170 + this.app.shiftX, this.SMFlows[i][0].y + 240 + this.app.shiftY]
        var to = [this.SMFlows[i][1].x + 120 + this.app.shiftX, this.SMFlows[i][1].y + 240 + this.app.shiftY]
        var cx = from[0] + 0.5 * (to[0] - from[0]) - this.app.shiftX
        var cy = from[1] + 0.5 * (to[1] - from[1]) - this.app.shiftY
        var distance = Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy))

        if (distance <= 7) {
            this.SMFlows.splice(i, 1)
        }
    }

    for (var i = 0; i < this.nrOfSystems; i++) {
        // Drawing AM flow lines
        if (this.isDrawingAMFlow) {
            var distance = Math.sqrt(
                (x - this.systems[i].x - 120) * (x - this.systems[i].x - 120)
                + (y - this.systems[i].y - 200) * (y - this.systems[i].y - 200)
            )

            if (distance <= 15 && this.systems[i].name != this.AMFlowSource.name) {
                this.isDrawingAMFlow = false
                this.AMFlows[this.AMFlows.length] = [this.AMFlowSource, this.systems[i]]
                this.AMFlowSource = undefined
            }
        } else {
            var distance = Math.sqrt(
                (x - this.systems[i].x - 170) * (x - this.systems[i].x - 170)
                + (y - this.systems[i].y - 200) * (y - this.systems[i].y - 200)
            )

            if (distance <= 15) {
                this.isDrawingAMFlow = true
                this.AMFlowSource = this.systems[i]
            }
        }

        // Drawing SM flow lines
        if (this.isDrawingSMFlow) {
            var distance = Math.sqrt(
                (x - this.systems[i].x - 120) * (x - this.systems[i].x - 120)
                + (y - this.systems[i].y - 240) * (y - this.systems[i].y - 240)
            )

            if (distance <= 15 && this.systems[i].name != this.SMFlowSource.name) {
                this.isDrawingSMFlow = false
                this.SMFlows[this.SMFlows.length] = [this.SMFlowSource, this.systems[i]]
                this.SMFlowSource = undefined
            }
        } else {
            var distance = Math.sqrt(
                (x - this.systems[i].x - 170) * (x - this.systems[i].x - 170)
                + (y - this.systems[i].y - 240) * (y - this.systems[i].y - 240)
            )

            if (distance <= 15) {
                this.isDrawingSMFlow = true
                this.SMFlowSource = this.systems[i]
            }
        }

        // Building button
        if(!this.isDrawingAMFlow && !this.isDrawingSMFlow) {
            if (
                x >= this.systems[i].x + 10
                && x <= this.systems[i].x + this.boundingBox[0] - 10
                && y >= this.systems[i].y + 275
                && y <= this.systems[i].y + 305
            ) {
                if (i == 0) {
                    if (
                        !this.systems[i].hasBuilding
                        && this.systems[i].resources.am >= this.c_qpinchCostAM
                        && this.systems[i].resources.sm >= this.c_qpinchCostSM
                    ) {
                        this.systems[i].resources.am -= this.c_qpinchCostAM
                        this.systems[i].resources.sm -= this.c_qpinchCostSM
                        this.systems[i].hasBuilding = true
                        this.app.triggerWin()
                    }

                } else {
                    if (
                        !this.systems[i].hasBuilding
                        && this.systems[i].resources.am >= this.c_dyswarmCostAM
                        && this.systems[i].resources.sm >= this.c_dyswarmCostSM
                    ) {
                        this.systems[i].resources.am -= this.c_dyswarmCostAM
                        this.systems[i].resources.sm -= this.c_dyswarmCostSM
                        this.systems[i].producesAM = true
                        this.systems[i].hasBuilding = true
                    }
                }
            }
        }
    }
}

StarSystems.prototype.checkFlowsForSystem = function(nr) {
    remainingFlux = this.systems[nr].resources.flux

    for (var i = 0; i < this.SMFlows.length; i++) {
        if (this.SMFlows[i][0].name == this.systems[nr].name) {
            var smTransfer = Math.min(this.c_maxSMFlow, this.systems[nr].resources.sm)
            if (smTransfer * this.c_SMFlowCost < this.systems[nr].resources.am) {
                this.systems[nr].resources.am -= smTransfer * this.c_SMFlowCost
                this.systems[nr].resources.sm -= smTransfer
                this.SMFlows[i][1].resources.sm += smTransfer
            }
        }
    }

    for (var i = 0; i < this.AMFlows.length; i++) {
        if (this.AMFlows[i][0].name == this.systems[nr].name) {
            var amTransfer = Math.min(this.c_maxAMFlow, this.systems[nr].resources.am)
            if (remainingFlux > amTransfer * this.c_AMFlowCost) {
                remainingFlux -= Math.max(0, amTransfer * this.c_AMFlowCost)
                this.systems[nr].resources.am -= amTransfer
                this.AMFlows[i][1].resources.am += amTransfer
            } else {
                this.systems[nr].resources.am -= amTransfer
                amTransfer -= (amTransfer - remainingFlux / this.c_AMFlowCost) * this.c_AMFlowCost2
                this.AMFlows[i][1].resources.am += amTransfer
                remainingFlux = 0
            }
        }
    }

    return remainingFlux
}

StarSystems.prototype.update = function() {
    for (var i = 0; i < this.nrOfSystems; i++) {
        this.systems[i].resources.se -= this.systems[i].resources.flux * this.app.simSpeed / this.app.framerate
        this.systems[i].resources.flux = Math.max(this.c_minFlux, this.c_fluxRate * this.systems[i].resources.se)

        if (this.systems[i].resources.se <= 0) {
            this.systems[i].resources.se = 0
            this.systems[i].resources.flux = 0
        }

        remainingFlux = this.checkFlowsForSystem(i)

        if (this.systems[i].producesAM && this.systems[i].hasBuilding) {
            this.systems[i].resources.am += this.c_AMProductionRate * remainingFlux
        }
    }
}