# Pokedex

![alt text](image.png)

Pour la récupération des pokémons, nous utiliserons l'API Pokebuild qui contient toutes les informations sur les pokémons.

Cette API REST est accessible à l'adresse : https://pokebuildapi.fr/api/v1

## Repo à forker

Forkez ce dépôt GitHub : https://github.com/CHAOUCHI/cdpi-dwwm-fetch-pokedex-project


## Cahier des charges

|Tâches|
|-|
|Lister tous les pokémons dans une liste défilante sur la gauche de l'écran.|
|Afficher les détails d'un pokémon sur la droite lorsque l'on *clique* sur un pokémon de la liste.|
|Afficher l'évolution du pokémon dans les détails et permettre, comme pour la liste de pokémons, le clic sur ce pokémon pour en voir les détails.|
|Mettre en place une barre de recherche qui affiche le pokémon tapé dans le menu détails sur la droite de l'écran.|


> Astuce : il est possible de stocker une donnée dans la balise HTML avec l'attribut `data-*`. Par exemple `<div class="pokemon" data-id="1">...</div>`
> https://developer.mozilla.org/fr/docs/Web/HTML/Global_attributes/data-*

<!-- ## Maquette

Voici la maquette Figma qui permet de récupérer facilement les couleurs hexadécimales et les assets si besoin.

Lien Figma : https://www.figma.com/file/eZkyaB5YcGxTsTgn4ZEcv2/Untitled?type=design&node-id=59%3A111&mode=design&t=QfImaCXxk6vqaSfd-1 -->

```bash
docker build  --tag pokedexmsd .
docker run -d -p 8082:80 pokedexmsd
```
# 2. Documentation : Les développeurs écrivent de la documentation pour expliquer comment lancer l'application ainsi que les ports TCP qu'elle écoute (listen).
##### Prérequis (requirements)
Apache serveur web

Installation des dépendances (dependencies)
Ce projet ne nécessite aucune dépendance, cependant pour qu'un serveur web puisse servir un site web, il faut que les fichiers du site soient présents dans le dossier de l'application du serveur web (ex: /var/www/html pour apache), donc il suffit de copier le code source de notre application dans ce dossier.

Voir la doc pour apache : https://hub.docker.com/_/httpd#create-a-dockerfile-in-your-project
Ou la doc pour nginx : https://hub.docker.com/_/nginx#hosting-some-simple-static-content
Il est très important de lire la documentation officielle des images que vous utilisez par exemple ici je veux utiliser httpd le container apache serveur. Dans la doc je peux voir que le site web est servi depuis le dossier /usr/local/apache2/htdocs/, donc je sais que je dois copier mon code source dans ce dossier pour que mon site soit servi par apache.

alt text

Lancement de l'application (run) L'application est un démon (une application qui tourne sur le port 80 en continu). Donc pour la lancer il suffit de lancer le serveur web après s'être assuré que les fichiers du site sont présents dans le dossier de l'application du serveur web (ex: /var/www/html pour apache). Voilà on a bien documenté le lancement de notre application, on peut maintenant passer à l'étape suivante : la conteneurisation de l'application avec Docker.

## 3. Build : Le DevOps écrit un DockerFile, un fichier texte qui copie le code source et définit les commandes linux à exécuter pour lancer l'application.
Pour construire une nouvelle image il est important de résumer l'architecture réseau de notre application. En effet, notre application est un serveur web qui écoute sur le port 80, donc pour que les utilisateurs puissent accéder à notre application, il faut exposer le port 80 de notre conteneur vers l'extérieur de Docker, c'est à dire vers notre machine locale (localhost). Ainsi les utilisateurs pourront accéder à notre application en se connectant à localhost:80.

    a-Créer un fichier DockerFile à la racine du projet à l'aide de la documentation :

        projet/DockerFile

    Attention à ce que le fichier DockerFile soit bien à la racine du projet, sinon la commande docker build ne pourra pas trouver le code à copier coller dans le conteneur. COPY . /usr/local/apache2/htdocs/

    b- Construire l'image docker et la nommer, ici on la nomme frontend-basic mais vous pouvez lui donner le nom que vous voulez.

        docker build -t frontend-basic .

Attention ! arrêter les autres conteneurs Dock et être dans le bon projet : cd/bonprojet puis faire la commande suivante : docker build -t frontend-basic .

### Lancement de l'application (run)
## 4. Run : Le DevOps exécute le conteneur sur le serveur en précisant les ports TCP à ouvrir pour que les utilisateurs puissent accéder à l'application.
-p : pour exposer les ports TCP de l'application vers l'extérieur du conteneur, la syntaxe est -p <port_exterieur>:<port_interieur>, dans notre cas on veut exposer le port 3000 de l'application vers le port 3000 de notre machine locale, donc on utilise -p 3000:3000.

--name : pour donner un nom à notre conteneur, c'est plus facile de gérer les conteneurs avec des noms plutôt que des IDs générés aléatoirement, dans notre cas on va nommer notre conteneur jolieapidebilly pour faire simple.

    a- Lancer le conteneur, ici je vais le lancer sur le port 8080 comme ça je ne rentre pas en conflit avec d'autres applications qui pourraient déjà utiliser le port 80 sur ma machine locale.

    docker run -p 8080:80 --name frontend-basic frontend-basic

    b-Tester la route http://localhost:8080 dans le navigateur pour vérifier que notre site web fonctionne correctement

Fait dans la route http://localhost:8085

