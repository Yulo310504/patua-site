/* Patuá · script compartilhado por todas as páginas */
{
/* ===== CONFIGURAÇÃO: preencher quando o time confirmar ===== */
const PATUA = {
  whatsapp: "",            // só números com DDI e DDD, ex.: 5577999999999 (a confirmar)
  formTalentos: "",        // link do formulário do banco de talentos (a enviar)
  instagram: "https://www.instagram.com/agencia.patua/"
};

document.documentElement.classList.add("js");
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* WhatsApp fixo: sem número configurado, leva para o diagnóstico */
document.querySelectorAll("[data-wa]").forEach(a => {
  if (PATUA.whatsapp) {
    a.href = "https://wa.me/" + PATUA.whatsapp + "?text=" + encodeURIComponent("Oi, Patuá! Vim pelo site e quero conversar sobre a minha marca.");
    a.target = "_blank"; a.rel = "noopener";
  } else {
    a.href = "diagnostico.html";
  }
});
/* banco de talentos */
document.querySelectorAll("[data-talentos]").forEach(a => {
  if (PATUA.formTalentos) { a.href = PATUA.formTalentos; a.target = "_blank"; a.rel = "noopener"; }
});

/* menu de celular */
const mb = document.querySelector(".menu-btn"), gav = document.getElementById("gaveta");
if (mb && gav) {
  mb.addEventListener("click", () => {
    const on = gav.classList.toggle("on");
    mb.setAttribute("aria-expanded", on);
  });
}

/* ===== TV da home ===== */
const tv = document.getElementById("tv");
if (tv) {
  const canais = [...tv.querySelectorAll(".canal")];
  const botoes = [...tv.querySelectorAll(".botao-canal")];
  const osd = document.getElementById("osd");
  const cv = document.getElementById("ruido"), ctx = cv.getContext("2d");
  let atual = 0, auto = true, timer;
  const chiado = ms => {
    if (reduz) return Promise.resolve();
    cv.classList.add("on");
    const img = ctx.createImageData(cv.width, cv.height), d = img.data, t0 = performance.now();
    return new Promise(res => {
      const frame = t => {
        for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
        ctx.putImageData(img, 0, 0);
        if (t - t0 < ms) requestAnimationFrame(frame); else { cv.classList.remove("on"); res(); }
      };
      frame(t0);
    });
  };
  const sintoniza = async n => {
    if (n === atual) return;
    const p = chiado(260);
    setTimeout(() => {
      canais.forEach(c => c.classList.toggle("on", +c.dataset.c === n));
      botoes.forEach(b => b.setAttribute("aria-pressed", +b.dataset.c === n));
      osd.textContent = "CH " + String(n).padStart(2, "0");
    }, reduz ? 0 : 140);
    atual = n; await p;
  };
  botoes.forEach(b => b.addEventListener("click", () => { auto = false; clearInterval(timer); sintoniza(+b.dataset.c); }));
  setTimeout(() => {
    sintoniza(1);
    if (!reduz) timer = setInterval(() => { if (auto) sintoniza(atual % 4 + 1); }, 3800);
  }, 1600);
  const tc = document.getElementById("tc");
  if (tc) { let f = 0; setInterval(() => { f++; const s = Math.floor(f / 24); tc.textContent = `00:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}:${String(f % 24).padStart(2, "0")}`; }, 1000 / 24); }
}

/* ===== chiado contínuo (404) ===== */
const semSinal = document.getElementById("chiado");
if (semSinal) {
  const c = semSinal.getContext("2d"), img = c.createImageData(semSinal.width, semSinal.height), d = img.data;
  const pinta = () => { for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } c.putImageData(img, 0, 0); };
  pinta();
  if (!reduz) { let ult = 0; const loop = t => { if (t - ult > 60) { pinta(); ult = t; } requestAnimationFrame(loop); }; requestAnimationFrame(loop); }
}

/* ===== formulário de diagnóstico ===== */
const form = document.getElementById("form-diagnostico");
if (form) {
  const valida = campo => {
    const el = campo.querySelector("input,select,textarea");
    let ok = true;
    if (campo.dataset.grupo) ok = !!campo.querySelector("input:checked");
    else if (el.type === "checkbox") ok = el.checked;
    else if (el.required) ok = el.value.trim() !== "" && el.checkValidity();
    campo.classList.toggle("invalido", !ok);
    return ok;
  };
  form.querySelectorAll(".campo[data-req]").forEach(campo => {
    campo.addEventListener("change", () => campo.classList.contains("invalido") && valida(campo));
    campo.addEventListener("input", () => campo.classList.contains("invalido") && valida(campo));
  });
  form.addEventListener("submit", e => {
    e.preventDefault();
    const campos = [...form.querySelectorAll(".campo[data-req]")];
    const ruins = campos.filter(c => !valida(c));
    if (ruins.length) {
      const el = ruins[0].querySelector("input,select,textarea");
      ruins[0].scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "center" });
      el && el.focus({ preventScroll: true });
      return;
    }
    /* Aqui entra o envio real (WordPress / ferramenta de formulário). Na prévia, segue para a confirmação. */
    location.href = "obrigado.html";
  });
}

/* ===== revelação ao rolar ===== */
const all = [...document.querySelectorAll(".rv")];
if (!("IntersectionObserver" in window) || reduz) all.forEach(e => e.classList.add("in"));
else {
  all.forEach(e => { if (e.getBoundingClientRect().top < innerHeight * .9) e.classList.add("in"); });
  const ob = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); setTimeout(() => e.target.classList.add("done"), 1200); ob.unobserve(e.target);
  }), { rootMargin: "0px 0px -10% 0px" });
  all.forEach(e => { if (!e.classList.contains("in")) ob.observe(e); });
  setTimeout(() => all.forEach(e => e.classList.add("in", "done")), 7000);
}
}
