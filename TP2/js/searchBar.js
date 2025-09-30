document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  async function performSearch() {
    const text = searchInput.value.trim();
    
 
    if (text.length === 0) {
      renderSearch([], '');
      return;
    }
    

    const allGames = await getGames();
    const filteredGames = await filterBy(text, allGames);
    renderSearch(filteredGames, text);
  }

  searchBtn.addEventListener("click", performSearch);
  
  searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  });
});