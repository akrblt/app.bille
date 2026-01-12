### DB
Créer fichier '.env' dans le dossier 'app.bille-backend/' 
Le but est d'insérer des variables d'environnement qui contiennent les informations de connexion à la db.
Le nom des variables à y insérer se trouvent dans le fichier 'app.bille-backend/db/sequelize.js'
Format : NOM_VARIABLE=VALEURS

### INITIALISER L'APPLICATION FRONTEND
1)  créer fichier 'adress.ts' dans le dossier '/app.bille-frontend/src/services/' 
    Insérer la fonction 'IPadress()' ci-dessous dans le fichier 
    Pour l'adresse vous pouvez mettre localhost ou votre ip réseau local

    Fonction à insérer : 
    ---------------------------------------------------------------
    export function IPadress(){
        return `http://your_adress:3000`
    }
    ---------------------------------------------------------------

2)  Installer toutes les dépendances en executant la commande `npm install --save' 
    à la racine du projet 'app.bille-frontend'

3)  Démarrer l'application frontend en executant la commande 'npm start' à la racine du projet 'app.bille-frontend'. 
    Cela va faire démarrer un serveur dédié au frontend qui run sur le port 3000 par défaut. 
    Il proposerait dynamiquement un autre port si le 300 est deja utilisé (et c'est le cas par le backend) 
    C'est pourquoi il est préférable de start en premier le backend pour faciliter tout cela