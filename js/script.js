document.addEventListener("DOMContentLoaded", function () {
    let myChart = null;
    document.getElementById("procesar").addEventListener("click", function() {
    
        // Obtener referencias a los elementos
        const tabla = document.getElementById("Valores");
        const xCell = document.getElementById("X");
        const yCell = document.getElementById("Y");
        const canvas = document.getElementById("myChart");

        const varA = document.getElementById("varA").value;
        const varB = document.getElementById("varB").value;
        const varC = document.getElementById("varC").value;
        const varD = document.getElementById("varD").value;
        const varE = document.getElementById("varE").value;

        //console.log(typeof(varA));

        const xmin = document.getElementById("xMin").value;
        const xmax = document.getElementById("xMax").value;

        if (xmin < 0 && xmax < 0){
            let xabsmin = Math.abs(xmin);
            let xabsmax = Math.abs(xmax);
            if (xabsmin <= xabsmax){
                alert("Si ambos valores en X son negativos. El mínimo no puede ser igual o estar más cerca del 0 que el máximo");
                return;
            };
        };

        if (xmin >= 0 && xmax < 0){
            alert("El mínimo no puede ser igual o mayor que el máximo");
            return;
        };

        if (xmin >= xmax && xmin >= 0 && xmax >= 0){
            alert("El mínimo no puede ser igual o mayor que el máximo");
            return;
        };

        if (!canvas) {
            console.error("Elemento 'myChart' no encontrado.");
            return;
        }

        if(myChart){
            myChart.destroy();
        }

        const ctx = canvas.getContext("2d");

        // Listas de los datos X & Y
        let datosX = [];
        let datosY = [];

        // Crear gráfico con Chart.js
        myChart = new Chart(ctx, {
            type: "line",
            data: {
                labels: datosX,
                datasets: [{
                    label: "Valor Y (f(x))",
                    data: datosY,
                    borderColor: "blue",
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: "X" } },
                    y: { title: { display: true, text: "Y" } }
                }
            }
        });

        // Función matemática
        function f(x) {
            let operacion_a = Math.sin(varA * x);
            let operacion_b = Math.cos(varB * varA / x);
            let operacion_c = Math.cos(Math.sqrt(varC + x));
            let operacion_d = Math.sin((varE/x) + varA);
            let operacion_e = Math.cos(varD * x);
            let operacion_final = (operacion_a - operacion_b + operacion_c) / (operacion_d * operacion_e);

            /*
            console.log(operacion_a);
            console.log(operacion_b);
            console.log(operacion_c);
            console.log(operacion_d);
            console.log(operacion_e);
            */
            
            return operacion_final;
        }

        function generarDatos() {
            let xMin = parseFloat(xmin);
            let xMax = parseFloat(xmax);
            let paso = 0.1;

            tabla.innerHTML = "";

            for (let x = xMin; x <= xMax; x += paso) {
                let y = f(x);

                // Agregar valores a la tabla
                let fila = document.createElement("tr");
                if (isNaN(y)) {
                    fila.innerHTML = `<td class="tabla_datos">${x.toFixed(1)}</td><td class="tabla_datos">Indeterminado</td>`;
                } else {
                    fila.innerHTML = `<td class="tabla_datos">${x.toFixed(1)}</td><td class="tabla_datos">${y.toFixed(4)}</td>`;
                }
                
                tabla.appendChild(fila);

                // Agregar valores al gráfico
                datosX.push(x);
                datosY.push(y);
            }
            let xCorte = 0;

            // Detectar cambios de signo en Y
            for (let i = 1; i < datosX.length; i++) {
                let y1 = datosY[i - 1];
                let y2 = datosY[i];

                if ((y1 > 0 && y2 < 0) || (y1 < 0 && y2 > 0)) {
                    xCorte = xCorte + 1;
                }
            }

            // Actualizar valores en celdas individuales
            xCell.textContent = datosX[datosX.length - 1];
            yCell.textContent = datosY[datosY.length - 1];
            xCell.innerHTML = "<b>X</b>";
            yCell.innerHTML = "<b>Y</b>";

            let valMaxY = 0;
            let valMinY = 0;

            datosYParseada = datosY.map(v => parseFloat(v)).filter(v => !isNaN(v));

            document.getElementById("yMax").innerText = valMaxY = Math.max(...datosYParseada);
            document.getElementById("yMin").innerText = valMinY = Math.min(...datosYParseada);

            console.log(xCorte);
            document.getElementById("Cortes").innerText = xCorte;

            // Actualizar gráfico
            myChart.update();

            
        }
        

        // Llamar a la función para generar datos
        generarDatos();
    });
});

function openTab(tabName, event) {
    var i, tabContent, tabLinks;

    // Oculta todo el contenido de las pestañas
    tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    // Desactiva todas las pestañas
    tabLinks = document.getElementsByClassName("tab");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }

    // Muestra el contenido de la pestaña seleccionada y la activa
    document.getElementById(tabName).style.display = "block";
    if (event) {
        event.currentTarget.className += " active";
    }
}
