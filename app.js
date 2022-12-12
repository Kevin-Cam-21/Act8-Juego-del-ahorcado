function app() {

    canvas = document.getElementById("lienzo");
    
    /* Variables */
    var g=0;
    var p=0;
    var ctx;
    var canvas;
    var palabra;
    var letras = "QWERTYUIOPASDFGHJKLÑZXCVBNM";
    var colorTecla = "#585858";
    var colorMargen = "red";
    var inicioX = 250;
    var inicioY = 350;
    var lon = 35;
    var margen = 20;
    const audio = new Audio("./meta.mp3");
    const audioPerdido = new Audio("./audioEmpate.mp3");


    /* Arreglos */
    var teclas_array = new Array();
    var letras_array = new Array();
    var palabras_array = new Array();

    /* Variables de control */
    var aciertos = 0;
    var errores = 0;

    /* Palabras */
    palabras_array.push("LEON");
    palabras_array.push("CABALLO");
    palabras_array.push("PERRO");
    palabras_array.push("GATO");
    palabras_array.push("LAGARTIJA");
    palabras_array.push("RINOCERONTE");
    palabras_array.push("TIBURON");
    palabras_array.push("CARACOL");
    palabras_array.push("ALACRAN");
    palabras_array.push("ARAÑA");
    palabras_array.push("CHAPULIN");
    palabras_array.push("AVESTRUZ");
    palabras_array.push("OCELOTE");
    palabras_array.push("MUSARAÑA");
    palabras_array.push("AGUILA");

    /* Objetos */
    function Tecla(x, y, ancho, alto, letra) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.letra = letra;
        this.dibuja = juegoAhorcado.dibujaTecla;
    }

    function Letra(x, y, ancho, alto, letra) {
        this.x = x;
        this.y = y;
        this.ancho = ancho;
        this.alto = alto;
        this.letra = letra;
        this.dibuja = juegoAhorcado.dibujaCajaLetra;
        this.dibujaLetra = juegoAhorcado.dibujaLetraLetra;
    }


    const juegoAhorcado = {
        /* Funciones */

        /* Dibujar Teclas*/
        dibujaTecla: function () {
            ctx.fillStyle = colorTecla;
            ctx.strokeStyle = colorMargen;
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);

            ctx.fillStyle = "white";
            ctx.font = "bold 20px courier";
            ctx.fillText(this.letra, this.x + this.ancho / 2 - 5, this.y + this.alto / 2 + 5);
        },

        /* Dibua la letra y su caja */
        dibujaLetraLetra: function () {
            var w = this.ancho;
            var h = this.alto;
            ctx.fillStyle = "black";
            ctx.font = "bold 40px Courier";
            ctx.fillText(this.letra, this.x + w / 2 - 12, this.y + h / 2 + 14);
        },
        dibujaCajaLetra: function () {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
        },

        /* Distribuir nuestro teclado con sus letras respectivas al acomodo de nuestro array */
        teclado: function () {
            var ren = 0;
            var col = 0;
            var letra = "";
            var miLetra;
            var x = inicioX;
            var y = inicioY;
            for (var i = 0; i < letras.length; i++) {
                letra = letras.substr(i, 1);
                miLetra = new Tecla(x, y, lon, lon, letra);
                miLetra.dibuja();
                teclas_array.push(miLetra);
                x += lon + margen;
                col++;
                if (col == 10) {
                    col = 0;
                    ren++;
                    if (ren == 2) {
                        x = 280;
                    } else {
                        x = inicioX;
                    }
                }
                y = inicioY + ren * 50;
            }
        },


        /* aqui obtenemos nuestra palabra aleatoriamente y la dividimos en letras */
        pintaPalabra: function () {
            var p = Math.floor(Math.random() * palabras_array.length);
            palabra = palabras_array[p];


            var w = canvas.width;
            var len = palabra.length;
            var ren = 0;
            var col = 0;
            var y = 280;
            var lon = 50;
            var x = (w - (lon + margen) * len) / 2;
            for (var i = 0; i < palabra.length; i++) {
                letra = palabra.substr(i, 1);
                miLetra = new Letra(x, y, lon, lon, letra);
                miLetra.dibuja();
                letras_array.push(miLetra);
                x += lon + margen;
            }
        },

        /* dibujar cadalzo y partes del pj segun sea el caso */
        horca: function (errores) {
            var imagen = new Image();
            imagen.src = "imagenes/ilustrado" + errores + ".png";
            imagen.onload = function () {
                ctx.drawImage(imagen, 460, 30, 230, 260);
            }
            /*************************************************
            // Imagen 2 mas pequeña a un lado de la horca //       
            var imagen = new Image();
            imagen.src = "imagenes/ahorcado"+errores+".png";
            imagen.onload = function(){
                ctx.drawImage(imagen, 620, 0, 100, 100);
            }
            *************************************************/
        },

        /* ajustar coordenadas */
        ajusta: function (xx, yy) {
            var posCanvas = canvas.getBoundingClientRect();
            var x = xx - posCanvas.left;
            var y = yy - posCanvas.top;
            return { x: x, y: y }
        },

        /* Detecta tecla clickeada y la compara con las de la palabra ya elegida al azar */
        selecciona: function (e) {
            var x = e.offsetX;
            var y = e.offsetY;

            var coordenadas = document.getElementById("cordenadas");
            coordenadas.innerHTML = "cordenadas:  X: " + x + " Y: " + y;

            var pos = juegoAhorcado.ajusta(e.clientX, e.clientY);
            var x = pos.x;
            var y = pos.y;
            var tecla;
            var bandera = false;
            for (var i = 0; i < teclas_array.length; i++) {
                tecla = teclas_array[i];
                if (tecla.x > 0) {
                    if ((x > tecla.x) && (x < tecla.x + tecla.ancho) && (y > tecla.y) && (y < tecla.y + tecla.alto)) {
                        break;
                    }
                }
            }
            if (i < teclas_array.length) {
                for (var i = 0; i < palabra.length; i++) {
                    letra = palabra.substr(i, 1);
                    if (letra == tecla.letra) { /* comparamos y vemos si acerto la letra */
                        caja = letras_array[i];
                        caja.dibujaLetra();
                        aciertos++;
                        bandera = true;
                    }
                }
                if (bandera == false) { /* Si falla aumenta los errores y checa si perdio para mandar a la funcion gameover */
                    errores++;
                    juegoAhorcado.horca(errores);
                    if (errores == 5) juegoAhorcado.gameOver(errores);
                }
                /* Borra la tecla que se a presionado */
                ctx.clearRect(tecla.x - 1, tecla.y - 1, tecla.ancho + 2, tecla.alto + 2);
                tecla.x - 1;
                /* checa si se gano y manda a la funcion gameover */
                if (aciertos == palabra.length) juegoAhorcado.gameOver(errores);
            }
        },

        /* Borramos las teclas y la palabra con sus cajas y mandamos msj segun el caso si se gano o se perdio */
        gameOver: function (errores) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";

            ctx.font = "bold 50px Courier";
            if (errores < 5) {
               g=g+1;
               ctx.fillText(g, 245, 60);
                // ctx.fillText("Muy bien, la palabra es: ", 110, 300);
                audio.play();

                Swal.fire({
                    title: '¡GANASTE!',
                    width: 600,
                    padding: '3em',
                    color: '#fff',
                    // background: '#00c3ff', /* fallback for old browsers */
                    // background: '-webkit-linear-gradient(to right, #00c3ff, #ffff1c)', /* Chrome 10-25, Safari 5.1-6 */
                    // background: 'linear-gradient(to right, #00c3ff, #ffff1c)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */        
                    
                    background: '#0099F7',  /* fallback for old browsers */
                    background: '-webkit-linear-gradient(to right, #F11712, #0099F7)',  /* Chrome 10-25, Safari 5.1-6 */
                    background: 'linear-gradient(to right, #F11712, #0099F7)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    
                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("./confetti3.gif")
                      center top 
                      repeat
                    `
                  })

            } else {
                p=p+1;
                ctx.fillText(p, 425, 60);
                // ctx.fillText("Lo sentimos, la palabra era: ", 110, 300);
                audioPerdido.play()
                Swal.fire({
                    title: '¡PERDISTE!',
                    width: 600,
                    padding: '3em',
                    color: '#fff',
                    background: '#ee0979',  /* fallback for old browsers */
                    background: '-webkit-linear-gradient(to right, #ff6a00, #ee0979)',  /* Chrome 10-25, Safari 5.1-6 */
                    background: 'linear-gradient(to right, #ff6a00, #ee0979)', /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

                    backdrop: `
                      rgba(0,0,123,0.4)
                      url("./gatoMensaje.gif")
                      left top 
                      no-repeat
                    `
                    });
                
            }

            ctx.font = "bold 80px Courier";
            lon = (canvas.width - (palabra.length * 48)) / 2;
            ctx.fillText(palabra, lon, 380);
            juegoAhorcado.horca(errores);
        }
    }

    if (canvas && canvas.getContext) {

        ctx = canvas.getContext("2d");
        if (ctx) {

            juegoAhorcado.teclado();
            juegoAhorcado.pintaPalabra();
            juegoAhorcado.horca(errores);
            canvas.addEventListener("click", juegoAhorcado.selecciona, false);
        } else {
            alert("Error al cargar el contexto!");
        }
    }

}

/* Detectar si se a cargado nuestro contexco en el canvas, iniciamos las funciones necesarias para jugar o se le manda msj de error segun sea el caso */
window.onload = function () {
    app();
}