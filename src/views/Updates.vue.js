/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, onUnmounted } from 'vue';
const currentVersion = ref('Cargando...');
const statusData = ref({ type: '', text: '', error: '', info: null, progress: null });
const isProcessing = ref(false);
const checkForUpdates = async () => {
    statusData.value = { type: 'checking', text: 'Buscando actualizaciones...' };
    isProcessing.value = true;
    try {
        // @ts-ignore
        await window.electronAPI.checkUpdates();
    }
    catch (err) {
        statusData.value = { type: 'error', text: 'Error al buscar', error: err.message };
        isProcessing.value = false;
    }
};
const downloadUpdate = async () => {
    statusData.value = { type: 'progress', text: 'Iniciando descarga...' };
    isProcessing.value = true;
    try {
        // @ts-ignore
        await window.electronAPI.downloadUpdate();
    }
    catch (err) {
        statusData.value = { type: 'error', text: 'Error al descargar', error: err.message };
        isProcessing.value = false;
    }
};
const installUpdate = () => {
    isProcessing.value = true;
    // @ts-ignore
    window.electronAPI.installUpdate();
};
onMounted(async () => {
    // @ts-ignore
    if (window.electronAPI && window.electronAPI.getAppVersion) {
        // @ts-ignore
        currentVersion.value = await window.electronAPI.getAppVersion();
    }
    // @ts-ignore
    if (window.electronAPI && window.electronAPI.onUpdaterMessage) {
        // @ts-ignore
        window.electronAPI.onUpdaterMessage((event, data) => {
            statusData.value = { ...statusData.value, ...data };
            if (['not-available', 'error', 'downloaded'].includes(data.type)) {
                isProcessing.value = false;
            }
            if (data.type === 'available') {
                isProcessing.value = false; // Permite dar click a descargar
            }
        });
    }
});
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['app-details']} */ ;
/** @type {__VLS_StyleScopedClasses['app-details']} */ ;
/** @type {__VLS_StyleScopedClasses['update-status']} */ ;
/** @type {__VLS_StyleScopedClasses['update-status']} */ ;
/** @type {__VLS_StyleScopedClasses['update-status']} */ ;
/** @type {__VLS_StyleScopedClasses['update-status']} */ ;
/** @type {__VLS_StyleScopedClasses['update-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['pulse-glow']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "updates-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "update-card glass-panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-info" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-icon" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
    width: "48",
    height: "48",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    'stroke-width': "1.5",
    'stroke-linecap': "round",
    'stroke-linejoin': "round",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
    d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z",
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-details" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
(__VLS_ctx.currentVersion);
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "update-status" },
    ...{ class: (__VLS_ctx.statusData.type) },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-icon" },
});
if (__VLS_ctx.statusData.type === 'checking') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        ...{ class: "spin" },
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "12",
        y1: "2",
        x2: "12",
        y2: "6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "12",
        y1: "18",
        x2: "12",
        y2: "22",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "4.93",
        y1: "4.93",
        x2: "7.76",
        y2: "7.76",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "16.24",
        y1: "16.24",
        x2: "19.07",
        y2: "19.07",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "2",
        y1: "12",
        x2: "6",
        y2: "12",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "18",
        y1: "12",
        x2: "22",
        y2: "12",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "4.93",
        y1: "19.07",
        x2: "7.76",
        y2: "16.24",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "16.24",
        y1: "7.76",
        x2: "19.07",
        y2: "4.93",
    });
}
if (__VLS_ctx.statusData.type === 'available') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#f59e0b",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        cx: "12",
        cy: "12",
        r: "10",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "12",
        y1: "8",
        x2: "12",
        y2: "12",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "12",
        y1: "16",
        x2: "12.01",
        y2: "16",
    });
}
if (__VLS_ctx.statusData.type === 'not-available') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#10b981",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M22 11.08V12a10 10 0 1 1-5.93-9.14",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
        points: "22 4 12 14.01 9 11.01",
    });
}
if (__VLS_ctx.statusData.type === 'error') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#ef4444",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.circle, __VLS_intrinsicElements.circle)({
        cx: "12",
        cy: "12",
        r: "10",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "15",
        y1: "9",
        x2: "9",
        y2: "15",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "9",
        y1: "9",
        x2: "15",
        y2: "15",
    });
}
if (['progress', 'downloaded'].includes(__VLS_ctx.statusData.type)) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "#38bdf8",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
        points: "7 10 12 15 17 10",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "12",
        y1: "15",
        x2: "12",
        y2: "3",
    });
}
if (!__VLS_ctx.statusData.type) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "status-message" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
(__VLS_ctx.statusData.text || 'Listo para buscar actualizaciones');
if (__VLS_ctx.statusData.error) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
        ...{ class: "error-text" },
    });
    (__VLS_ctx.statusData.error);
}
if (__VLS_ctx.statusData.info) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.statusData.info?.version);
}
if (__VLS_ctx.statusData.type === 'progress' && __VLS_ctx.statusData.progress) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar-container" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "progress-bar-fill" },
        ...{ style: ({ width: (__VLS_ctx.statusData.progress?.percent || 0) + '%' }) },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "progress-text" },
    });
    (__VLS_ctx.formatBytes(__VLS_ctx.statusData.progress?.transferred || 0));
    (__VLS_ctx.formatBytes(__VLS_ctx.statusData.progress?.total || 0));
    (Math.round(__VLS_ctx.statusData.progress?.percent || 0));
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-buttons" },
});
if (!__VLS_ctx.isProcessing && __VLS_ctx.statusData.type !== 'available' && __VLS_ctx.statusData.type !== 'downloaded') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.checkForUpdates) },
        ...{ class: "btn btn-primary" },
    });
}
if (__VLS_ctx.statusData.type === 'available') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.downloadUpdate) },
        ...{ class: "btn btn-warning pulse-glow" },
        disabled: (__VLS_ctx.isProcessing),
    });
}
if (__VLS_ctx.statusData.type === 'downloaded') {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.installUpdate) },
        ...{ class: "btn btn-success pulse-glow" },
        disabled: (__VLS_ctx.isProcessing),
    });
}
/** @type {__VLS_StyleScopedClasses['updates-view']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['update-card']} */ ;
/** @type {__VLS_StyleScopedClasses['glass-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['app-info']} */ ;
/** @type {__VLS_StyleScopedClasses['app-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['app-details']} */ ;
/** @type {__VLS_StyleScopedClasses['update-status']} */ ;
/** @type {__VLS_StyleScopedClasses['status-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['spin']} */ ;
/** @type {__VLS_StyleScopedClasses['status-message']} */ ;
/** @type {__VLS_StyleScopedClasses['error-text']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar-container']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-text']} */ ;
/** @type {__VLS_StyleScopedClasses['action-buttons']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-warning']} */ ;
/** @type {__VLS_StyleScopedClasses['pulse-glow']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-success']} */ ;
/** @type {__VLS_StyleScopedClasses['pulse-glow']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            currentVersion: currentVersion,
            statusData: statusData,
            isProcessing: isProcessing,
            checkForUpdates: checkForUpdates,
            downloadUpdate: downloadUpdate,
            installUpdate: installUpdate,
            formatBytes: formatBytes,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Updates.vue.js.map