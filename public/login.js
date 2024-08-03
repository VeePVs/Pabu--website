const closeBtn = document.getElementById("closeModal");
const modal = document.getElementById("modal");

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
})