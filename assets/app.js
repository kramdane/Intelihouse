document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Header : fond opaque au scroll ---------- */
  var header = document.querySelector('header');
  var TOP  = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-transparent py-6';
  var SCRL = 'fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#030507]/90 backdrop-blur-xl border-b border-cyan-500/10 py-3';
  var isSub = !!document.getElementById('cat-grid');   // page intérieure : header toujours opaque
  function onScroll(){ if(header) header.className = (isSub || window.scrollY > 40) ? SCRL : TOP; }
  window.addEventListener('scroll', onScroll, {passive:true}); onScroll();

  /* ---------- Défilement fluide sur les ancres ---------- */
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - 80, behavior:'smooth'}); closeMenu(); }
    });
  });

  /* ---------- Menu mobile ---------- */
  var LINKS = [['Accueil','index.html'],['À propos','index.html#about'],['Services','index.html#services'],
               ['Solutions','index.html#solutions'],['Réalisations','index.html#realisations'],
               ['Catalogue','catalogue.html'],['Contact','index.html#contact']];
  if (window.IH_LINKS) LINKS = window.IH_LINKS;
  var panel = document.createElement('div');
  panel.className = 'ih-menu';
  panel.innerHTML = '<button aria-label="Fermer" class="ih-menu-close">&times;</button>' +
    LINKS.map(function(l){ return '<a href="'+l[1]+'">'+l[0]+'</a>'; }).join('') + '<a href="https://wa.me/212605747417" target="_blank" rel="noopener noreferrer" class="ih-menu-cta">'
      + (window.IH_CTA || 'Demander un devis') + '</a>';
  document.body.appendChild(panel);
  function closeMenu(){ panel.classList.remove('is-open'); document.body.style.overflow=''; }
  function openMenu(){ panel.classList.add('is-open'); document.body.style.overflow='hidden'; }
  panel.querySelector('button').addEventListener('click', closeMenu);
  /* Le hamburger se cible par son aria-label : le bloc .lg:hidden contient
     aussi la pastille de langue, et querySelector renvoyait celle-ci. */
  var burger = document.querySelector('header [aria-label="Toggle menu"], header [aria-label="فتح القائمة"]');
  if (burger) burger.addEventListener('click', openMenu);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape') closeMenu(); });

  /* ---------- Apparition au scroll ---------- */
  /* Filet de sécurité : un élément ne doit JAMAIS rester invisible.
     IntersectionObserver + repli au scroll + révélation forcée après 4 s. */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var reveal = [];
  if (!reduce) {
    document.querySelectorAll('section > div > *, section h2, .cat-card').forEach(function(el, i){
      if (el.closest('header') || el.closest('aside')) return;
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      var d = (i % 6) * 60;
      el.style.transition = 'opacity .7s cubic-bezier(.22,1,.36,1) '+d+'ms, transform .7s cubic-bezier(.22,1,.36,1) '+d+'ms';
      reveal.push(el);
    });
  }
  function show(el){
    /* Chromium ne fait pas avancer les transitions des éléments sortis du
       cadre : une carte révélée puis dépassée resterait figée à opacité 0.
       On saute donc l'animation hors écran, et on force l'état final au
       plus tard 1,2 s après le déclenchement. */
    var r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) el.style.transition = 'none';
    el.style.opacity = '1';
    el.style.transform = 'none';
    setTimeout(function(){
      el.style.transition = 'none';
      el.style.opacity = '1';
      el.style.transform = 'none';
    }, 1200);
  }
  function sweep(){
    if (!reveal.length) return;
    var vh = window.innerHeight;
    reveal = reveal.filter(function(el){
      if (el.getBoundingClientRect().top < vh - 40) { show(el); return false; }
      return true;
    });
  }
  if (reveal.length) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { show(e.target); io.unobserve(e.target); } });
    }, {threshold:0.05, rootMargin:'0px 0px -40px 0px'});
    reveal.forEach(function(el){ io.observe(el); });
    window.addEventListener('scroll', sweep, {passive:true});
    window.addEventListener('resize', sweep, {passive:true});
    window.addEventListener('load', sweep);
    setTimeout(function(){ reveal.forEach(function(el){ el.style.transition='none'; show(el); }); reveal = []; }, 4000);
  }

  /* ---------- Catalogue : accordéon du menu latéral ---------- */
  document.querySelectorAll('.cat-toggle').forEach(function(btn){
    btn.addEventListener('click', function(){ btn.parentElement.classList.toggle('cat-open'); });
  });

  /* ---------- Catalogue : recherche instantanée ---------- */
  var search = document.getElementById('cat-search');
  if (search) {
    var cards = Array.prototype.slice.call(document.querySelectorAll('.cat-card'));
    var count = document.getElementById('cat-count');
    var empty = document.getElementById('cat-empty');
    var norm = function(s){ return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); };
    search.addEventListener('input', function(){
      var q = norm(search.value.trim()), n = 0;
      cards.forEach(function(c){
        var hit = !q || norm(c.getAttribute('data-name') + ' ' + c.textContent).indexOf(q) !== -1;
        c.style.display = hit ? '' : 'none';
        if (hit) n++;
      });
      if (count) count.textContent = n;
      if (empty) empty.classList.toggle('hidden', n > 0);
    });
  }

  /* ---------- Formulaire de contact ---------- */
  var form = document.querySelector('form');
  if (form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
    if (!btn) return;
    var old = btn.innerHTML;
    btn.innerHTML = 'Message envoyé ✓'; btn.disabled = true;
    setTimeout(function(){ btn.innerHTML = old; btn.disabled = false; form.reset(); }, 3000);
  });
});


