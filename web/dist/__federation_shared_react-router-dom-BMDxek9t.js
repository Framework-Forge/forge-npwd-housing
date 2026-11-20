import { importShared as Oe, __tla as __tla_0 } from "./__federation_fn_import-DWhSBi9z.js";
import { g as Xe } from "./_commonjsHelpers-C932wzq6.js";
import { h as dt } from "./hoist-non-react-statics.cjs-CMMHUrlT.js";
let On, Rn, sn, pn, Tn, vn, dn, mn, ue, gn, yn, qe, fe, xn, on, Pn, En, wn;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  var ke = {
    exports: {}
  }, mt = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED", gt = mt, yt = gt;
  function Ye() {
  }
  function Qe() {
  }
  Qe.resetWarningCache = Ye;
  var wt = function() {
    function e(r, o, i, s, c, f) {
      if (f !== yt) {
        var a = new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");
        throw a.name = "Invariant Violation", a;
      }
    }
    e.isRequired = e;
    function t() {
      return e;
    }
    var n = {
      array: e,
      bigint: e,
      bool: e,
      func: e,
      number: e,
      object: e,
      string: e,
      symbol: e,
      any: e,
      arrayOf: t,
      element: e,
      elementType: e,
      instanceOf: t,
      node: e,
      objectOf: t,
      oneOf: t,
      oneOfType: t,
      shape: t,
      exact: t,
      checkPropTypes: Qe,
      resetWarningCache: Ye
    };
    return n.PropTypes = n, n;
  };
  ke.exports = wt();
  var xt = ke.exports;
  const $e = Xe(xt);
  function ye(e, t) {
    return ye = Object.setPrototypeOf || function(r, o) {
      return r.__proto__ = o, r;
    }, ye(e, t);
  }
  function ee(e, t) {
    e.prototype = Object.create(t.prototype), e.prototype.constructor = e, ye(e, t);
  }
  function Y() {
    return Y = Object.assign || function(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    }, Y.apply(this, arguments);
  }
  function oe(e) {
    return e.charAt(0) === "/";
  }
  function pe(e, t) {
    for (var n = t, r = n + 1, o = e.length; r < o; n += 1, r += 1) e[n] = e[r];
    e.pop();
  }
  function Pt(e, t) {
    t === void 0 && (t = "");
    var n = e && e.split("/") || [], r = t && t.split("/") || [], o = e && oe(e), i = t && oe(t), s = o || i;
    if (e && oe(e) ? r = n : n.length && (r.pop(), r = r.concat(n)), !r.length) return "/";
    var c;
    if (r.length) {
      var f = r[r.length - 1];
      c = f === "." || f === ".." || f === "";
    } else c = false;
    for (var a = 0, u = r.length; u >= 0; u--) {
      var l = r[u];
      l === "." ? pe(r, u) : l === ".." ? (pe(r, u), a++) : a && (pe(r, u), a--);
    }
    if (!s) for (; a--; a) r.unshift("..");
    s && r[0] !== "" && (!r[0] || !oe(r[0])) && r.unshift("");
    var h = r.join("/");
    return c && h.substr(-1) !== "/" && (h += "/"), h;
  }
  function Ue(e) {
    return e.valueOf ? e.valueOf() : Object.prototype.valueOf.call(e);
  }
  function ie(e, t) {
    if (e === t) return true;
    if (e == null || t == null) return false;
    if (Array.isArray(e)) return Array.isArray(t) && e.length === t.length && e.every(function(o, i) {
      return ie(o, t[i]);
    });
    if (typeof e == "object" || typeof t == "object") {
      var n = Ue(e), r = Ue(t);
      return n !== e || r !== t ? ie(n, r) : Object.keys(Object.assign({}, e, t)).every(function(o) {
        return ie(e[o], t[o]);
      });
    }
    return false;
  }
  var Et = "Invariant failed";
  function V(e, t) {
    throw new Error(Et);
  }
  function re(e) {
    return e.charAt(0) === "/" ? e : "/" + e;
  }
  function Me(e) {
    return e.charAt(0) === "/" ? e.substr(1) : e;
  }
  function Ot(e, t) {
    return e.toLowerCase().indexOf(t.toLowerCase()) === 0 && "/?#".indexOf(e.charAt(t.length)) !== -1;
  }
  function Ze(e, t) {
    return Ot(e, t) ? e.substr(t.length) : e;
  }
  function et(e) {
    return e.charAt(e.length - 1) === "/" ? e.slice(0, -1) : e;
  }
  function Rt(e) {
    var t = e || "/", n = "", r = "", o = t.indexOf("#");
    o !== -1 && (r = t.substr(o), t = t.substr(0, o));
    var i = t.indexOf("?");
    return i !== -1 && (n = t.substr(i), t = t.substr(0, i)), {
      pathname: t,
      search: n === "?" ? "" : n,
      hash: r === "#" ? "" : r
    };
  }
  function j(e) {
    var t = e.pathname, n = e.search, r = e.hash, o = t || "/";
    return n && n !== "?" && (o += n.charAt(0) === "?" ? n : "?" + n), r && r !== "#" && (o += r.charAt(0) === "#" ? r : "#" + r), o;
  }
  function M(e, t, n, r) {
    var o;
    typeof e == "string" ? (o = Rt(e), o.state = t) : (o = Y({}, e), o.pathname === void 0 && (o.pathname = ""), o.search ? o.search.charAt(0) !== "?" && (o.search = "?" + o.search) : o.search = "", o.hash ? o.hash.charAt(0) !== "#" && (o.hash = "#" + o.hash) : o.hash = "", t !== void 0 && o.state === void 0 && (o.state = t));
    try {
      o.pathname = decodeURI(o.pathname);
    } catch (i) {
      throw i instanceof URIError ? new URIError('Pathname "' + o.pathname + '" could not be decoded. This is likely caused by an invalid percent-encoding.') : i;
    }
    return n && (o.key = n), r ? o.pathname ? o.pathname.charAt(0) !== "/" && (o.pathname = Pt(o.pathname, r.pathname)) : o.pathname = r.pathname : o.pathname || (o.pathname = "/"), o;
  }
  function Tt(e, t) {
    return e.pathname === t.pathname && e.search === t.search && e.hash === t.hash && e.key === t.key && ie(e.state, t.state);
  }
  function Re() {
    var e = null;
    function t(s) {
      return e = s, function() {
        e === s && (e = null);
      };
    }
    function n(s, c, f, a) {
      if (e != null) {
        var u = typeof e == "function" ? e(s, c) : e;
        typeof u == "string" ? typeof f == "function" ? f(u, a) : a(true) : a(u !== false);
      } else a(true);
    }
    var r = [];
    function o(s) {
      var c = true;
      function f() {
        c && s.apply(void 0, arguments);
      }
      return r.push(f), function() {
        c = false, r = r.filter(function(a) {
          return a !== f;
        });
      };
    }
    function i() {
      for (var s = arguments.length, c = new Array(s), f = 0; f < s; f++) c[f] = arguments[f];
      r.forEach(function(a) {
        return a.apply(void 0, c);
      });
    }
    return {
      setPrompt: t,
      confirmTransitionTo: n,
      appendListener: o,
      notifyListeners: i
    };
  }
  var tt = !!(typeof window < "u" && window.document && window.document.createElement);
  function nt(e, t) {
    t(window.confirm(e));
  }
  function Ct() {
    var e = window.navigator.userAgent;
    return (e.indexOf("Android 2.") !== -1 || e.indexOf("Android 4.0") !== -1) && e.indexOf("Mobile Safari") !== -1 && e.indexOf("Chrome") === -1 && e.indexOf("Windows Phone") === -1 ? false : window.history && "pushState" in window.history;
  }
  function bt() {
    return window.navigator.userAgent.indexOf("Trident") === -1;
  }
  function Lt() {
    return window.navigator.userAgent.indexOf("Firefox") === -1;
  }
  function At(e) {
    return e.state === void 0 && navigator.userAgent.indexOf("CriOS") === -1;
  }
  var He = "popstate", Ie = "hashchange";
  function je() {
    try {
      return window.history.state || {};
    } catch {
      return {};
    }
  }
  function St(e) {
    e === void 0 && (e = {}), tt || V();
    var t = window.history, n = Ct(), r = !bt(), o = e, i = o.forceRefresh, s = i === void 0 ? false : i, c = o.getUserConfirmation, f = c === void 0 ? nt : c, a = o.keyLength, u = a === void 0 ? 6 : a, l = e.basename ? et(re(e.basename)) : "";
    function h(v) {
      var p = v || {}, w = p.key, m = p.state, E = window.location, _ = E.pathname, D = E.search, K = E.hash, B = _ + D + K;
      return l && (B = Ze(B, l)), M(B, m, w);
    }
    function d() {
      return Math.random().toString(36).substr(2, u);
    }
    var g = Re();
    function O(v) {
      Y(W, v), W.length = t.length, g.notifyListeners(W.location, W.action);
    }
    function T(v) {
      At(v) || H(h(v.state));
    }
    function C() {
      H(h(je()));
    }
    var S = false;
    function H(v) {
      if (S) S = false, O();
      else {
        var p = "POP";
        g.confirmTransitionTo(v, p, f, function(w) {
          w ? O({
            action: p,
            location: v
          }) : I(v);
        });
      }
    }
    function I(v) {
      var p = W.location, w = R.indexOf(p.key);
      w === -1 && (w = 0);
      var m = R.indexOf(v.key);
      m === -1 && (m = 0);
      var E = w - m;
      E && (S = true, b(E));
    }
    var $ = h(je()), R = [
      $.key
    ];
    function y(v) {
      return l + j(v);
    }
    function x(v, p) {
      var w = "PUSH", m = M(v, p, d(), W.location);
      g.confirmTransitionTo(m, w, f, function(E) {
        if (E) {
          var _ = y(m), D = m.key, K = m.state;
          if (n) if (t.pushState({
            key: D,
            state: K
          }, null, _), s) window.location.href = _;
          else {
            var B = R.indexOf(W.location.key), X = R.slice(0, B + 1);
            X.push(m.key), R = X, O({
              action: w,
              location: m
            });
          }
          else window.location.href = _;
        }
      });
    }
    function A(v, p) {
      var w = "REPLACE", m = M(v, p, d(), W.location);
      g.confirmTransitionTo(m, w, f, function(E) {
        if (E) {
          var _ = y(m), D = m.key, K = m.state;
          if (n) if (t.replaceState({
            key: D,
            state: K
          }, null, _), s) window.location.replace(_);
          else {
            var B = R.indexOf(W.location.key);
            B !== -1 && (R[B] = m.key), O({
              action: w,
              location: m
            });
          }
          else window.location.replace(_);
        }
      });
    }
    function b(v) {
      t.go(v);
    }
    function L() {
      b(-1);
    }
    function z() {
      b(1);
    }
    var J = 0;
    function N(v) {
      J += v, J === 1 && v === 1 ? (window.addEventListener(He, T), r && window.addEventListener(Ie, C)) : J === 0 && (window.removeEventListener(He, T), r && window.removeEventListener(Ie, C));
    }
    var U = false;
    function k(v) {
      v === void 0 && (v = false);
      var p = g.setPrompt(v);
      return U || (N(1), U = true), function() {
        return U && (U = false, N(-1)), p();
      };
    }
    function he(v) {
      var p = g.appendListener(v);
      return N(1), function() {
        N(-1), p();
      };
    }
    var W = {
      length: t.length,
      action: "POP",
      location: $,
      createHref: y,
      push: x,
      replace: A,
      go: b,
      goBack: L,
      goForward: z,
      block: k,
      listen: he
    };
    return W;
  }
  var Ne = "hashchange", _t = {
    hashbang: {
      encodePath: function(t) {
        return t.charAt(0) === "!" ? t : "!/" + Me(t);
      },
      decodePath: function(t) {
        return t.charAt(0) === "!" ? t.substr(1) : t;
      }
    },
    noslash: {
      encodePath: Me,
      decodePath: re
    },
    slash: {
      encodePath: re,
      decodePath: re
    }
  };
  function rt(e) {
    var t = e.indexOf("#");
    return t === -1 ? e : e.slice(0, t);
  }
  function ne() {
    var e = window.location.href, t = e.indexOf("#");
    return t === -1 ? "" : e.substring(t + 1);
  }
  function $t(e) {
    window.location.hash = e;
  }
  function ve(e) {
    window.location.replace(rt(window.location.href) + "#" + e);
  }
  function Ut(e) {
    e === void 0 && (e = {}), tt || V();
    var t = window.history;
    Lt();
    var n = e, r = n.getUserConfirmation, o = r === void 0 ? nt : r, i = n.hashType, s = i === void 0 ? "slash" : i, c = e.basename ? et(re(e.basename)) : "", f = _t[s], a = f.encodePath, u = f.decodePath;
    function l() {
      var p = u(ne());
      return c && (p = Ze(p, c)), M(p);
    }
    var h = Re();
    function d(p) {
      Y(v, p), v.length = t.length, h.notifyListeners(v.location, v.action);
    }
    var g = false, O = null;
    function T(p, w) {
      return p.pathname === w.pathname && p.search === w.search && p.hash === w.hash;
    }
    function C() {
      var p = ne(), w = a(p);
      if (p !== w) ve(w);
      else {
        var m = l(), E = v.location;
        if (!g && T(E, m) || O === j(m)) return;
        O = null, S(m);
      }
    }
    function S(p) {
      if (g) g = false, d();
      else {
        var w = "POP";
        h.confirmTransitionTo(p, w, o, function(m) {
          m ? d({
            action: w,
            location: p
          }) : H(p);
        });
      }
    }
    function H(p) {
      var w = v.location, m = y.lastIndexOf(j(w));
      m === -1 && (m = 0);
      var E = y.lastIndexOf(j(p));
      E === -1 && (E = 0);
      var _ = m - E;
      _ && (g = true, L(_));
    }
    var I = ne(), $ = a(I);
    I !== $ && ve($);
    var R = l(), y = [
      j(R)
    ];
    function x(p) {
      var w = document.querySelector("base"), m = "";
      return w && w.getAttribute("href") && (m = rt(window.location.href)), m + "#" + a(c + j(p));
    }
    function A(p, w) {
      var m = "PUSH", E = M(p, void 0, void 0, v.location);
      h.confirmTransitionTo(E, m, o, function(_) {
        if (_) {
          var D = j(E), K = a(c + D), B = ne() !== K;
          if (B) {
            O = D, $t(K);
            var X = y.lastIndexOf(j(v.location)), _e = y.slice(0, X + 1);
            _e.push(D), y = _e, d({
              action: m,
              location: E
            });
          } else d();
        }
      });
    }
    function b(p, w) {
      var m = "REPLACE", E = M(p, void 0, void 0, v.location);
      h.confirmTransitionTo(E, m, o, function(_) {
        if (_) {
          var D = j(E), K = a(c + D), B = ne() !== K;
          B && (O = D, ve(K));
          var X = y.indexOf(j(v.location));
          X !== -1 && (y[X] = D), d({
            action: m,
            location: E
          });
        }
      });
    }
    function L(p) {
      t.go(p);
    }
    function z() {
      L(-1);
    }
    function J() {
      L(1);
    }
    var N = 0;
    function U(p) {
      N += p, N === 1 && p === 1 ? window.addEventListener(Ne, C) : N === 0 && window.removeEventListener(Ne, C);
    }
    var k = false;
    function he(p) {
      p === void 0 && (p = false);
      var w = h.setPrompt(p);
      return k || (U(1), k = true), function() {
        return k && (k = false, U(-1)), w();
      };
    }
    function W(p) {
      var w = h.appendListener(p);
      return U(1), function() {
        U(-1), w();
      };
    }
    var v = {
      length: t.length,
      action: "POP",
      location: R,
      createHref: x,
      push: A,
      replace: b,
      go: L,
      goBack: z,
      goForward: J,
      block: he,
      listen: W
    };
    return v;
  }
  function De(e, t, n) {
    return Math.min(Math.max(e, t), n);
  }
  function Mt(e) {
    e === void 0 && (e = {});
    var t = e, n = t.getUserConfirmation, r = t.initialEntries, o = r === void 0 ? [
      "/"
    ] : r, i = t.initialIndex, s = i === void 0 ? 0 : i, c = t.keyLength, f = c === void 0 ? 6 : c, a = Re();
    function u(x) {
      Y(y, x), y.length = y.entries.length, a.notifyListeners(y.location, y.action);
    }
    function l() {
      return Math.random().toString(36).substr(2, f);
    }
    var h = De(s, 0, o.length - 1), d = o.map(function(x) {
      return typeof x == "string" ? M(x, void 0, l()) : M(x, void 0, x.key || l());
    }), g = j;
    function O(x, A) {
      var b = "PUSH", L = M(x, A, l(), y.location);
      a.confirmTransitionTo(L, b, n, function(z) {
        if (z) {
          var J = y.index, N = J + 1, U = y.entries.slice(0);
          U.length > N ? U.splice(N, U.length - N, L) : U.push(L), u({
            action: b,
            location: L,
            index: N,
            entries: U
          });
        }
      });
    }
    function T(x, A) {
      var b = "REPLACE", L = M(x, A, l(), y.location);
      a.confirmTransitionTo(L, b, n, function(z) {
        z && (y.entries[y.index] = L, u({
          action: b,
          location: L
        }));
      });
    }
    function C(x) {
      var A = De(y.index + x, 0, y.entries.length - 1), b = "POP", L = y.entries[A];
      a.confirmTransitionTo(L, b, n, function(z) {
        z ? u({
          action: b,
          location: L,
          index: A
        }) : u();
      });
    }
    function S() {
      C(-1);
    }
    function H() {
      C(1);
    }
    function I(x) {
      var A = y.index + x;
      return A >= 0 && A < y.entries.length;
    }
    function $(x) {
      return x === void 0 && (x = false), a.setPrompt(x);
    }
    function R(x) {
      return a.appendListener(x);
    }
    var y = {
      length: d.length,
      action: "POP",
      location: d[h],
      index: h,
      entries: d,
      createHref: g,
      push: O,
      replace: T,
      go: C,
      goBack: S,
      goForward: H,
      canGo: I,
      block: $,
      listen: R
    };
    return y;
  }
  function we(e, t) {
    return we = Object.setPrototypeOf || function(r, o) {
      return r.__proto__ = o, r;
    }, we(e, t);
  }
  function We(e, t) {
    e.prototype = Object.create(t.prototype), e.prototype.constructor = e, we(e, t);
  }
  const ot = await Oe("react"), { Component: Be } = ot;
  var de = 1073741823, Fe = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : {};
  function Ht() {
    var e = "__global_unique_id__";
    return Fe[e] = (Fe[e] || 0) + 1;
  }
  function It(e, t) {
    return e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
  }
  function jt(e) {
    var t = [];
    return {
      on: function(r) {
        t.push(r);
      },
      off: function(r) {
        t = t.filter(function(o) {
          return o !== r;
        });
      },
      get: function() {
        return e;
      },
      set: function(r, o) {
        e = r, t.forEach(function(i) {
          return i(e, o);
        });
      }
    };
  }
  function Nt(e) {
    return Array.isArray(e) ? e[0] : e;
  }
  function Dt(e, t) {
    var n, r, o = "__create-react-context-" + Ht() + "__", i = function(c) {
      We(f, c);
      function f() {
        var u;
        return u = c.apply(this, arguments) || this, u.emitter = jt(u.props.value), u;
      }
      var a = f.prototype;
      return a.getChildContext = function() {
        var l;
        return l = {}, l[o] = this.emitter, l;
      }, a.componentWillReceiveProps = function(l) {
        if (this.props.value !== l.value) {
          var h = this.props.value, d = l.value, g;
          It(h, d) ? g = 0 : (g = typeof t == "function" ? t(h, d) : de, g |= 0, g !== 0 && this.emitter.set(l.value, g));
        }
      }, a.render = function() {
        return this.props.children;
      }, f;
    }(Be);
    i.childContextTypes = (n = {}, n[o] = $e.object.isRequired, n);
    var s = function(c) {
      We(f, c);
      function f() {
        var u;
        return u = c.apply(this, arguments) || this, u.state = {
          value: u.getValue()
        }, u.onUpdate = function(l, h) {
          var d = u.observedBits | 0;
          d & h && u.setState({
            value: u.getValue()
          });
        }, u;
      }
      var a = f.prototype;
      return a.componentWillReceiveProps = function(l) {
        var h = l.observedBits;
        this.observedBits = h ?? de;
      }, a.componentDidMount = function() {
        this.context[o] && this.context[o].on(this.onUpdate);
        var l = this.props.observedBits;
        this.observedBits = l ?? de;
      }, a.componentWillUnmount = function() {
        this.context[o] && this.context[o].off(this.onUpdate);
      }, a.getValue = function() {
        return this.context[o] ? this.context[o].get() : e;
      }, a.render = function() {
        return Nt(this.props.children)(this.state.value);
      }, f;
    }(Be);
    return s.contextTypes = (r = {}, r[o] = $e.object, r), {
      Provider: i,
      Consumer: s
    };
  }
  var Wt = ot.createContext || Dt;
  function G() {
    return G = Object.assign || function(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    }, G.apply(this, arguments);
  }
  var te = {
    exports: {}
  }, Bt = Array.isArray || function(e) {
    return Object.prototype.toString.call(e) == "[object Array]";
  }, ce = Bt;
  te.exports = ct;
  te.exports.parse = Te;
  te.exports.compile = Kt;
  te.exports.tokensToFunction = it;
  te.exports.tokensToRegExp = at;
  var Ft = new RegExp([
    "(\\\\.)",
    "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))"
  ].join("|"), "g");
  function Te(e, t) {
    for (var n = [], r = 0, o = 0, i = "", s = t && t.delimiter || "/", c; (c = Ft.exec(e)) != null; ) {
      var f = c[0], a = c[1], u = c.index;
      if (i += e.slice(o, u), o = u + f.length, a) {
        i += a[1];
        continue;
      }
      var l = e[o], h = c[2], d = c[3], g = c[4], O = c[5], T = c[6], C = c[7];
      i && (n.push(i), i = "");
      var S = h != null && l != null && l !== h, H = T === "+" || T === "*", I = T === "?" || T === "*", $ = c[2] || s, R = g || O;
      n.push({
        name: d || r++,
        prefix: h || "",
        delimiter: $,
        optional: I,
        repeat: H,
        partial: S,
        asterisk: !!C,
        pattern: R ? Vt(R) : C ? ".*" : "[^" + ae($) + "]+?"
      });
    }
    return o < e.length && (i += e.substr(o)), i && n.push(i), n;
  }
  function Kt(e, t) {
    return it(Te(e, t), t);
  }
  function qt(e) {
    return encodeURI(e).replace(/[\/?#]/g, function(t) {
      return "%" + t.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  function Gt(e) {
    return encodeURI(e).replace(/[?#]/g, function(t) {
      return "%" + t.charCodeAt(0).toString(16).toUpperCase();
    });
  }
  function it(e, t) {
    for (var n = new Array(e.length), r = 0; r < e.length; r++) typeof e[r] == "object" && (n[r] = new RegExp("^(?:" + e[r].pattern + ")$", be(t)));
    return function(o, i) {
      for (var s = "", c = o || {}, f = i || {}, a = f.pretty ? qt : encodeURIComponent, u = 0; u < e.length; u++) {
        var l = e[u];
        if (typeof l == "string") {
          s += l;
          continue;
        }
        var h = c[l.name], d;
        if (h == null) if (l.optional) {
          l.partial && (s += l.prefix);
          continue;
        } else throw new TypeError('Expected "' + l.name + '" to be defined');
        if (ce(h)) {
          if (!l.repeat) throw new TypeError('Expected "' + l.name + '" to not repeat, but received `' + JSON.stringify(h) + "`");
          if (h.length === 0) {
            if (l.optional) continue;
            throw new TypeError('Expected "' + l.name + '" to not be empty');
          }
          for (var g = 0; g < h.length; g++) {
            if (d = a(h[g]), !n[u].test(d)) throw new TypeError('Expected all "' + l.name + '" to match "' + l.pattern + '", but received `' + JSON.stringify(d) + "`");
            s += (g === 0 ? l.prefix : l.delimiter) + d;
          }
          continue;
        }
        if (d = l.asterisk ? Gt(h) : a(h), !n[u].test(d)) throw new TypeError('Expected "' + l.name + '" to match "' + l.pattern + '", but received "' + d + '"');
        s += l.prefix + d;
      }
      return s;
    };
  }
  function ae(e) {
    return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1");
  }
  function Vt(e) {
    return e.replace(/([=!:$\/()])/g, "\\$1");
  }
  function Ce(e, t) {
    return e.keys = t, e;
  }
  function be(e) {
    return e && e.sensitive ? "" : "i";
  }
  function zt(e, t) {
    var n = e.source.match(/\((?!\?)/g);
    if (n) for (var r = 0; r < n.length; r++) t.push({
      name: r,
      prefix: null,
      delimiter: null,
      optional: false,
      repeat: false,
      partial: false,
      asterisk: false,
      pattern: null
    });
    return Ce(e, t);
  }
  function Jt(e, t, n) {
    for (var r = [], o = 0; o < e.length; o++) r.push(ct(e[o], t, n).source);
    var i = new RegExp("(?:" + r.join("|") + ")", be(n));
    return Ce(i, t);
  }
  function Xt(e, t, n) {
    return at(Te(e, n), t, n);
  }
  function at(e, t, n) {
    ce(t) || (n = t || n, t = []), n = n || {};
    for (var r = n.strict, o = n.end !== false, i = "", s = 0; s < e.length; s++) {
      var c = e[s];
      if (typeof c == "string") i += ae(c);
      else {
        var f = ae(c.prefix), a = "(?:" + c.pattern + ")";
        t.push(c), c.repeat && (a += "(?:" + f + a + ")*"), c.optional ? c.partial ? a = f + "(" + a + ")?" : a = "(?:" + f + "(" + a + "))?" : a = f + "(" + a + ")", i += a;
      }
    }
    var u = ae(n.delimiter || "/"), l = i.slice(-u.length) === u;
    return r || (i = (l ? i.slice(0, -u.length) : i) + "(?:" + u + "(?=$))?"), o ? i += "$" : i += r && l ? "" : "(?=" + u + "|$)", Ce(new RegExp("^" + i, be(n)), t);
  }
  function ct(e, t, n) {
    return ce(t) || (n = t || n, t = []), n = n || {}, e instanceof RegExp ? zt(e, t) : ce(e) ? Jt(e, t, n) : Xt(e, t, n);
  }
  var kt = te.exports;
  const st = Xe(kt);
  function ut(e, t) {
    if (e == null) return {};
    var n = {}, r = Object.keys(e), o, i;
    for (i = 0; i < r.length; i++) o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
    return n;
  }
  const P = await Oe("react");
  let ft, lt, F, ht;
  ft = function(t) {
    var n = Wt();
    return n.displayName = t, n;
  };
  lt = ft("Router-History");
  F = ft("Router");
  ue = function(e) {
    ee(t, e), t.computeRootMatch = function(o) {
      return {
        path: "/",
        url: "/",
        params: {},
        isExact: o === "/"
      };
    };
    function t(r) {
      var o;
      return o = e.call(this, r) || this, o.state = {
        location: r.history.location
      }, o._isMounted = false, o._pendingLocation = null, r.staticContext || (o.unlisten = r.history.listen(function(i) {
        o._isMounted ? o.setState({
          location: i
        }) : o._pendingLocation = i;
      })), o;
    }
    var n = t.prototype;
    return n.componentDidMount = function() {
      this._isMounted = true, this._pendingLocation && this.setState({
        location: this._pendingLocation
      });
    }, n.componentWillUnmount = function() {
      this.unlisten && (this.unlisten(), this._isMounted = false, this._pendingLocation = null);
    }, n.render = function() {
      return P.createElement(F.Provider, {
        value: {
          history: this.props.history,
          location: this.state.location,
          match: t.computeRootMatch(this.state.location.pathname),
          staticContext: this.props.staticContext
        }
      }, P.createElement(lt.Provider, {
        children: this.props.children || null,
        value: this.props.history
      }));
    }, t;
  }(P.Component);
  pn = function(e) {
    ee(t, e);
    function t() {
      for (var r, o = arguments.length, i = new Array(o), s = 0; s < o; s++) i[s] = arguments[s];
      return r = e.call.apply(e, [
        this
      ].concat(i)) || this, r.history = Mt(r.props), r;
    }
    var n = t.prototype;
    return n.render = function() {
      return P.createElement(ue, {
        history: this.history,
        children: this.props.children
      });
    }, t;
  }(P.Component);
  ht = function(e) {
    ee(t, e);
    function t() {
      return e.apply(this, arguments) || this;
    }
    var n = t.prototype;
    return n.componentDidMount = function() {
      this.props.onMount && this.props.onMount.call(this, this);
    }, n.componentDidUpdate = function(o) {
      this.props.onUpdate && this.props.onUpdate.call(this, this, o);
    }, n.componentWillUnmount = function() {
      this.props.onUnmount && this.props.onUnmount.call(this, this);
    }, n.render = function() {
      return null;
    }, t;
  }(P.Component);
  vn = function(e) {
    var t = e.message, n = e.when, r = n === void 0 ? true : n;
    return P.createElement(F.Consumer, null, function(o) {
      if (o || V(), !r || o.staticContext) return null;
      var i = o.history.block;
      return P.createElement(ht, {
        onMount: function(c) {
          c.release = i(t);
        },
        onUpdate: function(c, f) {
          f.message !== t && (c.release(), c.release = i(t));
        },
        onUnmount: function(c) {
          c.release();
        },
        message: t
      });
    });
  };
  var me = {}, Yt = 1e4, Ke = 0;
  function Qt(e) {
    if (me[e]) return me[e];
    var t = st.compile(e);
    return Ke < Yt && (me[e] = t, Ke++), t;
  }
  qe = function(e, t) {
    return e === void 0 && (e = "/"), t === void 0 && (t = {}), e === "/" ? e : Qt(e)(t, {
      pretty: true
    });
  };
  dn = function(e) {
    var t = e.computedMatch, n = e.to, r = e.push, o = r === void 0 ? false : r;
    return P.createElement(F.Consumer, null, function(i) {
      i || V();
      var s = i.history, c = i.staticContext, f = o ? s.push : s.replace, a = M(t ? typeof n == "string" ? qe(n, t.params) : G({}, n, {
        pathname: qe(n.pathname, t.params)
      }) : n);
      return c ? (f(a), null) : P.createElement(ht, {
        onMount: function() {
          f(a);
        },
        onUpdate: function(l, h) {
          var d = M(h.to);
          Tt(d, G({}, a, {
            key: d.key
          })) || f(a);
        },
        to: n
      });
    });
  };
  var Ge = {}, Zt = 1e4, Ve = 0;
  function en(e, t) {
    var n = "" + t.end + t.strict + t.sensitive, r = Ge[n] || (Ge[n] = {});
    if (r[e]) return r[e];
    var o = [], i = st(e, o, t), s = {
      regexp: i,
      keys: o
    };
    return Ve < Zt && (r[e] = s, Ve++), s;
  }
  fe = function(e, t) {
    t === void 0 && (t = {}), (typeof t == "string" || Array.isArray(t)) && (t = {
      path: t
    });
    var n = t, r = n.path, o = n.exact, i = o === void 0 ? false : o, s = n.strict, c = s === void 0 ? false : s, f = n.sensitive, a = f === void 0 ? false : f, u = [].concat(r);
    return u.reduce(function(l, h) {
      if (!h && h !== "") return null;
      if (l) return l;
      var d = en(h, {
        end: i,
        strict: c,
        sensitive: a
      }), g = d.regexp, O = d.keys, T = g.exec(e);
      if (!T) return null;
      var C = T[0], S = T.slice(1), H = e === C;
      return i && !H ? null : {
        path: h,
        url: h === "/" && C === "" ? "/" : C,
        isExact: H,
        params: O.reduce(function(I, $, R) {
          return I[$.name] = S[R], I;
        }, {})
      };
    }, null);
  };
  function tn(e) {
    return P.Children.count(e) === 0;
  }
  mn = function(e) {
    ee(t, e);
    function t() {
      return e.apply(this, arguments) || this;
    }
    var n = t.prototype;
    return n.render = function() {
      var o = this;
      return P.createElement(F.Consumer, null, function(i) {
        i || V();
        var s = o.props.location || i.location, c = o.props.computedMatch ? o.props.computedMatch : o.props.path ? fe(s.pathname, o.props) : i.match, f = G({}, i, {
          location: s,
          match: c
        }), a = o.props, u = a.children, l = a.component, h = a.render;
        return Array.isArray(u) && tn(u) && (u = null), P.createElement(F.Provider, {
          value: f
        }, f.match ? u ? typeof u == "function" ? u(f) : u : l ? P.createElement(l, f) : h ? h(f) : null : typeof u == "function" ? u(f) : null);
      });
    }, t;
  }(P.Component);
  function Le(e) {
    return e.charAt(0) === "/" ? e : "/" + e;
  }
  function nn(e, t) {
    return e ? G({}, t, {
      pathname: Le(e) + t.pathname
    }) : t;
  }
  function rn(e, t) {
    if (!e) return t;
    var n = Le(e);
    return t.pathname.indexOf(n) !== 0 ? t : G({}, t, {
      pathname: t.pathname.substr(n.length)
    });
  }
  function ze(e) {
    return typeof e == "string" ? e : j(e);
  }
  function ge(e) {
    return function() {
      V();
    };
  }
  function Je() {
  }
  gn = function(e) {
    ee(t, e);
    function t() {
      for (var r, o = arguments.length, i = new Array(o), s = 0; s < o; s++) i[s] = arguments[s];
      return r = e.call.apply(e, [
        this
      ].concat(i)) || this, r.handlePush = function(c) {
        return r.navigateTo(c, "PUSH");
      }, r.handleReplace = function(c) {
        return r.navigateTo(c, "REPLACE");
      }, r.handleListen = function() {
        return Je;
      }, r.handleBlock = function() {
        return Je;
      }, r;
    }
    var n = t.prototype;
    return n.navigateTo = function(o, i) {
      var s = this.props, c = s.basename, f = c === void 0 ? "" : c, a = s.context, u = a === void 0 ? {} : a;
      u.action = i, u.location = nn(f, M(o)), u.url = ze(u.location);
    }, n.render = function() {
      var o = this.props, i = o.basename, s = i === void 0 ? "" : i, c = o.context, f = c === void 0 ? {} : c, a = o.location, u = a === void 0 ? "/" : a, l = ut(o, [
        "basename",
        "context",
        "location"
      ]), h = {
        createHref: function(g) {
          return Le(s + ze(g));
        },
        action: "POP",
        location: rn(s, M(u)),
        push: this.handlePush,
        replace: this.handleReplace,
        go: ge(),
        goBack: ge(),
        goForward: ge(),
        listen: this.handleListen,
        block: this.handleBlock
      };
      return P.createElement(ue, G({}, l, {
        history: h,
        staticContext: f
      }));
    }, t;
  }(P.Component);
  yn = function(e) {
    ee(t, e);
    function t() {
      return e.apply(this, arguments) || this;
    }
    var n = t.prototype;
    return n.render = function() {
      var o = this;
      return P.createElement(F.Consumer, null, function(i) {
        i || V();
        var s = o.props.location || i.location, c, f;
        return P.Children.forEach(o.props.children, function(a) {
          if (f == null && P.isValidElement(a)) {
            c = a;
            var u = a.props.path || a.props.from;
            f = u ? fe(s.pathname, G({}, a.props, {
              path: u
            })) : i.match;
          }
        }), f ? P.cloneElement(c, {
          location: s,
          computedMatch: f
        }) : null;
      });
    }, t;
  }(P.Component);
  wn = function(e) {
    var t = "withRouter(" + (e.displayName || e.name) + ")", n = function(o) {
      var i = o.wrappedComponentRef, s = ut(o, [
        "wrappedComponentRef"
      ]);
      return P.createElement(F.Consumer, null, function(c) {
        return c || V(), P.createElement(e, G({}, s, c, {
          ref: i
        }));
      });
    };
    return n.displayName = t, n.WrappedComponent = e, dt(n, e);
  };
  var le = P.useContext;
  xn = function() {
    return le(lt);
  };
  on = function() {
    return le(F).location;
  };
  Pn = function() {
    var e = le(F).match;
    return e ? e.params : {};
  };
  En = function(e) {
    var t = on(), n = le(F).match;
    return e ? fe(t.pathname, e) : n;
  };
  function xe(e, t) {
    return xe = Object.setPrototypeOf || function(r, o) {
      return r.__proto__ = o, r;
    }, xe(e, t);
  }
  function pt(e, t) {
    e.prototype = Object.create(t.prototype), e.prototype.constructor = e, xe(e, t);
  }
  function Q() {
    return Q = Object.assign || function(e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var r in n) Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
      }
      return e;
    }, Q.apply(this, arguments);
  }
  function Ae(e, t) {
    if (e == null) return {};
    var n = {}, r = Object.keys(e), o, i;
    for (i = 0; i < r.length; i++) o = r[i], !(t.indexOf(o) >= 0) && (n[o] = e[o]);
    return n;
  }
  const q = await Oe("react");
  let Pe, Ee, Se, Z;
  On = function(e) {
    pt(t, e);
    function t() {
      for (var r, o = arguments.length, i = new Array(o), s = 0; s < o; s++) i[s] = arguments[s];
      return r = e.call.apply(e, [
        this
      ].concat(i)) || this, r.history = St(r.props), r;
    }
    var n = t.prototype;
    return n.render = function() {
      return q.createElement(ue, {
        history: this.history,
        children: this.props.children
      });
    }, t;
  }(q.Component);
  Rn = function(e) {
    pt(t, e);
    function t() {
      for (var r, o = arguments.length, i = new Array(o), s = 0; s < o; s++) i[s] = arguments[s];
      return r = e.call.apply(e, [
        this
      ].concat(i)) || this, r.history = Ut(r.props), r;
    }
    var n = t.prototype;
    return n.render = function() {
      return q.createElement(ue, {
        history: this.history,
        children: this.props.children
      });
    }, t;
  }(q.Component);
  Pe = function(t, n) {
    return typeof t == "function" ? t(n) : t;
  };
  Ee = function(t, n) {
    return typeof t == "string" ? M(t, null, null, n) : t;
  };
  Se = function(t) {
    return t;
  };
  Z = q.forwardRef;
  typeof Z > "u" && (Z = Se);
  function an(e) {
    return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
  }
  let cn, vt, se;
  cn = Z(function(e, t) {
    var n = e.innerRef, r = e.navigate, o = e.onClick, i = Ae(e, [
      "innerRef",
      "navigate",
      "onClick"
    ]), s = i.target, c = Q({}, i, {
      onClick: function(a) {
        try {
          o && o(a);
        } catch (u) {
          throw a.preventDefault(), u;
        }
        !a.defaultPrevented && a.button === 0 && (!s || s === "_self") && !an(a) && (a.preventDefault(), r());
      }
    });
    return Se !== Z ? c.ref = t || n : c.ref = n, q.createElement("a", c);
  });
  sn = Z(function(e, t) {
    var n = e.component, r = n === void 0 ? cn : n, o = e.replace, i = e.to, s = e.innerRef, c = Ae(e, [
      "component",
      "replace",
      "to",
      "innerRef"
    ]);
    return q.createElement(F.Consumer, null, function(f) {
      f || V();
      var a = f.history, u = Ee(Pe(i, f.location), f.location), l = u ? a.createHref(u) : "", h = Q({}, c, {
        href: l,
        navigate: function() {
          var g = Pe(i, f.location), O = j(f.location) === j(Ee(g)), T = o || O ? a.replace : a.push;
          T(g);
        }
      });
      return Se !== Z ? h.ref = t || s : h.innerRef = s, q.createElement(r, h);
    });
  });
  vt = function(t) {
    return t;
  };
  se = q.forwardRef;
  typeof se > "u" && (se = vt);
  function un() {
    for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
    return t.filter(function(r) {
      return r;
    }).join(" ");
  }
  Tn = se(function(e, t) {
    var n = e["aria-current"], r = n === void 0 ? "page" : n, o = e.activeClassName, i = o === void 0 ? "active" : o, s = e.activeStyle, c = e.className, f = e.exact, a = e.isActive, u = e.location, l = e.sensitive, h = e.strict, d = e.style, g = e.to, O = e.innerRef, T = Ae(e, [
      "aria-current",
      "activeClassName",
      "activeStyle",
      "className",
      "exact",
      "isActive",
      "location",
      "sensitive",
      "strict",
      "style",
      "to",
      "innerRef"
    ]);
    return q.createElement(F.Consumer, null, function(C) {
      C || V();
      var S = u || C.location, H = Ee(Pe(g, S), S), I = H.pathname, $ = I && I.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"), R = $ ? fe(S.pathname, {
        path: $,
        exact: f,
        sensitive: l,
        strict: h
      }) : null, y = !!(a ? a(R, S) : R), x = typeof c == "function" ? c(y) : c, A = typeof d == "function" ? d(y) : d;
      y && (x = un(x, i), A = Q({}, A, s));
      var b = Q({
        "aria-current": y && r || null,
        className: x,
        style: A,
        to: H
      }, T);
      return vt !== se ? b.ref = t || O : b.innerRef = O, q.createElement(sn, b);
    });
  });
});
export {
  On as BrowserRouter,
  Rn as HashRouter,
  sn as Link,
  pn as MemoryRouter,
  Tn as NavLink,
  vn as Prompt,
  dn as Redirect,
  mn as Route,
  ue as Router,
  gn as StaticRouter,
  yn as Switch,
  __tla,
  qe as generatePath,
  fe as matchPath,
  xn as useHistory,
  on as useLocation,
  Pn as useParams,
  En as useRouteMatch,
  wn as withRouter
};
