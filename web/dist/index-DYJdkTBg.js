import { importShared as r, __tla as __tla_0 } from "./__federation_fn_import-DWhSBi9z.js";
import { __tla as __tla_1 } from "./HousingWidget-B0dehkCg.js";
Promise.all([
  (() => {
    try {
      return __tla_0;
    } catch {
    }
  })(),
  (() => {
    try {
      return __tla_1;
    } catch {
    }
  })()
]).then(async () => {
  await r("react-dom");
  const { MemoryRouter: a } = await r("react-router-dom");
});
