# Page d'accueil (landing) de CrateSort
from common import *

def ico(paths):
    return f'<div class="ic"><svg viewBox="0 0 24 24">{paths}</svg></div>'

FEATURES = [
    ('<path d="M3 12h3l3-8 4 16 3-8h5"/>', 'Écoute au drop',
     'Forme d’onde cliquable, détection automatique du drop (<kbd>D</kbd>), départ au drop et enchaînement des morceaux.'),
    ('<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>', 'Rangement au clavier',
     '<kbd>Entrée</kbd> pour déplacer, <kbd>Maj</kbd>+<kbd>1</kbd>…<kbd>9</kbd> vers vos favoris, <kbd>Suppr</kbd> pour écarter, <kbd>Ctrl</kbd>+<kbd>Z</kbd> pour annuler.'),
    ('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>', 'Bibliothèque en colonnes',
     'Parcourez vos dossiers comme dans le Finder, avec fil d’Ariane et colonnes réglables à la largeur que vous voulez.'),
    ('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', 'BPM, tonalité, genre',
     'Lus dans les tags ou estimés à l’écoute, avec la tonalité en notation Camelot (8A, 11B…) pour le mix harmonique.'),
    ('<path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>', 'Morceaux compatibles',
     'Touche <kbd>H</kbd> : seuls les morceaux qui se mixent avec la sélection restent (tonalité voisine, BPM à ±6 %).'),
    ('<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/>', 'Doublons repérés',
     'CrateSort signale les morceaux déjà présents dans votre bibliothèque avant que vous ne les rangiez une deuxième fois.'),
    ('<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>', 'Noms nettoyés',
     '« Artiste - Titre » en un clic : sites, « FREE DOWNLOAD » et numéros de piste disparaissent des noms de fichiers.'),
    ('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>', '100 % local et sûr',
     'Aucun fichier ne quitte votre ordinateur. Rien n’est effacé : les rejets vont dans _Rejetes, tout s’annule.'),
]

TABS = [
    ('ranger', 'Ranger', 'Écoutez à gauche, choisissez le dossier à droite, rangez en une touche.'),
    ('bibliotheque', 'Bibliothèque', 'Toute votre bibliothèque en colonnes, comme dans le Finder.'),
    ('nuit', 'Thèmes', 'Sombre, Noir, Nuit ou Clair, et la couleur de votre choix.'),
    ('visite', 'Visite guidée', 'Une visite en 10 étapes accompagne votre premier lancement.'),
]

FAQ = [
    ('CrateSort fonctionne-t-il sur Mac et sur Windows ?',
     'Oui. CrateSort s’installe sur Mac (puce Apple et Intel, macOS 10.13 ou plus récent) et sur PC Windows 10 et 11. Il n’existe pas de version en ligne : l’application travaille directement sur les dossiers de votre ordinateur.'),
    ('Pourquoi un avertissement s’affiche-t-il à l’installation ?',
     'CrateSort n’est pas encore signé par Apple ou Microsoft. Sur Mac, ouvrez l’app une fois, cliquez sur « Terminé », puis Réglages Système → Confidentialité et sécurité → « Ouvrir quand même ». Sur Windows, cliquez sur « Informations complémentaires » → « Exécuter quand même ». Cette étape n’est à faire qu’une seule fois.'),
    ('Mes morceaux sont-ils envoyés sur Internet ?',
     'Non. Tout se passe sur votre ordinateur : CrateSort lit et déplace vos fichiers localement. La seule connexion sert à vérifier s’il existe une nouvelle version, et vous pouvez la désactiver dans les réglages.'),
    ('Est-ce que CrateSort peut effacer mes fichiers ?',
     'CrateSort ne supprime rien. Les morceaux écartés sont déplacés dans un dossier _Rejetes, chaque déplacement peut être annulé avec Ctrl/⌘+Z, et un fichier n’est jamais écrasé.'),
    ('Est-ce compatible avec Serato, Rekordbox, Traktor ou VirtualDJ ?',
     'CrateSort range vos fichiers dans vos dossiers, que votre logiciel de mix lit ensuite. Vous pouvez aussi exporter la liste des morceaux rangés en playlist .m3u8 ou .csv. Pour Serato, le bouton « Mettre à jour Serato » ajoute directement les morceaux rangés à votre bibliothèque et à vos crates.'),
    ('Comment se font les mises à jour ?',
     'À chaque ouverture, CrateSort vérifie s’il existe une nouvelle version. Sur Windows, elle se télécharge et s’installe toute seule au redémarrage. Sur Mac, CrateSort vous la signale et propose de télécharger la nouvelle version.'),
]

