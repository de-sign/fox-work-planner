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
- Menu Principal
    - Programme
    - Rémunération
- Administration
    - Clients
    - Planification
- Paramètres
    - _(Gestion des données)_
    - Thème

---

### Menu "Clients"
Menu qui permet la gestion des **clients**.

##### Vue
- Liste des **clients** par ordre alphabétique
- Voir un **client**, ses **contacts** et ses **heures de travail programmées**

##### Actions
- Ajouter / Modifier / Supprimer un **clients**
- Ajouter / Modifier / Supprimer un **contact** d'un **client**
- _(Ajouter / Modifier / Supprimer une plage d'**heures de travail programmées** hebdomadaire ou bimensuelle pour un **client**)_

---

### Menu "Planification"
Menu qui permet de définir des **heures de travail programmées** pour les **clients** afin de définir un **programme** type pour la semaine.

##### Vue
- Liste des **heures de travail programmées** pour les **clients**
    - Sous forme de calendrier hebdomadaire
    - Sous forme de liste journalière

##### Actions
- Passer d'une forme d'affichage à l'autre
- Ajouter / Modifier / Supprimer une plage d'**heures de travail programmées** hebdomadaire ou bimensuelle

---

### Menu "Programme"
Menu qui permet de voir et gérer les **heures de travail programmées** à venir, de valider les **heures de travail** effectuées (**programmées** ou non), d'ajouter des **heures de travail** non **programmées**.

##### Vue
- Liste des **heures de travail**
    - Sous forme de calendrier hebdomadaire
    - Sous forme de liste journalière
- Différenciation visuelle des **heures de travail** :
    - **Heures de travail programmées**
    - **Heures de travail** non **programmées**
    - **Heures de travail** validées
    - _(**Heures de travail** annulées)_

##### Actions
- Passer d'une forme d'affichage à l'autre
- Modifier la semaine affichée ( Affichage calendrier )
- Ajouter / Valider / Modifier / Supprimer des **heures de travail** non **programmées**
- Valider / Modifier / Annuler des **heures de travail programmées**

---

### Menu "Rémunération"
Menu qui permet de voir les **heures de travail** par **client** avec le revenu que cela génère pour le mois en cours.

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
- Calendrier mensuel pour Agenda

##### Idées
- Afficher les jours féries
- Utiliser l'API History pour la navigation entre Component et Page
- Utiliser les swipe pour changer de mois dan Agenda et Renumération