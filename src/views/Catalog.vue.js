/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, toRaw } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const catalog = ref({});
const newExtensions = ref({});
const isSaving = ref(false);
const newCategoryName = ref('');
onMounted(async () => {
    if (window.electronAPI) {
        catalog.value = await window.electronAPI.getCatalog();
    }
});
const removeExtension = (category, index) => {
    catalog.value[category].splice(index, 1);
};
const addExtension = (category) => {
    let ext = newExtensions.value[category]?.trim();
    if (ext) {
        if (!ext.startsWith('.')) {
            ext = '.' + ext;
        }
        ext = ext.toLowerCase();
        if (!catalog.value[category].includes(ext)) {
            catalog.value[category].push(ext);
        }
        newExtensions.value[category] = '';
    }
};
const addCategory = () => {
    const name = newCategoryName.value.trim();
    if (name && !catalog.value[name] && name.toLowerCase() !== 'otros') {
        catalog.value = { ...catalog.value, [name]: [] };
        newCategoryName.value = '';
    }
    else if (name) {
        alert("Categoría inválida o ya existe.");
    }
};
const removeCategory = (category) => {
    if (confirm(`¿Estás seguro de eliminar la categoría "${category}"?`)) {
        const newCatalog = { ...catalog.value };
        delete newCatalog[category];
        catalog.value = newCatalog;
    }
};
const saveCatalog = async () => {
    isSaving.value = true;
    if (window.electronAPI) {
        const rawCatalog = JSON.parse(JSON.stringify(toRaw(catalog.value)));
        await window.electronAPI.updateCatalog(rawCatalog);
    }
    isSaving.value = false;
    alert("Catálogo actualizado. Los cambios ya se ven reflejados en tus archivos organizados.");
    router.push('/scan');
};
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['ext-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-cat-btn']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "catalog-view fade-in" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "header-actions" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h2, __VLS_intrinsicElements.h2)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
    ...{ onClick: (__VLS_ctx.saveCatalog) },
    ...{ class: "btn btn-primary" },
    disabled: (__VLS_ctx.isSaving),
});
(__VLS_ctx.isSaving ? 'Guardando...' : 'Guardar Cambios');
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
if (__VLS_ctx.catalog) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "categories-grid" },
    });
    for (const [extensions, category] of __VLS_getVForSourceType((__VLS_ctx.catalog))) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "category-card" },
            key: (category),
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-header" },
            ...{ style: {} },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
        (category);
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.catalog))
                        return;
                    __VLS_ctx.removeCategory(category);
                } },
            ...{ class: "remove-cat-btn" },
            title: "Eliminar categoría",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "card-body" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "extensions-list" },
        });
        for (const [ext, index] of __VLS_getVForSourceType((extensions))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "extension-tag" },
                key: (index),
            });
            (ext);
            __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
                ...{ onClick: (...[$event]) => {
                        if (!(__VLS_ctx.catalog))
                            return;
                        __VLS_ctx.removeExtension(category, index);
                    } },
                ...{ class: "remove-btn" },
            });
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "add-extension" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
            ...{ onKeyup: (...[$event]) => {
                    if (!(__VLS_ctx.catalog))
                        return;
                    __VLS_ctx.addExtension(category);
                } },
            type: "text",
            placeholder: ".ext",
            value: (__VLS_ctx.newExtensions[category]),
            ...{ class: "ext-input" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(__VLS_ctx.catalog))
                        return;
                    __VLS_ctx.addExtension(category);
                } },
            ...{ class: "btn-icon" },
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "category-card new-category-card" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-header" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "card-body add-category-body" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.input)({
        ...{ onKeyup: (__VLS_ctx.addCategory) },
        type: "text",
        placeholder: "Ej. Modelos 3D",
        value: (__VLS_ctx.newCategoryName),
        ...{ class: "ext-input w-full" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (__VLS_ctx.addCategory) },
        ...{ class: "btn btn-primary w-full mt-1" },
    });
}
/** @type {__VLS_StyleScopedClasses['catalog-view']} */ ;
/** @type {__VLS_StyleScopedClasses['fade-in']} */ ;
/** @type {__VLS_StyleScopedClasses['header-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['categories-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-cat-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['extensions-list']} */ ;
/** @type {__VLS_StyleScopedClasses['extension-tag']} */ ;
/** @type {__VLS_StyleScopedClasses['remove-btn']} */ ;
/** @type {__VLS_StyleScopedClasses['add-extension']} */ ;
/** @type {__VLS_StyleScopedClasses['ext-input']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-icon']} */ ;
/** @type {__VLS_StyleScopedClasses['category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['new-category-card']} */ ;
/** @type {__VLS_StyleScopedClasses['card-header']} */ ;
/** @type {__VLS_StyleScopedClasses['card-body']} */ ;
/** @type {__VLS_StyleScopedClasses['add-category-body']} */ ;
/** @type {__VLS_StyleScopedClasses['ext-input']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['btn']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-primary']} */ ;
/** @type {__VLS_StyleScopedClasses['w-full']} */ ;
/** @type {__VLS_StyleScopedClasses['mt-1']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            catalog: catalog,
            newExtensions: newExtensions,
            isSaving: isSaving,
            newCategoryName: newCategoryName,
            removeExtension: removeExtension,
            addExtension: addExtension,
            addCategory: addCategory,
            removeCategory: removeCategory,
            saveCatalog: saveCatalog,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
//# sourceMappingURL=Catalog.vue.js.map