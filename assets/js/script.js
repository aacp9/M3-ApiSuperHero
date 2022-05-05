//función flecha valida texto solo numero// ESTA FUNCIÓN NO ES UTILIZADA EN SUPER HERO
let valida_letras= (nombre,asunto,mensaje) =>{
  //asignamos patrón
   let patron = /[a-zA-Z]/gim;
   //utilizamo la función test
if (patron.test(nombre)==false) {
    document.querySelector(".errorNombre").innerHTML = "el nombre debe ser solo LETRAS";
    return false;
}else if (patron.test(asunto)==false) {
    document.querySelector(".errorAsunto").innerHTML = "el asunto debe ser solo LETRAS";
    return false;
}else if (patron.test(mensaje)==false) {
    document.querySelector(".errorMensaje").innerHTML = "el mensaje debe ser solo LETRAS";
    return false;
}else{
    return true;
}
};

$(document).ready(function () {
  // creamos una funcion de forma tipo flecha llamada "consulta"
  let consulta = (id_recibido) => {
        // primero estructurar el AJAX para luego ingresar la consulta
        $.ajax({
              dataType: "json", //como va a llegar la consulta, tipo json
              type: "GET", //tipo de petición
              url: `https://www.superheroapi.com/api.php/10216218593416642/${id_recibido}`, //url a consultar usan comillas(acento grave) con alt+96 para el INYECTAR EL ID ${id}
              success: (result) => {
                if (result.response === "success") {
                  
                  //usan comillas(acento grave) la variable resultado del texto
                  let resultado_texto_html = `
                  <h4 class="text-center"><b>SuperHero Encontrado</b></h4>
                  <div class="card mb-3" style="max-width: 540px;">
                  <div class="row g-0">
                    <div class="col-md-4">
                      <!-- INYECTANDO imagen-->
                      <img src="${result.image.url}" class="img-fluid rounded-start" alt="${result.name}">
                    </div>
                  
                    <div class="col-md-8">
                        <div class="card-body" >
                          
                          <h5><b>Nombre:</b> ${result.name}</h5>
                          <p class="card-text"><b>Conexiones:</b> ${result.connections["group-affiliation"]}</p>
                          <ul class="list-group list-group-flush">
                            <li class="list-group-item"><b>Publicado por:</b> ${result.biography.publisher}</li>
                            <li class="list-group-item"><b>Ocupación:</b> ${result.work.occupation}</li>
                            <li class="list-group-item"><b>Primera Aparición:</b> ${result.biography["first-appearance"]}</li>
                            <li class="list-group-item"><b>Altura:</b> ${result.appearance.height}</li>
                            <li class="list-group-item"><b>Peso:</b> ${result.appearance.weight}</li>
                            <li class="list-group-item"><b>Alianzas:</b> ${result.biography.aliases}</li>
                          </ul>
                        </div>
                    </div>
                    
                  </div>
                 </div>
                  `;

                  $("#id_html_resultadoAPI").append(
                    resultado_texto_html
                  );

                  //*********************************************** */
                  //GRÁFICO DE CANVAS
                  //********************************************************************* */
                  //template buscar en el siguinte link
                  //https://canvasjs.com/javascript-charts/json-data-api-ajax-chart/
                  //declarando la función
                    //definimos un arreglo para que reciba los datos del datapoints
                    let dataPoints=[];
                  //utilizamos for-in para recorrer objetos
                  for (const key in result.powerstats) {
                    dataPoints.push({
                      label: key,//el key recibe los valores de intelligence,strength,...etc
                      y: parseInt(result.powerstats[key])//para obtener los valores de números de cada key
                    });
                  }

                    var chart = new CanvasJS.Chart("id_html_chartContainer", {
                     // theme: "light1", // "light1", "light2", "dark1", "dark2"
                      //exportEnabled: true,
                     
                      animationEnabled: true,
                      title: {
                        fontFamily: "Architects Daughter",
                        text: `Estadísticas de Poder para ${result.name}`
                      },
                      legend:{
                        fontFamily: "Architects Daughter",
                        horizontalAlign:"center",
                        fontSize: 12,
                        verticalAlign:"bottom"
                      },
                      data: [{
                        
                        type: "pie",
                        startAngle: 25,
                        toolTipContent: "<b>{label}</b>: ({y})",
                        showInLegend: "true",
                        legendText: "{label}",
                        indexLabelFontSize: 16,
                        indexLabel: "{label} - ({y})",
                        indexLabelFontFamily: "Architects Daughter",
                        dataPoints:dataPoints
                      
                      }]
                    });//fin de CanvasJS.Chart
                   
                    chart.render();

                } else {
                  alert("Super-Hero not found ");
                }
              },
              error: (error) => {
                alert("ha ocurrido un error en la consulta");
              },
          });
  }; //fin función flecha

  //hacemos evento al formulario
  $("form").on("submit", (evento) => {
    //LIMPIAMOS ÁREA DE DESPLIEGE
    document.querySelector(".errorId").innerHTML = " ";
    document.querySelector("#id_html_resultadoAPI").innerHTML = " ";
    document.querySelector("#id_html_chartContainer").innerHTML = " ";
    
    
    evento.preventDefault(); //previene el formulario por defecto
     //limpiamos el contenido del html para que este vacio y no muestre nada
    //  $("#id_html_resultadoAPI").html(" ");
   
    
    // convertiendo el dato que llega del input
    //id_evento = parseInt($("#id_hero_input").val());
    id_evento = $("#id_hero_input").val();

    //expresión regular consultado en https://regextester.com/21
    let patron = /^[0-9]*$/gm;
      
  if (patron.test(id_evento)==false) {
     document.querySelector(".errorId").innerHTML = "el ID debe ser solo NÚMEROS";
  }else{
        
        id_evento=parseInt(id_evento);
        // utilizando la funcion consulta y entregamos el id obtenido en la variable id_evento
        consulta(id_evento);
  } 

  });
});
