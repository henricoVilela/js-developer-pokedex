

class Pokemon {
    number;
    name;
    type;
    types = [];
    photo;

    height;
    weight;
    species = {};
    abilities = [];
    stats = [];
}

class PokemonSpecies {
    name;
    eggGroups;
    genderRate;
    evolutionChain;
    evolvesFromSpecies;
}

class PokemonEvolutionChain {
    id;
    evolvesTo = [];
    species = {};
}
