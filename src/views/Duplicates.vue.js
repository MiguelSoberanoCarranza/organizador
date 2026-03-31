/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted } from 'vue';
const groups = ref([]);
const loading = ref(true);
const isCleaning = ref(false);
const loadDuplicates = async () => {
    loading.value = true;
    // @ts-ignore
    const data = await window.electronAPI.getDuplicates();
    // For each group, we should ideally fetch the specific files
    // In MVP, we just show the hashes for now
    groups.value = data;
    loading.value = false;
};
onMounted(() => loadDuplicates());
const quarantine = async (fileId) => {
    // @ts-ignore
    await window.electronAPI.quarantineFile(fileId);
    await loadDuplicates();
};
const autoClean = async () => {
    isCleaning.value = true;
    // Logic to keep 1 and quarantine rest
    isCleaning.value = false;
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "duplicates-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
(__VLS_ctx.groups.length);
if (__VLS_ctx.groups.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.autoClean) },
        ...{ class: "btn btn-primary" },
        disabled: (__VLS_ctx.isCleaning),
    });
    (__VLS_ctx.isCleaning ? 'Limpiando...' : 'Auto-Limpiar');
}
if (__VLS_ctx.loading) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "loading-state" },
    });
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "groups-list" },
    });
    for (const [group] of __VLS_getVForSourceType((__VLS_ctx.groups))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (group.hash),
            ...{ class: "group-card" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "group-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "badge" },
        });
        (group.hash.substring(0, 8));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "count" },
        });
        (group.count);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "size" },
        });
        ((group.totalSize / (1024 ** 2)).toFixed(2));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "group-files" },
        });
        for (const [file] of __VLS_getVForSourceType((group.files))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                key: (file.id),
                ...{ class: "file-row" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "file-details" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "file-name" },
            });
            (file.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "file-path" },
            });
            (file.path);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!!(__VLS_ctx.loading))
                            return;
                        __VLS_ctx.quarantine(file.id);
                    } },
                ...{ class: "btn-icon" },
            });
        }
    }
}
/** @type {__VLS_StyleScopedClasses['duplicates-view']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['loading-state']} */ ;
/** @type {__VLS_StyleScopedClasses['groups-list']} */ ;
/** @type {__VLS_StyleScopedClasses['group-card']} */ ;
/** @type {__VLS_StyleScopedClasses['group-info']} */ ;
/** @type {__VLS_StyleScopedClasses['badge']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['size']} */ ;
/** @type {__VLS_StyleScopedClasses['group-files']} */ ;
/** @type {__VLS_StyleScopedClasses['file-row']} */ ;
/** @type {__VLS_StyleScopedClasses['file-details']} */ ;
/** @type {__VLS_StyleScopedClasses['file-name']} */ ;
/** @type {__VLS_StyleScopedClasses['file-path']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            groups: groups,
            loading: loading,
            isCleaning: isCleaning,
            quarantine: quarantine,
            autoClean: autoClean,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Duplicates.vue.js.map