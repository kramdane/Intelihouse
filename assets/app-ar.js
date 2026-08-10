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
  var LINKS = [['الرئيسية','index-ar.html'],['شكون حنا','index-ar.html#about'],['الخدمات','index-ar.html#services'],
               ['الحلول','index-ar.html#solutions'],['الأعمال ديالنا','index-ar.html#realisations'],
               ['الكاطالوج','catalogue-ar.html'],['اتصل بينا','index-ar.html#contact']];
  var panel = document.createElement('div');
  panel.className = 'ih-menu';
  panel.innerHTML = '<button aria-label="إغلاق" class="ih-menu-close">&times;</button>' +
    LINKS.map(function(l){ return '<a href="'+l[1]+'">'+l[0]+'</a>'; }).join('') + '<a href="https://wa.me/212605747417" target="_blank" rel="noopener noreferrer" class="ih-menu-cta">طلب ديفي</a>';
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
    btn.innerHTML = '✓ تصيفطات الرسالة'; btn.disabled = true;
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
  var M = [{"badge": "الوحدة 1 / 6", "title": "ضوء ذكي", "label": "ضوء ذكي", "desc": "تخفيف الضوء، أجواء هادئة و تدبير أوتوماتيكي حسب ضوء النهار.", "icon": null}, {"badge": "الوحدة 2 / 6", "title": "الكليماتيزور و التسخين", "label": "الكليماتيزور و التسخين", "desc": "تنظيم الحرارة حسب كل منطقة، توقع مسبق و توفير ذكي فالطاقة.", "icon": "<path d=\"M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z\"/>"}, {"badge": "الوحدة 3 / 6", "title": "الأمان و الأنذار", "label": "الأمان و الأنذار", "desc": "كشف السرقة، قفل أوتوماتيكي و كاميرات بجودة عالية.", "icon": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\"/>"}, {"badge": "الوحدة 4 / 6", "title": "صوت متعدد الغرف", "label": "صوت متعدد الغرف", "desc": "موسيقى بجودة عالية ف كل بيت ديال الفيلا ولا البيرو.", "icon": "<path d=\"M11 4.7a.7.7 0 0 0-1.2-.5L6.4 7.6a1.4 1.4 0 0 1-1 .4H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.4a1.4 1.4 0 0 1 1 .4l3.4 3.4a.7.7 0 0 0 1.2-.5z\"/><path d=\"M16 9a5 5 0 0 1 0 6\"/><path d=\"M19.4 5.6a9 9 0 0 1 0 12.7\"/>"}, {"badge": "الوحدة 5 / 6", "title": "الريدوات و البيبان", "label": "الريدوات و البيبان", "desc": "أتمتة الشيش الدوارة و حاجب الشمس القابل للتوجيه.", "icon": "<path d=\"M3 3h18\"/><path d=\"M20 7H8\"/><path d=\"M20 11H8\"/><path d=\"M10 19h10\"/><path d=\"M8 15h12\"/><path d=\"M4 3v14\"/><circle cx=\"4\" cy=\"19\" r=\"2\"/>"}, {"badge": "الوحدة 6 / 6", "title": "الشبكة و Wi-Fi احترافي", "label": "الشبكة و Wi-Fi احترافي", "desc": "اتصال سريع بزاف و آمن كيربط جميع الأجهزة ديالك.", "icon": "<path d=\"M12 20h.01\"/><path d=\"M2 8.82a15 15 0 0 1 20 0\"/><path d=\"M5 12.86a10 10 0 0 1 14 0\"/><path d=\"M8.5 16.43a5 5 0 0 1 7 0\"/>"}];

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
   Mega-menu Catalogue : panneau plein largeur sous l'en-tete (desktop)
   et liste depliable dans le menu plein ecran (mobile).
================================================================== */
document.addEventListener('DOMContentLoaded', function () {
  var btn = document.querySelector('.ih-mega-btn');
  var panneau = document.getElementById('ih-mega');
  var entete = document.querySelector('header');
  if (!btn || !panneau) return;

  /* la hauteur de l'en-tete change au defilement : on la publie en CSS */
  function hauteur() {
    if (entete) document.documentElement.style.setProperty(
      '--ih-hh', Math.round(entete.getBoundingClientRect().height) + 'px');
  }
  hauteur();
  window.addEventListener('scroll', hauteur, {passive: true});
  window.addEventListener('resize', hauteur);

  var ouvert = false, minuteur = null;
  function montrer(on) {
    if (on === ouvert) return;
    ouvert = on;
    if (on) { panneau.hidden = false; hauteur();
              requestAnimationFrame(function(){ panneau.classList.add('ouvert'); }); }
    else    { panneau.classList.remove('ouvert');
              setTimeout(function(){ if (!ouvert) panneau.hidden = true; }, 240); }
    btn.setAttribute('aria-expanded', on ? 'true' : 'false');
  }
  function differer(on) { clearTimeout(minuteur); minuteur = setTimeout(function(){ montrer(on); }, on ? 60 : 220); }

  /* survol au pointeur, clic au tactile — le lien reste utilisable */
  [btn.parentNode, panneau].forEach(function (z) {
    z.addEventListener('mouseenter', function(){ differer(true); });
    z.addEventListener('mouseleave', function(){ differer(false); });
  });
  btn.addEventListener('click', function (e) {
    if (window.matchMedia('(hover: none)').matches) { e.preventDefault(); montrer(!ouvert); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') montrer(false); });
  document.addEventListener('click', function (e) {
    if (ouvert && !panneau.contains(e.target) && !btn.parentNode.contains(e.target)) montrer(false);
  });

  /* ---- version mobile : les familles dans le menu plein ecran ---- */
  var menu = document.querySelector('.ih-menu');
  if (!menu) return;
  var lienCat = [].slice.call(menu.querySelectorAll('a')).filter(function (a) {
    return /catalogue(-ar)?\.html$/.test(a.getAttribute('href') || ''); })[0];
  if (!lienCat) return;

  var boite = document.createElement('div');
  boite.className = 'ih-menu-cat';
  var liste = document.createElement('div');
  liste.className = 'ih-menu-cat-liste';
  liste.innerHTML = [].slice.call(panneau.querySelectorAll('.ih-mega-titre')).map(function (t) {
    var n = t.querySelector('.ih-mega-n');
    return '<a href="' + t.getAttribute('href') + '">' + t.firstChild.textContent
         + '<span class="n">' + (n ? n.textContent : '') + '</span></a>';
  }).join('');
  boite.appendChild(liste);
  lienCat.parentNode.insertBefore(boite, lienCat.nextSibling);

  var fleche = document.createElement('button');
  fleche.type = 'button';
  fleche.setAttribute('aria-label', 'Familles de produits');
  fleche.style.cssText = 'background:none;border:0;color:#00F2FE;font-size:1.4rem;line-height:1;cursor:pointer;padding:0 .5rem';
  fleche.textContent = '⌄';
  lienCat.appendChild(fleche);
  fleche.addEventListener('click', function (e) {
    e.preventDefault(); e.stopPropagation();
    boite.classList.toggle('ouvert');
    fleche.textContent = boite.classList.contains('ouvert') ? '⌃' : '⌄';
  });
});
