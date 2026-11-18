# Articles du blog CrateSort (6 à 10)
A = []

A.append(dict(
slug='renommer-fichiers-mp3',
tag='Fichiers',
title='Renommer ses fichiers MP3 en « Artiste - Titre » proprement',
seo='Renommer ses fichiers MP3 en « Artiste - Titre » proprement',
desc='Numéros de piste, noms de sites, « FREE DOWNLOAD » : comment renommer ses fichiers MP3 en « Artiste - Titre » proprement, à partir des tags, sans rien casser.',
minutes=6,
chapo='« 03_artiste-titre_(free_download)_www.site.com.mp3 » : sur l’écran d’une platine, ce genre de nom fait perdre de précieuses secondes. Un nom propre, au format « Artiste - Titre », se lit d’un coup d’œil et se trie correctement partout.',
body='''
<h2 id="format">Le bon format</h2>
<p>Le format le plus répandu chez les DJ est simple :</p>
<p><strong>Artiste - Titre (Version).extension</strong></p>
<ul>
<li><strong>Artiste</strong> d’abord, pour que le tri alphabétique regroupe les morceaux d’un même artiste ;</li>
<li><strong>Titre</strong> ensuite, séparé par « espace, tiret, espace » ;</li>
<li><strong>Version</strong> entre parenthèses quand elle compte : Extended Mix, Dub, Remix de tel artiste.</li>
</ul>
<p>Exemple : <code>Kerri Chandler - Rain (Extended Mix).mp3</code>.</p>

<h2 id="retirer">Ce qu’il faut retirer</h2>
<ul>
<li>les <strong>numéros de piste</strong> en début de nom (« 01 », « 03_ ») ;</li>
<li>les <strong>noms de sites</strong> et adresses web ;</li>
<li>les mentions <strong>« FREE DOWNLOAD »</strong>, « Promo », « Out now » ;</li>
<li>les <strong>tirets bas</strong> utilisés à la place des espaces ;</li>
<li>les <strong>espaces en double</strong> et les espaces en fin de nom.</li>
</ul>

<h2 id="tags">Partir des tags plutôt que du nom</h2>
<p>La plupart des fichiers contiennent des tags (ID3 pour les MP3) avec l’artiste et le titre. Ils sont souvent plus fiables que le nom du fichier : utilisez-les comme source, puis corrigez à la main les rares cas où ils sont vides ou faux.</p>

<h2 id="caracteres">Attention aux caractères interdits</h2>
<p>Windows refuse dans les noms de fichiers les caractères <code>\\ / : * ? " &lt; &gt; |</code>, et macOS traite le deux-points à part. Si votre bibliothèque passe d’un système à l’autre ou sur une clé USB, remplacez-les : « Feat. » plutôt que « / », un tiret plutôt que « : ».</p>
<div class="tip"><p>Astuce : renommez vos fichiers <strong>avant</strong> de les importer dans votre logiciel de mix. Renommer un fichier déjà importé peut le faire apparaître comme manquant.</p></div>

<h2 id="outil">Renommer en lot, avec contrôle</h2>
<p>Renommer 60 fichiers à la main prend du temps et provoque des fautes. Un outil de renommage en lot fait le travail, à condition de pouvoir <strong>vérifier chaque nom avant de valider</strong> et <strong>annuler</strong> en cas d’erreur. Dans CrateSort, « Nettoyer les noms » (touche <kbd>F2</kbd>) propose pour chaque fichier un nouveau nom basé sur les tags, retire les mentions parasites, vous laisse corriger chaque ligne, et s’annule avec <kbd>Ctrl</kbd>+<kbd>Z</kbd>.</p>

<h2 id="conclusion">En résumé</h2>
<p>« Artiste - Titre (Version) », sans numéro, sans site, sans caractère interdit, et à partir des tags. Faites-le dès l’arrivée des fichiers, dans le cadre de votre <a href="ranger-telechargements-musique.html">routine de rangement</a>, et vous n’aurez plus jamais à y penser.</p>
'''))

