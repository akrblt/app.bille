### INITIALISER BACKEND

1)  Créer fichier '.env' dans le dossier 'app.bille-backend/' 
    Le but est d'insérer des variables d'environnement qui contiennent les informations de connexion à la db.
    Le nom des variables à y insérer se trouvent dans le fichier 'app.bille-backend/db/sequelize.js', après chaque 'process.env.'
    Format : NOM_VARIABLE=VALEURS

2)  Créer la base de donnée mysql et importation des données

3)  Installer toutes les dépendances en executant la commande `npm install --save`
    à la racine du projet 'app.bille-backend'

4)  Démarrer le backend avec la commande `npm start` à la racine du dossier
    Les message suivant devraient s'afficher si tout est ok : 
    -   'connexion to db successfull' (app.bille-backend/db/initDb)
    -   'Server started on port 3000' 