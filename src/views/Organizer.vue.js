/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, computed } from 'vue';
const categories = ref({});
const allCategories = ref([]);
const plan = ref([]);
const selectedItems = ref([]);
const isOrganizing = ref(false);
const currentAction = ref({ current: 0, total: 0, name: '' });
const history = ref([]);
const toggleAll = (e) => {
    if (e.target.checked)
        selectedItems.value = plan.value.map(i => i.source);
    else
        selectedItems.value = [];
};
const toggleSelection = (source) => {
    if (selectedItems.value.includes(source)) {
        selectedItems.value = selectedItems.value.filter(s => s !== source);
    }
    else {
        selectedItems.value.push(source);
    }
};
const refresh = async () => {
    // @ts-ignore
    const stats = await window.electronAPI.getCategoryStats();
    categories.value = stats;
    // @ts-ignore
    const catalog = await window.electronAPI.getCatalog();
    allCategories.value = [...Object.keys(catalog), 'Otros'];
    // @ts-ignore
    const dbStats = await window.electronAPI.getStats();
    if (!dbStats || dbStats.totalFiles === 0) {
        plan.value = [];
        selectedItems.value = [];
        return;
    }
    // @ts-ignore
    plan.value = await window.electronAPI.getOrganizationPreview() || [];
    selectedItems.value = plan.value.map(i => i.source);
};
onMounted(() => {
    refresh();
    // @ts-ignore
    window.electronAPI.onOrganizeProgress((event, data) => {
        currentAction.value = data;
    });
});
const startOrganize = async () => {
    if (selectedItems.value.length === 0)
        return;
    if (!confirm(`¿Seguro que quieres mover ${selectedItems.value.length} archivos a sus carpetas de categoría?`))
        return;
    isOrganizing.value = true;
    // Create custom plan with user corrections
    const customPlan = plan.value
        .filter(i => selectedItems.value.includes(i.source))
        .map(i => ({ source: i.source, category: i.category, name: i.name }));
    // @ts-ignore
    await window.electronAPI.organizeByCategory(JSON.parse(JSON.stringify(customPlan)));
    await refresh();
    isOrganizing.value = false;
};
const formatBytes = (bytes, decimals = 2) => {
    if (!+bytes)
        return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
const getIcon = (cat) => {
    const icons = {
        'Imágenes': '🖼️',
        'Videos': '🎬',
        'Documentos': '📄',
        'Software': '💻',
        'Imágenes de Disco': '💿',
        'Videojuegos': '🎮',
        'Comprimidos': '📦',
        'Código': '📁',
        'Otros': '📄'
    };
    return icons[cat] || '📁';
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-table']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-table']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-select']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-select']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "organizer-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "section-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "category-grid" },
});
for (const [count, cat] of __VLS_getVForSourceType((__VLS_ctx.categories))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        key: (cat),
        ...{ class: "cat-card" },
        title: (cat),
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "cat-icon" },
    });
    (__VLS_ctx.getIcon(cat));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "cat-name" },
    });
    (cat);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "cat-count" },
    });
    (count);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "action-panel" },
});
if (__VLS_ctx.plan.length > 0 || __VLS_ctx.isOrganizing) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "strategy-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    (__VLS_ctx.selectedItems.length);
    (__VLS_ctx.plan.length);
    if (__VLS_ctx.isOrganizing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-section" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-info" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentAction.name);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
        (__VLS_ctx.currentAction.current);
        (__VLS_ctx.currentAction.total);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-bar-bg" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "progress-bar-fill" },
            ...{ style: ({ width: (__VLS_ctx.currentAction.current / __VLS_ctx.currentAction.total * 100) + '%' }) },
        });
    }
    if (__VLS_ctx.plan.length > 0 && !__VLS_ctx.isOrganizing) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "preview-table-container" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
            ...{ class: "preview-table" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onChange: (__VLS_ctx.toggleAll) },
            type: "checkbox",
            checked: (__VLS_ctx.plan.length > 0 && __VLS_ctx.selectedItems.length === __VLS_ctx.plan.length),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
        for (const [item] of __VLS_getVForSourceType((__VLS_ctx.plan))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
                key: (item.source),
                ...{ class: ({ 'selected-row': __VLS_ctx.selectedItems.includes(item.source) }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: "text-center" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
                type: "checkbox",
                value: (item.source),
            });
            (__VLS_ctx.selectedItems);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.plan.length > 0 || __VLS_ctx.isOrganizing))
                            return;
                        if (!(__VLS_ctx.plan.length > 0 && !__VLS_ctx.isOrganizing))
                            return;
                        __VLS_ctx.toggleSelection(item.source);
                    } },
                ...{ class: "name-cell" },
                ...{ style: {} },
            });
            (item.name);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.plan.length > 0 || __VLS_ctx.isOrganizing))
                            return;
                        if (!(__VLS_ctx.plan.length > 0 && !__VLS_ctx.isOrganizing))
                            return;
                        __VLS_ctx.toggleSelection(item.source);
                    } },
                ...{ style: {} },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "type-badge" },
            });
            (item.type);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.plan.length > 0 || __VLS_ctx.isOrganizing))
                            return;
                        if (!(__VLS_ctx.plan.length > 0 && !__VLS_ctx.isOrganizing))
                            return;
                        __VLS_ctx.toggleSelection(item.source);
                    } },
                ...{ class: "size-cell" },
                ...{ style: {} },
            });
            (__VLS_ctx.formatBytes(item.size));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
                ...{ class: "dest-cell" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.select, __VLS_intrinsicElements.select)({
                ...{ onClick: () => { } },
                value: (item.category),
                ...{ class: "cat-select" },
            });
            for (const [cat] of __VLS_getVForSourceType((__VLS_ctx.allCategories))) {
                __VLS_asFunctionalElement(__VLS_intrinsicElements.option, __VLS_intrinsicElements.option)({
                    key: (cat),
                    value: (cat),
                });
                (cat);
            }
        }
    }
    if (__VLS_ctx.plan.length > 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "warning-box" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.startOrganize) },
        ...{ class: "btn btn-hero" },
        disabled: (__VLS_ctx.isOrganizing || __VLS_ctx.selectedItems.length === 0),
    });
    (__VLS_ctx.isOrganizing ? 'Organizando...' : '¡Ejecutar elementos seleccionados!');
}
else {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "strategy-card empty-state" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.strong, __VLS_intrinsicElements.strong)({});
}
if (__VLS_ctx.history.length > 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "mini-history" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h4, __VLS_intrinsicElements.h4)({});
    for (const [h] of __VLS_getVForSourceType((__VLS_ctx.history))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            key: (h.id),
            ...{ class: "history-item" },
        });
        (h.source_path.split('\\').pop());
        (h.target_path.split('\\').pop());
    }
}
/** @type {__VLS_StyleScopedClasses['organizer-view']} */ ;
/** @type {__VLS_StyleScopedClasses['section-header']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['category-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-card']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-name']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-count']} */ ;
/** @type {__VLS_StyleScopedClasses['action-panel']} */ ;
/** @type {__VLS_StyleScopedClasses['strategy-card']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-section']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-info']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar-bg']} */ ;
/** @type {__VLS_StyleScopedClasses['progress-bar-fill']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-table-container']} */ ;
/** @type {__VLS_StyleScopedClasses['preview-table']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['name-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['type-badge']} */ ;
/** @type {__VLS_StyleScopedClasses['size-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['dest-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['cat-select']} */ ;
/** @type {__VLS_StyleScopedClasses['warning-box']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-hero']} */ ;
/** @type {__VLS_StyleScopedClasses['strategy-card']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
/** @type {__VLS_StyleScopedClasses['mini-history']} */ ;
/** @type {__VLS_StyleScopedClasses['history-item']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            categories: categories,
            allCategories: allCategories,
            plan: plan,
            selectedItems: selectedItems,
            isOrganizing: isOrganizing,
            currentAction: currentAction,
            history: history,
            toggleAll: toggleAll,
            toggleSelection: toggleSelection,
            startOrganize: startOrganize,
            formatBytes: formatBytes,
            getIcon: getIcon,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Organizer.vue.js.map