A.append(dict(
slug='preparer-un-set-dj',
tag='Mix',
title='Préparer un set DJ : de la sélection au dossier de soirée',
seo='Préparer un set DJ : de la sélection au dossier de soirée',
desc='Public, sélection, courbe d’énergie, BPM et tonalités, crate de soirée : la méthode en six étapes pour préparer un set DJ sereinement.',
minutes=8,
chapo='Préparer un set ne veut pas dire tout écrire à l’avance. Il s’agit d’arriver avec une sélection solide, organisée de façon à pouvoir improviser en fonction de la salle. Voici une méthode en six étapes.',
body='''
<h2 id="contexte">1. Comprendre le contexte</h2>
<p>Avant d’ouvrir votre bibliothèque, répondez à quatre questions : quel public, quel lieu, quel créneau (ouverture, pic, clôture) et combien de temps ? Un warm-up de deux heures et un pic d’une heure ne se préparent pas de la même façon.</p>

<h2 id="selection">2. Faire une large présélection</h2>
<p>Sélectionnez environ deux à trois fois plus de morceaux que vous n’en jouerez : pour une heure de set, prévoyez 40 à 60 morceaux. Partez de vos dossiers par genre et de vos nouveautés récentes. Une bibliothèque bien rangée rend cette étape rapide (voir <a href="organiser-bibliotheque-musicale-dj.html">organiser sa bibliothèque</a>).</p>

<h2 id="energie">3. Construire une courbe d’énergie</h2>
<p>Classez votre présélection en trois ou quatre groupes d’énergie : calme, montée, pic, redescente. Un set réussi n’est presque jamais une ligne droite : il monte, respire, remonte. Gardez des morceaux « joker » capables de relancer une piste qui s’essouffle.</p>

<h2 id="harmonie">4. Vérifier BPM et tonalités</h2>
<p>Regardez les BPM de votre sélection : de trop grands écarts imposent des transitions plus créatives (coupures, effets, changement de tempo progressif). Repérez aussi les familles de tonalités compatibles grâce à la <a href="mix-harmonique-roue-camelot.html">roue Camelot</a>. Quelques enchaînements harmoniques bien préparés donnent beaucoup de fluidité.</p>

<h2 id="dossier">5. Préparer un dossier ou une crate de soirée</h2>
<p>Rassemblez la sélection dans une crate ou une playlist dédiée à la soirée, sans déplacer les fichiers. Si votre logiciel le permet, ajoutez des sous-groupes (« Ouverture », « Pic », « Bonus »). Une <a href="exporter-playlist-m3u8.html">playlist M3U8</a> permet aussi de transporter la sélection d’un logiciel à l’autre.</p>
<div class="tip"><p>Astuce : préparez vos points de repère (cue points) sur les morceaux de la sélection : début du drop, break, fin de l’intro. En soirée, vous gagnerez un temps précieux.</p></div>

<h2 id="technique">6. Vérifier la technique</h2>
<ul>
<li>Fichiers présents et lisibles (aucun morceau manquant) ;</li>
<li>Clé USB ou disque à jour, avec une copie de secours ;</li>
<li>Bibliothèque du logiciel de mix à jour avec vos derniers rangements ;</li>
<li>Câbles, casque et ordinateur chargés.</li>
</ul>

<h2 id="improviser">Préparer pour mieux improviser</h2>
<p>Le but de la préparation n’est pas de jouer une liste figée, mais de pouvoir réagir à la salle sans chercher. Avec une sélection groupée par énergie et des tonalités repérées, vous aurez toujours deux ou trois bons choix sous la main.</p>

<h2 id="conclusion">En résumé</h2>
<p>Contexte, présélection large, courbe d’énergie, BPM et tonalités, crate de soirée, vérifications techniques. Une heure de préparation suffit souvent pour un set serein.</p>
'''))