/* ==================================================================
   Section « Une maison qui vous comprend » : les 6 modules.
   Le React d'origine gérait cet état ; il est réécrit ici en vanilla.
   Les classes actives/inactives sont LUES dans le DOM au démarrage,
   pour rester alignées sur le style du site sans les recopier.
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var M = [{"badge": "MODULE 1 / 6", "title": "Éclairage Intelligent", "label": "Éclairage Intelligent", "desc": "Variation de lumière, ambiances feutrées et gestion automatique selon la luminosité naturelle.", "icon": null}, {"badge": "MODULE 2 / 6", "title": "Climatisation & Chauffage", "label": "Climatisation & Chauffage", "desc": "Régulation thermique par zone, anticipation et économie d’énergie intelligente.", "icon": "<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/>"}, {"badge": "MODULE 3 / 6", "title": "Sécurité & Alarme", "label": "Sécurité & Alarme", "desc": "Détection intrusion, verrouillage automatique et caméras haute définition.", "icon": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>"}, {"badge": "MODULE 4 / 6", "title": "Audio Multiroom", "label": "Audio Multiroom", "desc": "Diffusion musicale haute fidélité dans chaque pièce de la villa ou du bureau.", "icon": "<path d=\"M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6a1.4 1.4 0 0 1-1 .4H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z\"/><path d=\"M16 9a5 5 0 0 1 0 6\"/><path d=\"M19.4 5.6a9 9 0 0 1 0 12.7\"/>"}, {"badge": "MODULE 5 / 6", "title": "Stores & Fermetures", "label": "Stores & Fermetures", "desc": "Automatisation des volets roulants et brise-soleil orientables.", "icon": "<path d=\"M3 3h18\"/><path d=\"M20 7H8\"/><path d=\"M20 11H8\"/><path d=\"M10 19h10\"/><path d=\"M8 15h12\"/><path d=\"M4 3v14\"/><circle cx=\"4\" cy=\"19\" r=\"2\"/>"}, {"badge": "MODULE 6 / 6", "title": "Réseau & Wi-Fi Pro", "label": "Réseau & Wi-Fi Pro", "desc": "Connexion ultra-rapide et sécurisée interconnectant tous vos équipements.", "icon": "<path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.86a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.43a5 5 0 0 1 7 0\"/>"}];

  var badge = null, spans = document.querySelectorAll('span');
  for (var i = 0; i < spans.length; i++) {
    if (spans[i].textContent.trim() === M[0].badge) { badge = spans[i]; break; }
  }
  if (!badge) return;
  var panel = badge.closest('.glass-panel'); if (!panel) return;

  var title   = panel.querySelector('h3');
  var desc    = panel.querySelector('p');
  var iconBox = panel.querySelector('div.p-3.rounded-xl');
  var list    = panel.querySelector('.space-y-2');
  if (!title || !desc || !iconBox || !list) return;
  var tabs = [].slice.call(list.children);
  if (tabs.length !== M.length) return;

  /* états de référence relevés dans le balisage existant */
  var ON = tabs[0].className, OFF = tabs[1].className;
  var chk = tabs[0].querySelector('svg');
  var CHECK = chk ? chk.outerHTML : '';
  var icon0 = iconBox.querySelector('svg');
  var ICLS = icon0 ? (icon0.getAttribute('class') || '') : '';
  M[0].iconHTML = icon0 ? icon0.outerHTML : '';

  function svg(paths) {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" '
         + 'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" '
         + 'stroke-linejoin="round" class="' + ICLS + '">' + paths + '</svg>';
  }

  /* pastilles numérotées sur la photo */
  var hots = M.map(function (m) {
    return document.querySelector('button[aria-label="' + m.label + '"]');
  });
  var HOT_ON = hots[0] ? hots[0].className : null;
  var HOT_OFF = hots[1] ? hots[1].className : null;

  var current = 0;
  function select(n) {
    if (n === current) return;
    var m = M[n];
    badge.textContent = m.badge;
    title.textContent = m.title;
    desc.textContent  = m.desc;
    iconBox.innerHTML = m.iconHTML || svg(m.icon);

    tabs.forEach(function (t, j) {
      t.className = (j === n) ? ON : OFF;
      var s = t.querySelector('svg'); if (s) s.remove();
      if (j === n && CHECK) t.insertAdjacentHTML('beforeend', CHECK);
      t.setAttribute('aria-current', j === n ? 'true' : 'false');
    });
    if (HOT_ON) hots.forEach(function (b, j) { if (b) b.className = (j === n) ? HOT_ON : HOT_OFF; });

    /* fondu discret sur le texte */
    desc.style.transition = 'none'; desc.style.opacity = '0';
    requestAnimationFrame(function () {
      desc.style.transition = 'opacity .35s ease'; desc.style.opacity = '1';
    });
    current = n;
  }

  tabs.forEach(function (t, j) {
    t.setAttribute('type', 'button');
    t.addEventListener('click', function () { select(j); });
  });
  hots.forEach(function (b, j) {
    if (!b) return;
    b.setAttribute('type', 'button');
    b.addEventListener('click', function () { select(j); });
  });
  tabs[0].setAttribute('aria-current', 'true');
});


