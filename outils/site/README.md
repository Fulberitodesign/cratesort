# Générateur du site CrateSort

Le site (landing page + blog) est du HTML statique dans `site/`, publié sur GitHub Pages
par `.github/workflows/site.yml` à chaque modification de `site/` sur `main`.

Ces scripts régénèrent les pages :

```bash
python3 outils/site/build.py site
```

- `landing.py` : page d'accueil
- `blog.py` : liste des articles, pages d'article, flux RSS
- `articles1.py`, `articles2.py` : le texte des 10 articles
- `common.py` : en-tête, pied de page, balises SEO
- `image-partage.js` : image de partage `site/assets/og.png` (Playwright)
