# Génère le site statique dans <dépôt>/site
import sys, os, datetime
sys.path.insert(0, os.path.dirname(__file__))
from common import *
import landing

OUT = sys.argv[1]
TODAY = datetime.date.today().isoformat()

def write(rel, txt):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(txt)

write('index.html', landing.build())
write('favicon.svg', "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='8' fill='#c6f04b'/><g transform='translate(4 3.4)' fill='none' stroke='#131a03' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='9.5' r='6.8'/><circle cx='12' cy='9.5' r='2.4'/><path d='M3 13h18v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z' fill='#c6f04b'/><path d='M9.5 17h5'/></g></svg>\n")
write('.nojekyll', '')

urls = [('', '1.0')]
try:
    import blog
    urls += blog.build(write)
except ImportError:
    pass

write('robots.txt', f'User-agent: *\nAllow: /\n\nSitemap: {BASE}sitemap.xml\n')
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
      + ''.join(f'  <url><loc>{BASE}{u}</loc><lastmod>{TODAY}</lastmod><priority>{p}</priority></url>\n' for u, p in urls)
      + '</urlset>\n')
write('404.html', head('Page introuvable — CrateSort', 'Cette page n’existe pas.', '404.html', root='/cratesort/').replace('<meta name="robots" content="index,follow,max-image-preview:large">', '<meta name="robots" content="noindex">')
      + header('/cratesort/') + '<main class="wrap" style="padding:120px 24px;text-align:center"><h1 style="font-size:48px">Page introuvable</h1><p style="color:var(--text2);margin:16px 0 28px">Le lien est peut-être ancien.</p><a class="btn primary" href="/cratesort/">Retour à l’accueil</a></main>' + footer('/cratesort/'))
print('site généré :', len(urls), 'pages dans le plan du site')
