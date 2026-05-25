const pages = document.querySelectorAll(".passport-page");
const previousButton = document.querySelector('[data-action="previous"]');
const nextButton = document.querySelector('[data-action="next"]');
const pageNumber = document.querySelector("[data-page-number]");
const stampButtons = document.querySelectorAll(".city-page");
let savedStamps = JSON.parse(localStorage.getItem("victoria-passport-stamps") || "[]");
let savedStampPositions = JSON.parse(localStorage.getItem("victoria-passport-stamp-positions") || "{}");
let currentPage = 0;

stampButtons.forEach((cityPage) => {
  const cityName = cityPage.dataset.city;
  const cityStamp = cityPage.querySelector(".passport-stamp");

  cityPage.setAttribute("role", "button");
  cityPage.setAttribute("tabindex", "0");

  if (savedStampPositions[cityName]) {
    const stampSafeRadius = Math.hypot(cityStamp.offsetWidth, cityStamp.offsetHeight) / 2;
    const savedStampX = Math.min(Math.max(savedStampPositions[cityName].x, stampSafeRadius), cityPage.offsetWidth - stampSafeRadius);
    const savedStampY = Math.min(Math.max(savedStampPositions[cityName].y, stampSafeRadius), cityPage.offsetHeight - stampSafeRadius);

    cityStamp.style.setProperty("--stamp-x", `${savedStampX}px`);
    cityStamp.style.setProperty("--stamp-y", `${savedStampY}px`);
    savedStampPositions[cityName] = { x: savedStampX, y: savedStampY };
  }

  if (savedStamps.includes(cityName)) {
    cityPage.classList.add("stamped");
    cityPage.setAttribute("aria-pressed", "true");
  } else {
    cityPage.setAttribute("aria-pressed", "false");
  }

  cityPage.addEventListener("click", (event) => {
    if (cityPage.classList.contains("stamped")) {
      cityPage.classList.remove("stamped");
      cityPage.setAttribute("aria-pressed", "false");
      savedStamps = savedStamps.filter((savedCity) => savedCity !== cityName);
      delete savedStampPositions[cityName];
    } else {
      const pageBounds = cityPage.getBoundingClientRect();
      const stampSafeRadius = Math.hypot(cityStamp.offsetWidth, cityStamp.offsetHeight) / 2;
      const clickX = event.clientX || pageBounds.left + pageBounds.width / 2;
      const clickY = event.clientY || pageBounds.top + pageBounds.height / 2;
      const stampX = Math.min(Math.max(clickX - pageBounds.left, stampSafeRadius), pageBounds.width - stampSafeRadius);
      const stampY = Math.min(Math.max(clickY - pageBounds.top, stampSafeRadius), pageBounds.height - stampSafeRadius);

      cityStamp.style.setProperty("--stamp-x", `${stampX}px`);
      cityStamp.style.setProperty("--stamp-y", `${stampY}px`);
      cityPage.classList.add("stamped");
      cityPage.setAttribute("aria-pressed", "true");
      savedStampPositions[cityName] = { x: stampX, y: stampY };

      if (!savedStamps.includes(cityName)) {
        savedStamps.push(cityName);
      }
    }

    localStorage.setItem("victoria-passport-stamps", JSON.stringify(savedStamps));
    localStorage.setItem("victoria-passport-stamp-positions", JSON.stringify(savedStampPositions));
  });

  cityPage.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      cityPage.click();
    }
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