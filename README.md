# CrateSort

Outil de rangement de morceaux pour DJ : écoutez vos nouveaux téléchargements, parcourez-les sur la forme d'onde, et rangez-les dans votre bibliothèque en une touche.

## Télécharger

| Ordinateur | Lien |
|---|---|
| **Mac** (puce Apple ou Intel) | [CrateSort-Mac.dmg](https://github.com/Fulberitodesign/cratesort/releases/latest/download/CrateSort-Mac.dmg) |
| **Windows** 10 / 11 | [CrateSort-Windows.exe](https://github.com/Fulberitodesign/cratesort/releases/latest/download/CrateSort-Windows.exe) |

Toutes les versions sont sur la page [Releases](https://github.com/Fulberitodesign/cratesort/releases).

**Mac** : ouvrez le `.dmg` et glissez CrateSort dans Applications. Au premier lancement, macOS indique qu'il ne peut pas vérifier l'application : cliquez sur « Terminé », puis allez dans Réglages Système → Confidentialité et sécurité → « Ouvrir quand même ». À faire une seule fois.

**Windows** : double-cliquez sur le `.exe`. Si Windows affiche « Windows a protégé votre ordinateur », cliquez sur « Informations complémentaires » → « Exécuter quand même ». CrateSort s'installe, crée un raccourci sur le bureau et s'ouvre.

Ces avertissements viennent de ce que l'application n'est pas signée par Apple ou Microsoft.

À partir de la version 2.3, plus besoin de revenir ici : CrateSort vous prévient lui-même des nouvelles versions (sur Windows, il se met à jour tout seul au redémarrage).

## Fonctionnalités

- **Nouvelle interface (2.2)** : barre latérale avec deux pages, « Ranger » (téléchargements + bibliothèque côte à côte) et « Bibliothèque » (pleine largeur), compteurs « à ranger », « rangés » et « doublons ».
- **Bibliothèque en colonnes** (style Finder, affichage par défaut) : Dossier › Sous-dossier › Sous-dossier 1 › Sous-dossier 2…, avec fil d'Ariane cliquable et écoute des morceaux déjà rangés. L'arborescence reste disponible. Largeur des colonnes réglable à la main (glisser le bord, double-clic pour ajuster au contenu, Alt+glisser pour toutes), mémorisée ; bouton « Largeur auto » pour revenir au réglage automatique.
- **Mises à jour automatiques (2.3)** : sur Windows, la nouvelle version se télécharge en arrière-plan et s'installe au redémarrage. Sur Mac, CrateSort signale la nouvelle version et propose de télécharger le `.dmg`. Désactivable dans Réglages.
- **Apparence au choix** : 9 couleurs principales ou une couleur personnalisée, et 4 fonds (Sombre, Noir, Nuit, Clair). Le choix est mémorisé.
- **Écoute rapide** : forme d'onde cliquable, ←/→ ±10 s, détection automatique du drop (touche D), départ au drop, enchaînement automatique.
- **Rangement au clavier** : Maj+1…9 vers vos dossiers favoris, Suppr pour rejeter (`_Rejetes`, rien n'est effacé), Ctrl/⌘+Z pour annuler.
- **Infos DJ** : BPM (lu dans les tags ou estimé), tonalité en notation Camelot, genre, durée, détection des doublons.
- **Morceaux compatibles** (H) : tonalité voisine et BPM à ±6 %.
- **Lots de couleurs** liés à des dossiers, rangés en un clic.
- **Nettoyage des noms** en « Artiste - Titre » (sites, FREE DOWNLOAD, numéros de piste retirés).
- **Export de playlist** `.m3u8` (Serato, Rekordbox, Traktor, VirtualDJ) et `.csv`.

## Utilisation

Quatre façons de lancer l'outil, du plus simple au plus complet :

| Version | Comment | Navigateur requis |
|---|---|---|
| Fichier HTML | Ouvrir `CrateSort.html` avec Chrome, Edge ou Brave | Oui |
| Lanceur Windows | Double-clic sur `Lancer CrateSort.bat` (à côté de `CrateSort.html`) | Oui |
| Lanceur Mac | `CrateSort (Chrome).app`, placé à côté de `CrateSort.html` | Oui |
| **Application de bureau** | [Télécharger](#télécharger) l'installateur Mac ou Windows | **Non** |

L'application de bureau est recommandée : elle embarque son propre moteur et lit le disque directement. Elle affiche donc aussi les dossiers et fichiers dont le nom contient `? " * | < > :` ou finit par un point, que les navigateurs masquent.

Safari et Firefox ne sont pas compatibles avec la version HTML, car ils ne permettent pas à une page d'accéder à un dossier.

## Construire l'application de bureau

Prérequis : [Node.js](https://nodejs.org) 18 ou plus.

```bash
cd desktop
npm install
npm start            # lancer en mode développement
npm run build:win    # sous Windows → desktop/dist/CrateSort-Windows.exe (installateur)
npm run build:mac    # sous macOS   → desktop/dist/CrateSort-Mac.dmg (puce Apple + Intel)
```

`CrateSort.html` à la racine est la source unique : `npm start` et les builds la copient automatiquement dans `desktop/`.

**Publier une nouvelle version** : changez `version` dans `desktop/package.json`, puis sur GitHub ouvrez **Releases → Draft a new release**, créez le tag du même numéro (par exemple `v2.3.0`) et cliquez sur **Publish release**. Pousser le tag depuis un terminal (`git push origin v2.3.0`) fonctionne aussi. GitHub Actions construit alors le `.exe` et le `.dmg` sur de vrais Windows et Mac, puis les ajoute à la version (`.github/workflows/installateurs.yml`).

Les installateurs ne sont pas signés (le Mac reçoit une signature ad hoc). Pour supprimer les avertissements à l'installation, il faudrait un compte Apple Developer et un certificat de signature Windows.

## Structure

```
CrateSort.html            l'outil complet (interface, lecture des tags, analyse audio)
Lancer CrateSort.bat      lanceur Windows (Chrome, sinon Edge)
CrateSort (Chrome).app/   lanceur Mac (Chrome, Edge ou Brave)
desktop/                  application de bureau Electron (installateurs construits avec electron-builder)
  main.js                 fenêtre, menus, accès disque limité aux dossiers choisis
  preload.js              pont sécurisé entre l'interface et le disque
  assets/                 icônes
```

## Confidentialité

Tout fonctionne en local : aucun fichier ni aucune donnée ne quitte l'ordinateur. Les réglages (favoris, couleurs, historique) sont enregistrés sur l'ordinateur, dans les données de l'application ou du navigateur.
