function main() {
    fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/100")
        .then(response_obj => response_obj.json())
        .then(pokemons_arr => {

            const container = document.querySelector(".pokemon-list");
            const template_pokemon = document.querySelector(".template-pokemon");

            pokemons_arr.forEach(pokemon_obj => {
                console.log(pokemon_obj.name);
                  console.log(pokemon_obj.pokedexId);

                const pokemon_elem = template_pokemon.content.cloneNode(true);
                pokemon_elem.querySelector(".pokemon-id").textContent = pokemon_obj.pokedexId;
                pokemon_elem.querySelector("p").textContent = pokemon_obj.name;
                pokemon_elem.querySelector("img").src = pokemon_obj.image;
                pokemon_elem.querySelector("img").alt = pokemon_obj.name;
                container.appendChild(pokemon_elem);

            });
        });


}

main();


