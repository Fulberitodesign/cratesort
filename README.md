# CrateSort

Outil de rangement de morceaux pour DJ : écoutez vos nouveaux téléchargements, parcourez-les sur la forme d'onde, et rangez-les dans votre bibliothèque en une touche.

## Fonctionnalités

- **Écoute rapide** : forme d'onde cliquable, ←/→ ±10 s, détection automatique du drop (touche D), départ au drop, enchaînement automatique.
- **Rangement au clavier** : Maj+1…9 vers vos dossiers favoris, Suppr pour rejeter (`_Rejetes`, rien n'est effacé), Ctrl/⌘+Z pour annuler.
- **Infos DJ** : BPM (lu dans les tags ou estimé), tonalité en notation Camelot, genre, durée, détection des doublons.
- **Morceaux compatibles** (H) : tonalité voisine et BPM à ±6 %.
- **Lots de couleurs** liés à des dossiers, rangés en un clic.
- **Nettoyage des noms** en « Artiste - Titre » (sites, FREE DOWNLOAD, numéros de piste retirés).
- **Bibliothèque en arborescence ou en colonnes** (style Finder), avec écoute des morceaux déjà rangés.
- **Export de playlist** `.m3u8` (Serato, Rekordbox, Traktor, VirtualDJ) et `.csv`.

## Utilisation

Quatre façons de lancer l'outil, du plus simple au plus complet :

| Version | Comment | Navigateur requis |
|---|---|---|
| Fichier HTML | Ouvrir `CrateSort.html` avec Chrome, Edge ou Brave | Oui |
| Lanceur Windows | Double-clic sur `Lancer CrateSort.bat` (à côté de `CrateSort.html`) | Oui |
| Lanceur Mac | `CrateSort (Chrome).app`, placé à côté de `CrateSort.html` | Oui |
| **Application de bureau** | Dossier `desktop/` (voir ci-dessous) | **Non** |

L'application de bureau est recommandée : elle embarque son propre moteur et lit le disque directement. Elle affiche donc aussi les dossiers et fichiers dont le nom contient `? " * | < > :` ou finit par un point, que les navigateurs masquent.

Safari et Firefox ne sont pas compatibles avec la version HTML, car ils ne permettent pas à une page d'accéder à un dossier.

## Construire l'application de bureau

Prérequis : [Node.js](https://nodejs.org) 18 ou plus.

```bash
cd desktop
npm install
npm start            # lancer en mode développement
npm run build:win    # Windows x64   → desktop/dist/CrateSort-win32-x64/CrateSort.exe
npm run build:mac    # Mac Intel     → desktop/dist/CrateSort-darwin-x64/CrateSort.app
npm run build:mac-arm  # Mac Apple Silicon
```

`CrateSort.html` à la racine est la source unique : `npm start` et les builds la copient automatiquement dans `desktop/`.

Les applications ne sont pas signées. Au premier lancement :

- **Windows** : « Informations complémentaires » → « Exécuter quand même ».
- **Mac** : clic droit → Ouvrir, ou Réglages Système → Confidentialité et sécurité → « Ouvrir quand même ». Une build Mac faite sous Windows ou Linux doit être re-signée (signature ad hoc) avant distribution, par exemple avec `codesign --force --deep -s - CrateSort.app` sur un Mac.

## Structure

```
CrateSort.html            l'outil complet (interface, lecture des tags, analyse audio)
Lancer CrateSort.bat      lanceur Windows (Chrome, sinon Edge)
CrateSort (Chrome).app/   lanceur Mac (Chrome, Edge ou Brave)
desktop/                  application de bureau Electron
  main.js                 fenêtre, menus, accès disque limité aux dossiers choisis
  preload.js              pont sécurisé entre l'interface et le disque
  assets/                 icônes
```

## Confidentialité

Tout fonctionne en local : aucun fichier ni aucune donnée ne quitte l'ordinateur. Les réglages (favoris, couleurs, historique) sont enregistrés sur l'ordinateur, dans les données de l'application ou du navigateur.