A.append(dict(
slug='bpm-tonalite-morceau',
tag='Analyse',
title='Trouver le BPM et la tonalité d’un morceau : méthodes et outils',
seo='Trouver le BPM et la tonalité d’un morceau',
desc='Tags, logiciel de mix, outils dédiés ou oreille : comment connaître le BPM et la tonalité de ses morceaux, et quand se méfier de l’analyse automatique.',
minutes=6,
chapo='Le BPM et la tonalité sont les deux informations qui décident si deux morceaux peuvent s’enchaîner. Voici les différentes façons de les obtenir, et leurs pièges.',
body='''
<h2 id="definitions">BPM et tonalité, de quoi parle-t-on ?</h2>
<p>Le <strong>BPM</strong> (battements par minute) mesure le tempo : 120 à 128 pour beaucoup de house, 130 et plus pour la techno, autour de 90 pour une partie du hip-hop. La <strong>tonalité</strong> indique la note et le mode (mineur ou majeur) autour desquels le morceau est construit. Les DJ l’écrivent souvent en notation Camelot (8A, 9B…), expliquée dans notre guide du <a href="mix-harmonique-roue-camelot.html">mix harmonique</a>.</p>

<h2 id="tags">1. Lire les tags du fichier</h2>
<p>Beaucoup de morceaux achetés sur les plateformes destinées aux DJ contiennent déjà le BPM et la tonalité dans leurs tags (pour les MP3, les champs ID3 <code>TBPM</code> et <code>TKEY</code>). C’est la méthode la plus rapide, mais la qualité dépend de la source.</p>

<h2 id="logiciel">2. L’analyse du logiciel de mix</h2>
<p>Serato DJ, Rekordbox, Traktor et VirtualDJ analysent le BPM et la tonalité à l’import. Les résultats sont généralement bons, et ils sont ensuite visibles en soirée. Pensez à lancer l’analyse avant le set, pas pendant.</p>

<h2 id="outils">3. Les outils dédiés</h2>
<p>Des logiciels spécialisés dans la détection de tonalité existent, et peuvent écrire le résultat dans les tags du fichier. Utile si vous changez souvent de logiciel de mix ou voulez une valeur unique partout.</p>

<h2 id="oreille">4. À l’oreille</h2>
<p>Pour le BPM, tapez la pulsation (beaucoup de logiciels ont un bouton « tap ») pendant une quinzaine de secondes. Pour la tonalité, cherchez sur un clavier la note sur laquelle la mélodie semble « se reposer ». C’est plus long, mais imbattable pour vérifier un résultat douteux.</p>

<h2 id="pieges">Les pièges de l’analyse automatique</h2>
<ul>
<li><strong>BPM doublé ou divisé par deux</strong> : un morceau à 87 BPM peut être détecté à 174, et inversement.</li>
<li><strong>Morceaux très percussifs</strong> : peu de mélodie, donc une tonalité difficile à déterminer.</li>
<li><strong>Changements de tonalité</strong> en cours de morceau : l’analyse donne une seule valeur.</li>
<li><strong>Tempos variables</strong> (enregistrements anciens, live) : le BPM n’est qu’une moyenne.</li>
</ul>
<div class="tip"><p>Astuce : dans CrateSort, le BPM et la tonalité sont lus dans les tags dès l’écoute. Quand le BPM manque, il est estimé et affiché en italique pour signaler qu’il s’agit d’une estimation.</p></div>

<h2 id="utiliser">Utiliser ces informations pour ranger</h2>
<p>Le BPM et la tonalité ne servent pas qu’en soirée. Au moment du rangement, ils aident à décider où va un morceau (un titre à 135 BPM a peu de chances d’aller dans « Deep House ») et à repérer ceux qui se marient bien. Filtrez par plage de BPM (par exemple 120-128) ou par code Camelot pour préparer vos sélections.</p>

<h2 id="conclusion">En résumé</h2>
<p>Commencez par les tags, laissez votre logiciel analyser le reste, et vérifiez à l’oreille les cas douteux. Des informations fiables, c’est des transitions plus sûres.</p>
'''))

