

window.addEventListener('load', showHome);

const URL_GAMES = 'https://vj.interfaces.jima.com.ar/api';
const URL_PRICES = './js/prices.json';
const URL_COMMENTS = 'https://68ccc70eda4697a7f3038624.mockapi.io/comments';


/* # data */

async function getGames() {

    try {

        const responseGamesData = await fetch(URL_GAMES);
        const gamesData = await responseGamesData.json();

        const responsePrices = await fetch(URL_PRICES);
        const prices = await responsePrices.json();


        // prices es diccionario

        let gamesWithPrices = [];

        gamesData.forEach(game => {

            const product = { ...game, ...prices[game.id] };

            gamesWithPrices.push(product);
        });

        return gamesWithPrices;

    } catch (error) {
        console.error('Error:', error);
    }

}

async function getComments() {

    try {

        const responseComments = await fetch(URL_COMMENTS);
        const comments = await responseComments.json();

        return comments;

    } catch (error) {
        console.log('error:', error);
    }

    /* cualquier función que espere datos asincrónicos declarala asincronica ! */
}

async function getCategories() {

  let categories = [];
  
  const games = await getGames();

  games.forEach(game => {
    game.genres.forEach(genre => {
        const genreName = genre.name.toLowerCase();
      if (!categories.includes(genreName)) {
        categories.push(genreName);
      }
    });
  });

  return categories;
}

async function getPromos() {

    const games = await getGames();

    let promos = [];

    games.forEach(game => {

        let price = game.price ; 
        let discountPrice = game.discountPrice; 
        if( discountPrice != 0 && discountPrice < price ){

            promos.push(game);

        }

       
    })

    return promos;    
}

/* # controller */ 
/* ## filtros */

async function filterBy(text, games) {     

    let input = text.toLowerCase();

    let gamesFiltered = [];

    if (await isCategory(input)){

        gamesFiltered = games.filter(game => game.genres.find(genre => genre.name.toLowerCase() == input));      

    } else { // busca por nombre
        gamesFiltered = games.filter (game => game.name.toLowerCase().includes(input));
    } 

    return gamesFiltered;   
    // en la fuction show si recibo un arreglo vacío muestro por pantalla: "no se encontró";
    //en caso que el valor de text sea un sring vacío devuelve todos los juegos;

}

async function filterByFree(games){   

    let gamesFiltered = games.filter(game => game.isFree == true);    

    return gamesFiltered;

}

async function filterByHeroCard(games){   

    let gamesFiltered = games.filter(game => game.isHeroCard == true);    

    return gamesFiltered;

}

async function isCategory(text) {

   let categories = await getCategories();

   let category = text.toLowerCase(); 

   return categories.includes(category); 
    
}

/* # vistas */

async function showGames(nameOrCategory) {

    let games = await getGames();

    let ejemplo = document.querySelector('#divData');

    let reemplazoEjemplo = '';

    let gamesFiltered =  await getPromos();

    console.log(gamesFiltered); 

    gamesFiltered.forEach(game => {

            reemplazoEjemplo += `
            <li>                
                    <p>${game.id}</p>
                    <p>${game.name}</p>
                    <p>${game.discountPrice}</p>
                    <p>${game.price}</p>
                    <p>Gratis? ${game.isFree}</p>
                    <p> - </p>

                </li>
        `

    });

    ejemplo.innerHTML = reemplazoEjemplo;
    
}

async function showHome() {
    // definir como se renderizan los carrouseles con las categorias
    await showGames('');
    
}

// podria traer de la base los mas destacados o podria elegir manualmente 3 imagenes; 
