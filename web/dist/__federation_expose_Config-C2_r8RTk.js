import { j as o, H as t, A as n, __tla as __tla_0 } from "./HousingWidget-B0dehkCg.js";
let l, e;
let __tla = Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })()
]).then(async () => {
  let s, a, c;
  s = ({ size: i = 30 }) => o.jsx("svg", {
    width: i,
    height: i,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: o.jsx("path", {
      d: "M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z",
      fill: "#FFFFFF"
    })
  });
  a = () => o.jsx(s, {
    size: 30
  });
  c = () => o.jsx(s, {
    size: 24
  });
  e = "/housing";
  l = () => ({
    id: "housing",
    nameLocale: "Im\xF3veis",
    color: "#FFFFFF",
    backgroundColor: "#FF7A1A",
    path: e,
    icon: a,
    notificationIcon: c,
    app: n,
    homeWidgets: [
      {
        id: "properties",
        name: "Meus im\xF3veis",
        description: "Propriedades, contas e seguran\xE7a residencial.",
        sizes: [
          {
            width: 2,
            height: 1,
            label: "Compacto 2\xD71"
          },
          {
            width: 4,
            height: 1,
            label: "Resumo 4\xD71"
          },
          {
            width: 4,
            height: 2,
            label: "Completo 4\xD72"
          }
        ],
        Component: t,
        path: e
      }
    ]
  });
});
export {
  __tla,
  l as default,
  e as path
};
