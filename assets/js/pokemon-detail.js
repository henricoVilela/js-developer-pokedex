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

            item.addEventListener("click", function(){

                itemsMenu.forEach(function(li) {
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
        const pokemonTypes = document.querySelector('.detail .types');
        pokeDetail.types.forEach(function(type) {
            const typeLi = document.createElement('li');
            typeLi.classList.add('type', type);
            typeLi.textContent = type;
            pokemonTypes.appendChild(typeLi);
        });
    }

    function addFigurePokemonDetail(pokeDetail) {
        const pokemonDetail = document.querySelector('.detail');
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

    if (pokemonNumber) {
        pokeApi.getPokemonDetailByNumber(pokemonNumber).then(pokeDetail => {

            console.log(pokeDetail)

            document.getElementById('poke_name').innerText = pokeDetail.name;

            pokemonDetailContent.classList.add(pokeDetail.type);
            addTypesIntoPokemonDetail(pokeDetail);
            addFigurePokemonDetail(pokeDetail);
            addPropertiesToAboutDetail(pokeDetail);
            addBasicStats(pokeDetail);
        });
    }
}

function backToHome() {
    window.location.href = '/index.html';
}

initPokemonDetail();
initMenuItens();