# Entrega - Juego de disparos

Versión: 10 de Enero de 2020

## Objetivo

Practicar con clases, Booleans, Strings y con el manejo de eventos.

## Descripción de la práctica

En esta entrega vamos a desarrollar un juego completo usando HTML, CSS y JavaScript. El juego consiste en un juego clásico de disparos, en el que manejaremos a nuestro personaje (cuadrado) utilizando las flechas del teclado o la pantalla táctil. El objetivo del juego es disparar a una serie de formas que aparecerán en la pantalla para convertirlas en estrellas, a la vez que esquivamos sus disparos. Para comenzar el desarrollo partimos de la versión básica del juego cuyo código proporcionamos.


## Descargar el código del proyecto

El proyecto se descarga en el ordenador local con estos comandos:

El proyecto debe clonarse en el ordenador desde el que se está trabajando

```
$ git clone https://github.com/sonsoleslp/js_shooter_game
```
Entrar en el directorio de trabajo

```
$ cd js_shooter_game
```

## Elementos del juego

En este código, para modelar cada uno de los elementos del juego empleamos una clase JavaScript con sus métodos y atributos, los cuales se describen a continuación:

-  **Entity:** Cada uno de los elementos que se pintan en el juego
-  **Character** : Cada uno de los personajes del juego, es decir, aquellos elementos que tienen "vida". Hereda de la clase _Entity_
-  **Player** : Personaje principal del juego. Hereda de la clase _Character_
-  **Opponent** : Forma a la que tenemos que convertir en estrella
-  **Shot** : Disparo de un _Character_. Hereda de la clase _Entity_
-  **Game** : El propio juego

En el propio código están documentados todos los atributos y métodos de estas clases con detalle.

## Comienzo y actualización del juego

En el fichero ``game.html`` se importan todos los scripts necesarios para el funcionamiento del juego, entre los que figuran todas las clases necesarias y el fichero ``main.js``. En este fichero se definen una serie de constantes necesarias para el juego, se crea una instancia de la clase _Game_ y se llama a su método _start_ para comenzar la partida.

El método _start_ crea los personajes, pinta el juego según el tamaño de la pantalla e inicializa los escuchadores de eventos (los cuales veremos en el siguiente apartado). Adicionalmente, en este método se da comienzo a un temporizador que llama a la función _update_ cada 50 ms para actualizar y pintar el estado del juego actualizado según las acciones del usuario, de los movimientos del oponente y de la posición de los disparos. Este intervalo de tiempo es equivalente a 20 marcos por segundo, es decir, estamos cambiando lo que muestra el juego 20 veces cada segundo, más que suficiente para crear la ilusión de movimiento.

## Manejo de eventos

Para poder manejar el personaje principal del juego con las flechas del teclado o con la pantalla táctil debemos hacer uso de los eventos que nos proporciona el navegador para este propósito. En el método _start_ de la clase _Game_, inicializamos los escuchadores de eventos necesarios:

- **keydown** : Se llama cuando el usuario pulsa una tecla. Guarda la tecla pulsada en el atributo _keyPressed_ de _Game._
- **keyup** : Se llama cuando el usuario deja de pulsar una tecla. Elimina el contenido del atributo _keyPressed_ de _Game._
- **touchstart** : Se llama cuando el usuario toca la pantalla. Guarda la posición horizontal (x) donde el usuario ha tocado en el atributo _xDown_ de _Game_.
- **touchmove** : Se llama cuando el usuario arrastra el dedo por la pantalla. Elimina el contenido del atributo _xDown_ de _Game._

Como hemos visto antes, cada 50ms se llama al método _update_ de _Game_. Este método comprueba el valor de _xDown_ y _keyPressed_ para actualizar la posición del personaje principal en función de las acciones del usuario.

## Tareas

Se pide modificar el código proporcionado para lograr tres funcionalidades nuevas:

- Registro de los **puntos conseguidos** por el usuario. Cada vez que convierta a un oponente en estrella debe incrementar el número de puntos en una unidad.
- El personaje principal debe contar con **tres vidas**. Si es alcanzado por un disparo, en vez de perder, el número de vidas disminuirá en una unidad, otorgándole una nueva oportunidad para ganar. Si el número de vidas llega a cero, se termina el juego.
- Si el jugador consigue disparar al oponente (triángulo) y convertirlo en estrella, se le presentará una **oponente final** más poderoso (pentágono). Éste se moverá al **doble de velocidad** que el triángulo y el tiempo mínimo entre disparos será **medio segundo** en vez de uno.

