(() => {
  const $ = s => document.querySelector(s);
  const nav = $('#nav');
  $('#menuBtn').onclick = () => nav.classList.toggle('open');
  nav.querySelectorAll('a').forEach(a => a.onclick = () => nav.classList.remove('open'));
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && e.target.classList.add('in')), { threshold: .1 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  addEventListener('scroll', () => {
    const h = document.documentElement;
    $('#bar').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + '%';
  });

  // ---- Illustrative conceptual 3D model (arbitrary units, not to scale, not CAD output) ----
  const host = $('#stage');
  if (!window.THREE) { host.innerHTML = '<p class="fallback">The 3D viewer could not load (the Three.js CDN may be blocked). The rest of the site works normally.</p>'; return; }
  const T = THREE, scene = new T.Scene();
  const cam = new T.PerspectiveCamera(40, 1, .1, 100);
  const ren = new T.WebGLRenderer({ antialias: true, alpha: true });
  ren.setPixelRatio(Math.min(devicePixelRatio, 2)); host.appendChild(ren.domElement);
  scene.add(new T.AmbientLight(0xffffff, .55));
  const dl = new T.DirectionalLight(0xffffff, .8); dl.position.set(4, 8, 6); scene.add(dl);
  const pl = new T.PointLight(0x3d8bff, .8, 20); pl.position.set(-4, 3, 3); scene.add(pl);

  const parts = { cpu: [], monitor: [], keyboard: [], mouse: [], stand: [] };
  const rig = new T.Group(); scene.add(rig);
  function add(part, geo, color, x, y, z, extra = {}) {
    const m = new T.Mesh(geo, new T.MeshStandardMaterial(Object.assign({ color, roughness: .45, metalness: .3 }, extra)));
    m.position.set(x, y, z); rig.add(m); parts[part].push(m); return m;
  }
  const box = (w, h, d) => new T.BoxGeometry(w, h, d);
  const desk = new T.GridHelper(10, 20, 0x3d8bff, 0x1c2744); rig.add(desk);
  // CPU cabinet
  add('cpu', box(1.2, 2.4, 2.1), 0x14171f, -2.9, 1.2, 0);
  add('cpu', box(.9, .06, .02), 0x3d8bff, -2.9, 1.7, 1.06, { emissive: 0x3d8bff, emissiveIntensity: .9 });
  add('cpu', box(.8, .08, .02), 0x2a2f3c, -2.9, 2.1, 1.06);
  add('cpu', box(.8, .08, .02), 0x2a2f3c, -2.9, 1.95, 1.06);
  // Monitor
  add('monitor', box(3.6, 2.1, .14), 0x0c0e14, .6, 2.75, 0);
  add('monitor', box(3.3, 1.85, .02), 0x0a1a3a, .6, 2.75, .08, { emissive: 0x1d4fb8, emissiveIntensity: .35 });
  // Stand
  add('stand', box(.22, 1.64, .16), 0x2b303d, .6, .88, -.15);
  add('stand', box(1.6, .06, 1), 0x2b303d, .6, .03, -.1);
  // Keyboard with canvas key-grid texture
  const c = document.createElement('canvas'); c.width = 256; c.height = 80; const g = c.getContext('2d');
  g.fillStyle = '#10131b'; g.fillRect(0, 0, 256, 80); g.fillStyle = '#2b3345';
  for (let r = 0; r < 5; r++) for (let k = 0; k < 18; k++) g.fillRect(8 + k * 13.5, 8 + r * 13.5, 11, 11);
  const kb = add('keyboard', box(2.5, .1, .85), 0x10131b, .6, .05, 1.5);
  const top = new T.Mesh(new T.PlaneGeometry(2.4, .75), new T.MeshBasicMaterial({ map: new T.CanvasTexture(c) }));
  top.rotation.x = -Math.PI / 2; top.position.set(.6, .106, 1.5); rig.add(top); parts.keyboard.push(top);
  // Mouse
  const ms = add('mouse', new T.SphereGeometry(.5, 24, 16), 0x1a1e29, 2.6, .1, 1.5); ms.scale.set(.32, .2, .5);

  // Highlight
  const chips = document.querySelectorAll('.part'); let cur = null;
  function focus(n) {
    cur = cur === n ? null : n;
    for (const k in parts) parts[k].forEach(m => { if (m.material.emissive && m.material.type === 'MeshStandardMaterial' && !m.userData.keep) {
      if (m.userData.e0 === undefined) m.userData.e0 = [m.material.emissive.getHex(), m.material.emissiveIntensity];
      if (k === cur) { m.material.emissive.setHex(0x22d3ee); m.material.emissiveIntensity = .55; }
      else { m.material.emissive.setHex(m.userData.e0[0]); m.material.emissiveIntensity = m.userData.e0[1]; } } });
    chips.forEach(b => b.classList.toggle('active', b.dataset.part === cur));
  }
  chips.forEach(b => b.onclick = () => { focus(b.dataset.part); scrollTo({ top: 0, behavior: 'smooth' }); });

  // Orbit (drag rotate, wheel/button zoom)
  const D = { yaw: .6, pitch: .38, dist: 13 };
  let spin = true, drag = false, lx = 0, ly = 0;
  const look = new T.Vector3(-.2, 1.3, .3);
  const el = ren.domElement;
  el.addEventListener('pointerdown', e => { drag = true; lx = e.clientX; ly = e.clientY; el.setPointerCapture(e.pointerId); });
  el.addEventListener('pointerup', () => drag = false);
  el.addEventListener('pointercancel', () => drag = false);
  el.addEventListener('pointermove', e => { if (!drag) return;
    D.yaw -= (e.clientX - lx) * .008; D.pitch = Math.max(.05, Math.min(1.4, D.pitch + (e.clientY - ly) * .006)); lx = e.clientX; ly = e.clientY; });
  const zoom = f => D.dist = Math.max(6, Math.min(22, D.dist * f));
  el.addEventListener('wheel', e => { e.preventDefault(); zoom(e.deltaY > 0 ? 1.08 : .92); }, { passive: false });
  $('#zin').onclick = () => zoom(.85); $('#zout').onclick = () => zoom(1.18);
  $('#spin').onclick = e => { spin = !spin; e.target.classList.toggle('on', spin); };
  $('#reset').onclick = () => { Object.assign(D, { yaw: .6, pitch: .38, dist: 13 }); focus(cur); };

  function size() { const w = host.clientWidth, h = host.clientHeight; ren.setSize(w, h); cam.aspect = w / h; cam.updateProjectionMatrix(); }
  new ResizeObserver(size).observe(host); size();
  (function loop() {
    if (spin && !drag) D.yaw += .0035;
    cam.position.set(look.x + D.dist * Math.sin(D.yaw) * Math.cos(D.pitch), look.y + D.dist * Math.sin(D.pitch), look.z + D.dist * Math.cos(D.yaw) * Math.cos(D.pitch));
    cam.lookAt(look); ren.render(scene, cam); requestAnimationFrame(loop);
  })();
})();
