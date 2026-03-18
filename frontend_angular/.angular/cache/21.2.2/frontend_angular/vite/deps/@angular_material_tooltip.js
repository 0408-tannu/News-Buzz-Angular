import {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MatTooltip,
  SCROLL_THROTTLE_MS,
  TOOLTIP_PANEL_CLASS,
  TooltipComponent,
  getMatTooltipInvalidPositionError
} from "./chunk-REQQ3YXB.js";
import {
  OverlayModule
} from "./chunk-E6RCFO4C.js";
import {
  CdkScrollableModule
} from "./chunk-D6L3EKC2.js";
import "./chunk-XEZLRTI4.js";
import {
  A11yModule
} from "./chunk-TTQ6WAFE.js";
import "./chunk-X4B24UDU.js";
import "./chunk-PLJ2QXBA.js";
import "./chunk-N4DOILP3.js";
import "./chunk-AX45W3JQ.js";
import "./chunk-7RWTAV2Q.js";
import "./chunk-RLC7HB32.js";
import "./chunk-T3HMBLOX.js";
import "./chunk-NV6NMIAE.js";
import "./chunk-GUGIMSVJ.js";
import "./chunk-27PDPJ3I.js";
import "./chunk-LWYPMQHL.js";
import {
  BidiModule
} from "./chunk-SX7RO6K6.js";
import "./chunk-IXJRGKT4.js";
import "./chunk-VEOUJGQD.js";
import {
  NgModule,
  setClassMetadata,
  ɵɵdefineInjector,
  ɵɵdefineNgModule
} from "./chunk-QKGCVU47.js";
import "./chunk-JRFR6BLO.js";
import "./chunk-HWYXSU2G.js";
import "./chunk-MARUHEWW.js";
import "./chunk-OCBFZOLU.js";

// node_modules/@angular/material/fesm2022/tooltip.mjs
var MatTooltipModule = class _MatTooltipModule {
  static ɵfac = function MatTooltipModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatTooltipModule)();
  };
  static ɵmod = ɵɵdefineNgModule({
    type: _MatTooltipModule,
    imports: [A11yModule, OverlayModule, MatTooltip, TooltipComponent],
    exports: [MatTooltip, TooltipComponent, BidiModule, CdkScrollableModule]
  });
  static ɵinj = ɵɵdefineInjector({
    imports: [A11yModule, OverlayModule, BidiModule, CdkScrollableModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatTooltipModule, [{
    type: NgModule,
    args: [{
      imports: [A11yModule, OverlayModule, MatTooltip, TooltipComponent],
      exports: [MatTooltip, TooltipComponent, BidiModule, CdkScrollableModule]
    }]
  }], null, null);
})();
export {
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MAT_TOOLTIP_SCROLL_STRATEGY,
  MatTooltip,
  MatTooltipModule,
  SCROLL_THROTTLE_MS,
  TOOLTIP_PANEL_CLASS,
  TooltipComponent,
  getMatTooltipInvalidPositionError
};
//# sourceMappingURL=@angular_material_tooltip.js.map