A.append(dict(
slug='exporter-playlist-m3u8',
tag='Logiciels',
title='Exporter une playlist M3U8 vers Rekordbox, Serato, Traktor ou VirtualDJ',
seo='Exporter une playlist M3U8 pour Rekordbox, Serato, Traktor',
desc='Le format M3U8 permet de transporter une liste de morceaux d’un logiciel de mix à l’autre. Ce qu’il contient, comment le créer et comment l’importer.',
minutes=5,
chapo='Vous avez rangé vos nouveautés et voulez les retrouver dans votre logiciel de mix ? Ou transférer une sélection d’un logiciel à un autre ? Le fichier M3U8 est le moyen le plus simple et le plus universel.',
body='''
<h2 id="format">Qu’est-ce qu’un fichier M3U8 ?</h2>
<p>Un fichier <strong>M3U</strong> est une simple liste de chemins vers des fichiers audio, un par ligne. Le <strong>M3U8</strong> est la même chose, encodée en UTF-8 : les accents et caractères spéciaux des noms de fichiers sont conservés. Il ne contient pas la musique elle-même, seulement l’emplacement de chaque morceau.</p>
<p>Un exemple :</p>
<p><code>#EXTM3U<br>#EXTINF:412,Kerri Chandler - Rain<br>/Volumes/DJ/Music/House/Deep House/Kerri Chandler - Rain.mp3</code></p>

<h2 id="pourquoi">Pourquoi c’est utile</h2>
<ul>
<li><strong>Universel</strong> : la plupart des logiciels de mix et des lecteurs audio savent le lire.</li>
<li><strong>Léger</strong> : quelques kilo-octets, même pour des centaines de morceaux.</li>
<li><strong>Lisible</strong> : un simple éditeur de texte suffit pour le vérifier.</li>
</ul>

<h2 id="chemins">Le point clé : les chemins complets</h2>
<p>Pour qu’un logiciel retrouve les morceaux, chaque ligne doit contenir le <strong>chemin complet</strong> du fichier sur votre ordinateur. Si vous déplacez les fichiers ou changez de disque après l’export, la playlist ne les retrouvera plus. Exportez donc la playlist <strong>après</strong> avoir rangé vos fichiers à leur place définitive.</p>
<div class="tip"><p>Dans CrateSort, « Exporter la playlist » génère un fichier .m3u8 (ou .csv) des morceaux rangés : depuis l’ouverture de l’outil, aujourd’hui, sur les 7 derniers jours ou sur tout l’historique. Vous indiquez une seule fois l’emplacement de votre bibliothèque pour obtenir les chemins complets.</p></div>

<h2 id="importer">Importer la playlist dans son logiciel</h2>
<p>Selon le logiciel, l’import se fait par un menu du type « Importer une playlist » ou en faisant glisser le fichier .m3u8 dans la bibliothèque. Rekordbox, Serato, Traktor et VirtualDJ savent tous exploiter des playlists de ce type ; le menu exact varie selon la version, consultez l’aide de votre logiciel en cas de doute.</p>

<h2 id="csv">Et le CSV ?</h2>
<p>Le format CSV s’ouvre dans un tableur (Excel, Numbers, Google Sheets). Il ne s’importe pas dans un logiciel de mix, mais il est pratique pour garder un historique de vos achats, préparer une liste pour une soirée ou partager une sélection.</p>

<h2 id="problemes">Si des morceaux manquent après l’import</h2>
<ul>
<li>les fichiers ont été déplacés ou renommés après l’export ;</li>
<li>le disque externe n’est pas branché, ou porte un autre nom ;</li>
<li>la playlist a été créée sur un autre ordinateur, avec d’autres chemins.</li>
</ul>
<p>Dans tous les cas, ré-exportez la playlist depuis l’ordinateur et le disque que vous utiliserez en soirée.</p>

<h2 id="conclusion">En résumé</h2>
<p>Le M3U8 est le pont le plus simple entre votre rangement et votre logiciel de mix. Rangez d’abord, exportez ensuite, importez enfin : vos nouveautés vous attendront dans une playlist dédiée.</p>
'''))

