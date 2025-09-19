

window.addEventListener('load', showGames);



const URL_GAMES = 'https://vj.interfaces.jima.com.ar/api';
const URL_PRICES = './js/prices.json';
const URL_COMMENTS = 'https://68ccc70eda4697a7f3038624.mockapi.io/comments';



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


async function filterBy(category) {

    let games = await getGames();

    let gamesFiltered = games.filter(game =>
        game.genres.find(genres => genres.name == category));

    console.log(gamesFiltered);

    return gamesFiltered;
}

let category ='RPG'
console.log(filterBy(category));


async function showGames() {

    let games = await getGames();

    let ejemplo = document.querySelector('#divData');

    let reemplazoEjemplo = '';

    games.forEach(game => {

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