const pages = document.querySelectorAll(".passport-page");
const previousButton = document.querySelector('[data-action="previous"]');
const nextButton = document.querySelector('[data-action="next"]');
const pageNumber = document.querySelector("[data-page-number]");
let currentPage = 0;

previousButton.addEventListener("click", () => {
  pages[currentPage].classList.remove("active");
  pages[currentPage].setAttribute("aria-hidden", "true");
  pages[currentPage].inert = true;
  currentPage = Math.max(currentPage - 1, 0);
  pages[currentPage].classList.add("active");
  pages[currentPage].setAttribute("aria-hidden", "false");
  pages[currentPage].inert = false;
  pageNumber.textContent = currentPage + 1;
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
  pageNumber.textContent = currentPage + 1;
  previousButton.disabled = currentPage === 0;
  nextButton.disabled = currentPage === pages.length - 1;
});