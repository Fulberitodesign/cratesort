/* CrateSort — comportements communs (landing et blog) */
(() => {
  const REPO = 'Fulberitodesign/cratesort';
  const DL = {
    mac: `https://github.com/${REPO}/releases/latest/download/CrateSort-Mac.dmg`,
    win: `https://github.com/${REPO}/releases/latest/download/CrateSort-Windows.exe`
  };
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* Système du visiteur : le bon bouton passe en premier */
  const ua = navigator.userAgent || '';
  const plat = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const mobile = /Android|iPhone|iPad|iPod|Mobile/i.test(ua) || (navigator.maxTouchPoints > 1 && /Mac/i.test(plat) && innerWidth < 1100);
  const os = mobile ? 'mobile' : /Win/i.test(plat + ua) ? 'win' : /Mac/i.test(plat + ua) ? 'mac' : 'other';
  if (mobile) document.body.classList.add('is-mobile');
  $$('[data-dl]').forEach(a => { a.href = DL[a.dataset.dl]; });
  $$('.dl').forEach(box => {
    const mac = $('[data-dl=mac]', box), win = $('[data-dl=win]', box);
    if (!mac || !win) return;
    const first = os === 'win' ? win : mac, second = first === mac ? win : mac;
    if (os === 'mac' || os === 'win') { first.classList.add('primary'); second.classList.remove('primary'); box.prepend(first); }
    else { mac.classList.add('primary'); win.classList.add('primary'); }
  });
  $$('[data-os-label]').forEach(el => {
    el.textContent = os === 'mac' ? 'Votre Mac est compatible (puce Apple et Intel).'
      : os === 'win' ? 'Votre PC Windows est compatible (Windows 10 et 11).'
      : el.textContent;
  });

  /* Dernière version publiée */
  const ver = $$('[data-version]');
  if (ver.length) fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
    .then(r => r.ok ? r.json() : null)
    .then(j => { if (j && j.tag_name) ver.forEach(v => { v.textContent = 'Version ' + j.tag_name.replace(/^v/, ''); }); })
    .catch(() => {});

  /* Copier le lien (sur téléphone) */
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const url = location.origin + location.pathname.replace(/blog\/.*$/, '');
    try {
      if (navigator.share) await navigator.share({ title: 'CrateSort', text: 'CrateSort, le rangement de morceaux pour DJ (Mac et Windows)', url });
      else { await navigator.clipboard.writeText(url); b.textContent = 'Lien copié ✓'; }
    } catch (e) {}
  }));

  /* Menu sur petits écrans */
  const menu = $('.menu'), nav = $('.nav');
  if (menu && nav) {
    menu.addEventListener('click', () => {
      const o = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', o);
      menu.textContent = o ? '✕' : '☰';
    });
    $$('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menu.textContent = '☰'; menu.setAttribute('aria-expanded', 'false'); }));
  }

  const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Apparition au défilement */
  if ('IntersectionObserver' in window && !still) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    $$('.rv').forEach(el => io.observe(el));
  } else $$('.rv').forEach(el => el.classList.add('in'));

  /* Capture d'écran en 3D qui se redresse au défilement */
  const tilt = $('.tilt');
  if (tilt && !still) {
    const upd = () => {
      const r = tilt.parentElement.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * 0.85)));
      tilt.style.setProperty('--rx', (22 * (1 - p)).toFixed(2) + 'deg');
      tilt.style.setProperty('--sc', (0.9 + 0.1 * p).toFixed(3));
    };
    addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  }

  /* Onglets de la vitrine */
  const tabs = $('.tabs');
  if (tabs) {
    const img = $('#showImg'), cap = $('#showCap');
    tabs.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      $$('button', tabs).forEach(x => x.setAttribute('aria-selected', x === b));
      img.src = b.dataset.img; img.srcset = `${b.dataset.img.replace('.webp', '-800.webp')} 800w, ${b.dataset.img} 1600w`;
      img.alt = b.dataset.alt; cap.textContent = b.dataset.cap;
    });
  }

  /* Cartes qui s'inclinent sous la souris */
  if (!still && matchMedia('(hover: hover)').matches) $$('.card').forEach(c => {
    c.addEventListener('pointermove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(700px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateY(-3px)`;
    });
    c.addEventListener('pointerleave', () => { c.style.transform = ''; });
  });

  document.documentElement.classList.add('js');
})();
