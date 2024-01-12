const url = window.location.href;
const urlObj = new URL(url);
const pokemonNumber = urlObj.searchParams.get("number");

if (pokemonNumber) {
    pokeApi.getPokemonDetailByNumber(pokemonNumber).then(details => {
        console.log(details);
    });
}


function backToHome() {
    window.location.href = '/index.html';
}