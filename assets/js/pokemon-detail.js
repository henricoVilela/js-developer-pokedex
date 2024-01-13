const url = window.location.href;
const urlObj = new URL(url);
const pokemonNumber = urlObj.searchParams.get("number");
const pokemonDetailContent = document.getElementById('pokemon-detail-content')

if (pokemonNumber) {
    pokeApi.getPokemonDetailByNumber(pokemonNumber).then(details => {
        console.log(details);
        pokemonDetailContent.classList.add(details.type);
    });
}


function backToHome() {
    window.location.href = '/index.html';
}