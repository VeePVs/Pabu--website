async function getProductos() {
    console.log("validando")
    const res = await fetch("/productos");
    const resJson = await res.json();
    return resJson;
}