/* ==================================================================
   Menu lateral du catalogue : accordeon.
   Tout etait deplie d'un coup ; les sous-categories sont desormais
   repliees, le chevron ouvre. La branche de la categorie affichee
   s'ouvre toute seule.
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var arbre = document.querySelector('.ih-arbre');
  if (!arbre) return;

  function bascule(li, ouvrir) {
    var chev = li.querySelector(':scope > .ih-ligne > .ih-chev');
    if (!chev) return;
    var on = (ouvrir === undefined) ? !li.classList.contains('ouvert') : ouvrir;
    li.classList.toggle('ouvert', on);
    chev.setAttribute('aria-expanded', on ? 'true' : 'false');
  }

  arbre.querySelectorAll('.ih-chev').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var li = b.closest('.ih-noeud');
      var etait = li.classList.contains('ouvert');
      /* une seule branche ouverte a la fois : la liste reste courte */
      arbre.querySelectorAll('.ih-noeud.ouvert').forEach(function (o) {
        if (o !== li) bascule(o, false);
      });
      bascule(li, !etait);
    });
  });

  /* ouvrir la branche correspondant a ?c=... */
  var c = new URLSearchParams(location.search).get('c');
  if (!c) return;
  var cible = arbre.querySelector('a[href$="?c=' + c + '"]');
  if (!cible) return;
  cible.classList.add('actif');
  var li = cible.closest('.ih-noeud');
  if (li) bascule(li, true);
});


/* --- Colonne des categories : depliage sur mobile --- */
document.addEventListener('DOMContentLoaded', function () {
  var aside = document.querySelector('.ih-aside');
  if (!aside) return;
  var tog = aside.querySelector('.ih-side-tog');
  if (!tog) return;
  tog.addEventListener('click', function () {
    var on = !aside.classList.contains('ouvert');
    aside.classList.toggle('ouvert', on);
    tog.setAttribute('aria-expanded', on ? 'true' : 'false');
  });
});


