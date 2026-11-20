# Les commandes du projet

## Créer le projet

| Commande | Ce qu'elle fait |
|---|---|
| `git init` | Crée le dépôt Git. |
| `npm init -y` | Crée `package.json` avec les valeurs par défaut. |
| `npm install koa @koa/router koa-bodyparser` | Installe les bibliothèques du serveur. |

Dans `package.json`, mettre `"type": "module"` pour pouvoir écrire `import`.

## Lancer le projet

| Commande | Ce qu'elle fait |
|---|---|
| `npm install` | Installe les dépendances (après un clone). |
| `npm start` | Lance le serveur sur `http://localhost:3000`. |
| `Ctrl + C` | Arrête le serveur. |
| `node recette.js` | Teste le serveur pendant qu'il tourne (attendu : 29 / 29). |
