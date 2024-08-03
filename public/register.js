const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");
campoContrase = document.getElementById("passwordInput");
userInput = document.getElementById("userInput");
nombreInput = document.getElementById("nombreInput")

userInput.addEventListener("change", () => {

})

var banderaCarEspecial = false;
var banderaNumeros = false;
var banderaCantidad = false;
var banderaMayus = false;


campoContrase.addEventListener("change", () => {
    banderaCarEspecial = true;
    banderaNumeros = true;
    banderaCantidad = true;
    banderaMayus = true;
    if (campoContrase.value.length >= 6 || campoContrase.value.length <= 12) {
        document.getElementById("errorCantidad").style.display = "none  ";
        banderaCantidad = false;
    }else{
        document.getElementById("errorCantidad").style.display = "block";
        banderaCantidad = true;
    }

    const uppercaseCount = (campoContrase.value.match(/[A-Z]/g) || []).length;
    if (uppercaseCount > 0) {
        document.getElementById("errorMayus").style.display = "none  ";
        banderaMayus = false;
    }else{
        document.getElementById("errorMayus").style.display = "block";
        banderaMayus = true;
    }

    const numberCount = (campoContrase.value.match(/\d/g) || []).length;
    if (numberCount  > 0) {
        document.getElementById("errorNumero").style.display = "none";
        banderaNumeros = false;
    }else{
        document.getElementById("errorNumero").style.display = "block";
        banderaNumeros = true;
    }

    const specialCharCount = (campoContrase.value.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length;
    if (specialCharCount > 0) {
        document.getElementById("errorEspecial").style.display = "none";
        banderaCarEspecial = false;
    }else{
        document.getElementById("errorEspecial").style.display = "block";
        banderaCarEspecial = true;
    }
})

document.getElementById("againPasswordInput").addEventListener("change", () => {
    if (document.getElementById("againPasswordInput").value == document.getElementById("passwordInput").value) {
        document.getElementById("againPasswordInput").style.border= "0";
    }
})


document.getElementById("registrarse").addEventListener("click", async(e) => {
    validarInputs(e);
})

function validarInputs(e) {
    if (document.getElementById("nombreInput").value == "" || 
        document.getElementById("apellidoInput").value == "" ||
        document.getElementById("emailInput").value == "" || 
        document.getElementById("cedulaInput").value == "" || 
        document.getElementById("passwordInput").value == "" || 
        document.getElementById("againPasswordInput").value == ""  || 
        document.getElementById("userInput").value == "") {
        e.preventDefault();
    } else if(document.getElementById("againPasswordInput").value !== document.getElementById("passwordInput").value){
        e.preventDefault();
        console.log("Hey hey, ¿creiste que no iba a pensar en las contraseñas diferentes?")
    } 
    if(banderaMayus || banderaCantidad || banderaNumeros || banderaCarEspecial) {
        e.preventDefault();
    }
}

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open")
})

module.exports = register;