/* ==================================================================
   Mega-menus (Catalogue et Services) : panneau plein largeur sous
   l'en-tete en desktop, listes depliables dans le menu mobile.
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var entete = document.querySelector('header');
  function hauteur() {
    if (entete) document.documentElement.style.setProperty(
      '--ih-hh', Math.round(entete.getBoundingClientRect().height) + 'px');
  }
  hauteur();
  window.addEventListener('scroll', hauteur, {passive: true});
  window.addEventListener('resize', hauteur);

  var menus = [];
  [['.ih-mega-btn', 'ih-mega'], ['.ih-mega-btn2', 'ih-mega-serv']].forEach(function (paire) {
    var btn = document.querySelector(paire[0]);
    var pan = document.getElementById(paire[1]);
    if (!btn || !pan) return;
    var m = {btn: btn, pan: pan, ouvert: false, t: null};
    m.montrer = function (on) {
      if (on === m.ouvert) return;
      m.ouvert = on;
      if (on) {
        menus.forEach(function (o) { if (o !== m) o.montrer(false); });
        pan.hidden = false; hauteur();
        requestAnimationFrame(function () { pan.classList.add('ouvert'); });
      } else {
        pan.classList.remove('ouvert');
        setTimeout(function () { if (!m.ouvert) pan.hidden = true; }, 240);
      }
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    };
    m.differer = function (on) {
      clearTimeout(m.t);
      m.t = setTimeout(function () { m.montrer(on); }, on ? 60 : 220);
    };
    [btn.parentNode, pan].forEach(function (z) {
      z.addEventListener('mouseenter', function () { m.differer(true); });
      z.addEventListener('mouseleave', function () { m.differer(false); });
    });
    btn.addEventListener('click', function (e) {
      if (window.matchMedia('(hover: none)').matches) { e.preventDefault(); m.montrer(!m.ouvert); }
    });
    menus.push(m);
  });
  if (!menus.length) return;
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') menus.forEach(function (m) { m.montrer(false); });
  });
  document.addEventListener('click', function (e) {
    menus.forEach(function (m) {
      if (m.ouvert && !m.pan.contains(e.target) && !m.btn.parentNode.contains(e.target)) m.montrer(false);
    });
  });

  /* ---- menu mobile : familles de produits et liste des services ---- */
  var menu = document.querySelector('.ih-menu');
  if (!menu) return;
  function deplier(regex, panneau, selecteur, avecCompteur) {
    var lien = [].slice.call(menu.querySelectorAll('a')).filter(function (a) {
      return regex.test(a.getAttribute('href') || ''); })[0];
    if (!lien || !panneau) return;
    var boite = document.createElement('div');
    boite.className = 'ih-menu-cat';
    var liste = document.createElement('div');
    liste.className = 'ih-menu-cat-liste';
    liste.innerHTML = [].slice.call(panneau.querySelectorAll(selecteur)).map(function (t) {
      var n = avecCompteur ? t.querySelector('.ih-mega-n') : null;
      var txt = avecCompteur ? t.firstChild.textContent : t.textContent;
      return '<a href="' + t.getAttribute('href') + '">' + txt
           + (n ? '<span class="n">' + n.textContent + '</span>' : '') + '</a>';
    }).join('');
    boite.appendChild(liste);
    lien.parentNode.insertBefore(boite, lien.nextSibling);
    var f = document.createElement('button');
    f.type = 'button';
    f.style.cssText = 'background:none;border:0;color:#00F2FE;font-size:1.4rem;line-height:1;cursor:pointer;padding:0 .5rem';
    f.textContent = '⌄';
    lien.appendChild(f);
    f.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      boite.classList.toggle('ouvert');
      f.textContent = boite.classList.contains('ouvert') ? '⌃' : '⌄';
    });
  }
  deplier(/catalogue(-ar)?\.html$/, document.getElementById('ih-mega'), '.ih-mega-titre', true);
  deplier(/#services$/, document.getElementById('ih-mega-serv'), '.ih-mega-sub', false);
});


