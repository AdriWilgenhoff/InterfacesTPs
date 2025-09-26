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
      showHome(); // si no hay texto, muestro la home por defecto
    }
  });

  // también podemos escuchar "Enter" en el input
  searchInput.addEventListener("keypress", async (e) => {
    if (e.key === "Enter") {
      searchBtn.click();
    }
  });
});


/* 

document.querySelector(".menu-link.free").addEventListener("click", async () => {
  const games = await getGames();
  renderHome(filterByFree(games));
});

document.querySelector(".menu-link.promos").addEventListener("click", async () => {
  const promos = await getPromos();
  renderHome(promos);
}); */