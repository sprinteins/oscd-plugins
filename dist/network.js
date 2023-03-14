function l() {
}
function N(t) {
  return t();
}
function E() {
  return /* @__PURE__ */ Object.create(null);
}
function _(t) {
  t.forEach(N);
}
function O(t) {
  return typeof t == "function";
}
function P(t, e) {
  return t != t ? e == e : t !== e || t && typeof t == "object" || typeof t == "function";
}
function A(t) {
  return Object.keys(t).length === 0;
}
function B(t, e, n) {
  t.insertBefore(e, n || null);
}
function S(t) {
  t.parentNode && t.parentNode.removeChild(t);
}
function H(t) {
  return document.createElement(t);
}
function L(t) {
  return Array.from(t.childNodes);
}
let y;
function a(t) {
  y = t;
}
const i = [], v = [], h = [], j = [], T = Promise.resolve();
let $ = !1;
function q() {
  $ || ($ = !0, T.then(C));
}
function p(t) {
  h.push(t);
}
const g = /* @__PURE__ */ new Set();
let f = 0;
function C() {
  if (f !== 0)
    return;
  const t = y;
  do {
    try {
      for (; f < i.length; ) {
        const e = i[f];
        f++, a(e), z(e.$$);
      }
    } catch (e) {
      throw i.length = 0, f = 0, e;
    }
    for (a(null), i.length = 0, f = 0; v.length; )
      v.pop()();
    for (let e = 0; e < h.length; e += 1) {
      const n = h[e];
      g.has(n) || (g.add(n), n());
    }
    h.length = 0;
  } while (i.length);
  for (; j.length; )
    j.pop()();
  $ = !1, g.clear(), a(t);
}
function z(t) {
  if (t.fragment !== null) {
    t.update(), _(t.before_update);
    const e = t.dirty;
    t.dirty = [-1], t.fragment && t.fragment.p(t.ctx, e), t.after_update.forEach(p);
  }
}
const D = /* @__PURE__ */ new Set();
function F(t, e) {
  t && t.i && (D.delete(t), t.i(e));
}
function G(t, e, n, o) {
  const { fragment: c, after_update: m } = t.$$;
  c && c.m(e, n), o || p(() => {
    const s = t.$$.on_mount.map(N).filter(O);
    t.$$.on_destroy ? t.$$.on_destroy.push(...s) : _(s), t.$$.on_mount = [];
  }), m.forEach(p);
}
function I(t, e) {
  const n = t.$$;
  n.fragment !== null && (_(n.on_destroy), n.fragment && n.fragment.d(e), n.on_destroy = n.fragment = null, n.ctx = []);
}
function J(t, e) {
  t.$$.dirty[0] === -1 && (i.push(t), q(), t.$$.dirty.fill(0)), t.$$.dirty[e / 31 | 0] |= 1 << e % 31;
}
function K(t, e, n, o, c, m, s, M = [-1]) {
  const d = y;
  a(t);
  const r = t.$$ = {
    fragment: null,
    ctx: [],
    // state
    props: m,
    update: l,
    not_equal: c,
    bound: E(),
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(e.context || (d ? d.$$.context : [])),
    // everything else
    callbacks: E(),
    dirty: M,
    skip_bound: !1,
    root: e.target || d.$$.root
  };
  s && s(r.root);
  let b = !1;
  if (r.ctx = n ? n(t, e.props || {}, (u, x, ...k) => {
    const w = k.length ? k[0] : x;
    return r.ctx && c(r.ctx[u], r.ctx[u] = w) && (!r.skip_bound && r.bound[u] && r.bound[u](w), b && J(t, u)), x;
  }) : [], r.update(), b = !0, _(r.before_update), r.fragment = o ? o(r.ctx) : !1, e.target) {
    if (e.hydrate) {
      const u = L(e.target);
      r.fragment && r.fragment.l(u), u.forEach(S);
    } else
      r.fragment && r.fragment.c();
    e.intro && F(t.$$.fragment), G(t, e.target, e.anchor, e.customElement), C();
  }
  a(d);
}
class Q {
  $destroy() {
    I(this, 1), this.$destroy = l;
  }
  $on(e, n) {
    if (!O(n))
      return l;
    const o = this.$$.callbacks[e] || (this.$$.callbacks[e] = []);
    return o.push(n), () => {
      const c = o.indexOf(n);
      c !== -1 && o.splice(c, 1);
    };
  }
  $set(e) {
    this.$$set && !A(e) && (this.$$.skip_bound = !0, this.$$set(e), this.$$.skip_bound = !1);
  }
}
function R(t) {
  let e;
  return {
    c() {
      e = H("main"), e.innerHTML = "<h1>Example Editor v0.0.6</h1>";
    },
    m(n, o) {
      B(n, e, o);
    },
    p: l,
    i: l,
    o: l,
    d(n) {
      n && S(e);
    }
  };
}
class U extends Q {
  constructor(e) {
    super(), K(this, e, null, R, P, {});
  }
}
export {
  U as default
};