/* ==================================================================
   Recherche globale.
   Les familles et les services sont lus dans les panneaux des
   mega-menus, deja presents sur chaque page : aucun fichier
   supplementaire a charger. Les produits viennent de produits.json,
   telecharge au premier usage seulement.
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var pan = document.getElementById('ih-search');
  var champ = document.getElementById('ih-q');
  var zone = document.getElementById('ih-res');
  if (!pan || !champ || !zone) return;
  var boutons = document.querySelectorAll('.ih-loupe');
  var AR = document.documentElement.getAttribute('dir') === 'rtl';
  var T = AR ? {p:'المنتجات', c:'العائلات', s:'الخدمات', rien:'ما كاين حتى نتيجة.'}
             : {p:'Produits', c:'Familles', s:'Services', rien:'Aucun résultat.'};
  var aide = zone.innerHTML;
  var produits = null, enCours = false, vise = -1;

  var norm = function (s) {
    return (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };
  function statiques(sel, panneau) {
    var p = document.getElementById(panneau);
    if (!p) return [];
    return [].slice.call(p.querySelectorAll(sel)).map(function (a) {
      var n = a.querySelector('.ih-mega-n');
      var txt = n ? a.firstChild.textContent : a.textContent;
      return {nom: txt.trim(), href: a.getAttribute('href'), sec: n ? n.textContent.trim() : ''};
    });
  }
  var familles = statiques('.ih-mega-titre, .ih-mega-sub', 'ih-mega');
  var services = statiques('.ih-mega-sub', 'ih-mega-serv');

  function charger() {
    if (produits || enCours) return;
    enCours = true;
    fetch('assets/produits.json').then(function (r) { return r.json(); })
      .then(function (d) { produits = d.produits; enCours = false; rendu(); })
      .catch(function () { produits = []; enCours = false; });   /* file:// ou reseau : on continue sans */
  }

  function ligne(o, img) {
    return '<a href="' + o.href + '">'
      + (img ? '<img src="' + img + '" alt="" loading="lazy">' : '')
      + '<span class="ih-search-nom">' + o.nom + '</span>'
      + (o.sec ? '<span class="ih-search-sec">' + o.sec + '</span>' : '') + '</a>';
  }
  function rendu() {
    var q = norm(champ.value.trim());
    vise = -1;
    if (q.length < 2) { zone.innerHTML = aide; return; }
    var suf = AR ? '-ar' : '';
    var out = '';
    var fc = familles.filter(function (o) { return norm(o.nom).indexOf(q) !== -1; }).slice(0, 6);
    var sv = services.filter(function (o) { return norm(o.nom).indexOf(q) !== -1; }).slice(0, 6);
    var pr = (produits || []).filter(function (p) {
      return norm(p.n + ' ' + p.r + ' ' + p.m).indexOf(q) !== -1; }).slice(0, 8);
    if (pr.length) {
      out += '<div class="ih-search-groupe">' + T.p + '</div>' + pr.map(function (p) {
        var img = p.i ? 'images/produits/' + p.i.split('/').pop().replace(/\.[a-z]+$/i, '') + '.webp' : '';
        return ligne({nom: p.n, href: 'produit' + suf + '.html?p=' + encodeURIComponent(p.s),
                      sec: p.r || p.m || ''}, img);
      }).join('');
    }
    if (fc.length) out += '<div class="ih-search-groupe">' + T.c + '</div>' + fc.map(function (o) { return ligne(o, ''); }).join('');
    if (sv.length) out += '<div class="ih-search-groupe">' + T.s + '</div>' + sv.map(function (o) { return ligne(o, ''); }).join('');
    zone.innerHTML = out || '<p class="ih-search-rien">' + T.rien + '</p>';
    zone.scrollTop = 0;
  }

  function ouvrir(on) {
    if (on) {
      pan.hidden = false;
      requestAnimationFrame(function () { pan.classList.add('ouvert'); champ.focus(); });
      document.body.style.overflow = 'hidden';
      charger();
    } else {
      pan.classList.remove('ouvert');
      document.body.style.overflow = '';
      setTimeout(function () { if (!pan.classList.contains('ouvert')) pan.hidden = true; }, 220);
    }
  }
  [].slice.call(boutons).forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); ouvrir(true); });
  });
  pan.querySelector('.ih-search-x').addEventListener('click', function () { ouvrir(false); });
  pan.addEventListener('click', function (e) { if (e.target === pan) ouvrir(false); });
  champ.addEventListener('input', rendu);

  document.addEventListener('keydown', function (e) {
    /* Ctrl+K ou Cmd+K : reflexe repandu */
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); ouvrir(true); return; }
    if (pan.hidden) return;
    var liens = zone.querySelectorAll('a');
    if (e.key === 'Escape') { ouvrir(false); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (!liens.length) return;
      e.preventDefault();
      if (vise >= 0) liens[vise].classList.remove('vise');
      vise = e.key === 'ArrowDown' ? (vise + 1) % liens.length : (vise <= 0 ? liens.length - 1 : vise - 1);
      liens[vise].classList.add('vise');
      liens[vise].scrollIntoView({block: 'nearest'});
    } else if (e.key === 'Enter' && liens.length) {
      (liens[vise >= 0 ? vise : 0]).click();
    }
  });
});