Para implementar las tres funcionalidades debes seguir los siguientes pasos:

1. **1.** Añadir un atributo nuevo _score_ a la clase _Game_ que refleje la puntuación (inicialmente 0).
2. **2.** Modificar el código del método _die_ de la clase _Opponent_ para que sume un punto a _score_ cada vez que se dispara a un triángulo.
3. **3.** Añadir un atributo nuevo _lives_ a la clase _Player_ que valga 3 inicialmente. Puedes definir el nº de vidas inicial en una constante en main.js.
4. **4.** Modificar el código del método _die_ de la clase _Player_ para que reste una vida cada vez que al jugador le alcance un disparo. Sólo debe morir si el nº de vidas es cero tras la resta.
5. **5.** Añadir el código necesario para pintar la puntuación y las vidas en la pantalla del juego en todo momento. Para ello crea una lista (etiqueta ul de HTML) con dos elementos (etiqueta li). El primero, con id &quot;scoreli&quot;, mostrará la puntuación con el siguiente formato:  ``Score: x``, siendo ``x`` el valor del atributo _score_ del juego. El segundo, con id ``livesli``, mostrará el nº de vidas con el siguiente formato: ``Lives: y``, siendo ``y`` el valor del atributo _lives_ del jugador.
6. **6.** Crear una clase nueva llamada _Boss_ en un nuevo fichero llamado Boss.js (no te olvides de importarlo en game.html). Esta clase debe heredar los métodos y atributos necesarios de la clase _Opponent_ sobreescribiendo aquellos que sean necesarios para lograr la funcionalidad requerida. Para representar al jefe final puedes usar las imágenes ``jefe.png`` y ``jefe_muerto.png`` de la carpeta assets.
7. **7.** Modificar el código necesario para que cuando el jugador consiga matar al triángulo, le aparezca el desafío final. Si consigue derrotar al jefe final ganará la partida y aparecerá la imagen ``you_win.jpg`` de la carpeta assets, en vez de ``game_over.jpg``.
8. **8.** Subir dicha aplicación a una cuenta de [org](http://neocities.org) (crearla si no se tiene) para comprobar como se ve en un servidor remoto.

## Prueba de la práctica 

Se puede utilizar un programa de corrección automática del desarrollo de esta entrega. Para utilizar esta herramienta debes tener node.js (y npm) ([https://nodejs.org/es/](https://nodejs.org/es/)) y Git instalados. Si no están instalados, puedes  realizar la practica sin utilizar el validador y probarla manualmente.

Para instalar y hacer uso de la [herramienta de autocorrección](https://www.npmjs.com/package/autocorector) en el ordenador local, ejecuta los siguientes comandos en el directorio del proyecto:
```
$ npm install -g autocorector     ## Instala el programa de test
$ autocorector                    ## Pasa los tests al fichero a entregar
............................      ## en el directorio de trabajo
... (resultado de los tests)
```
También se puede instalar como paquete local, en el caso de que no se dispongas de permisos en el ordenador desde el que estás trabajando:
```
$ npm install autocorector     ## Instala el programa de test
$ npx autocorector            ## Pasa los tests al fichero a entregar
............................  ## en el directorio de trabajo
... (resultado de los tests)
```
## Instrucciones para la Entrega y Evaluación.

La entregar consiste en subir un **zip** a la plataforma con todos los ficheros de la práctica. Excluye la carpeta `node_modules` que se crea automáticamente al instalar el validador.

Para evaluar el fichero entregado, hay que descargarlo de la plataforma y comprobar que funciona correctamente abriendo el fichero index.html en el navagador. También puedes hacer uso del validador y utilizar el resultado del mismo como nota.

**RÚBRICA**: Se puntuará el ejercicio a corregir sumando el % indicado a la nota total si la parte indicada es correcta:

-  **25%: ** Muestra correctamente las vidas del usuario
-  **25%:**  Muestra correctamente la puntuación del usuario
-  **50%:**  La funcionalidad del oponente final está implementada correctamente

Si pasa todos los tests se dará la máxima puntuación.

El objetivo de este curso es sacar el máximo provecho al trabajo dedicado y para ello lo mejor es utilizar las evaluaciones para ayudar al evaluado, especialmente a los principiantes. Al evaluar se debe dar comentarios sobre la corrección del código, su claridad, legibilidad, estructuración y documentación, siempre que puedan ayudar al evaluado.

**¡Cuidado! Una vez enviadas, tanto la entrega, como la evaluación, no se pueden cambiar.**   Esperar a tener completa y revisada, tanto la entrega, como la evaluación antes de enviarlas.
