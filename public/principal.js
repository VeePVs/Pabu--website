const contenedorTarjetas = document.getElementById("grid");

function crearTarjetasProductosInicio(productos){
  console.log(productos)
  productos.forEach(cadaProducto => {
  const nuevoProducto = document.createElement("div");
  nuevoProducto.classList = "items";
    if (cadaProducto.precio == "0" && cadaProducto.stock == "0") {
      nuevoProducto.classList = "items noDispo"
      nuevoProducto.innerHTML = `<div class="imgContainer"><img src="${cadaProducto.refIMG}" class="img"/></div>`
    }else if(parseInt(cadaProducto.stock) < 0){
      nuevoProducto.classList = "items noDispo"
      nuevoProducto.innerHTML = `<div class="Oculto">ERROR DB01, STOCK NO VALIDO</div>`
    } else if ((parseInt(cadaProducto.precio) % 50) != 0) {
      nuevoProducto.classList = "items noDispo"
      nuevoProducto.innerHTML = `<div class="Oculto">ERROR DB02, PRECIO NO VALIDO</div>`
    } else if (cadaProducto.precio == "0" && parseInt(cadaProducto.stock)>0) {
      nuevoProducto.classList = "items descuento"
      nuevoProducto.innerHTML = `<div class="imgContainer"><img src="${cadaProducto.refIMG}" class="img"/></div>`
    } else if ((parseInt(cadaProducto.precio) < 50) != 0) {
      nuevoProducto.classList = "items noDispo"
      nuevoProducto.innerHTML = `<div class="Oculto">ERROR DB02, PRECIO NO VALIDO</div>`
    } else{
      nuevoProducto.classList = "items"
      nuevoProducto.innerHTML = `<div class="imgContainer"><img src="${cadaProducto.refIMG}" class="img"/></div>`
    }
     

    nuevoProducto.innerHTML += `
      <p class="nombreProducto">${cadaProducto.nombre}</p>
      <p class="precioProducto">$${cadaProducto.precio}</p>
      <button class="botonAñadir">+</button>
      
    `;
    contenedorTarjetas.appendChild(nuevoProducto);
    nuevoProducto.getElementsByTagName("button")[0].addEventListener("click",()=> agregarAlCarrito(producto))
  });
}

getProductos().then(productos => {
    crearTarjetasProductosInicio(productos);
})