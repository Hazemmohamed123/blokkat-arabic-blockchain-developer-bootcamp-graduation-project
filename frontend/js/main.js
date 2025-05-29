let header = document.querySelector(".main-header");
document.addEventListener("scroll", () => {
  if (window.scrollY >= 100) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
})