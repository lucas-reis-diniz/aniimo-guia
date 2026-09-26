/* Aniimo — Guia de Campo · utilitários compartilhados */
const A = (() => {
  const V = "20260926";
  const cache = {};
  const load = (n) => cache[n] || (cache[n] = fetch(`data/${n}.json?v=${V}`).then(r => {
    if (!r.ok) throw new Error(`Falha ao carregar ${n}`); return r.json();
  }));

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const chip = (el) => `<span class="chip el-${esc(el)}">${esc(el)}</span>`;
  const chips = (els) => (els || []).map(chip).join(" ");
  const role = (p) => `<span class="role role-${esc(p)}">${esc(p)}</span>`;
  const tier = (t, src) => t ? `<span class="tier t-${esc(t)}" title="${esc(src || "")}">${esc(t)}</span>` : "";
  const dexLink = (nome) => `aniidex.html#${encodeURIComponent(nome)}`;
  const fmtD = (iso) => { if (!iso) return "—"; const [y,m,d] = iso.split("-"); return `${d}/${m}`; };
  const today = () => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), d.getDate()); };
  const parse = (iso) => { if (!iso) return null; const [y,m,d] = iso.split("-").map(Number); return new Date(y, m-1, d); };
  const status = (ev) => {
    const t = today(), i = parse(ev.inicio), f = parse(ev.fim);
    if (i && t < i) return "soon";
    if (f && t > f) return "done";
    return "live";
  };

  /* ---- tipos ---- */
  let T = null;
  const setTypes = (s) => { T = s.tipos; };
  const mult = (atk, def) => {
    const a = T.ataque[atk]; if (!a) return 1;
    if (a.super.includes(def)) return T.multiplicadores.super;
    if (a.resistido.includes(def)) return T.multiplicadores.resistido;
    return 1;
  };
  const multVs = (atk, defs) => defs.reduce((m, d) => m * mult(atk, d), 1);
  const weakTo = (defs, els) => els.filter(e => multVs(e, defs) > 1);
  const resists = (defs, els) => els.filter(e => multVs(e, defs) < 1);

  /* ---- nav ---- */
  const PAGES = [["index.html","Início"],["eventos.html","Eventos"],["meta.html","Meta"],["builds.html","Builds"],["aniidex.html","Aniidex"],["sistemas.html","Sistemas"]];
  const nav = (upd) => {
    const here = location.pathname.split("/").pop() || "index.html";
    const links = PAGES.map(([h,t]) => `<a href="${h}" class="${h===here?"on":""}">${t}</a>`).join("");
    const el = document.getElementById("top");
    if (el) el.innerHTML = `<div class="in"><a class="brand" href="index.html"><span class="dot"></span>Aniimo · Guia de Campo</a><nav class="nav">${links}</nav><span class="upd">${upd ? "Atualizado em " + fmtD(upd) : ""}</span></div>`;
    const ft = document.getElementById("foot");
    if (ft) ft.innerHTML = `<div class="in">Guia pessoal mantido com pesquisa semanal (toda quinta). Dados de fontes da comunidade — veja <a href="eventos.html#fontes">fontes</a>. Aniimo é propriedade dos seus respectivos donos; este site não é oficial.</div>`;
  };

  /* ---- time ---- */
  const teamHTML = (coreKey, meta, amap, opts = {}) => {
    const c = meta.cores[coreKey]; if (!c) return "";
    const nm = (n) => `<a class="nm" href="${dexLink(n)}">${esc(n)}</a>`;
    const els = (n) => amap[n] ? chips(amap[n].el) : "";
    const sup = c.supports.map(s => `<div class="slot"><div class="lab">Support</div>${nm(s)}${els(s)}</div>`).join("");
    const alt = c.alt.length ? `<div class="alt">Alt: ${c.alt.map(a => `<a href="${dexLink(a)}">${esc(a)}</a>`).join(", ")}</div>` : "";
    return `<div class="team"><div class="slot main"><div class="lab">Main</div>${nm(c.main)}${els(c.main)}${alt}</div>${sup}</div>` +
      (opts.why !== false ? `<p class="muted" style="font-size:.9rem">${esc(c.porque)}</p>` : "") +
      (c.flex && c.flex.length && opts.flex !== false ? `<p class="dim" style="font-size:.82rem">Troca possível nos supports: ${c.flex.map(f => `<a href="${dexLink(f)}">${esc(f)}</a>`).join(", ")}</p>` : "");
  };

  /* ---- build ---- */
  const PERS = {E:"Energetic",I:"Instinctive",S:"Practical",N:"Nimble",T:"Tenacious",F:"Faithful",J:"Judicious",P:"Playful"};
  const RES = {alta:["Alta","live"], media:["Média","soon"], baixa:["Baixa",""]};
  const buildHTML = (nome, b, resson, opts = {}) => {
    if (!b) return "";
    const sk = (s) => `<span class="pill sk">${esc(s)}</span>`;
    const pers = b.pers.split("").map(l => `<span title="${PERS[l] || ""}">${l}</span>`).join(" · ");
    const [rl, rc] = RES[b.reson] || ["—",""];
    const kit = b.kit.length ? `<details class="kit"><summary>Kit completo (${b.kit.length} skills)</summary><div class="tw"><table><thead><tr><th>Skill</th><th>Elem.</th><th class="tc">Power</th><th class="tc">EP</th><th class="tc">CD</th><th>Efeito</th></tr></thead><tbody>${b.kit.map(k => `<tr><td><b>${esc(k.n)}</b>${k.ult ? ' <span class="pill" style="font-size:.66rem">ult</span>' : ""}</td><td>${chip(k.el)}</td><td class="tc">${k.pw ?? "—"}</td><td class="tc">${k.ep ?? "—"}</td><td class="tc">${esc(k.cd)}</td><td class="muted">${esc(k.ef)}</td></tr>`).join("")}</tbody></table></div></details>` : "";
    return `<div class="build">
      <div class="bgrid">
        <div class="bbox"><div class="lab">Held item</div><b>${esc(b.item[0])}</b>${b.item[1] ? `<div class="alt">alt: ${b.item.slice(1).map(esc).join(", ")}</div>` : ""}</div>
        <div class="bbox"><div class="lab">Capability Awakening</div><b>${b.awak.map(esc).join(" → ")}</b></div>
        <div class="bbox"><div class="lab">Personalidade</div><b class="pers">${pers}</b>${b.persFonte === "sugestão" ? `<div class="alt">sugestão pelo papel</div>` : ""}</div>
        <div class="bbox"><div class="lab">Star-Up (Resonance)</div><span class="pill ${rc}">${rl}</span></div>
      </div>
      <p class="muted" style="font-size:.88rem;margin:.6em 0">${esc(b.itemWhy)}</p>
      <div class="kv" style="margin:10px 0">
        <b>Como main</b><div class="row">${b.main.map(sk).join(" ")}</div>
        <b>Como support</b><div>${esc(b.swap)}</div>
      </div>
      ${b.sit.length ? `<div class="sits">${b.sit.map(s => `<div class="sit"><div class="q">${esc(s.quando)}</div><div class="row" style="margin:4px 0">${s.skills.map(sk).join(" ")}</div><div class="muted" style="font-size:.86rem">${esc(s.porque)}</div></div>`).join("")}</div>` : ""}
      ${opts.resson !== false && resson ? `<p class="dim" style="font-size:.82rem;margin:.6em 0 0">${esc(resson[b.reson] || "")}</p>` : ""}
      ${b.nota ? `<div class="note" style="margin-top:10px">${esc(b.nota)}</div>` : ""}
      ${opts.kit !== false ? kit : ""}
    </div>`;
  };

  const byName = (list) => Object.fromEntries(list.map(a => [a.nome, a]));
  const fail = (e, id = "app") => { const el = document.getElementById(id); if (el) el.innerHTML = `<div class="note">Não consegui carregar os dados (${esc(e.message)}). Recarregue a página.</div>`; console.error(e); };

  return { load, esc, chip, chips, role, tier, dexLink, fmtD, status, parse, today, setTypes, mult, multVs, weakTo, resists, nav, teamHTML, buildHTML, byName, fail };
})();
