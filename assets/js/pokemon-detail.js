const url = window.location.href;
const urlObj = new URL(url);
const pokemonNumber = urlObj.searchParams.get("number");
const pokemonDetailContent = document.getElementById('pokemon-detail-content');

function convertKgToLbs(kg) {
    const conversionFactor = 2.20462;
    return (kg * conversionFactor).toFixed(2);
}

function convertHecToKg(hec) {
    const conversionFactor = 10;
    return hec / conversionFactor;
}

function convertDecToCm(dec) {
    const conversionFactor = 10;
    return dec * conversionFactor;
}

function convertCmToFeet(cm) {
    // Fatores de conversão
    const cmPorPolegada = 2.54;
    const polegadasPorPe = 12;

    // Converte centímetros para polegadas
    const polegadas = cm / cmPorPolegada;

    // Calcula o número de pés e polegadas
    const pe = Math.floor(polegadas / polegadasPorPe);
    const restoPolegadas = polegadas % polegadasPorPe;

    return pe + "'" + restoPolegadas.toFixed(1) + "\"";
}

function convertOctToPercent(oct) {
    const conversionFactor = 8;
    return ((oct / conversionFactor) * 100).toFixed(2);
}

function hideDetailsBody() {
    document.querySelectorAll('.card-detail .body').forEach(detailBody => {
        detailBody.style.display = 'none';
    });
}

function showDetailBodyByClassName(className) {
    const detailBody = document.querySelector(`.${className}`);
    if (detailBody)
        detailBody.style.display = 'block';
}

function initMenuItens() {
    const itemsMenu = document.querySelectorAll('#menu-list li');
    if (itemsMenu) {
        itemsMenu.forEach(item => {

            item.addEventListener("click", function () {

                itemsMenu.forEach(function (li) {
                    li.classList.remove('selected');
                });
                item.classList.add('selected');

                hideDetailsBody();
                showDetailBodyByClassName(item.dataset.bodyClass);
            });
        })
    }
}

