function getFrecuencias(mensaje) {
    const frecuencias = {};
    for (const simbolo of mensaje) {
        if (frecuencias[simbolo])
            frecuencias[simbolo]++;
        else
            frecuencias[simbolo] = 1;
    }
    return frecuencias;
}

function procesar() {
    const mensaje = document.getElementById("imputTexto").value;
    const salida = document.getElementById("output");

    if (mensaje.length === 0) {
        salida.innerHTML = `
            <p class="alert">
                Debe ingresar una cadena válida por favor.
            </p>
        `;
        return;
    }

    salida.innerHTML = `
        <p>
            procesando la cadena: <strong>${mensaje}</strong>
        </p>
    `;

    //Calcular frecuencias
    let frecuencias = getFrecuencias(mensaje);

    //Mostramos las frecuencias
    mostrarFrecuencias(frecuencias, salida);

    //Construimos el arbol
    const arbolito = construirArbol(frecuencias, salida);

    const cods = {};
    const codigos = generarCodigos(arbolito, "", cods);

    mostrarCodigos(codigos, salida);

    mostrarMensajeCodificado(mensaje, codigos, salida);
}

function mostrarFrecuencias(frecuencias, salida) {
    let tabla = `
        <h3>frecuencia de simbolos</h3>
        <table border="1" cellpadding="5">
            <tr>
                <th>Caracter</th>
                <th>Frecuencia</th>
            </tr> 
        `;
    for (const [car, frec] of Object.entries(frecuencias)) {
        tabla += `
        <tr>
            <td>${car}</td>
            <td>${frec}</td>
        </tr>
    `;
    }
    tabla += `</table>`;
    salida.innerHTML += tabla;
}

class Nodo {
    constructor(caracter, frecuencia, izq, der) {
        this.caracter = caracter;
        this.frecuencia = frecuencia;
        this.izq = izq;
        this.der = der;
    }
}

function construirArbol(frecuencias, salida) {
    const noditos = [];
    let pasos = 0;

    //Construir los nodos hoja
    for (const [car, frec] of Object.entries(frecuencias)) {
        let nodito = new Nodo(car, frec, null, null);
        noditos.push(nodito);
    }

    pasos++;

    while (noditos.length > 1) {
        noditos.sort((a, b) => a.frecuencia - b.frecuencia);

        const menor_uno = noditos.shift();
        const menor_dos = noditos.shift();

        let frec_nodo_comb = menor_uno.frecuencia + menor_dos.frecuencia;
        const nodo_cobinado = new Nodo(null, frec_nodo_comb, menor_uno, menor_dos);

        noditos.push(nodo_cobinado);

        salida.innerHTML += `
            <p class="success">
                Paso${pasos++}: Combinar los nodos (${mostrarNodo(menor_uno)}) y (${mostrarNodo(menor_dos)}) --> Nuevo nodo, con frecuencia:${nodo_cobinado.frecuencia}
            </p>
        `;
    }
    return noditos[0];
}

function mostrarNodo(nodito) {
    if (nodito.caracter != null) {
        return `
            '${nodito.caracter}' (${nodito.frecuencia})
        `;
    } else {
        return `
           ∅ (${nodito.frecuencia})
        `;
    }
}

function generarCodigos(nodito, cod_actual, codigos) {
    if (nodito != null) {
        if (nodito.caracter != null) {
            codigos[nodito.caracter] = cod_actual;
            return;
        }

        generarCodigos(nodito.izq, cod_actual + "0", codigos);
        generarCodigos(nodito.der, cod_actual + "1", codigos);

        return codigos;
    } else return;
}

function mostrarCodigos(codigos, salida) {
    let codesHTML = `
        <h3>Codificación de Huffman: </h3>
        <table border="1" cellpadding="5">
            <tr>
                <th>Símbolo</th>
                <th>Codificación</th>
            </tr>
    `;
    for (const [car, cod] of Object.entries(codigos)) {
        codesHTML += `
            <tr>
                <td>${car}</td>
                <td>${cod}</td>
            </tr>
        `;
    }
    codesHTML += `</table>`;
    salida.innerHTML += codesHTML;
}

function mostrarMensajeCodificado(mensaje, codigos, salida) {
    let codificacion = "";
    for (const simbolo of mensaje) {
        codificacion += codigos[simbolo];
    }
    salida.innerHTML += `
        <h3>Mensaje codificado</h3>
        <p>
            <code>${codificacion}</code>
        </p>
    `;

}