document.addEventListener("DOMContentLoaded", () => {

  const searchInput = document.querySelector(".search-input");
  const searchBtn = document.querySelector(".search-btn");

  searchBtn.addEventListener("click", async () => {
    const text = searchInput.value.trim();
    if (text.length > 0) {
      const allGames = await getGames();
      const filteredGames = await filterBy(text, allGames);
      renderSearch(filteredGames);
    } else {
      showHome(); 
    }
  });
  
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});