function initPokemonDetail() {


    function addTypesIntoPokemonDetail(pokeDetail) {
        const pokemonTypes = document.querySelector('.details .types');
        pokeDetail.types.forEach(function (type) {
            const typeLi = document.createElement('li');
            typeLi.classList.add('type', type);
            typeLi.textContent = type;
            pokemonTypes.appendChild(typeLi);
        });
    }

    function addFigurePokemonDetail(pokeDetail) {
        const pokemonDetail = document.querySelector('.details');
        const pokemonFigure = document.createElement('img');
        pokemonFigure.src = pokeDetail.photo;
        pokemonFigure.alt = pokeDetail.name;
        pokemonDetail.appendChild(pokemonFigure);
    }

    function addPropertiesToAboutDetail(pokeDetail) {

        const kg = convertHecToKg(pokeDetail.weight);
        const cm = convertDecToCm(pokeDetail.height);
        const femaleRate = convertOctToPercent(pokeDetail.species.genderRate);
        const maleRate = 100 - femaleRate;

        document.getElementById('poke_species').innerText = pokeDetail.species.name;
        document.getElementById('poke_height').innerText = `${convertCmToFeet(cm)} (${cm} cm)`;
        document.getElementById('poke_weight').innerText = `${convertKgToLbs(kg)} lbs (${kg} kg)`;
        document.getElementById('poke_abilities').innerText = pokeDetail.abilities;
        document.getElementById('poke_gender_rate_male').innerText = `${maleRate}%`;
        document.getElementById('poke_gender_rate_femenine').innerText = `${femaleRate}%`;
        document.getElementById('poke_egg_groups').innerText = pokeDetail.species.eggGroups;
    }

    function addBasicStats(pokeDetail) {
        const pokeBasicStats = document.querySelector('.base-stats');

        function createElementsToBasicStats(pokeState) {
            const colorFromStat = (pokeState.baseStat >= 50) ? 'green' : 'red';

            const labelStat = document.createElement('span');
            labelStat.classList.add('label');
            labelStat.style.width = '100px';
            labelStat.style.fontSize = 'small';
            labelStat.textContent = pokeState.name.replace('special-', 'sp. ');

            const valueStat = document.createElement('span');
            valueStat.classList.add('value', 'mr-1r');
            valueStat.textContent = pokeState.baseStat;

            const progressBar = document.createElement('div');
            progressBar.classList.add('progress-bar');

            const progressValue = document.createElement('div');
            progressValue.classList.add('progress-value', colorFromStat);
            progressValue.style.width = `${pokeState.baseStat}%`;
            progressBar.appendChild(progressValue);

            const br = document.createElement('div');
            br.classList.add('br');

            pokeBasicStats.appendChild(labelStat);
            pokeBasicStats.appendChild(valueStat);
            pokeBasicStats.appendChild(progressBar);
            pokeBasicStats.appendChild(br);
        }

        pokeDetail.stats.forEach(createElementsToBasicStats);

    }

    function addPokemonsEvolutions(pokeDetail) {

        function convertPokemonToLi(pokeEvo, clickHandler) {
            const resultRegex = pokeEvo.species.url.match(/\/(\d+)\/$/);
            const idEvolve = resultRegex && resultRegex[1];

            const liElement = document.createElement('li');
            liElement.classList.add('pokemon', pokeDetail.type);
            liElement.addEventListener('click', function () {
                clickHandler(idEvolve);
            });

            const pokemonName = document.createElement('span');
            pokemonName.classList.add('name');
            pokemonName.textContent = pokeEvo.species.name;
            liElement.appendChild(pokemonName);

            const pokemonDetail = document.createElement('div');
            pokemonDetail.classList.add('detail');
            pokemonDetail.style.alignSelf = 'end';

            const pokemonFigure = document.createElement('img');
            pokemonFigure.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${idEvolve}.svg`;
            pokemonFigure.alt = pokeEvo.species.name;
            pokemonFigure.style.width = '50px';
            pokemonFigure.style.height = '50px';

            pokemonDetail.appendChild(pokemonFigure);

            liElement.appendChild(pokemonDetail);

            return liElement;
        }

        const pokeEvolution = document.querySelector('.evolution');

        const pokemonList = document.createElement('ol');
        pokemonList.classList.add('pokemons-evolves');
        pokeEvolution.appendChild(pokemonList);

        const evolvesTo = pokeDetail.species.evolutionChain.evolvesTo;

        function createEvolves(evolves) {
            evolves.forEach(evolve => {

                if (evolve.species.name != pokeDetail.name) 
                    pokemonList.appendChild(convertPokemonToLi(evolve, handlePokemonClick))
                
                if (evolve.evolves_to.length)
                    createEvolves(evolve.evolves_to);

            });
        }

        //Primeira evolução
        if (pokeDetail.species.evolvesFromSpecies) 
            pokemonList.appendChild(
                convertPokemonToLi({ species: pokeDetail.species.evolutionChain.species }, handlePokemonClick)
            );
        
        
        createEvolves(evolvesTo);
    }

    function addPokemonsMoves(pokeDetail) {
        const pokeMoves = document.querySelector('.moves');

        pokeDetail.moves.forEach(move => {
            const pokeMove = document.createElement('span');
            pokeMove.classList.add('move');
            pokeMove.textContent = move
            pokeMoves.appendChild(pokeMove);
        });
    }

    if (pokemonNumber) {
        pokeApi.getPokemonDetailByNumber(pokemonNumber).then(pokeDetail => {
            
            document.getElementById('poke_name').innerText = pokeDetail.name;

            pokemonDetailContent.classList.add(pokeDetail.type);
            addTypesIntoPokemonDetail(pokeDetail);
            addFigurePokemonDetail(pokeDetail);
            addPropertiesToAboutDetail(pokeDetail);
            addBasicStats(pokeDetail);
            addPokemonsEvolutions(pokeDetail);
            addPokemonsMoves(pokeDetail);
        });
    }
}

function backToHome() {
    window.location.href = '/index.html';
}

function handlePokemonClick(pokeNumber) {
    window.location.href = '/pages/pokemon-detail.html?number=' + pokeNumber
}


initPokemonDetail();
initMenuItens();