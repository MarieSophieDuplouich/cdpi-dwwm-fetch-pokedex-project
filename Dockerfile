# 1. On part d'une image de base qui contient déjà nodejs
FROM httpd
# 2. On copie le code source public de notre application dans le conteneur
COPY . /usr/local/apache2/htdocs/
# 5. On ouvre le port 80 du container pour que les utilisateurs puissent accéder à l'application
EXPOSE 80
# 6. Pas de commande à exécuter pour lancer l'application car le serveur web est un démon qui tourne en continu, il se lance automatiquement lorsque le conteneur est lancé
