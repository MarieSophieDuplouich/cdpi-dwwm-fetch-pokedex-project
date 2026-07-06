//LIRE LE GROS COMMENTAIRE EN DESSOUS DE CE CODE SVP// Base des images officielles des Pokémon (fournie par le repo GitHub officiel de PokeAPI)
// On construit l'URL nous-mêmes avec l'id, pas besoin de faire une requête en plus pour l'image
const SPRITE_BASE = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

// Petite fonction utilitaire : PokeAPI donne des URLs du genre
// "https://pokeapi.co/api/v2/pokemon/25/" et on veut juste récupérer le "25"
function getIdFromUrl(url) {
    const parts = url.split("/").filter(Boolean); // on enlève les morceaux vides
    return parts[parts.length - 1];
}

function main() {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=100")
        .then(response_obj => response_obj.json())
        .then(data => {
            // Ici la liste des pokémons s'appelle "results" chez PokeAPI
            const pokemons_arr = data.results;

            const container = document.querySelector(".pokemon-list");
            const template_pokemon = document.querySelector(".template-pokemon");

            pokemons_arr.forEach(pokemon_obj => {
                const id = getIdFromUrl(pokemon_obj.url);

                const pokemon_elem = template_pokemon.content.cloneNode(true);
                pokemon_elem.querySelector(".pokemon-id").textContent = id;
                pokemon_elem.querySelector("p").textContent = pokemon_obj.name;
                pokemon_elem.querySelector("img").src = `${SPRITE_BASE}/${id}.png`;
                pokemon_elem.querySelector("img").alt = pokemon_obj.name;
                container.appendChild(pokemon_elem);
            });
        });
}

main();

function choisirpokemon(pokedexId) {

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokedexId}`)
        .then(response_obj => response_obj.json())
        .then(pokemon_obj => {

            const pokemon_choisi = document.querySelector(".pokemon-choisi");

            pokemon_choisi.querySelector(".pokemon-id").textContent = `#${pokemon_obj.id}`;
            pokemon_choisi.querySelector(".pokemon-name").textContent = pokemon_obj.name;
            pokemon_choisi.querySelector(".image-choisie").src = `${SPRITE_BASE}/${pokemon_obj.id}.png`;
            pokemon_choisi.querySelector(".image-choisie").alt = pokemon_obj.name;

            // Partie Types
            // PokeAPI ne fournit pas d'image pour les types (contrairement à pokebuildapi).
            // On affiche donc le nom du type dans un petit badge texte à la place d'une image.
            const typesContainer = pokemon_choisi.querySelector(".Lestypes");
            typesContainer.innerHTML = ""; // vider avant d'ajouter

            pokemon_obj.types.forEach(typeInfo => {
                const badge = document.createElement("span");
                badge.textContent = typeInfo.type.name;
                badge.classList.add("type", `type-${typeInfo.type.name}`);
                typesContainer.appendChild(badge);
            });

            // Partie Evolution
            const evolutionsContainer = document.querySelector(".printpokemonbar");
            evolutionsContainer.innerHTML = ""; // vider avant d'ajouter

            // Chez PokeAPI, pour trouver les évolutions il faut d'abord passer
            // par la fiche "species" (espèce) du pokémon, qui contient un lien
            // vers la "evolution_chain" (chaîne d'évolution complète de la famille)
            fetch(pokemon_obj.species.url)
                .then(res => res.json())
                .then(species_obj => fetch(species_obj.evolution_chain.url))
                .then(res => res.json())
                .then(evolution_data => {
                    const idsEvolutions = [];
                    collectEvolutionIds(evolution_data.chain, idsEvolutions);

                    idsEvolutions
                        .filter(id => id !== String(pokemon_obj.id)) // on n'affiche pas le pokémon déjà sélectionné
                        .forEach(async (evoId) => {
                            const evolutionInfo = await fetch(`https://pokeapi.co/api/v2/pokemon/${evoId}`).then(res => res.json());

                            const evolutionDiv = document.createElement("div");
                            evolutionDiv.classList.add("pokemonevolved");

                            const imgEvolution = document.createElement("img");
                            imgEvolution.src = `${SPRITE_BASE}/${evolutionInfo.id}.png`;
                            imgEvolution.alt = evolutionInfo.name;
                            imgEvolution.classList.add("image");

                            const idEvolution = document.createElement("div");
                            idEvolution.textContent = `#${evolutionInfo.id}`;
                            idEvolution.classList.add("pokemon-evolution-id");

                            const nameEvolution = document.createElement("p");
                            nameEvolution.textContent = evolutionInfo.name;
                            nameEvolution.classList.add("name-evolution");

                            evolutionDiv.appendChild(imgEvolution);
                            evolutionDiv.appendChild(idEvolution);
                            evolutionDiv.appendChild(nameEvolution);

                            evolutionDiv.addEventListener("click", () => {
                                choisirpokemon(evolutionInfo.id);
                            });

                            evolutionsContainer.appendChild(evolutionDiv);
                        });
                });

        });
}

