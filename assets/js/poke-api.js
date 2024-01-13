
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.weight = pokeDetail.weight
    pokemon.height = pokeDetail.height
    pokemon.species = pokeDetail.species
    pokemon.abilities = pokeDetail.abilities.map(abilitie => abilitie.ability.name).join(', ');
    pokemon.stats = pokeDetail.stats.map(stat => {
        return { baseStat: stat.base_stat, name: stat.stat.name};
    });
    
    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

function setPokemonSpecies(pokemon, pokeSpecies) {
    const species = new PokemonSpecies();
    species.name = pokeSpecies.name;
    species.genderRate = pokeSpecies.gender_rate;
    species.eggGroups = pokeSpecies.egg_groups.map(group => group.name).join(', ');

    pokemon.species = species;
    return pokemon;
}

pokeApi.getPokemonDetailByNumber = (pokemonNumber) => {
    utils.exibirLoading();

    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
        .then(pokeApi.getPokemonSpecies)
        .finally(() => utils.ocultarLoading())
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemonSpecies = (pokemon) => {
    return fetch(pokemon.species.url)
        .then((response) => response.json())
        .then((pokeSpecies) => setPokemonSpecies(pokemon, pokeSpecies))
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}
