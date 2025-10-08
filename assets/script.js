function main() {
    fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/100")
        .then(response_obj => response_obj.json())
        .then(pokemons_arr => {

            const container = document.querySelector(".pokemon-list");
            const template_pokemon = document.querySelector(".template-pokemon");

            pokemons_arr.forEach(pokemon_obj => {
                // console.log(pokemon_obj.name);
                // console.log(pokemon_obj.pokedexId);

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

function choisirpokemon(pokedexId) {

    fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`)
        .then(response_obj => response_obj.json())
        .then(pokemon_obj => {

            const pokemon_choisi = document.querySelector(".pokemon-choisi");

            pokemon_choisi.querySelector(".pokemon-id").textContent = `#${pokemon_obj.pokedexId}`;
            pokemon_choisi.querySelector(".pokemon-name").textContent = pokemon_obj.name;
            pokemon_choisi.querySelector(".image-choisie").src = pokemon_obj.image;
            pokemon_choisi.querySelector(".image-choisie").alt = pokemon_obj.name;

            const typesContainer = pokemon_choisi.querySelector(".Lestypes");
            typesContainer.innerHTML = ""; // vider avant d’ajouter

            pokemon_obj.apiTypes.forEach(typeInfo => {
                const imgType = document.createElement("img");
                imgType.src = typeInfo.image;
                imgType.alt = typeInfo.name;
                imgType.classList.add("type");
                typesContainer.appendChild(imgType);
            });

            //Partie Evolution
            const evolutionsContainer = document.querySelector(".printpokemonbar");
            evolutionsContainer.innerHTML = ""; // vider avant d’ajouter

            //evolution image
            //<img src="" alt="" class="image"></img>
            pokemon_obj.apiEvolutions.forEach(async ({pokedexId}) => {
                const evolutionInfo = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`).then(res=>res.json())
                const evolutionDiv = document.createElement("div");
                evolutionDiv.classList.add("pokemonevolved");


                const imgEvolution = document.createElement("img");
                imgEvolution.src = evolutionInfo.image;
                imgEvolution.alt = evolutionInfo.name;
                imgEvolution.classList.add("image");
                // evolutionsContainer.appendChild(imgEvolution);
                //evolution id

                //<div class="pokemon-evolution-id"></div>
                const idEvolution = document.createElement("div");
                // const evolutionsContainer_id = pokemon_choisi.querySelector(".pokemonevolved");
                idEvolution.textContent = `#${evolutionInfo.pokedexId}`;
                idEvolution.classList.add("pokemon-evolution-id");


                // <p class="name-evolution"></p>

                const nameEvolution = document.createElement("p");
                nameEvolution.textContent = evolutionInfo.name;
                nameEvolution.classList.add("name-evolution");

                // idEvolution.p = evolutionInfo.name;

                evolutionDiv.appendChild(imgEvolution);
                evolutionDiv.appendChild(idEvolution);
                evolutionDiv.appendChild(nameEvolution);

                evolutionsContainer.appendChild(evolutionDiv);
            });

        })
}


function ajouterEvenementsPokemon() {
    // sélectionne toutes les cartes Pokémon
    const toutesLesCartes = document.querySelectorAll(".pokemon-list .pokemon");
    toutesLesCartes.forEach(carte => {
        const id = carte.querySelector(".pokemon-id").textContent;
        carte.addEventListener("click", () => {
            choisirpokemon(id);
        });
    });
}

// Appelle cette fonction après un petit délai pour que main() ait fini d’ajouter les Pokémon
setTimeout(ajouterEvenementsPokemon, 500);



// barre de reherche javascript action input entrée dans al abree derecherhce que le nom concaténation
// id nom et numéro avec ou sans majuscule ça doit marcher trim () etc 

// revoir barre de recherche et rendre cliquable evoltuion

function filterByName(e) {
  const items = document.querySelectorAll(".pokemon");
  const searchTerm = e.target.value.trim().toLowerCase();
//   e.preventDefault(); 
//   ça empêche que le formulaire buggue mais ici ça ne sert à rien
  items.forEach(item => {
    
    if (!item.innerText.toLowerCase().includes(searchTerm)) {
      item.style.display = 'none';
    }
  })
}

//pour que la page se recharge correctement en effaçant les données en dur mais là ça le fait bugger tant pis

// reload the current page
// window.location.reload(true);

document.querySelector(".search-pokemon").addEventListener("submit", function(e) {
  e.preventDefault(); 
});