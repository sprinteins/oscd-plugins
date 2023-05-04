function c() {
}
function C(t) {
  return t();
}
function L() {
  return /* @__PURE__ */ Object.create(null);
}
function _(t) {
  t.forEach(C);
}
function k(t) {
  return typeof t == "function";
}
function B(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function J(t) {
  return Object.keys(t).length === 0;
}
function p(t, e) {
  t.appendChild(e);
}
function w(t, e, n) {
  t.insertBefore(e, n || null);
}
function j(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function $(t) {
  return document.createElement(t);
}
function K(t) {
  return document.createTextNode(t);
}
function O() {
  return K(" ");
}
function g(t, e, n) {
  n == null ? t.removeAttribute(e) : t.getAttribute(e) !== n && t.setAttribute(e, n);
}
function Q(t) {
  return Array.from(t.childNodes);
}
function I(t) {
  const e = {};
  for (const n of t)
    e[n.name] = n.value;
  return e;
}
let N;
function m(t) {
  N = t;
}
const h = [], P = [], x = [], R = [], U = Promise.resolve();
let E = !1;
function W() {
  E || (E = !0, U.then(V));
}
function v(t) {
  x.push(t);
}
const b = /* @__PURE__ */ new Set();
let d = 0;
function V() {
  if (d !== 0)
    return;
  const t = N;
  do {
    try {
      for (; d < h.length; ) {
        const e = h[d];
        d++, m(e), X(e.$$);
      }
    } catch (e) {
      throw h.length = 0, d = 0, e;
    }
    for (m(null), h.length = 0, d = 0; P.length; )
      P.pop()();
    for (let e = 0; e < x.length; e += 1) {
      const n = x[e];
      b.has(n) || (b.add(n), n());
    }
    x.length = 0;
  } while (h.length);
  for (; R.length; )
    R.pop()();
  E = !1, b.clear(), m(t);
}
function X(t) {
  if (t.fragment !== null) {
    t.update(), _(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(v);
  }
}
const y = /* @__PURE__ */ new Set();
let Y;
function q(t, e) {
  t && t.i && (y.delete(t), t.i(e));
}
function Z(t, e, n, o) {
  if (t && t.o) {
    if (y.has(t))
      return;
    y.add(t), Y.c.push(() => {
      y.delete(t), o && (n && t.d(1), o());
    }), t.o(e);
  } else
    o && o();
}
function tt(t) {
  t && t.c();
}
function z(t, e, n, o) {
  const { fragment: u, after_update: l } = t.$$;
  u && u.m(e, n), o || v(() => {
    const s = t.$$.on_mount.map(C).filter(k);
    t.$$.on_destroy ? t.$$.on_destroy.push(...s) : _(s), t.$$.on_mount = [];
  }), l.forEach(v);
}
function D(t, e) {
  const n = t.$$;
  n.fragment !== null && (_(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function et(t, e) {
  t.$$.dirty[0] === -1 && (h.push(t), W(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function F(t, e, n, o, u, l, s, f = [-1]) {
  const i = N;
  m(t);
  const r = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: l,
    update: c,
    not_equal: u,
    bound: L(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (i ? i.$$.context : [])),
    // everything else
    callbacks: L(),
    dirty: f,
    skip_bound: !1,
    root: e.target || i.$$.root
  };
  s && s(r.root);
  let H = !1;
  if (r.ctx = n ? n(t, e.props || {}, (a, M, ...S) => {
    const T = S.length ? S[0] : M;
    return r.ctx && u(r.ctx[a], r.ctx[a] = T) && (!r.skip_bound && r.bound[a] && r.bound[a](T), H && et(t, a)), M;
  }) : [], r.update(), H = !0, _(r.before_update), r.fragment = o ? o(r.ctx) : !1, e.target) {
    if (e.hydrate) {
      const a = Q(e.target);
      r.fragment && r.fragment.l(a), a.forEach(j);
    } else
      r.fragment && r.fragment.c();
    e.intro && q(t.$$.fragment), z(t, e.target, e.anchor, e.customElement), V();
  }
  m(i);
}
let A;
typeof HTMLElement == "function" && (A = class extends HTMLElement {
  constructor() {
    super(), this.attachShadow({ mode: "open" });
  }
  connectedCallback() {
    const { on_mount: t } = this.$$;
    this.$$.on_disconnect = t.map(C).filter(k);
    for (const e in this.$$.slotted)
      this.appendChild(this.$$.slotted[e]);
  }
  attributeChangedCallback(t, e, n) {
    this[t] = n;
  }
  disconnectedCallback() {
    _(this.$$.on_disconnect);
  }
  $destroy() {
    D(this, 1), this.$destroy = c;
  }
  $on(t, e) {
    if (!k(e))
      return c;
    const n = this.$$.callbacks[t] || (this.$$.callbacks[t] = []);
    return n.push(e), () => {
      const o = n.indexOf(e);
      o !== -1 && n.splice(o, 1);
    };
  }
  $set(t) {
    this.$$set && !J(t) && (this.$$.skip_bound = !0, this.$$set(t), this.$$.skip_bound = !1);
  }
});
function nt(t) {
  let e;
  return {
    c() {
      e = $("network-explorer"), e.innerHTML = "<h1>Hi I am the network explorer!!!</h1>", this.c = c;
    },
    m(n, o) {
      w(n, e, o);
    },
    p: c,
    i: c,
    o: c,
    d(n) {
      n && j(e);
    }
  };
}
class G extends A {
  constructor(e) {
    super(), F(
      this,
      {
        target: this.shadowRoot,
        props: I(this.attributes),
        customElement: !0
      },
      null,
      nt,
      B,
      {},
      null
    ), e && e.target && w(e.target, this, e.anchor);
  }
}
customElements.define("tscd-network-explorer", G);
const rt = "@oscd-plugins/network-explorer", ot = "0.0.5";
function it(t) {
  let e, n, o, u, l, s, f;
  return n = new G({}), {
    c() {
      e = $("main"), tt(n.$$.fragment), o = O(), u = $("input"), l = O(), s = $("input"), this.c = c, g(u, "type", "hidden"), g(u, "name", "package-name"), u.value = rt, g(s, "type", "hidden"), g(s, "name", "package-version"), s.value = ot;
    },
    m(i, r) {
      w(i, e, r), z(n, e, null), p(e, o), p(e, u), p(e, l), p(e, s), f = !0;
    },
    p: c,
    i(i) {
      f || (q(n.$$.fragment, i), f = !0);
    },
    o(i) {
      Z(n.$$.fragment, i), f = !1;
    },
    d(i) {
      i && j(e), D(n);
    }
  };
}
class ut extends A {
  constructor(e) {
    super(), F(
      this,
      {
        target: this.shadowRoot,
        props: I(this.attributes),
        customElement: !0
      },
      null,
      it,
      B,
      {},
      null
    ), e && e.target && w(e.target, this, e.anchor);
  }
}
export {
  ut as default
};
