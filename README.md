# Maman Solo — prototype de site web

## Contenu
- `index.html` : page du site
- `style.css` : design adaptatif téléphone / ordinateur
- `app.js` : interactions de démonstration

## Ce qui fonctionne dans cette version
- Navigation entre les rubriques
- Filtres d'activités et de secteur (le secteur est un filtre textuel, pas une vraie recherche géographique)
- Formulaire local de création d'une sortie
- Bouton de participation de démonstration
- Liste de tâches et calculateur budgétaire
- Sauvegarde locale dans le navigateur avec `localStorage`
- Liens vers des ressources officielles

## Limites importantes
Cette version est un prototype statique. Les données créées et les demandes de participation restent dans le navigateur de la personne qui l'utilise. Elles ne sont **pas partagées entre les utilisatrices**, aucun message ou courriel n'est envoyé, et il n'y a pas de compte utilisateur, de modération ni de véritable calcul de distance. Les sorties affichées avec la mention « Exemple » sont fictives.

**Ne l'utilise pas pour organiser de vraies rencontres entre inconnues avant d'avoir ajouté et testé un service partagé, un contact de signalement, une politique de confidentialité, des règles de modération et des protections adaptées.**

## Mise en ligne gratuite (site public de démonstration) avec GitHub Pages
1. Crée un compte sur https://github.com/
2. Crée un nouveau dépôt public, par exemple `maman-solo`.
3. Téléverse `index.html`, `style.css`, `app.js` et ce fichier `README.md` à la racine du dépôt.
4. Dans le dépôt, ouvre **Settings → Pages**.
5. Dans la section de déploiement, choisis **Deploy from a branch**, puis `main` et `/ (root)`, et enregistre.
6. Attends la fin du déploiement. GitHub affichera l'adresse publique de ton site dans la section Pages.

Le site sera publiquement consultable, mais les données ne seront pas mutualisées. Le dépôt étant public, ne téléverse aucune donnée personnelle.

## Pour une vraie version collaborative gratuite ou à très faible coût
Il faudra choisir et configurer un backend (par exemple Supabase ou Firebase), avec :
- authentification et règles d'accès ;
- base de données pour profils minimaux, sorties et participations ;
- consentement et procédure de suppression ;
- modération, signalement et blocage ;
- limitation de fréquence / protection anti-spam ;
- règles de conservation des données et informations RGPD ;
- tests de sécurité avant ouverture.

Le plan gratuit d'un fournisseur peut évoluer et ne garantit ni disponibilité permanente ni coût nul à long terme. Ne collecte pas d'informations sensibles ou de données d'enfants dans le prototype.