def build():
    ld = [
        {"@context": "https://schema.org", "@type": "SoftwareApplication", "name": "CrateSort",
         "applicationCategory": "MultimediaApplication", "operatingSystem": "macOS, Windows",
         "description": "Logiciel de rangement de morceaux pour DJ : écoute au drop, BPM, tonalité Camelot, doublons et rangement au clavier.",
         "url": BASE, "downloadUrl": REPO + "/releases/latest", "image": BASE + "assets/img/ranger.webp",
         "screenshot": BASE + "assets/img/ranger.webp", "inLanguage": "fr"},
        {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
            {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]},
        {"@context": "https://schema.org", "@type": "WebSite", "name": "CrateSort", "url": BASE, "inLanguage": "fr"},
    ]
    title = 'CrateSort — Rangement de morceaux pour DJ (Mac, Windows)'
    desc = 'Écoutez vos nouveaux sons au drop, repérez BPM, tonalité et doublons, puis rangez-les dans votre bibliothèque en une touche. Pour Mac et Windows.'
    out = head(title, desc, '', extra_ld=ld, preload='<link rel="modulepreload" href="https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.min.js">\n')
    out += header()
    feats = ''.join(f'<article class="card rv">{ico(p)}<h3>{t}</h3><p>{d}</p></article>' for p, t, d in FEATURES)
    tabs = ''.join(f'<button role="tab" aria-selected="{"true" if i == 0 else "false"}" data-img="assets/img/{k}.webp" data-alt="Capture d’écran de CrateSort : {lbl}" data-cap="{cap}">{lbl}</button>' for i, (k, lbl, cap) in enumerate(TABS))
    faq = ''.join(f'<details class="rv"><summary>{q}</summary><p>{a}</p></details>' for q, a in FAQ)
    out += f'''<main>
<section class="hero" aria-labelledby="titre">
  <div class="wrap">
    <div>
      <span class="eyebrow">Pour les DJ · Mac et Windows</span>
      <h1 id="titre">Rangez vos nouveaux sons <em>en un clic</em>.</h1>
      <p class="lead">CrateSort vous fait écouter vos derniers téléchargements au drop, repère le BPM, la tonalité et les doublons, puis les range dans votre bibliothèque en une touche. Tout se passe sur votre ordinateur.</p>
      {dl_buttons()}
      <p class="dlnote"><span data-os-label>Mac (puce Apple et Intel) et Windows 10 / 11.</span> <span data-version></span></p>
      <div class="mobile-note">📱 CrateSort s’installe sur un Mac ou un PC. Ouvrez cette page depuis votre ordinateur pour le télécharger. <button class="btn sm" data-copy style="margin-top:10px">Envoyer le lien</button></div>
    </div>
    <div class="stage" aria-hidden="true">
      <canvas id="scene"></canvas>
      <img class="fallback" src="assets/img/icon-256.png" alt="" width="256" height="256">
    </div>
  </div>
</section>

<div class="band"><div class="wrap">
  <span><b>MP3, WAV, FLAC, AIFF, M4A…</b></span><span>Export de playlist <b>.m3u8</b> pour Rekordbox, Serato, Traktor, VirtualDJ</span><span><b>Rien n’est effacé</b>, tout s’annule</span>
</div></div>

<section id="vitrine" aria-labelledby="t-vitrine">
  <div class="wrap">
    <div class="sh center rv"><span class="kicker">L’application</span><h2 id="t-vitrine">Pensé pour ranger vite, sans quitter le clavier</h2><p>Une interface sombre, lisible en soirée comme au studio, avec vos couleurs.</p></div>
    <div class="tabs" role="tablist">{tabs}</div>
    <div class="show"><div class="tilt"><img id="showImg" src="assets/img/ranger.webp" srcset="assets/img/ranger-800.webp 800w, assets/img/ranger.webp 1600w" sizes="(max-width: 1200px) 100vw, 1130px" width="1600" height="1000" alt="Capture d’écran de CrateSort : Ranger" fetchpriority="high"></div></div>
    <p class="capt" id="showCap">{TABS[0][2]}</p>
  </div>
</section>

<section id="fonctionnalites" aria-labelledby="t-feat">
  <div class="wrap">
    <div class="sh rv"><span class="kicker">Fonctionnalités</span><h2 id="t-feat">Tout ce qu’il faut pour trier une semaine de sons en dix minutes</h2><p>CrateSort se concentre sur une chose : faire passer vos nouveaux morceaux du dossier Téléchargements au bon dossier de votre bibliothèque.</p></div>
    <div class="grid">{feats}</div>
  </div>
</section>

<section id="comment" aria-labelledby="t-comment">
  <div class="wrap">
    <div class="sh rv"><span class="kicker">Comment ça marche</span><h2 id="t-comment">Trois étapes, et votre dossier Téléchargements est vide</h2></div>
    <div class="steps">
      <div class="step rv"><h3>Choisissez vos dossiers</h3><p>Le dossier où arrivent vos sons, et la racine de votre bibliothèque. CrateSort s’en souvient.</p></div>
      <div class="step rv"><h3>Écoutez au drop</h3><p><kbd>↓</kbd> pour passer au morceau suivant : il démarre directement au drop, avec BPM et tonalité affichés.</p></div>
      <div class="step rv"><h3>Rangez en une touche</h3><p><kbd>Maj</kbd>+<kbd>1</kbd>…<kbd>9</kbd> envoie le morceau dans un de vos dossiers favoris. Le suivant se lance tout seul.</p></div>
    </div>
  </div>
</section>

<section id="serato" aria-labelledby="t-serato">
  <div class="wrap duo">
    <div class="rv">
      <span class="pill" style="background:var(--a-soft);color:var(--a);border-color:var(--a-line)">Nouveau</span>
      <h2 id="t-serato" style="font-size:clamp(28px,3.4vw,42px);font-weight:800;margin-bottom:14px">Votre bibliothèque Serato à jour en un clic</h2>
      <p style="color:var(--text2);font-size:18px">Vous avez rangé 20 morceaux sur 100 et la soirée commence dans un quart d’heure ? Un clic sur « Mettre à jour Serato » envoie ce qui est rangé, et vous continuerez plus tard.</p>
      <ul class="list"><li>Crates qui suivent vos dossiers</li><li>Chemins réparés pour les morceaux déjà dans Serato</li><li>Sauvegarde automatique et annulation en un clic</li><li>Plus besoin de réimporter vos morceaux</li></ul>
    </div>
    <div class="shot rv"><img src="assets/img/bibliotheque-800.webp" srcset="assets/img/bibliotheque-800.webp 800w, assets/img/bibliotheque.webp 1600w" sizes="(max-width: 860px) 100vw, 560px" width="1600" height="1000" alt="La bibliothèque de CrateSort en colonnes" loading="lazy"></div>
  </div>
</section>

<section id="faq" aria-labelledby="t-faq">
  <div class="wrap">
    <div class="sh center rv"><span class="kicker">Questions</span><h2 id="t-faq">Questions fréquentes</h2></div>
    <div class="faq">{faq}</div>
  </div>
</section>

<section id="telecharger" aria-labelledby="t-dl" style="padding-top:20px">
  <div class="wrap">
    <div class="cta rv">
      <h2 id="t-dl">Téléchargez CrateSort</h2>
      <p style="color:var(--text2);font-size:18px;margin-top:12px">Choisissez votre système. Les mises à jour arrivent ensuite automatiquement.</p>
      {dl_buttons()}
      <p class="dlnote"><span data-version></span></p>
      <div class="mobile-note" style="text-align:left">📱 Vous êtes sur téléphone : CrateSort s’installe sur un Mac ou un PC. <button class="btn sm" data-copy style="margin-top:10px">Envoyer le lien</button></div>
      <div class="inst">
        <div><h3>Installer sur Mac</h3><ol><li>Ouvrez le fichier .dmg et glissez CrateSort dans Applications.</li><li>Lancez CrateSort, puis cliquez sur « Terminé » au message d’avertissement.</li><li>Réglages Système → Confidentialité et sécurité → « Ouvrir quand même ».</li></ol></div>
        <div><h3>Installer sur Windows</h3><ol><li>Double-cliquez sur le fichier .exe.</li><li>Si Windows vous avertit : « Informations complémentaires » → « Exécuter quand même ».</li><li>CrateSort s’installe, crée un raccourci et s’ouvre.</li></ol></div>
      </div>
    </div>
  </div>
</section>
</main>
<script type="module" src="assets/scene.js"></script>
'''
    out += footer()
    return out
