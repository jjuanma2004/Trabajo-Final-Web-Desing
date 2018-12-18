/* 
 * Autor = Diego Rodríguez Suárez-Bustillo
 * Fecha = 01-dic-2014
 * Licencia = gpl30
 * Version = 1.0
 * Descripcion = Scripts para la felicitación de navidad.
 */

/* 
 * Copyright (C) 2014 Diego Rodríguez Suárez-Bustillo
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
var snowflakeCounter = 0;
var intervalSnowID;
var intervalSnowflakeTime = 500;
var maxSnowTimes = 9;
var intervalSnowRunning = false;
var makeSnowCounter = 0;
var cssAttrib = 'boxShadow animation backgroundSize';

/**
 * @description Escoge un objeto al azar de un array
 * @param {Array} arr
 * @returns {Object} Valor aleatorio
 */
function randIndex(arr) {
    var index = Math.floor((Math.random() * arr.length)); //0 -> length-1
    return arr[index];
}

/**
 * @description Añade un copo de nieve aleatorio a la escena
 */
function addSnow() {
    var left = Math.floor((Math.random() * 520)) + 'px', //Min 0 max 520(600div-80copo)
            orientation = ['left', 'right'],
            size = ['small', 'normal', 'big'],
            snowflake = document.createElement("div"),
            clase = randIndex(orientation) + ' ' + randIndex(size);
    snowflake.className = 'snowflake ' + clase;
    snowflake.style.left = left;
    var snowflakeWrapper = document.getElementById('snowWrapper');
    snowflakeWrapper.appendChild(snowflake);

    //Controlador para makeSnow()
    if (snowflakeCounter === maxSnowTimes) {
        snowflakeCounter = 0;
        clearInterval(intervalSnowID);
        intervalSnowRunning = false;
        document.getElementById('pointer').style.cursor = 'pointer';
    } else {
        snowflakeCounter++;
    }
}

/**
 * @description Crea un intervalo de copos de nieve<br>
 * Cantidad de copos definida por maxSnowTimes<br>
 * Espacio de tiempo definido por intervalSnowTime
 */
function makeSnow() {
    //Comprueba que no haya ya un intervalo de nieve activo
    if (!intervalSnowRunning) {
        intervalSnowID = setInterval(function () {
            addSnow();
        }, intervalSnowflakeTime);
        intervalSnowRunning = true;
        document.getElementById('pointer').style.cursor = 'not-allowed';
    }
}

/**
 * @description Carga varias rachas de nieve<br>
 * Tiempo de espera entre rachas definido por loadSnowIntervalTimeWait<br>
 * Número de rachas definidas por loadSnowTimes
 */
function loadSnow() {
    var loadSnowIntervalTimeWait = 1000; // >=1000
    var loadSnowIntervalTime = (intervalSnowflakeTime * maxSnowTimes) + loadSnowIntervalTimeWait;
    var loadSnowTimeDelay = 0;
    for (var i = 0; i < 4; i++) {
        loadSnowTimeDelay += loadSnowIntervalTime;
        setTimeout(function () {
            makeSnow();
        }, loadSnowTimeDelay);
    }
}

/**
 * @description Comprueba si el navegador soporta un atributo CSS concreto en el elemento
 * @param {String} attribute
 * @param {Object} element
 * @returns {Boolean}
 */
function testAttribute(attribute, element) {
    //The IN operator returns true if the specified property is in the specified object.
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/in
    if (attribute in element.style) {
        return true;
    }
    //Comprobar webkit (p.e. webkitBoxShadow)
    attribute = attribute.charAt(0).toUpperCase() + attribute.slice(1);
    if (('webkit'+attribute) in element.style) {
        return true;
    }
    return false;
}

/**
 * @description Comprueba la compatibilidad del navegador con varios tributos CSS y carga la nieve
 */
function checkAttributes() {
    var attributes = cssAttrib.split(' ');
    var supportsAttributes = true;
    for (var i = 0; i < attributes.lenght; i++) {
        if (!testAttribute(attributes[i], document.body)) {
            supportsAttributes = false;
            break;
        }
    }
    if (supportsAttributes) {
        loadSnow();
    } else {
        document.getElementById('alert').style.display = 'block';
    }
}
