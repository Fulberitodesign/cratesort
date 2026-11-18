# Blog CrateSort : page de liste, 10 articles, flux RSS
import re, html, datetime
from common import *
from articles1 import A as A1
from articles2 import A as A2

ARTS = A1 + A2
MOIS = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']
D = datetime.date.today()
DATE_ISO = D.isoformat()
DATE_FR = f'{D.day} {MOIS[D.month - 1]} {D.year}'
ORG = {"@type": "Organization", "name": "CrateSort", "url": BASE, "logo": {"@type": "ImageObject", "url": BASE + "assets/img/icon-256.png"}}


def page_title(a):
    t = a['seo']
    return t + ' | CrateSort' if len(t) <= 48 else t


def card(a, root=''):
    return (f'<a class="post rv" href="{root}{a["slug"]}.html"><span class="tag">{a["tag"]}</span>'
            f'<h2>{html.escape(a["title"])}</h2><p>{html.escape(a["desc"])}</p>'
            f'<span class="meta">{a["minutes"]} min de lecture</span></a>')


def article(a, i):
    url = f'blog/{a["slug"]}.html'
    heads = re.findall(r'<h2 id="([^"]+)">(.*?)</h2>', a['body'])
    toc = ''.join(f'<li><a href="#{k}">{t}</a></li>' for k, t in heads)
    words = len(re.sub(r'<[^>]+>', ' ', a['body'] + a['chapo']).split())
    ld = [
        {"@context": "https://schema.org", "@type": "BlogPosting", "headline": a['title'], "description": a['desc'],
         "datePublished": DATE_ISO, "dateModified": DATE_ISO, "inLanguage": "fr", "wordCount": words,
         "mainEntityOfPage": BASE + url, "image": BASE + "assets/og.png", "author": ORG, "publisher": ORG,
         "articleSection": a['tag']},
        {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Accueil", "item": BASE},
            {"@type": "ListItem", "position": 2, "name": "Blog", "item": BASE + "blog/"},
            {"@type": "ListItem", "position": 3, "name": a['title'], "item": BASE + url}]},
    ]
    rel = [ARTS[(i + k) % len(ARTS)] for k in (1, 2, 3)]
    out = head(page_title(a), a['desc'], url, og_type='article', extra_ld=ld, root='../')
    out = out.replace('</head>', f'<meta property="article:published_time" content="{DATE_ISO}">\n<meta property="article:section" content="{a["tag"]}">\n</head>')
    out += header('../', 'blog')
    out += f'''<main>
<article class="art">
  <nav class="crumbs" aria-label="Fil d’Ariane"><a href="../">Accueil</a><span>›</span><a href="./">Blog</a><span>›</span><span>{a["tag"]}</span></nav>
  <h1>{html.escape(a["title"])}</h1>
  <p class="ameta">Par l’équipe CrateSort · <time datetime="{DATE_ISO}">{DATE_FR}</time> · {a["minutes"]} min de lecture</p>
  <p class="chapo">{a["chapo"]}</p>
  <nav class="toc" aria-label="Sommaire"><b>Sommaire</b><ol>{toc}</ol></nav>
  {a["body"]}
  <aside class="acta">
    <h2>Rangez vos nouveaux morceaux avec CrateSort</h2>
    <p style="font-size:16.5px">Écoute au drop, BPM, tonalité Camelot, doublons et rangement au clavier. Pour Mac et Windows.</p>
    {dl_buttons()}
    <p style="margin-top:14px;font-size:14.5px"><a href="../#fonctionnalites">Découvrir les fonctionnalités</a></p>
  </aside>
</article>
<section class="related" style="padding-top:0" aria-labelledby="t-rel">
  <h2 id="t-rel">À lire aussi</h2>
  <div class="posts">{''.join(card(r) for r in rel)}</div>
</section>
</main>
'''
    out += footer('../')
    return out


def index():
    ld = [{"@context": "https://schema.org", "@type": "Blog", "name": "Blog CrateSort", "url": BASE + "blog/", "inLanguage": "fr",
           "publisher": ORG, "blogPost": [{"@type": "BlogPosting", "headline": a['title'], "url": f'{BASE}blog/{a["slug"]}.html', "datePublished": DATE_ISO} for a in ARTS]}]
    out = head('Blog CrateSort — Ranger et organiser sa musique de DJ',
               'Organiser sa bibliothèque, ranger ses téléchargements, mix harmonique, crates Serato, doublons : les conseils pratiques du blog CrateSort pour les DJ.',
               'blog/', extra_ld=ld, root='../')
    out += header('../', 'blog')
    out += f'''<main>
<section class="bhero"><div class="wrap">
  <span class="kicker">Blog</span>
  <h1>Ranger, organiser, mixer : le blog des DJ</h1>
  <p>Des méthodes concrètes pour garder une bibliothèque musicale propre, préparer vos sets et gagner du temps entre deux soirées.</p>
</div></section>
<div class="wrap"><div class="posts">{''.join(card(a) for a in ARTS)}</div></div>
</main>
'''
    out += footer('../')
    return out


def rss():
    items = ''.join(f'''<item><title>{html.escape(a["title"])}</title><link>{BASE}blog/{a["slug"]}.html</link><guid>{BASE}blog/{a["slug"]}.html</guid><pubDate>{D.strftime("%a, %d %b %Y")} 08:00:00 +0000</pubDate><description>{html.escape(a["desc"])}</description></item>\n''' for a in ARTS)
    return f'''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>Blog CrateSort</title><link>{BASE}blog/</link><description>Conseils pour ranger et organiser sa musique de DJ</description><language>fr</language>
{items}</channel></rss>
'''


def build(write):
    write('blog/index.html', index())
    for i, a in enumerate(ARTS):
        write(f'blog/{a["slug"]}.html', article(a, i))
    write('blog/rss.xml', rss())
    return [('blog/', '0.8')] + [(f'blog/{a["slug"]}.html', '0.7') for a in ARTS]
