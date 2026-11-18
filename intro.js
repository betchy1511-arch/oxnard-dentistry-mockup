/* Oxnard Dentistry entry intro (18 Nov 2026).
   Plays once per visit (browser tab session), on whichever page the visitor lands on.
   MODE "session" = every new visit; MODE "first" = only a visitor's very first visit.
   ?intro=1 forces a replay (for review). Skipped for prefers-reduced-motion. */
(function(){
  var MODE = "session";
  var KEY = "oxd-intro-seen";
  var q = location.search;
  var force = /[?&]intro=1/.test(q);
  var store = MODE === "first" ? window.localStorage : window.sessionStorage;
  try { if (!force && store.getItem(KEY)) return; } catch(e) {}
  if (!force && window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!document.body || !document.body.animate) return;

  var me = document.currentScript && document.currentScript.src || "";
  var base = me.replace(/intro\.js.*$/, "");
  var es = false;
  try { es = localStorage.getItem("oxd-lang") === "es"; } catch(e) {}
  var IMGS = ["implants","invisalign","whitening","crowns","rootcanal","veneers","emergency","gums","cosmetic","tmj","wisdom","general"];

  var css = ""
  + "#oxd-intro{position:fixed;inset:0;z-index:9999;background:radial-gradient(120% 90% at 50% 45%,#124247 0%,#0D3236 55%,#08262A 100%);overflow:hidden;display:grid;place-items:center;font-family:'Plus Jakarta Sans',system-ui,sans-serif;color:#fff}"
  + "#oxd-intro .oi-mid{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:flex;flex-direction:column;align-items:center;gap:18px;z-index:3;text-align:center}"
  + "#oxd-intro .oi-logo{background:#fff;border-radius:999px;padding:12px 26px;box-shadow:0 12px 40px rgba(0,0,0,.35)}"
  + "#oxd-intro .oi-logo img{width:clamp(150px,18vw,220px);height:auto;display:block}"
  + "#oxd-intro .oi-word{font-size:12px;font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:#CFE5E1;white-space:nowrap}@media(max-width:480px){#oxd-intro .oi-word{letter-spacing:.2em;font-size:11px}}"
  + "#oxd-intro .oi-bar{width:150px;height:2px;background:rgba(255,255,255,.16);border-radius:2px;overflow:hidden}"
  + "#oxd-intro .oi-bar i{display:block;height:100%;width:100%;background:linear-gradient(90deg,#2E8279,#E6A23C);transform-origin:left;transform:scaleX(0)}"
  + "#oxd-intro .oi-tooth{position:absolute;left:50%;top:50%;width:clamp(64px,8vw,96px);transform:translate(-50%,-50%) scale(.6);opacity:0;z-index:2;filter:drop-shadow(0 0 22px rgba(230,162,60,.45))}"
  + "#oxd-intro .oi-card{position:absolute;left:50%;top:50%;width:var(--cw);height:calc(var(--cw)*1.25);margin:calc(var(--cw)*-.625) 0 0 calc(var(--cw)*-.5);border-radius:14px;overflow:hidden;border:3px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.4);opacity:0;z-index:1;will-change:transform,opacity}"
  + "#oxd-intro .oi-card img{width:100%;height:100%;object-fit:cover;display:block}"
  + "#oxd-intro .oi-skip{position:absolute;right:20px;bottom:20px;z-index:4;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.35);color:#fff;border-radius:999px;padding:9px 18px;font:600 14px/1 'Plus Jakarta Sans',system-ui,sans-serif;cursor:pointer}"
  + "#oxd-intro .oi-skip:hover{background:rgba(255,255,255,.2)}"
  + "html.oxd-intro-on,html.oxd-intro-on body{overflow:hidden}";
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var tooth = '<svg class="oi-tooth" viewBox="0 0 64 72" aria-hidden="true"><path d="M32 8c-6-5-15-6-21-1C4 13 6 25 9 34c2 7 3 14 4 22 1 7 4 11 7 11 4 0 5-6 6-12 1-5 3-9 6-9s5 4 6 9c1 6 2 12 6 12 3 0 6-4 7-11 1-8 2-15 4-22 3-9 5-21-2-27-6-5-15-4-21 1z" fill="#fff"/><path d="M44 14c3 1 6 4 6 9" stroke="#E6A23C" stroke-width="3" stroke-linecap="round" fill="none"/></svg>';
  var ov = document.createElement("div");
  ov.id = "oxd-intro"; ov.setAttribute("role", "presentation");
  ov.innerHTML = '<div class="oi-mid"><span class="oi-logo"><img src="' + base + 'img/logo.png" alt="" width="584" height="153"></span>'
    + '<span class="oi-word">' + (es ? "Preparando su visita" : "Preparing your visit") + '</span><span class="oi-bar"><i></i></span></div>'
    + tooth + '<button type="button" class="oi-skip">' + (es ? "Saltar" : "Skip intro") + '</button>';
  var W = innerWidth, H = innerHeight, small = W < 700;
  var cw = small ? 62 : Math.max(84, Math.min(120, W * 0.075));
  ov.style.setProperty("--cw", cw + "px");
  var cards = IMGS.map(function(n){
    var c = document.createElement("div"); c.className = "oi-card";
    c.innerHTML = '<img src="' + base + 'img/svc-' + n + '.jpg" alt="">';
    ov.appendChild(c); return c;
  });
  document.documentElement.classList.add("oxd-intro-on");
  document.body.appendChild(ov);
  try { store.setItem(KEY, "1"); } catch(e) {}

  var done = false, anims = [];
  function finish(){
    if (done) return; done = true;
    anims.forEach(function(a){ try { a.finish(); } catch(e) {} });
    var f = ov.animate([{opacity:1},{opacity:0}], {duration:450, easing:"ease-out", fill:"forwards"});
    f.onfinish = function(){ ov.remove(); st.remove(); document.documentElement.classList.remove("oxd-intro-on"); };
  }
  ov.querySelector(".oi-skip").addEventListener("click", finish);
  document.addEventListener("keydown", function k(e){ if (e.key === "Escape") { finish(); document.removeEventListener("keydown", k); } });

  var mid = ov.querySelector(".oi-mid"), bar = ov.querySelector(".oi-bar i"), th = ov.querySelector(".oi-tooth");
  anims.push(bar.animate([{transform:"scaleX(0)"},{transform:"scaleX(1)"}], {duration:1300, easing:"cubic-bezier(.6,0,.2,1)", fill:"forwards"}));
  anims.push(mid.animate([{opacity:0,transform:"translate(-50%,-46%)"},{opacity:1,transform:"translate(-50%,-50%)",offset:.15},{opacity:1,transform:"translate(-50%,-50%)",offset:.75},{opacity:0,transform:"translate(-50%,-58%) scale(.92)"}], {duration:1700, easing:"ease", fill:"forwards"}));
  anims.push(th.animate([{opacity:0,transform:"translate(-50%,-50%) scale(.5) rotate(-20deg)"},{opacity:1,transform:"translate(-50%,-50%) scale(1) rotate(0)",offset:.25},{opacity:1,transform:"translate(-50%,-50%) scale(1.05)",offset:.75},{opacity:0,transform:"translate(-50%,-50%) scale(2.6)"}], {delay:1500, duration:2900, easing:"cubic-bezier(.5,0,.2,1)", fill:"forwards"}));

  var N = cards.length, half = N / 2;
  var R = Math.min(W, H) * (small ? 0.34 : 0.3);
  var spread = Math.min(W * 0.86, (cw + 18) * half);
  var far = Math.hypot(W, H) * 0.75;
  cards.forEach(function(c, i){
    var top = i < half, j = top ? i : i - half;
    var rowX = -spread / 2 + (spread / (half - 1)) * j;
    var rowY = (top ? -1 : 1) * H * 0.3;
    var sx = (top ? -1 : 1) * (W / 2 + cw * 2 + j * 30);
    var a0 = (i / N) * 360 - 90, a1 = a0 + 75;
    var rad0 = a0 * Math.PI / 180, rad1 = a1 * Math.PI / 180;
    var rx = Math.cos(rad0) * R, ry = Math.sin(rad0) * R;
    var r2x = Math.cos(rad1) * R, r2y = Math.sin(rad1) * R;
    var ox = Math.cos(rad1) * far, oy = Math.sin(rad1) * far;
    var tilt = (i % 2 ? 1 : -1) * (6 + (i * 7) % 12);
    anims.push(c.animate([
      {opacity:0, transform:"translate(" + sx + "px," + rowY + "px) rotate(" + tilt * 2 + "deg) scale(.8)"},
      {opacity:1, transform:"translate(" + rowX + "px," + rowY + "px) rotate(0deg) scale(.9)", offset:.22},
      {opacity:1, transform:"translate(" + rx + "px," + ry + "px) rotate(" + (a0 + 90) + "deg) scale(.85)", offset:.45},
      {opacity:1, transform:"translate(" + r2x + "px," + r2y + "px) rotate(" + (a1 + 90) + "deg) scale(.85)", offset:.8},
      {opacity:0, transform:"translate(" + ox + "px," + oy + "px) rotate(" + (a1 + 90 + tilt * 3) + "deg) scale(2.2)"}
    ], {delay:1100 + j * 45, duration:3800, easing:"cubic-bezier(.55,0,.25,1)", fill:"forwards"}));
  });
  setTimeout(finish, 1100 + half * 45 + 3800 - 550);
})();
