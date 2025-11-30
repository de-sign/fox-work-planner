# FOX Work Planner

Application pour **Poupinette 🥰​** afin de pouvoir lui permettre de plannifier ses heures de travail !

### Lexique
__En gras__ : Mots importants définissants le coeur du fonctionnement de l'applications.
_(En italic et entre parenthèses)_ : Mots ou fonction en questionnement ou en suspens.

---

### Objectifs
Lister les **heures de travail** effectuées par **clients**.
Anticiper la **rémunération** en fin de mois.
Voir les  **heures de travail** en avance.
Definir un **programme** type de travail.
Lister les **clients**.

### Contraintes
Utilisation sur téléphone 
Rapide, simple, efficace et évolutif

### Technologies
- Environnement
    - [Vite](https://vite.dev)
    - [Capacitor](https://capacitorjs.com) _(?)_

- Script
    - [TypeScript](https://www.typescriptlang.org)
    - [SVELTE](https://svelte.dev)

- Style
    - [Sass](https://sass-lang.com)
    - [BULMA](https://bulma.io)
    - [Font Awesome 7](https://fontawesome.com/?o=r)

---

### Menu principal
4 Menus prévus _(pour l'instant)_ :
- Général
    - Programme
    - Rémunération
- Paramètrage
    - Clients
    - Emploi du temps

---

### Menu "Clients"
Menu qui permet la gestion des **clients**.

##### Vue
- Liste des **clients** par ordre alphabétique
- Voir un **client**, ses **contacts** _(et ses **heures de travail programmées**)_

##### Actions
- Ajouter / Modifier / Supprimer un **clients**
- Ajouter / Modifier / Supprimer un **contact** d'un **client**
- _(Ajouter / Modifier / Supprimer une plage d'**heures de travail programmées** hebdomadaire ou bimensuelle pour un **client**)_

---

### Menu "Emploi du temps"
Menu qui permet de définir des **heures de travail programmées** pour les **clients** afin de définir un **programme** type pour la semaine.

##### Vue
- Liste des **heures de travail programmées** pour les **clients** sous forme de calendrier hebdomadaire

##### Actions
- Ajouter / Modifier / Supprimer une plage d'**heures de travail programmées** hebdomadaire ou bimensuelle

---

### Menu "Programme"
Menu qui permet de voir et gérer les **heures de travail programmées** à venir, de valider les **heures de travail** effectuées (**programmées** ou non), d'ajouter des **heures de travail** non **programmées**.

##### Vue
- Liste des **heures de travail** sous forme de liste journalière
    - Liste pour le mois en cours, avec la dernière semaine du mois précédent et la première semaine du mois suivant
    - _(Possibilité de remonter dans le temps et d'aller dans le futur)_
- Différenciation visuelle des **heures de travail** :
    - **Heures de travail programmées**
    - **Heures de travail** non **programmées**
    - **Heures de travail** validées

##### Actions
- Ajouter / Modifier / Supprimer des **heures de travail** non **programmées**
- Valider / Modifier / Supprimer des **heures de travail programmées**

---

### Menu "Rémunération"
Menu qui permet voir les **heures de travail** par **client** avec le revenu que cela génère pour le mois en cours.

##### Vue
- Liste des **heures de travail** par **client** pour le mois
    - Affichage des **heures de travail** validées ou non
    - Somme du revenu générer pour le **client**
- Affichage de la somme total du revenu générer
    - Revenu des **heures de travail** validées
    - Revenu théorique des **heures de travail** validées ou non

##### Actions
- Modifier le mois affiché

---

### TODO

##### Besoins
- Ajouter les différentes tailles d'images du logo dans la balise HEAD

##### Idées
- Utiliser l'API History pour la navigation entre Component et Page