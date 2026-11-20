import { importShared as Q, __tla as __tla_0 } from "./__federation_fn_import-DWhSBi9z.js";
import { h as je } from "./hoist-non-react-statics.cjs-CMMHUrlT.js";
let Lr, Vr, I, Y, Br, Fr, Rr, jr, _r, $e, oe, Dr, qr, Ge, ce, X, Gr, ve;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  Y = function() {
    return Y = Object.assign ? Object.assign.bind() : function(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = arguments[r];
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
      }
      return e;
    }, Y.apply(this, arguments);
  };
  Ge = function(e) {
    var r = /* @__PURE__ */ Object.create(null);
    return function(t) {
      return r[t] === void 0 && (r[t] = e(t)), r[t];
    };
  };
  var Fe = true;
  $e = function(e, r, t) {
    var n = "";
    return t.split(" ").forEach(function(a) {
      e[a] !== void 0 ? r.push(e[a] + ";") : n += a + " ";
    }), n;
  };
  ce = function(r, t, n) {
    var a = r.key + "-" + t.name;
    (n === false || Fe === false) && r.registered[a] === void 0 && (r.registered[a] = t.styles);
  };
  oe = function(r, t, n) {
    ce(r, t, n);
    var a = r.key + "-" + t.name;
    if (r.inserted[t.name] === void 0) {
      var s = t;
      do
        r.insert(t === s ? "." + a : "", s, r.sheet, true), s = s.next;
      while (s !== void 0);
    }
  };
  function _e(e) {
    for (var r = 0, t, n = 0, a = e.length; a >= 4; ++n, a -= 4) t = e.charCodeAt(n) & 255 | (e.charCodeAt(++n) & 255) << 8 | (e.charCodeAt(++n) & 255) << 16 | (e.charCodeAt(++n) & 255) << 24, t = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16), t ^= t >>> 24, r = (t & 65535) * 1540483477 + ((t >>> 16) * 59797 << 16) ^ (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16);
    switch (a) {
      case 3:
        r ^= (e.charCodeAt(n + 2) & 255) << 16;
      case 2:
        r ^= (e.charCodeAt(n + 1) & 255) << 8;
      case 1:
        r ^= e.charCodeAt(n) & 255, r = (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16);
    }
    return r ^= r >>> 13, r = (r & 65535) * 1540483477 + ((r >>> 16) * 59797 << 16), ((r ^ r >>> 15) >>> 0).toString(36);
  }
  var De = {
    animationIterationCount: 1,
    borderImageOutset: 1,
    borderImageSlice: 1,
    borderImageWidth: 1,
    boxFlex: 1,
    boxFlexGroup: 1,
    boxOrdinalGroup: 1,
    columnCount: 1,
    columns: 1,
    flex: 1,
    flexGrow: 1,
    flexPositive: 1,
    flexShrink: 1,
    flexNegative: 1,
    flexOrder: 1,
    gridRow: 1,
    gridRowEnd: 1,
    gridRowSpan: 1,
    gridRowStart: 1,
    gridColumn: 1,
    gridColumnEnd: 1,
    gridColumnSpan: 1,
    gridColumnStart: 1,
    msGridRow: 1,
    msGridRowSpan: 1,
    msGridColumn: 1,
    msGridColumnSpan: 1,
    fontWeight: 1,
    lineHeight: 1,
    opacity: 1,
    order: 1,
    orphans: 1,
    tabSize: 1,
    widows: 1,
    zIndex: 1,
    zoom: 1,
    WebkitLineClamp: 1,
    fillOpacity: 1,
    floodOpacity: 1,
    stopOpacity: 1,
    strokeDasharray: 1,
    strokeDashoffset: 1,
    strokeMiterlimit: 1,
    strokeOpacity: 1,
    strokeWidth: 1
  }, Ve = /[A-Z]|^ms/g, qe = /_EMO_([^_]+?)_([^]*?)_EMO_/g, Ae = function(r) {
    return r.charCodeAt(1) === 45;
  }, me = function(r) {
    return r != null && typeof r != "boolean";
  }, ne = Ge(function(e) {
    return Ae(e) ? e : e.replace(Ve, "-$&").toLowerCase();
  }), ge = function(r, t) {
    switch (r) {
      case "animation":
      case "animationName":
        if (typeof t == "string") return t.replace(qe, function(n, a, s) {
          return k = {
            name: a,
            styles: s,
            next: k
          }, a;
        });
    }
    return De[r] !== 1 && !Ae(r) && typeof t == "number" && t !== 0 ? t + "px" : t;
  };
  function F(e, r, t) {
    if (t == null) return "";
    if (t.__emotion_styles !== void 0) return t;
    switch (typeof t) {
      case "boolean":
        return "";
      case "object": {
        if (t.anim === 1) return k = {
          name: t.name,
          styles: t.styles,
          next: k
        }, t.name;
        if (t.styles !== void 0) {
          var n = t.next;
          if (n !== void 0) for (; n !== void 0; ) k = {
            name: n.name,
            styles: n.styles,
            next: k
          }, n = n.next;
          var a = t.styles + ";";
          return a;
        }
        return Be(e, r, t);
      }
      case "function": {
        if (e !== void 0) {
          var s = k, i = t(e);
          return k = s, F(e, r, i);
        }
        break;
      }
    }
    if (r == null) return t;
    var c = r[t];
    return c !== void 0 ? c : t;
  }
  function Be(e, r, t) {
    var n = "";
    if (Array.isArray(t)) for (var a = 0; a < t.length; a++) n += F(e, r, t[a]) + ";";
    else for (var s in t) {
      var i = t[s];
      if (typeof i != "object") r != null && r[i] !== void 0 ? n += s + "{" + r[i] + "}" : me(i) && (n += ne(s) + ":" + ge(s, i) + ";");
      else if (Array.isArray(i) && typeof i[0] == "string" && (r == null || r[i[0]] === void 0)) for (var c = 0; c < i.length; c++) me(i[c]) && (n += ne(s) + ":" + ge(s, i[c]) + ";");
      else {
        var o = F(e, r, i);
        switch (s) {
          case "animation":
          case "animationName": {
            n += ne(s) + ":" + o + ";";
            break;
          }
          default:
            n += s + "{" + o + "}";
        }
      }
    }
    return n;
  }
  let ye, k;
  ye = /label:\s*([^\s;\n{]+)\s*(;|$)/g;
  X = function(r, t, n) {
    if (r.length === 1 && typeof r[0] == "object" && r[0] !== null && r[0].styles !== void 0) return r[0];
    var a = true, s = "";
    k = void 0;
    var i = r[0];
    i == null || i.raw === void 0 ? (a = false, s += F(n, t, i)) : s += i[0];
    for (var c = 1; c < r.length; c++) s += F(n, t, r[c]), a && (s += i[c]);
    ye.lastIndex = 0;
    for (var o = "", l; (l = ye.exec(s)) !== null; ) o += "-" + l[1];
    var h = _e(s) + o;
    return {
      name: h,
      styles: s,
      next: k
    };
  };
  function He(e) {
    if (e.sheet) return e.sheet;
    for (var r = 0; r < document.styleSheets.length; r++) if (document.styleSheets[r].ownerNode === e) return document.styleSheets[r];
  }
  function Ke(e) {
    var r = document.createElement("style");
    return r.setAttribute("data-emotion", e.key), e.nonce !== void 0 && r.setAttribute("nonce", e.nonce), r.appendChild(document.createTextNode("")), r.setAttribute("data-s", ""), r;
  }
  var Ue = function() {
    function e(t) {
      var n = this;
      this._insertTag = function(a) {
        var s;
        n.tags.length === 0 ? n.insertionPoint ? s = n.insertionPoint.nextSibling : n.prepend ? s = n.container.firstChild : s = n.before : s = n.tags[n.tags.length - 1].nextSibling, n.container.insertBefore(a, s), n.tags.push(a);
      }, this.isSpeedy = t.speedy === void 0 ? true : t.speedy, this.tags = [], this.ctr = 0, this.nonce = t.nonce, this.key = t.key, this.container = t.container, this.prepend = t.prepend, this.insertionPoint = t.insertionPoint, this.before = null;
    }
    var r = e.prototype;
    return r.hydrate = function(n) {
      n.forEach(this._insertTag);
    }, r.insert = function(n) {
      this.ctr % (this.isSpeedy ? 65e3 : 1) === 0 && this._insertTag(Ke(this));
      var a = this.tags[this.tags.length - 1];
      if (this.isSpeedy) {
        var s = He(a);
        try {
          s.insertRule(n, s.cssRules.length);
        } catch {
        }
      } else a.appendChild(document.createTextNode(n));
      this.ctr++;
    }, r.flush = function() {
      this.tags.forEach(function(n) {
        return n.parentNode && n.parentNode.removeChild(n);
      }), this.tags = [], this.ctr = 0;
    }, e;
  }(), p = "-ms-", Z = "-moz-", f = "-webkit-", ke = "comm", fe = "rule", ue = "decl", Ye = "@import", Te = "@keyframes", Ze = Math.abs, ee = String.fromCharCode, Je = Object.assign;
  function Qe(e, r) {
    return (((r << 2 ^ x(e, 0)) << 2 ^ x(e, 1)) << 2 ^ x(e, 2)) << 2 ^ x(e, 3);
  }
  function Oe(e) {
    return e.trim();
  }
  function Xe(e, r) {
    return (e = r.exec(e)) ? e[0] : e;
  }
  function u(e, r, t) {
    return e.replace(r, t);
  }
  function ae(e, r) {
    return e.indexOf(r);
  }
  function x(e, r) {
    return e.charCodeAt(r) | 0;
  }
  function _(e, r, t) {
    return e.slice(r, t);
  }
  function T(e) {
    return e.length;
  }
  function he(e) {
    return e.length;
  }
  function B(e, r) {
    return r.push(e), e;
  }
  function er(e, r) {
    return e.map(r).join("");
  }
  var re = 1, z = 1, Pe = 0, S = 0, g = 0, W = "";
  function te(e, r, t, n, a, s, i) {
    return {
      value: e,
      root: r,
      parent: t,
      type: n,
      props: a,
      children: s,
      line: re,
      column: z,
      length: i,
      return: ""
    };
  }
  function j(e, r) {
    return Je(te("", null, null, "", null, null, 0), e, {
      length: -e.length
    }, r);
  }
  function rr() {
    return g;
  }
  function tr() {
    return g = S > 0 ? x(W, --S) : 0, z--, g === 10 && (z = 1, re--), g;
  }
  function E() {
    return g = S < Pe ? x(W, S++) : 0, z++, g === 10 && (z = 1, re++), g;
  }
  function O() {
    return x(W, S);
  }
  function H() {
    return S;
  }
  function V(e, r) {
    return _(W, e, r);
  }
  function D(e) {
    switch (e) {
      case 0:
      case 9:
      case 10:
      case 13:
      case 32:
        return 5;
      case 33:
      case 43:
      case 44:
      case 47:
      case 62:
      case 64:
      case 126:
      case 59:
      case 123:
      case 125:
        return 4;
      case 58:
        return 3;
      case 34:
      case 39:
      case 40:
      case 91:
        return 2;
      case 41:
      case 93:
        return 1;
    }
    return 0;
  }
  function Re(e) {
    return re = z = 1, Pe = T(W = e), S = 0, [];
  }
  function Ne(e) {
    return W = "", e;
  }
  function K(e) {
    return Oe(V(S - 1, se(e === 91 ? e + 2 : e === 40 ? e + 1 : e)));
  }
  function nr(e) {
    for (; (g = O()) && g < 33; ) E();
    return D(e) > 2 || D(g) > 3 ? "" : " ";
  }
  function ar(e, r) {
    for (; --r && E() && !(g < 48 || g > 102 || g > 57 && g < 65 || g > 70 && g < 97); ) ;
    return V(e, H() + (r < 6 && O() == 32 && E() == 32));
  }
  function se(e) {
    for (; E(); ) switch (g) {
      case e:
        return S;
      case 34:
      case 39:
        e !== 34 && e !== 39 && se(g);
        break;
      case 40:
        e === 41 && se(e);
        break;
      case 92:
        E();
        break;
    }
    return S;
  }
  function sr(e, r) {
    for (; E() && e + g !== 57; ) if (e + g === 84 && O() === 47) break;
    return "/*" + V(r, S - 1) + "*" + ee(e === 47 ? e : E());
  }
  function ir(e) {
    for (; !D(O()); ) E();
    return V(e, S);
  }
  function cr(e) {
    return Ne(U("", null, null, null, [
      ""
    ], e = Re(e), 0, [
      0
    ], e));
  }
  function U(e, r, t, n, a, s, i, c, o) {
    for (var l = 0, h = 0, m = i, P = 0, R = 0, C = 0, d = 1, w = 1, y = 1, b = 0, $ = "", q = a, N = s, A = n, v = $; w; ) switch (C = b, b = E()) {
      case 40:
        if (C != 108 && v.charCodeAt(m - 1) == 58) {
          ae(v += u(K(b), "&", "&\f"), "&\f") != -1 && (y = -1);
          break;
        }
      case 34:
      case 39:
      case 91:
        v += K(b);
        break;
      case 9:
      case 10:
      case 13:
      case 32:
        v += nr(C);
        break;
      case 92:
        v += ar(H() - 1, 7);
        continue;
      case 47:
        switch (O()) {
          case 42:
          case 47:
            B(or(sr(E(), H()), r, t), o);
            break;
          default:
            v += "/";
        }
        break;
      case 123 * d:
        c[l++] = T(v) * y;
      case 125 * d:
      case 59:
      case 0:
        switch (b) {
          case 0:
          case 125:
            w = 0;
          case 59 + h:
            R > 0 && T(v) - m && B(R > 32 ? pe(v + ";", n, t, m - 1) : pe(u(v, " ", "") + ";", n, t, m - 2), o);
            break;
          case 59:
            v += ";";
          default:
            if (B(A = be(v, r, t, l, h, a, c, $, q = [], N = [], m), s), b === 123) if (h === 0) U(v, r, A, A, q, s, m, c, N);
            else switch (P) {
              case 100:
              case 109:
              case 115:
                U(e, A, A, n && B(be(e, A, A, 0, 0, a, c, $, a, q = [], m), N), a, N, m, c, n ? q : N);
                break;
              default:
                U(v, A, A, A, [
                  ""
                ], N, 0, c, N);
            }
        }
        l = h = R = 0, d = y = 1, $ = v = "", m = i;
        break;
      case 58:
        m = 1 + T(v), R = C;
      default:
        if (d < 1) {
          if (b == 123) --d;
          else if (b == 125 && d++ == 0 && tr() == 125) continue;
        }
        switch (v += ee(b), b * d) {
          case 38:
            y = h > 0 ? 1 : (v += "\f", -1);
            break;
          case 44:
            c[l++] = (T(v) - 1) * y, y = 1;
            break;
          case 64:
            O() === 45 && (v += K(E())), P = O(), h = m = T($ = v += ir(H())), b++;
            break;
          case 45:
            C === 45 && T(v) == 2 && (d = 0);
        }
    }
    return s;
  }
  function be(e, r, t, n, a, s, i, c, o, l, h) {
    for (var m = a - 1, P = a === 0 ? s : [
      ""
    ], R = he(P), C = 0, d = 0, w = 0; C < n; ++C) for (var y = 0, b = _(e, m + 1, m = Ze(d = i[C])), $ = e; y < R; ++y) ($ = Oe(d > 0 ? P[y] + " " + b : u(b, /&\f/g, P[y]))) && (o[w++] = $);
    return te(e, r, t, a === 0 ? fe : c, o, l, h);
  }
  function or(e, r, t) {
    return te(e, r, t, ke, ee(rr()), _(e, 2, -2), 0);
  }
  function pe(e, r, t, n) {
    return te(e, r, t, ue, _(e, 0, n), _(e, n + 1, -1), n);
  }
  function Ie(e, r) {
    switch (Qe(e, r)) {
      case 5103:
        return f + "print-" + e + e;
      case 5737:
      case 4201:
      case 3177:
      case 3433:
      case 1641:
      case 4457:
      case 2921:
      case 5572:
      case 6356:
      case 5844:
      case 3191:
      case 6645:
      case 3005:
      case 6391:
      case 5879:
      case 5623:
      case 6135:
      case 4599:
      case 4855:
      case 4215:
      case 6389:
      case 5109:
      case 5365:
      case 5621:
      case 3829:
        return f + e + e;
      case 5349:
      case 4246:
      case 4810:
      case 6968:
      case 2756:
        return f + e + Z + e + p + e + e;
      case 6828:
      case 4268:
        return f + e + p + e + e;
      case 6165:
        return f + e + p + "flex-" + e + e;
      case 5187:
        return f + e + u(e, /(\w+).+(:[^]+)/, f + "box-$1$2" + p + "flex-$1$2") + e;
      case 5443:
        return f + e + p + "flex-item-" + u(e, /flex-|-self/, "") + e;
      case 4675:
        return f + e + p + "flex-line-pack" + u(e, /align-content|flex-|-self/, "") + e;
      case 5548:
        return f + e + p + u(e, "shrink", "negative") + e;
      case 5292:
        return f + e + p + u(e, "basis", "preferred-size") + e;
      case 6060:
        return f + "box-" + u(e, "-grow", "") + f + e + p + u(e, "grow", "positive") + e;
      case 4554:
        return f + u(e, /([^-])(transform)/g, "$1" + f + "$2") + e;
      case 6187:
        return u(u(u(e, /(zoom-|grab)/, f + "$1"), /(image-set)/, f + "$1"), e, "") + e;
      case 5495:
      case 3959:
        return u(e, /(image-set\([^]*)/, f + "$1$`$1");
      case 4968:
        return u(u(e, /(.+:)(flex-)?(.*)/, f + "box-pack:$3" + p + "flex-pack:$3"), /s.+-b[^;]+/, "justify") + f + e + e;
      case 4095:
      case 3583:
      case 4068:
      case 2532:
        return u(e, /(.+)-inline(.+)/, f + "$1$2") + e;
      case 8116:
      case 7059:
      case 5753:
      case 5535:
      case 5445:
      case 5701:
      case 4933:
      case 4677:
      case 5533:
      case 5789:
      case 5021:
      case 4765:
        if (T(e) - 1 - r > 6) switch (x(e, r + 1)) {
          case 109:
            if (x(e, r + 4) !== 45) break;
          case 102:
            return u(e, /(.+:)(.+)-([^]+)/, "$1" + f + "$2-$3$1" + Z + (x(e, r + 3) == 108 ? "$3" : "$2-$3")) + e;
          case 115:
            return ~ae(e, "stretch") ? Ie(u(e, "stretch", "fill-available"), r) + e : e;
        }
        break;
      case 4949:
        if (x(e, r + 1) !== 115) break;
      case 6444:
        switch (x(e, T(e) - 3 - (~ae(e, "!important") && 10))) {
          case 107:
            return u(e, ":", ":" + f) + e;
          case 101:
            return u(e, /(.+:)([^;!]+)(;|!.+)?/, "$1" + f + (x(e, 14) === 45 ? "inline-" : "") + "box$3$1" + f + "$2$3$1" + p + "$2box$3") + e;
        }
        break;
      case 5936:
        switch (x(e, r + 11)) {
          case 114:
            return f + e + p + u(e, /[svh]\w+-[tblr]{2}/, "tb") + e;
          case 108:
            return f + e + p + u(e, /[svh]\w+-[tblr]{2}/, "tb-rl") + e;
          case 45:
            return f + e + p + u(e, /[svh]\w+-[tblr]{2}/, "lr") + e;
        }
        return f + e + p + e + e;
    }
    return e;
  }
  function M(e, r) {
    for (var t = "", n = he(e), a = 0; a < n; a++) t += r(e[a], a, e, r) || "";
    return t;
  }
  function fr(e, r, t, n) {
    switch (e.type) {
      case Ye:
      case ue:
        return e.return = e.return || e.value;
      case ke:
        return "";
      case Te:
        return e.return = e.value + "{" + M(e.children, n) + "}";
      case fe:
        e.value = e.props.join(",");
    }
    return T(t = M(e.children, n)) ? e.return = e.value + "{" + t + "}" : "";
  }
  function ur(e) {
    var r = he(e);
    return function(t, n, a, s) {
      for (var i = "", c = 0; c < r; c++) i += e[c](t, n, a, s) || "";
      return i;
    };
  }
  function hr(e) {
    return function(r) {
      r.root || (r = r.return) && e(r);
    };
  }
  function lr(e, r, t, n) {
    if (e.length > -1 && !e.return) switch (e.type) {
      case ue:
        e.return = Ie(e.value, e.length);
        break;
      case Te:
        return M([
          j(e, {
            value: u(e.value, "@", "@" + f)
          })
        ], n);
      case fe:
        if (e.length) return er(e.props, function(a) {
          switch (Xe(a, /(::plac\w+|:read-\w+)/)) {
            case ":read-only":
            case ":read-write":
              return M([
                j(e, {
                  props: [
                    u(a, /:(read-\w+)/, ":" + Z + "$1")
                  ]
                })
              ], n);
            case "::placeholder":
              return M([
                j(e, {
                  props: [
                    u(a, /:(plac\w+)/, ":" + f + "input-$1")
                  ]
                }),
                j(e, {
                  props: [
                    u(a, /:(plac\w+)/, ":" + Z + "$1")
                  ]
                }),
                j(e, {
                  props: [
                    u(a, /:(plac\w+)/, p + "input-$1")
                  ]
                })
              ], n);
          }
          return "";
        });
    }
  }
  var we = function(r) {
    var t = /* @__PURE__ */ new WeakMap();
    return function(n) {
      if (t.has(n)) return t.get(n);
      var a = r(n);
      return t.set(n, a), a;
    };
  }, dr = function(r, t, n) {
    for (var a = 0, s = 0; a = s, s = O(), a === 38 && s === 12 && (t[n] = 1), !D(s); ) E();
    return V(r, S);
  }, vr = function(r, t) {
    var n = -1, a = 44;
    do
      switch (D(a)) {
        case 0:
          a === 38 && O() === 12 && (t[n] = 1), r[n] += dr(S - 1, t, n);
          break;
        case 2:
          r[n] += K(a);
          break;
        case 4:
          if (a === 44) {
            r[++n] = O() === 58 ? "&\f" : "", t[n] = r[n].length;
            break;
          }
        default:
          r[n] += ee(a);
      }
    while (a = E());
    return r;
  }, mr = function(r, t) {
    return Ne(vr(Re(r), t));
  }, xe = /* @__PURE__ */ new WeakMap(), gr = function(r) {
    if (!(r.type !== "rule" || !r.parent || r.length < 1)) {
      for (var t = r.value, n = r.parent, a = r.column === n.column && r.line === n.line; n.type !== "rule"; ) if (n = n.parent, !n) return;
      if (!(r.props.length === 1 && t.charCodeAt(0) !== 58 && !xe.get(n)) && !a) {
        xe.set(r, true);
        for (var s = [], i = mr(t, s), c = n.props, o = 0, l = 0; o < i.length; o++) for (var h = 0; h < c.length; h++, l++) r.props[l] = s[o] ? i[o].replace(/&\f/g, c[h]) : c[h] + " " + i[o];
      }
    }
  }, yr = function(r) {
    if (r.type === "decl") {
      var t = r.value;
      t.charCodeAt(0) === 108 && t.charCodeAt(2) === 98 && (r.return = "", r.value = "");
    }
  }, br = [
    lr
  ], pr = function(r) {
    var t = r.key;
    if (t === "css") {
      var n = document.querySelectorAll("style[data-emotion]:not([data-s])");
      Array.prototype.forEach.call(n, function(d) {
        var w = d.getAttribute("data-emotion");
        w.indexOf(" ") !== -1 && (document.head.appendChild(d), d.setAttribute("data-s", ""));
      });
    }
    var a = r.stylisPlugins || br, s = {}, i, c = [];
    i = r.container || document.head, Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="' + t + ' "]'), function(d) {
      for (var w = d.getAttribute("data-emotion").split(" "), y = 1; y < w.length; y++) s[w[y]] = true;
      c.push(d);
    });
    var o, l = [
      gr,
      yr
    ];
    {
      var h, m = [
        fr,
        hr(function(d) {
          h.insert(d);
        })
      ], P = ur(l.concat(a, m)), R = function(w) {
        return M(cr(w), P);
      };
      o = function(w, y, b, $) {
        h = b, R(w ? w + "{" + y.styles + "}" : y.styles), $ && (C.inserted[y.name] = true);
      };
    }
    var C = {
      key: t,
      sheet: new Ue({
        key: t,
        container: i,
        nonce: r.nonce,
        speedy: r.speedy,
        prepend: r.prepend,
        insertionPoint: r.insertionPoint
      }),
      nonce: r.nonce,
      inserted: s,
      registered: {},
      insert: o
    };
    return C.sheet.hydrate(c), C;
  }, wr = function(e, r) {
    return je(e, r);
  };
  const Se = await Q("react"), { createContext: Me, useContext: L, forwardRef: ze, createElement: G, Fragment: xr } = await Q("react");
  let le, de, Sr, Cr;
  le = {}.hasOwnProperty;
  de = Me(typeof HTMLElement < "u" ? pr({
    key: "css"
  }) : null);
  Lr = de.Provider;
  jr = function() {
    return L(de);
  };
  ve = function(r) {
    return ze(function(t, n) {
      var a = L(de);
      return r(t, a, n);
    });
  };
  I = Me({});
  Gr = function() {
    return L(I);
  };
  Sr = function(r, t) {
    if (typeof t == "function") {
      var n = t(r);
      return n;
    }
    return Y({}, r, t);
  };
  Cr = we(function(e) {
    return we(function(r) {
      return Sr(e, r);
    });
  });
  Fr = function(r) {
    var t = L(I);
    return r.theme !== t && (t = Cr(t)(r.theme)), G(I.Provider, {
      value: t
    }, r.children);
  };
  _r = function(e) {
    var r = e.displayName || e.name || "Component", t = function(s, i) {
      var c = L(I);
      return G(e, Y({
        theme: c,
        ref: i
      }, s));
    }, n = ze(t);
    return n.displayName = "WithTheme(" + r + ")", wr(n, e);
  };
  var Er = Se.useInsertionEffect ? Se.useInsertionEffect : function(r) {
    r();
  };
  function We(e) {
    Er(e);
  }
  var ie = "__EMOTION_TYPE_PLEASE_DO_NOT_USE__", $r = function(r, t) {
    var n = {};
    for (var a in t) le.call(t, a) && (n[a] = t[a]);
    return n[ie] = r, n;
  }, Ar = function(r) {
    var t = r.cache, n = r.serialized, a = r.isStringTag;
    return ce(t, n, a), We(function() {
      return oe(t, n, a);
    }), null;
  }, kr = ve(function(e, r, t) {
    var n = e.css;
    typeof n == "string" && r.registered[n] !== void 0 && (n = r.registered[n]);
    var a = e[ie], s = [
      n
    ], i = "";
    typeof e.className == "string" ? i = $e(r.registered, s, e.className) : e.className != null && (i = e.className + " ");
    var c = X(s, void 0, L(I));
    i += r.key + "-" + c.name;
    var o = {};
    for (var l in e) le.call(e, l) && l !== "css" && l !== ie && (o[l] = e[l]);
    return o.ref = t, o.className = i, G(xr, null, G(Ar, {
      cache: r,
      serialized: c,
      isStringTag: typeof a == "string"
    }), G(a, o));
  });
  const Ce = await Q("react"), { createElement: J, useLayoutEffect: Tr, useContext: Le, useRef: Or, Fragment: Pr } = await Q("react");
  let Ee;
  Dr = function(r, t) {
    var n = arguments;
    if (t == null || !le.call(t, "css")) return J.apply(void 0, n);
    var a = n.length, s = new Array(a);
    s[0] = kr, s[1] = $r(r, t);
    for (var i = 2; i < a; i++) s[i] = n[i];
    return J.apply(null, s);
  };
  Ee = Ce.useInsertionEffect ? Ce.useInsertionEffect : Tr;
  Vr = ve(function(e, r) {
    var t = e.styles, n = X([
      t
    ], void 0, Le(I)), a = Or();
    return Ee(function() {
      var s = r.key + "-global", i = new r.sheet.constructor({
        key: s,
        nonce: r.sheet.nonce,
        container: r.sheet.container,
        speedy: r.sheet.isSpeedy
      }), c = false, o = document.querySelector('style[data-emotion="' + s + " " + n.name + '"]');
      return r.sheet.tags.length && (i.before = r.sheet.tags[0]), o !== null && (c = true, o.setAttribute("data-emotion", s), i.hydrate([
        o
      ])), a.current = [
        i,
        c
      ], function() {
        i.flush();
      };
    }, [
      r
    ]), Ee(function() {
      var s = a.current, i = s[0], c = s[1];
      if (c) {
        s[1] = false;
        return;
      }
      if (n.next !== void 0 && oe(r, n.next, true), i.tags.length) {
        var o = i.tags[i.tags.length - 1].nextElementSibling;
        i.before = o, i.flush();
      }
      r.insert("", n, i, false);
    }, [
      r,
      n.name
    ]), null;
  });
  Rr = function() {
    for (var e = arguments.length, r = new Array(e), t = 0; t < e; t++) r[t] = arguments[t];
    return X(r);
  };
  let Nr;
  qr = function() {
    var r = Rr.apply(void 0, arguments), t = "animation-" + r.name;
    return {
      name: t,
      styles: "@keyframes " + t + "{" + r.styles + "}",
      anim: 1,
      toString: function() {
        return "_EMO_" + this.name + "_" + this.styles + "_EMO_";
      }
    };
  };
  Nr = function e(r) {
    for (var t = r.length, n = 0, a = ""; n < t; n++) {
      var s = r[n];
      if (s != null) {
        var i = void 0;
        switch (typeof s) {
          case "boolean":
            break;
          case "object": {
            if (Array.isArray(s)) i = e(s);
            else {
              i = "";
              for (var c in s) s[c] && c && (i && (i += " "), i += c);
            }
            break;
          }
          default:
            i = s;
        }
        i && (a && (a += " "), a += i);
      }
    }
    return a;
  };
  function Ir(e, r, t) {
    var n = [], a = $e(e, n, t);
    return n.length < 2 ? t : a + r(n);
  }
  let Mr;
  Mr = function(r) {
    var t = r.cache, n = r.serializedArr;
    return We(function() {
      for (var a = 0; a < n.length; a++) oe(t, n[a], false);
    }), null;
  };
  Br = ve(function(e, r) {
    var t = [], n = function() {
      for (var o = arguments.length, l = new Array(o), h = 0; h < o; h++) l[h] = arguments[h];
      var m = X(l, r.registered);
      return t.push(m), ce(r, m, false), r.key + "-" + m.name;
    }, a = function() {
      for (var o = arguments.length, l = new Array(o), h = 0; h < o; h++) l[h] = arguments[h];
      return Ir(r.registered, n, Nr(l));
    }, s = {
      css: n,
      cx: a,
      theme: Le(I)
    }, i = e.children(s);
    return J(Pr, null, J(Mr, {
      cache: r,
      serializedArr: t
    }), i);
  });
});
export {
  Lr as C,
  Vr as G,
  I as T,
  Y as _,
  __tla,
  Br as a,
  Fr as b,
  Rr as c,
  jr as d,
  _r as e,
  $e as g,
  oe as i,
  Dr as j,
  qr as k,
  Ge as m,
  ce as r,
  X as s,
  Gr as u,
  ve as w
};
