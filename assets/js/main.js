const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

/*function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}*/

function convertPokemonToLi(pokemon, clickHandler) {
    const liElement = document.createElement('li');
    liElement.classList.add('pokemon', pokemon.type);

    liElement.addEventListener('click', function() {
        // Chama o manipulador de eventos passando o pokemon como parâmetro
        clickHandler(pokemon);
    });

    const numberSpan = document.createElement('span');
    numberSpan.classList.add('number');
    numberSpan.textContent = `#${pokemon.number}`;
    liElement.appendChild(numberSpan);

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('name');
    nameSpan.textContent = pokemon.name;
    liElement.appendChild(nameSpan);

    const detailDiv = document.createElement('div');
    detailDiv.classList.add('detail');

    const typesOl = document.createElement('ol');
    typesOl.classList.add('types');
    pokemon.types.forEach(function(type) {
        const typeLi = document.createElement('li');
        typeLi.classList.add('type', type);
        typeLi.textContent = type;
        typesOl.appendChild(typeLi);
    });
    detailDiv.appendChild(typesOl);

    const imgElement = document.createElement('img');
    imgElement.src = pokemon.photo;
    imgElement.alt = pokemon.name;
    detailDiv.appendChild(imgElement);

    liElement.appendChild(detailDiv);

    return liElement;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        pokemons.forEach(pokemon => pokemonList.appendChild(convertPokemonToLi(pokemon, handlePokemonClick)))
    })
}

function handlePokemonClick(pokemon) {
    window.location.href = '/pages/pokemon-datail.html?number=' + pokemon.number
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