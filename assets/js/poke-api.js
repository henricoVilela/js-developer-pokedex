
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name
    pokemon.weight = pokeDetail.weight
    pokemon.height = pokeDetail.height
    pokemon.species = pokeDetail.species
    pokemon.abilities = pokeDetail.abilities.map(abilitie => abilitie.ability.name).join(', ');
    pokemon.moves = pokeDetail.moves.map(mov => mov.move.name.replace('-', ' '));
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
    species.evolutionChain = pokeSpecies.evolution_chain;
    species.evolvesFromSpecies = pokeSpecies.evolves_from_species;

    pokemon.species = species;
    return pokemon;
}

function setPokemonEvolutionChain(pokemon, pokeEvolutionChain) {

    const evolutionChain = new PokemonEvolutionChain();
    evolutionChain.id = pokeEvolutionChain.id;
    evolutionChain.evolvesTo = pokeEvolutionChain.chain.evolves_to;
    evolutionChain.species = pokeEvolutionChain.chain.species;

    pokemon.species.evolutionChain = evolutionChain;
    return pokemon;
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

pokeApi.getPokemonEvolutionChain = (pokemon) => {
    return fetch(pokemon.species.evolutionChain.url)
        .then((response) => response.json())
        .then((pokeEvolutionChain) => setPokemonEvolutionChain(pokemon, pokeEvolutionChain))
}

pokeApi.getPokemonDetailByNumber = (pokemonNumber) => {
    utils.exibirLoading();

    return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonNumber}/`)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
        .then(pokeApi.getPokemonSpecies)
        .then(pokeApi.getPokemonEvolutionChain)
        .finally(() => utils.ocultarLoading())
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
