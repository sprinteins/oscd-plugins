function f() {
}
function A(t) {
  return t();
}
function G() {
  return /* @__PURE__ */ Object.create(null);
}
function k(t) {
  t.forEach(A);
}
function L(t) {
  return typeof t == "function";
}
function ot(t, n) {
  return t != t ? n == n : t !== n || t && typeof t == "object" || typeof t == "function";
}
function rt(t) {
  return Object.keys(t).length === 0;
}
function Y(t, n, e) {
  t.insertBefore(n, e || null);
}
function Z(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function ct(t) {
  return document.createElement(t);
}
function st(t) {
  return Array.from(t.childNodes);
}
function it(t) {
  const n = {};
  for (const e of t)
    n[e.name] = e.value;
  return n;
}
let q;
function y(t) {
  q = t;
}
const h = [], J = [], C = [], K = [], ut = Promise.resolve();
let N = !1;
function at() {
  N || (N = !0, ut.then(tt));
}
function O(t) {
  C.push(t);
}
const S = /* @__PURE__ */ new Set();
let d = 0;
function tt() {
  if (d !== 0)
    return;
  const t = q;
  do {
    try {
      for (; d < h.length; ) {
        const n = h[d];
        d++, y(n), lt(n.$$);
      }
    } catch (n) {
      throw h.length = 0, d = 0, n;
    }
    for (y(null), h.length = 0, d = 0; J.length; )
      J.pop()();
    for (let n = 0; n < C.length; n += 1) {
      const e = C[n];
      S.has(e) || (S.add(e), e());
    }
    C.length = 0;
  } while (h.length);
  for (; K.length; )
    K.pop()();
  N = !1, S.clear(), y(t);
}
function lt(t) {
  if (t.fragment !== null) {
    t.update(), k(t.before_update);
    const n = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, n), t.after_update.forEach(O);
  }
}
const ft = /* @__PURE__ */ new Set();
function dt(t, n) {
  t && t.i && (ft.delete(t), t.i(n));
}
function ht(t, n, e, r) {
  const { fragment: i, after_update: l } = t.$$;
  i && i.m(n, e), r || O(() => {
    const u = t.$$.on_mount.map(A).filter(L);
    t.$$.on_destroy ? t.$$.on_destroy.push(...u) : k(u), t.$$.on_mount = [];
  }), l.forEach(O);
}
function mt(t, n) {
  const e = t.$$;
  e.fragment !== null && (k(e.on_destroy), e.fragment && e.fragment.d(n), e.on_destroy = e.fragment = null, e.ctx = []);
}
function $t(t, n) {
  t.$$.dirty[0] === -1 && (h.push(t), at(), t.$$.dirty.fill(0)), t.$$.dirty[n / 31 | 0] |= 1 << n % 31;
}
function pt(t, n, e, r, i, l, u, T = [-1]) {
  const a = q;
  y(t);
  const o = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: f,
    not_equal: i,
    bound: G(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(n.context || (a ? a.$$.context : [])),
    // everything else
    callbacks: G(),
    dirty: T,
    skip_bound: !1,
    root: n.target || a.$$.root
  };
  u && u(o.root);
  let $ = !1;
  if (o.ctx = e ? e(t, n.props || {}, (c, p, ...g) => {
    const _ = g.length ? g[0] : p;
    return o.ctx && i(o.ctx[c], o.ctx[c] = _) && (!o.skip_bound && o.bound[c] && o.bound[c](_), $ && $t(t, c)), p;
  }) : [], o.update(), $ = !0, k(o.before_update), o.fragment = r ? r(o.ctx) : !1, n.target) {
    if (n.hydrate) {
      const c = st(n.target);
      o.fragment && o.fragment.l(c), c.forEach(Z);
    } else
      o.fragment && o.fragment.c();
    n.intro && dt(t.$$.fragment), ht(t, n.target, n.anchor, n.customElement), tt();
  }
  y(a);
}
let nt;
typeof HTMLElement == "function" && (nt = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(A).filter(L);
    for (const n in this.$$.slotted)
      this.appendChild(this.$$.slotted[n]);
  }
  attributeChangedCallback(t, n, e) {
    this[t] = e;
  }
  disconnectedCallback() {
    k(this.$$.on_disconnect);
  }
  $destroy() {
    mt(this, 1), this.$destroy = f;
  }
  $on(t, n) {
    if (!L(n))
      return f;
    const e = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return e.push(n), () => {
      const r = e.indexOf(n);
      r !== -1 && e.splice(r, 1);
    };
  }
  $set(t) {
    this.$$set && !rt(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
function s() {
}
function B(t) {
  return t();
}
function Q() {
  return /* @__PURE__ */ Object.create(null);
}
function E(t) {
  t.forEach(B);
}
function R(t) {
  return typeof t == "function";
}
function V(t, n) {
  return t != t ? n == n : t !== n || t && typeof t == "object" || typeof t == "function";
}
function gt(t) {
  return Object.keys(t).length === 0;
}
function m(t, n, e) {
  t.insertBefore(n, e || null);
}
function v(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function W(t) {
  return document.createElement(t);
}
function _t(t) {
  return Array.from(t.childNodes);
}
function z(t) {
  const n = {};
  for (const e of t)
    n[e.name] = e.value;
  return n;
}
let D;
function x(t) {
  D = t;
}
const b = [], U = [], H = [], X = [], bt = Promise.resolve();
let I = !1;
function yt() {
  I || (I = !0, bt.then(et));
}
function P(t) {
  H.push(t);
}
const j = /* @__PURE__ */ new Set();
let w = 0;
function et() {
  const t = D;
  do {
    for (; w < b.length; ) {
      const n = b[w];
      w++, x(n), xt(n.$$);
    }
    for (x(null), b.length = 0, w = 0; U.length; )
      U.pop()();
    for (let n = 0; n < H.length; n += 1) {
      const e = H[n];
      j.has(e) || (j.add(e), e());
    }
    H.length = 0;
  } while (b.length);
  for (; X.length; )
    X.pop()();
  I = !1, j.clear(), x(t);
}
function xt(t) {
  if (t.fragment !== null) {
    t.update(), E(t.before_update);
    const n = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, n), t.after_update.forEach(P);
  }
}
const kt = /* @__PURE__ */ new Set();
function Et(t, n) {
  t && t.i && (kt.delete(t), t.i(n));
}
function wt(t, n, e, r) {
  const { fragment: i, after_update: l } = t.$$;
  i && i.m(n, e), r || P(() => {
    const u = t.$$.on_mount.map(B).filter(R);
    t.$$.on_destroy ? t.$$.on_destroy.push(...u) : E(u), t.$$.on_mount = [];
  }), l.forEach(P);
}
function Ct(t, n) {
  const e = t.$$;
  e.fragment !== null && (E(e.on_destroy), e.fragment && e.fragment.d(n), e.on_destroy = e.fragment = null, e.ctx = []);
}
function Ht(t, n) {
  t.$$.dirty[0] === -1 && (b.push(t), yt(), t.$$.dirty.fill(0)), t.$$.dirty[n / 31 | 0] |= 1 << n % 31;
}
function F(t, n, e, r, i, l, u, T = [-1]) {
  const a = D;
  x(t);
  const o = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: s,
    not_equal: i,
    bound: Q(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(n.context || (a ? a.$$.context : [])),
    // everything else
    callbacks: Q(),
    dirty: T,
    skip_bound: !1,
    root: n.target || a.$$.root
  };
  u && u(o.root);
  let $ = !1;
  if (o.ctx = e ? e(t, n.props || {}, (c, p, ...g) => {
    const _ = g.length ? g[0] : p;
    return o.ctx && i(o.ctx[c], o.ctx[c] = _) && (!o.skip_bound && o.bound[c] && o.bound[c](_), $ && Ht(t, c)), p;
  }) : [], o.update(), $ = !0, E(o.before_update), o.fragment = r ? r(o.ctx) : !1, n.target) {
    if (n.hydrate) {
      const c = _t(n.target);
      o.fragment && o.fragment.l(c), c.forEach(v);
    } else
      o.fragment && o.fragment.c();
    n.intro && Et(t.$$.fragment), wt(t, n.target, n.anchor, n.customElement), et();
  }
  x(a);
}
let M;
typeof HTMLElement == "function" && (M = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(B).filter(R);
    for (const n in this.$$.slotted)
      this.appendChild(this.$$.slotted[n]);
  }
  attributeChangedCallback(t, n, e) {
    this[t] = e;
  }
  disconnectedCallback() {
    E(this.$$.on_disconnect);
  }
  $destroy() {
    Ct(this, 1), this.$destroy = s;
  }
  $on(t, n) {
    if (!R(n))
      return s;
    const e = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return e.push(n), () => {
      const r = e.indexOf(n);
      r !== -1 && e.splice(r, 1);
    };
  }
  $set(t) {
    this.$$set && !gt(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
class vt {
  constructor() {
    this.name = "d";
  }
}
function Mt(t) {
  let n;
  return {
    c() {
      n = W("communication-explorer"), n.innerHTML = "<h1>Hi I am a communication explorer WC!!!</h1>", this.c = s;
    },
    m(e, r) {
      m(e, n, r);
    },
    p: s,
    i: s,
    o: s,
    d(e) {
      e && v(n);
    }
  };
}
function Tt(t) {
  const n = new vt();
  return console.log({ b: n }), [];
}
class St extends M {
  constructor(n) {
    super(), F(
      this,
      {
        target: this.shadowRoot,
        props: z(this.attributes),
        customElement: !0
      },
      Tt,
      Mt,
      V,
      {},
      null
    ), n && n.target && m(n.target, this, n.anchor);
  }
}
customElements.define("tscd-communication-explorer", St);
function jt(t) {
  let n;
  return {
    c() {
      n = W("network-explorer"), n.innerHTML = "<h1>Hi I am a network explorer!!!</h1>", this.c = s;
    },
    m(e, r) {
      m(e, n, r);
    },
    p: s,
    i: s,
    o: s,
    d(e) {
      e && v(n);
    }
  };
}
class Lt extends M {
  constructor(n) {
    super(), F(
      this,
      {
        target: this.shadowRoot,
        props: z(this.attributes),
        customElement: !0
      },
      null,
      jt,
      V,
      {},
      null
    ), n && n.target && m(n.target, this, n.anchor);
  }
}
customElements.define("tscd-network-explorer", Lt);
function Nt(t) {
  let n;
  return {
    c() {
      n = W("diffing-tool"), n.innerHTML = "<h1>Hi I am a diffing tool!!!</h1>", this.c = s;
    },
    m(e, r) {
      m(e, n, r);
    },
    p: s,
    i: s,
    o: s,
    d(e) {
      e && v(n);
    }
  };
}
class Ot extends M {
  constructor(n) {
    super(), F(
      this,
      {
        target: this.shadowRoot,
        props: z(this.attributes),
        customElement: !0
      },
      null,
      Nt,
      V,
      {},
      null
    ), n && n.target && m(n.target, this, n.anchor);
  }
}
customElements.define("tscd-diffing-tool", Ot);
function Rt(t) {
  let n;
  return {
    c() {
      n = ct("main"), n.innerHTML = `<h1>Communication Explorer</h1> 
  <tscd-communication-explorer></tscd-communication-explorer>`, this.c = f;
    },
    m(e, r) {
      Y(e, n, r);
    },
    p: f,
    i: f,
    o: f,
    d(e) {
      e && Z(n);
    }
  };
}
class It extends nt {
  constructor(n) {
    super(), pt(
      this,
      {
        target: this.shadowRoot,
        props: it(this.attributes),
        customElement: !0
      },
      null,
      Rt,
      ot,
      {},
      null
    ), n && n.target && Y(n.target, this, n.anchor);
  }
}
export {
  It as default
};
