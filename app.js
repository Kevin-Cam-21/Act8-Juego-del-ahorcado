function app() {

    canvas = document.getElementById("lienzo");

    ctx = canvas.getContext("2d");

    
    /* Variables */
    var g=0;
    var p=0;
    var ctx;
    var canvas;
    var palabra;
    var letras = "QWERTYUIOPASDFGHJKLÑZXCVBNM";
    var colorTecla = "#0A2F5C";
    var colorMargen = "white";
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
    var intentosRestantes = 5;


    /* Palabras */
    palabras_array.push("GUERRERO");
    palabras_array.push("CDMX");
    palabras_array.push("GUADALAJARA");
    palabras_array.push("DURANGO");
    palabras_array.push("GUANAJUATO");
    palabras_array.push("MICHOACAN");
    palabras_array.push("SINALOA");
    palabras_array.push("CHIHUAHUA");
    palabras_array.push("PUEBLA");
    palabras_array.push("TLAXCALA");
    palabras_array.push("OAXACA");
    palabras_array.push("QUERETARO");
    palabras_array.push("EDMX");
    palabras_array.push("MONTERREY");
    palabras_array.push("YUCATAN");
    palabras_array.push("TIJUANA");


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
            ctx.roundRect(this.x, this.y, this.ancho, this.alto, 10);
            ctx.stroke();

            ctx.fillStyle = "white";
            ctx.font = "bold 20px Sansita ";
            ctx.fillText(this.letra, this.x + this.ancho / 2 - 5, this.y + this.alto / 2 + 5);
        },

        /* Dibua la letra y su caja */
        dibujaLetraLetra: function () {
            var w = this.ancho;
            var h = this.alto;
            ctx.fillStyle = "black";
            ctx.font = "bold 40px Sansita ";
            ctx.fillText(this.letra, this.x + w / 2 - 12, this.y + h / 2 + 14);
        },
        // cajas blancas
        dibujaCajaLetra: function () {
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.fillRect(this.x, this.y, this.ancho, this.alto);
            ctx.strokeRect(this.x, this.y, this.ancho, this.alto);
        },

        informacion: function(){

            ctx.font = "bold 30px Sansita ";
            ctx.fillStyle = "#000";

            ctx.fillText(g, 205, 60);
            ctx.fillText(p, 415, 60);
            var r=g+p

            ctx.fillText(r, 830, 56);

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 20px Sansita ";
            ctx.fillText("REINICIAR",50,460);
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(45, 435, 120,35);

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
            juegoAhorcado.informacion();

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

            // MUESTRA COORDENADAS EN PANTALLA
            // var coordenadas = document.getElementById("cordenadas");
            // coordenadas.innerHTML = "cordenadas:  X: " + x + " Y: " + y;

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
                    intentosRestantes-=1;

                    juegoAhorcado.horca(errores);
                    if (errores == 5) juegoAhorcado.gameOver(errores);
                }
                /* Borra la tecla que se a presionado */
                ctx.clearRect(tecla.x - 1, tecla.y - 1, tecla.ancho + 2, tecla.alto + 2);
                tecla.x - 1;
                /* checa si se gano y manda a la funcion gameover */
                if (aciertos == palabra.length) juegoAhorcado.gameOver(errores);
            }
        // funcion para volver a jugar
            if(x > 40 && x < 163 && y > 440 && y < 464){
                window.location.reload();
            }
            // coordenadas del botón "Siguiente palabra"
            if(x > 750 && x < 935 && y > 440 && y < 465){
                juegoAhorcado.palabraSiguiente();
            }
        },


        palabraSiguiente: function (){
            intentosRestantes = 5;
            aciertos = 0;
            errores = 0;
            inicioX = 250;
            inicioY = 350;
            lon = 35;
            margen = 20;
            palabra = "";
            letras_array= new Array();
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            juegoAhorcado.play();
        },
        
        /* Borramos las teclas y la palabra con sus cajas y mandamos msj segun el caso si se gano o se perdio */
        gameOver: function (errores) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "black";

            ctx.font = "bold 50px Sansita ";
            if (errores < 5) {
            //    g=g+1;
            //    ctx.fillText(g, 205, 60);
            //    ctx.fillText(p, 410, 60);

            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 20px Sansita ";
            ctx.fillText("SEGUIR JUGANDO",760,460);
            ctx.fillStyle = "#000";
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(755, 440, 190, 30);
            
                audio.play();
                g=g+1;//aqui agrega el conteo de juego

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

            //   PALABRA EN COLOR VERDE
            ctx.font = "bold 80px Sansita ";
            ctx.fillStyle = "#fdf89d"
            lon = (canvas.width - (palabra.length * 48)) / 2;
            ctx.fillText(palabra, lon, 380);

            } else {
                p=p+1;
                // ctx.fillText(p, 410, 60);
                // ctx.fillText(g, 205, 60);
                // ctx.fillText("Lo sentimos, la palabra era: ", 110, 300);
                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 20px Sansita ";
                ctx.fillText("SEGUIR JUGANDO",760,460);
                ctx.fillStyle = "#000";
                ctx.strokeStyle = "#FFF";
                ctx.strokeRect(755, 440, 190, 30);

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

            //   PALABRA EN COLOR VERDE
            ctx.font = "bold 80px Sansita ";
            ctx.fillStyle = "red"
            lon = (canvas.width - (palabra.length * 48)) / 2;
            ctx.fillText(palabra, lon, 380);
                
            }

            // ctx.font = "bold 80px Sansita ";
            // ctx.fillStyle = "red"
            // lon = (canvas.width - (palabra.length * 48)) / 2;
            // ctx.fillText(palabra, lon, 380);
            ctx.font = "bold 30px Sansita ";
            juegoAhorcado.horca(errores);
        },

        play: function () {
            // Detectar si se a cargado nuestro contexco en el canvas, iniciamos las funciones necesarias para jugar o se le manda msj de error segun sea el caso 
            ctx.clearRect(0, 0, canvas.width, canvas.height);   
                //     ctx = canvas.getContext("2d"); 
            juegoAhorcado.teclado();
                juegoAhorcado.pintaPalabra();
                juegoAhorcado.horca(errores);
                canvas.addEventListener("click", juegoAhorcado.selecciona, false);
        }
    }

    juegoAhorcado.play(true);


    // if (canvas && canvas.getContext) {

    //     ctx = canvas.getContext("2d");
    //     if (ctx) {

    //         juegoAhorcado.teclado();
    //         juegoAhorcado.pintaPalabra();
    //         juegoAhorcado.horca(errores);
    //         canvas.addEventListener("click", juegoAhorcado.selecciona, false);
    //     } else {
    //         alert("Error al cargar el contexto!");
    //     }
    // }

}

/* Detectar si se a cargado nuestro contexco en el canvas, iniciamos las funciones necesarias para jugar o se le manda msj de error segun sea el caso */
window.onload = function () {
    app();
}