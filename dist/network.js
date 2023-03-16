function i() {
}
function y(t) {
  return t();
}
function C() {
  return /* @__PURE__ */ Object.create(null);
}
function d(t) {
  t.forEach(y);
}
function g(t) {
  return typeof t == "function";
}
function T(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function P(t) {
  return Object.keys(t).length === 0;
}
function S(t, e, n) {
  t.insertBefore(e, n || null);
}
function H(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function A(t) {
  return document.createElement(t);
}
function B(t) {
  return Array.from(t.childNodes);
}
function R(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let x;
function f(t) {
  x = t;
}
const a = [], j = [], _ = [], M = [], V = Promise.resolve();
let p = !1;
function q() {
  p || (p = !0, V.then(L));
}
function b(t) {
  _.push(t);
}
const $ = /* @__PURE__ */ new Set();
let s = 0;
function L() {
  if (s !== 0)
    return;
  const t = x;
  do {
    try {
      for (; s < a.length; ) {
        const e = a[s];
        s++, f(e), z(e.$$);
      }
    } catch (e) {
      throw a.length = 0, s = 0, e;
    }
    for (f(null), a.length = 0, s = 0; j.length; )
      j.pop()();
    for (let e = 0; e < _.length; e += 1) {
      const n = _[e];
      $.has(n) || ($.add(n), n());
    }
    _.length = 0;
  } while (a.length);
  for (; M.length; )
    M.pop()();
  p = !1, $.clear(), f(t);
}
function z(t) {
  if (t.fragment !== null) {
    t.update(), d(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(b);
  }
}
const D = /* @__PURE__ */ new Set();
function F(t, e) {
  t && t.i && (D.delete(t), t.i(e));
}
function G(t, e, n, o) {
  const { fragment: u, after_update: m } = t.$$;
  u && u.m(e, n), o || b(() => {
    const l = t.$$.on_mount.map(y).filter(g);
    t.$$.on_destroy ? t.$$.on_destroy.push(...l) : d(l), t.$$.on_mount = [];
  }), m.forEach(b);
}
function I(t, e) {
  const n = t.$$;
  n.fragment !== null && (d(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function J(t, e) {
  t.$$.dirty[0] === -1 && (a.push(t), q(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function K(t, e, n, o, u, m, l, O = [-1]) {
  const h = x;
  f(t);
  const r = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: m,
    update: i,
    not_equal: u,
    bound: C(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (h ? h.$$.context : [])),
    // everything else
    callbacks: C(),
    dirty: O,
    skip_bound: !1,
    root: e.target || h.$$.root
  };
  l && l(r.root);
  let k = !1;
  if (r.ctx = n ? n(t, e.props || {}, (c, E, ...w) => {
    const v = w.length ? w[0] : E;
    return r.ctx && u(r.ctx[c], r.ctx[c] = v) && (!r.skip_bound && r.bound[c] && r.bound[c](v), k && J(t, c)), E;
  }) : [], r.update(), k = !0, d(r.before_update), r.fragment = o ? o(r.ctx) : !1, e.target) {
    if (e.hydrate) {
      const c = B(e.target);
      r.fragment && r.fragment.l(c), c.forEach(H);
    } else
      r.fragment && r.fragment.c();
    e.intro && F(t.$$.fragment), G(t, e.target, e.anchor, e.customElement), L();
  }
  f(h);
}
let N;
typeof HTMLElement == "function" && (N = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(y).filter(g);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, n) {
    this[t] = n;
  }
  disconnectedCallback() {
    d(this.$$.on_disconnect);
  }
  $destroy() {
    I(this, 1), this.$destroy = i;
  }
  $on(t, e) {
    if (!g(e))
      return i;
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return n.push(e), () => {
      const o = n.indexOf(e);
      o !== -1 && n.splice(o, 1);
    };
  }
  $set(t) {
    this.$$set && !P(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
function Q(t) {
  let e;
  return {
    c() {
      e = A("main"), e.innerHTML = "<h1>Example Editor v0.0.11</h1>", this.c = i;
    },
    m(n, o) {
      S(n, e, o);
    },
    p: i,
    i,
    o: i,
    d(n) {
      n && H(e);
    }
  };
}
class U extends N {
  constructor(e) {
    super(), K(
      this,
      {
        target: this.shadowRoot,
        props: R(this.attributes),
        customElement: !0
      },
      null,
      Q,
      T,
      {},
      null
    ), e && e.target && S(e.target, this, e.anchor);
  }
}
export {
  U as default
};
