function script() {
    var canvas = document.getElementById("pantalla");
    ctx = canvas.getContext("2d");



 
        var imagen = new Image();
        imagen.src = "imagenes/ahorcado(1).png";
        imagen.onload = function () {
            ctx.drawImage(imagen, 390, 0, 230, 230);
        }
}
window.onload = function () {
    script();
    script.imagen;
}