A.append(dict(
slug='trier-morceaux-rapidement-drop',
tag='Routine',
title='Trier 100 morceaux en 15 minutes : la méthode de l’écoute au drop',
seo='Trier 100 morceaux en 15 minutes : l’écoute au drop',
desc='Écouter au drop, décider en quelques secondes, ranger au clavier : la méthode pour trier une centaine de nouveaux morceaux en un quart d’heure.',
minutes=6,
chapo='Cent morceaux à trier, c’est souvent un dimanche après-midi qui y passe. Avec la bonne méthode, un quart d’heure suffit. Le secret : écouter le bon passage, décider tout de suite et ne jamais lâcher le clavier.',
body='''
<h2 id="principe">Le principe : écouter le drop, pas l’intro</h2>
<p>Les morceaux pensés pour le club commencent souvent par une longue introduction, faite pour être mixée. Elle ne dit presque rien du morceau. Le <strong>drop</strong>, le moment où le morceau « tombe » après la montée, vous dit en quelques secondes si le titre vous intéresse.</p>
<p>Écouter directement au drop transforme une écoute de 30 secondes en une écoute de 5 secondes.</p>

<h2 id="preparation">Préparer le terrain (2 minutes)</h2>
<ol>
<li><strong>Nettoyez les noms</strong> des nouveaux fichiers (voir <a href="renommer-fichiers-mp3.html">renommer ses fichiers MP3</a>).</li>
<li><strong>Isolez les doublons</strong> pour ne pas les écouter deux fois (voir <a href="doublons-bibliotheque-musicale.html">les doublons</a>).</li>
<li><strong>Définissez vos favoris</strong> : les 5 à 9 dossiers où vous rangez le plus souvent.</li>
</ol>

<h2 id="boucle">La boucle de tri (10 à 12 minutes)</h2>
<p>Pour chaque morceau :</p>
<ol>
<li>passez au suivant avec <kbd>↓</kbd> : il démarre directement au drop ;</li>
<li>écoutez 4 à 8 secondes ;</li>
<li>décidez : favori n° 1, 2, 3… avec <kbd>Maj</kbd>+<kbd>1</kbd>…<kbd>9</kbd>, ou écart avec <kbd>Suppr</kbd> ;</li>
<li>le morceau suivant se lance tout seul.</li>
</ol>
<p>À ce rythme, cent morceaux prennent une dizaine de minutes. Pour les rares cas où vous hésitez, utilisez un dossier « À réécouter » plutôt que de bloquer la boucle.</p>
<div class="tip"><p>Dans CrateSort : activez « Écoute auto » et réglez « Départ » sur « Drop (auto) ». Chaque morceau sélectionné démarre au drop détecté automatiquement, et <kbd>D</kbd> permet d’y revenir à tout moment.</p></div>

<h2 id="decider">Comment décider en 5 secondes</h2>
<ul>
<li><strong>Le son</strong> : la qualité de production est-elle au niveau de vos sets ?</li>
<li><strong>L’énergie</strong> : à quel moment de la soirée le joueriez-vous ?</li>
<li><strong>L’usage</strong> : vous voyez-vous le jouer dans les trois prochains mois ? Sinon, écartez-le.</li>
</ul>
<p>Le BPM et la tonalité affichés pendant l’écoute aident aussi à trancher (voir <a href="bpm-tonalite-morceau.html">BPM et tonalité</a>).</p>

<h2 id="finir">Finir proprement (2 minutes)</h2>
<ol>
<li>Jetez un œil au dossier des écartés avant de le vider ;</li>
<li>mettez à jour votre logiciel de mix, ou exportez une <a href="exporter-playlist-m3u8.html">playlist M3U8</a> des nouveautés ;</li>
<li>notez les quelques morceaux coup de cœur pour votre prochain set.</li>
</ol>

<h2 id="conclusion">En résumé</h2>
<p>Écouter au drop, décider tout de suite, ranger au clavier. Une fois l’habitude prise, trier vos nouveautés devient une tâche courte, presque agréable, qui s’intègre à votre <a href="ranger-telechargements-musique.html">routine hebdomadaire</a>.</p>
'''))
