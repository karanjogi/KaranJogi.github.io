function modifyCircle() {
    var Circle = document.getElementById("orange-circle")
    var color = Circle.getAttribute("fill")

    if (color == "orange") Circle.setAttribute("fill", "#ff0212")
    else Circle.setAttribute("fill", "orange")
}

function modifyRectangle() {
    var rectange = document.getElementById("blue-rectangle")
    var rx = rectange.getAttribute("rx")
    var ry = rectange.getAttribute("ry")

    if(rx == "200") rectange.setAttribute("rx", "0")
    else rectange.setAttribute("rx", "200")

    if(ry == "200") rectange.setAttribute("ry", "0")
    else rectange.setAttribute("ry", "200")
}

function modifyEllipse() {
    var ellipse = document.getElementById("yellow-ellipse")
    opacity = ellipse.getAttribute("opacity")

    if (opacity == "-1") ellipse.setAttribute("opacity", "0.5")
    else ellipse.setAttribute("opacity", "-1")
    
}