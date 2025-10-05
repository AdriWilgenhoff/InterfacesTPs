document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  async function performSearch() {
    const text = searchInput.value.trim();

    if (text.length === 0) {
      renderSearch([], '');
      searchInput.value = '';     
      searchInput.blur();
      return;
    }

    const allGames = await getGames();
    const filteredGames = await filterBy(text, allGames);
    renderSearch(filteredGames, text);
  }

  searchInput.value = '';
  searchInput.blur();
  searchBtn.addEventListener("click", performSearch);

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
});