const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon, clickHandler) {
    const liElement = document.createElement('li');
    liElement.classList.add('pokemon', pokemon.type);

    liElement.addEventListener('click', function() {
        clickHandler(pokemon);
    });

    const pokemonNumber = document.createElement('span');
    pokemonNumber.classList.add('number');
    pokemonNumber.textContent = `#${pokemon.number}`;
    liElement.appendChild(pokemonNumber);

    const pokemonName = document.createElement('span');
    pokemonName.classList.add('name');
    pokemonName.textContent = pokemon.name;
    liElement.appendChild(pokemonName);

    const pokemonDetail = document.createElement('div');
    pokemonDetail.classList.add('detail');

    const pokemonTypes = document.createElement('ol');
    pokemonTypes.classList.add('types');

    pokemon.types.forEach(function(type) {
        const typeLi = document.createElement('li');
        typeLi.classList.add('type', type);
        typeLi.textContent = type;
        pokemonTypes.appendChild(typeLi);
    });

    pokemonDetail.appendChild(pokemonTypes);

    const pokemonFigure = document.createElement('img');
    pokemonFigure.src = pokemon.photo;
    pokemonFigure.alt = pokemon.name;
    pokemonDetail.appendChild(pokemonFigure);

    liElement.appendChild(pokemonDetail);

    return liElement;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.forEach(pokemon => pokemonList.appendChild(convertPokemonToLi(pokemon, handlePokemonClick)))
    })
}

function handlePokemonClick(pokemon) {
    window.location.href = '/pages/pokemon-detail.html?number=' + pokemon.number
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})