// Parcourt la chaîne d'évolution (structure récursive fournie par PokeAPI)
// et récupère tous les ids de Pokémon présents dans la famille d'évolution
function collectEvolutionIds(chainLink, idsList) {
    const id = getIdFromUrl(chainLink.species.url);
    idsList.push(id);
    chainLink.evolves_to.forEach(nextLink => collectEvolutionIds(nextLink, idsList));
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

// Appelle cette fonction après un petit délai pour que main() ait fini d'ajouter les Pokémon
setTimeout(ajouterEvenementsPokemon, 5000);


// barre de recherche javascript action input entrée dans la barre de recherche que le nom concaténation
// id nom et numéro avec ou sans majuscule ça doit marcher trim () etc

// revoir barre de recherche et rendre cliquable evolution


function filterByName(e) {
  e.preventDefault?.(); // si c'est un event de submit, ça évite le rechargement

  const items = document.querySelectorAll(".pokemon");
  const searchTerm = e.target.value
    .normalize("NFD")               // décompose les lettres accentuées  "Normalization Form Decomposed"
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .toLowerCase()                  // met tout en minuscules
    .trim();                        // supprime les espaces

  items.forEach(item => {
    const text = item.innerText
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

    item.style.display = text.includes(searchTerm) ? "" : "none";
  });
}

// Empêche le rechargement du formulaire
document.querySelector(".search-pokemon").addEventListener("submit", e => e.preventDefault());


//NFD 💡 Explication simple :
// "Forme décomposée" signifie que les caractères accentués sont séparés de leurs accents.
// Par exemple : La lettre é devient e + ´ (un e suivi du caractère accent aigu).
// Cela permet ensuite de supprimer les accents facilement pour des recherches insensibles aux accents.



// MSD 6 Juillet 2026
//lors de la dockerisation, le lien de l'api pokemon de l'époque n'est plus accessible le code ci-dessous contient l'ancien lien
// function main() {
//     fetch("https://pokebuildapi.fr/api/v1/pokemon/limit/100")
//         .then(response_obj => response_obj.json())
//         .then(pokemons_arr => {

//             const container = document.querySelector(".pokemon-list");
//             const template_pokemon = document.querySelector(".template-pokemon");

//             pokemons_arr.forEach(pokemon_obj => {
//                 // console.log(pokemon_obj.name);
//                 // console.log(pokemon_obj.pokedexId);

//                 const pokemon_elem = template_pokemon.content.cloneNode(true);
//                 pokemon_elem.querySelector(".pokemon-id").textContent = pokemon_obj.pokedexId;
//                 pokemon_elem.querySelector("p").textContent = pokemon_obj.name;
//                 pokemon_elem.querySelector("img").src = pokemon_obj.image;
//                 pokemon_elem.querySelector("img").alt = pokemon_obj.name;
//                 container.appendChild(pokemon_elem);
//             });
//         });

// }

// main();

// function choisirpokemon(pokedexId) {

//     fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`)
//         .then(response_obj => response_obj.json())
//         .then(pokemon_obj => {

//             const pokemon_choisi = document.querySelector(".pokemon-choisi");

//             pokemon_choisi.querySelector(".pokemon-id").textContent = `#${pokemon_obj.pokedexId}`;
//             pokemon_choisi.querySelector(".pokemon-name").textContent = pokemon_obj.name;
//             pokemon_choisi.querySelector(".image-choisie").src = pokemon_obj.image;
//             pokemon_choisi.querySelector(".image-choisie").alt = pokemon_obj.name;

//             const typesContainer = pokemon_choisi.querySelector(".Lestypes");
//             typesContainer.innerHTML = ""; // vider avant d’ajouter

//             pokemon_obj.apiTypes.forEach(typeInfo => {
//                 const imgType = document.createElement("img");
//                 imgType.src = typeInfo.image;
//                 imgType.alt = typeInfo.name;
//                 imgType.classList.add("type");
//                 typesContainer.appendChild(imgType);
//             });

//             //Partie Evolution
//             const evolutionsContainer = document.querySelector(".printpokemonbar");
           
//             evolutionsContainer.innerHTML = ""; // vider avant d’ajouter

//             //evolution image 
//             //<img src="" alt="" class="image"></img> https://pokebuildapi.fr/api/v1/pokemon
//             pokemon_obj.apiEvolutions.forEach(async ({pokedexId}) => {
//                 const evolutionInfo = await fetch(`https://pokebuildapi.fr/api/v1/pokemon/${pokedexId}`).then(res=>res.json())
//                 const evolutionDiv = document.createElement("div");
//                 evolutionDiv.classList.add("pokemonevolved");


//                 const imgEvolution = document.createElement("img");
//                 imgEvolution.src = evolutionInfo.image;
//                 imgEvolution.alt = evolutionInfo.name;
//                 imgEvolution.classList.add("image");
//                 // evolutionsContainer.appendChild(imgEvolution);
//                 //evolution id

//                 //<div class="pokemon-evolution-id"></div>
//                 const idEvolution = document.createElement("div");
//                 // const evolutionsContainer_id = pokemon_choisi.querySelector(".pokemonevolved");
//                 idEvolution.textContent = `#${evolutionInfo.pokedexId}`;
//                 idEvolution.classList.add("pokemon-evolution-id");


//                 // <p class="name-evolution"></p>

//                 const nameEvolution = document.createElement("p");
//                 nameEvolution.textContent = evolutionInfo.name;
//                 nameEvolution.classList.add("name-evolution");

//                 // idEvolution.p = evolutionInfo.name;

//                 evolutionDiv.appendChild(imgEvolution);
//                 evolutionDiv.appendChild(idEvolution);
//                 evolutionDiv.appendChild(nameEvolution);

//                 evolutionDiv.addEventListener("click", () => {
//                     choisirpokemon(evolutionInfo.pokedexId);
//                 });
//               evolutionsContainer.appendChild(evolutionDiv);
     
//             });

//         })
// }


// function ajouterEvenementsPokemon() {
//     // sélectionne toutes les cartes Pokémon
//     const toutesLesCartes = document.querySelectorAll(".pokemon-list .pokemon");
//     toutesLesCartes.forEach(carte => {
//         const id = carte.querySelector(".pokemon-id").textContent;
//         carte.addEventListener("click", () => {
//             choisirpokemon(id);
//         });
//     });
// }

// // Appelle cette fonction après un petit délai pour que main() ait fini d’ajouter les Pokémon
// setTimeout(ajouterEvenementsPokemon, 5000);



// // barre de reherche javascript action input entrée dans al abree derecherhce que le nom concaténation
// // id nom et numéro avec ou sans majuscule ça doit marcher trim () etc 

// // revoir barre de recherche et rendre cliquable evoltuion


// function filterByName(e) {
//   e.preventDefault?.(); // si c’est un event de submit, ça évite le rechargement

//   const items = document.querySelectorAll(".pokemon");
//   const searchTerm = e.target.value
//     .normalize("NFD")               // décompose les lettres accentuées  "Normalization Form Decomposed" Forme de normalisation décomposée 
//     .replace(/[\u0300-\u036f]/g, "") // supprime les accents
//     .toLowerCase()                  // met tout en minuscules
//     .trim();                        // supprime les espaces

//   items.forEach(item => {
//     const text = item.innerText
//       .normalize("NFD")
//       .replace(/[\u0300-\u036f]/g, "")
//       .toLowerCase()
//       .trim();

//     item.style.display = text.includes(searchTerm) ? "" : "none";
//   });
// }

// // Empêche le rechargement du formulaire
// document.querySelector(".search-pokemon").addEventListener("submit", e => e.preventDefault());



// //NFD 💡 Explication simple :

// // “Forme décomposée” signifie que les caractères accentués sont séparés de leurs accents.

// // Par exemple :

// // La lettre é devient e + ´ (un e suivi du caractère accent aigu).

// // Cela permet ensuite de supprimer les accents facilement pour des recherches insensibles aux accents.