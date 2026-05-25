const pages = document.querySelectorAll(".passport-page");
const previousButton = document.querySelector('[data-action="previous"]');
const nextButton = document.querySelector('[data-action="next"]');
const pageNumber = document.querySelector("[data-page-number]");
const stampButtons = document.querySelectorAll(".stamp-button");
let savedStamps = JSON.parse(localStorage.getItem("victoria-passport-stamps") || "[]");
let currentPage = 0;

stampButtons.forEach((button) => {
  const cityName = button.dataset.city;
  const cityPage = document.querySelector(`.city-page[data-city="${cityName}"]`);
  const cityTitle = cityPage.querySelector("h2").textContent;

  if (savedStamps.includes(cityName)) {
    cityPage.classList.add("stamped");
    button.setAttribute("aria-pressed", "true");
    button.textContent = `Remover carimbo de ${cityTitle}`;
  }

  button.addEventListener("click", () => {
    if (cityPage.classList.contains("stamped")) {
      cityPage.classList.remove("stamped");
      button.setAttribute("aria-pressed", "false");
      button.textContent = `Carimbar ${cityTitle}`;
      savedStamps = savedStamps.filter((savedCity) => savedCity !== cityName);
    } else {
      cityPage.classList.add("stamped");
      button.setAttribute("aria-pressed", "true");
      button.textContent = `Remover carimbo de ${cityTitle}`;
      savedStamps.push(cityName);
    }

    localStorage.setItem("victoria-passport-stamps", JSON.stringify(savedStamps));
  });
});

previousButton.addEventListener("click", () => {
  pages[currentPage].classList.remove("active");
  pages[currentPage].setAttribute("aria-hidden", "true");
  pages[currentPage].inert = true;
  currentPage = Math.max(currentPage - 1, 0);
  pages[currentPage].classList.add("active");
  pages[currentPage].setAttribute("aria-hidden", "false");
  pages[currentPage].inert = false;
  if (currentPage === 0) {
    pageNumber.textContent = "Capa";
    nextButton.textContent = "Abrir";
  } else {
    pageNumber.textContent = `${currentPage * 2 - 1}-${currentPage * 2}`;
    nextButton.textContent = "Avançar";
  }
  previousButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;
});

nextButton.addEventListener("click", () => {
  pages[currentPage].classList.remove("active");
  pages[currentPage].setAttribute("aria-hidden", "true");
  pages[currentPage].inert = true;
  currentPage = Math.min(currentPage + 1, pages.length - 1);
  pages[currentPage].classList.add("active");
  pages[currentPage].setAttribute("aria-hidden", "false");
  pages[currentPage].inert = false;
  pageNumber.textContent = `${currentPage * 2 - 1}-${currentPage * 2}`;
  previousButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;
  nextButton.textContent = currentPage === pages.length - 1 ? "Fim" : "Avançar";
});