/* ==================================================================
   Carrousel du hero : fondu toutes les 6 s, avec puces de navigation.
   Se met en pause quand l'onglet passe en arriere-plan, et se
   desactive si le visiteur a demande moins d'animations.
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var zone = document.querySelector('.ih-hero');
  if (!zone) return;
  var vues = [].slice.call(zone.querySelectorAll('.ih-hero-img'));
  if (vues.length < 2) return;

  var i = 0, minuteur = null;
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var points = document.createElement('div');
  points.className = 'ih-hero-points';
  points.setAttribute('role', 'tablist');
  vues.forEach(function (v, k) {
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Visuel ' + (k + 1));
    if (k === 0) b.className = 'actif';
    b.addEventListener('click', function () { aller(k); relancer(); });
    points.appendChild(b);
  });
  zone.parentNode.appendChild(points);
  var puces = [].slice.call(points.children);

  function aller(n) {
    if (n === i) return;
    vues[i].classList.remove('actif'); puces[i].classList.remove('actif');
    i = (n + vues.length) % vues.length;
    vues[i].classList.add('actif'); puces[i].classList.add('actif');
    /* relance l'effet de zoom sur le visuel qui entre */
    vues[i].style.animation = 'none'; void vues[i].offsetWidth; vues[i].style.animation = '';
  }
  function relancer() {
    clearInterval(minuteur);
    if (calme) return;
    minuteur = setInterval(function () { aller(i + 1); }, 6000);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) clearInterval(minuteur); else relancer();
  });
  relancer();
});


/* --- Selecteur de langue : ouverture au clic, fermeture ailleurs --- */
document.addEventListener('DOMContentLoaded', function () {
  var blocs = [].slice.call(document.querySelectorAll('.ih-lang'));
  if (!blocs.length) return;
  blocs.forEach(function (b) {
    var btn = b.querySelector('.ih-lang-btn');
    btn.addEventListener('click', function (e) {
      e.preventDefault(); e.stopPropagation();
      var on = !b.classList.contains('ouvert');
      blocs.forEach(function (o) { o.classList.remove('ouvert');
        o.querySelector('.ih-lang-btn').setAttribute('aria-expanded', 'false'); });
      b.classList.toggle('ouvert', on);
      btn.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
  });
  document.addEventListener('click', function () {
    blocs.forEach(function (o) { o.classList.remove('ouvert');
      o.querySelector('.ih-lang-btn').setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') blocs.forEach(function (o) { o.classList.remove('ouvert'); });
  });
});


/* ==================================================================
   Filtres du portfolio : les boutons ne faisaient rien.
   L'etat actif reprend exactement les classes deja presentes dans le
   balisage, pour ne pas dupliquer la charte.
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var btns = [].slice.call(document.querySelectorAll('.ih-filtre'));
  var cards = [].slice.call(document.querySelectorAll('.ih-projet'));
  if (!btns.length || !cards.length) return;

  var ACTIF = btns[0].className.replace(' ih-filtre', '');
  var INACTIF = (btns[1] || btns[0]).className.replace(' ih-filtre', '');

  function appliquer(f) {
    cards.forEach(function (c) {
      c.classList.toggle('masque', f !== 'tous' && c.getAttribute('data-f') !== f);
    });
    btns.forEach(function (b) {
      b.className = ((b.getAttribute('data-f') === f) ? ACTIF : INACTIF) + ' ih-filtre';
      b.setAttribute('aria-pressed', b.getAttribute('data-f') === f ? 'true' : 'false');
    });
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () { appliquer(b.getAttribute('data-f')); });
  });
  appliquer('tous');
});
