# Éléments communs du site CrateSort (en-tête, pied de page, balises SEO)
import json, html

BASE = 'https://fulberitodesign.github.io/cratesort/'
REPO = 'https://github.com/Fulberitodesign/cratesort'
SITE = 'CrateSort'

APPLE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.4 12.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.8-2-1.6-.2-3.1.9-3.9.9-.8 0-2.1-.9-3.4-.9-1.7 0-3.3 1-4.3 2.6-1.8 3.2-.5 7.9 1.3 10.4.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.4.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.5-1-2.5-4.3zM13.9 4.9c.7-.9 1.2-2 1.1-3.2-1 .1-2.3.7-3 1.6-.7.8-1.3 2-1.1 3.1 1.1.1 2.3-.6 3-1.5z"/></svg>'
WIN = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5.5 10.3 4.5v7H3zm0 13 7.3 1V12.5H3zm8.3 1.1L21 21V12.5h-9.7zM11.3 4.4V11.5H21V3z"/></svg>'


def dl_buttons(prefix=''):
    return (f'<div class="dl">'
            f'<a class="btn" data-dl="mac" href="{REPO}/releases/latest">{APPLE}<span>Télécharger pour Mac <small>.dmg</small></span></a>'
            f'<a class="btn" data-dl="win" href="{REPO}/releases/latest">{WIN}<span>Télécharger pour Windows <small>.exe</small></span></a>'
            f'</div>')


def head(title, desc, path, og_type='website', extra_ld=None, root='', image='assets/og.png', preload=''):
    url = BASE + path
    ld = ''
    for block in (extra_ld or []):
        ld += '<script type="application/ld+json">' + json.dumps(block, ensure_ascii=False) + '</script>\n'
    e = html.escape
    return f'''<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script>document.documentElement.classList.add('js')</script>
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta name="theme-color" content="#0b0c0f">
<meta property="og:type" content="{og_type}">
<meta property="og:site_name" content="{SITE}">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}{image}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{e(title)}">
<meta name="twitter:description" content="{e(desc)}">
<meta name="twitter:image" content="{BASE}{image}">
<link rel="icon" href="{root}favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="{root}assets/img/icon-256.png">
<link rel="alternate" type="application/rss+xml" title="Blog CrateSort" href="{BASE}blog/rss.xml">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}assets/style.css">
{preload}{ld}</head>
<body>
'''


def header(root='', current=''):
    cur = lambda k: ' aria-current="page"' if k == current else ''
    return f'''<header class="top">
  <div class="wrap">
    <a class="logo" href="{root or './'}"><img src="{root}assets/img/icon-256.png" alt="" width="34" height="34">CrateSort</a>
    <button class="menu" aria-label="Menu" aria-expanded="false">☰</button>
    <nav class="nav" aria-label="Navigation principale">
      <a href="{root}#fonctionnalites">Fonctionnalités</a>
      <a href="{root}#comment">Comment ça marche</a>
      <a href="{root}#faq">Questions</a>
      <a href="{root}blog/"{cur('blog')}>Blog</a>
      <a class="btn primary sm" href="{root}#telecharger">Télécharger</a>
    </nav>
  </div>
</header>
'''


def footer(root=''):
    return f'''<footer>
  <div class="wrap">
    <a class="logo" href="{root or './'}"><img src="{root}assets/img/icon-256.png" alt="" width="30" height="30" loading="lazy">CrateSort</a>
    <nav aria-label="Liens du pied de page">
      <a href="{root}#fonctionnalites">Fonctionnalités</a>
      <a href="{root}#telecharger">Télécharger</a>
      <a href="{root}blog/">Blog</a>
      <a href="{REPO}">GitHub</a>
      <a href="{REPO}/releases">Notes de version</a>
    </nav>
    <span>© 2026 CrateSort · Rangement de morceaux pour DJ · 100 % local</span>
  </div>
</footer>
<script src="{root}assets/main.js" defer></script>
</body>
</html>
'''
