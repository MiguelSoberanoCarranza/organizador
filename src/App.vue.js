/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
import { useAppStore } from './stores/app';
const store = useAppStore();
const reloadKey = ref(0);
onMounted(() => {
    if (window.electronAPI && window.electronAPI.onCatalogUpdated) {
        window.electronAPI.onCatalogUpdated(() => {
            reloadKey.value++;
            // Optionally refresh store stats if needed globally
            store.refreshStats();
        });
    }
});
const startNewScan = async () => {
    await store.startScan();
    reloadKey.value++;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "content" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "top-bar glass-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-left" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "logo" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
const __VLS_0 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    to: "/updates",
    ...{ class: "update-icon-top tooltip-container" },
    title: "Buscar Actualizaciones",
}));
const __VLS_2 = __VLS_1({
    to: "/updates",
    ...{ class: "update-icon-top tooltip-container" },
    title: "Buscar Actualizaciones",
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "18",
    height: "18",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.92-10.27l-3.26-1.5",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "21.5",
    y1: "8",
    x2: "16",
    y2: "8",
});
var __VLS_3;
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "separator" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
(__VLS_ctx.$route.name);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "scrollable-area" },
});
const __VLS_4 = {}.RouterView;
/** @type {[typeof __VLS_components.RouterView, typeof __VLS_components.routerView, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    key: (__VLS_ctx.reloadKey),
}));
const __VLS_6 = __VLS_5({
    key: (__VLS_ctx.reloadKey),
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_asFunctionalElement(__VLS_intrinsicElements.nav, __VLS_intrinsicElements.nav)({
    ...{ class: "bottom-nav glass-nav drag-region" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "nav-links no-drag" },
});
const __VLS_8 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    to: "/",
    ...{ class: "nav-item tooltip-container" },
}));
const __VLS_10 = __VLS_9({
    to: "/",
    ...{ class: "nav-item tooltip-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect, __VLS_intrinsicElements.rect)({
    x: "3",
    y: "3",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect, __VLS_intrinsicElements.rect)({
    x: "14",
    y: "3",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect, __VLS_intrinsicElements.rect)({
    x: "14",
    y: "14",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.rect, __VLS_intrinsicElements.rect)({
    x: "3",
    y: "14",
    width: "7",
    height: "7",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tooltip" },
});
var __VLS_11;
const __VLS_12 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
    to: "/explorer",
    ...{ class: "nav-item tooltip-container" },
}));
const __VLS_14 = __VLS_13({
    to: "/explorer",
    ...{ class: "nav-item tooltip-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_13));
__VLS_15.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tooltip" },
});
var __VLS_15;
if (!__VLS_ctx.store.isScanning) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.startNewScan) },
        ...{ class: "nav-item scan-action pulse-glow tooltip-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        cx: "11",
        cy: "11",
        r: "8",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "21",
        y1: "21",
        x2: "16.65",
        y2: "16.65",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tooltip" },
    });
}
if (__VLS_ctx.store.isScanning) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "nav-item scan-action spinner-container tooltip-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spinner" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "tooltip" },
    });
    (__VLS_ctx.store.progress.current);
    (__VLS_ctx.store.progress.total);
}
const __VLS_16 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    to: "/scan",
    ...{ class: "nav-item tooltip-container" },
}));
const __VLS_18 = __VLS_17({
    to: "/scan",
    ...{ class: "nav-item tooltip-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polygon, __VLS_intrinsicElements.polygon)({
    points: "12 2 2 7 12 12 22 7 12 2",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
    points: "2 17 12 22 22 17",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
    points: "2 12 12 17 22 12",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tooltip" },
});
var __VLS_19;
const __VLS_20 = {}.RouterLink;
/** @type {[typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, typeof __VLS_components.RouterLink, typeof __VLS_components.routerLink, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    to: "/catalog",
    ...{ class: "nav-item tooltip-container" },
}));
const __VLS_22 = __VLS_21({
    to: "/catalog",
    ...{ class: "nav-item tooltip-container" },
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
__VLS_23.slots.default;
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "2",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "8",
    y1: "6",
    x2: "21",
    y2: "6",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "8",
    y1: "12",
    x2: "21",
    y2: "12",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "8",
    y1: "18",
    x2: "21",
    y2: "18",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "3",
    y1: "6",
    x2: "3.01",
    y2: "6",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "3",
    y1: "12",
    x2: "3.01",
    y2: "12",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
    x1: "3",
    y1: "18",
    x2: "3.01",
    y2: "18",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "tooltip" },
});
var __VLS_23;
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
/** @type {__VLS_StyleScopedClasses['content']} */ ;
/** @type {__VLS_StyleScopedClasses['top-bar']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-header']} */ ;
/** @type {__VLS_StyleScopedClasses['header-left']} */ ;
/** @type {__VLS_StyleScopedClasses['logo']} */ ;
/** @type {__VLS_StyleScopedClasses['update-icon-top']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['separator']} */ ;
/** @type {__VLS_StyleScopedClasses['scrollable-area']} */ ;
/** @type {__VLS_StyleScopedClasses['bottom-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-nav']} */ ;
/** @type {__VLS_StyleScopedClasses['drag-region']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-links']} */ ;
/** @type {__VLS_StyleScopedClasses['no-drag']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['scan-action']} */ ;
/** @type {__VLS_StyleScopedClasses['pulse-glow']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['scan-action']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['spinner']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip']} */ ;
/** @type {__VLS_StyleScopedClasses['nav-item']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip-container']} */ ;
/** @type {__VLS_StyleScopedClasses['tooltip']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            store: store,
            reloadKey: reloadKey,
            startNewScan: startNewScan,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=App.vue.js.map