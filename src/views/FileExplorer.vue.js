/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, onMounted, computed } from 'vue';
const items = ref([]);
const rootPath = ref('');
const currentPath = ref('');
const breadcrumbs = computed(() => {
    if (!rootPath.value || !currentPath.value)
        return [];
    const relative = currentPath.value.replace(rootPath.value, '');
    return relative.split('\\').filter(p => p !== '');
});
const fetchItems = async (path) => {
    currentPath.value = path;
    // @ts-ignore
    const result = await window.electronAPI.getFolderContents(path);
    // Sort: Folders first, then by size
    items.value = result.sort((a, b) => {
        if (a.extension === 'folder' && b.extension !== 'folder')
            return -1;
        if (a.extension !== 'folder' && b.extension === 'folder')
            return 1;
        return b.size - a.size;
    });
};
onMounted(async () => {
    // @ts-ignore
    rootPath.value = await window.electronAPI.getRootPath();
    if (rootPath.value) {
        await fetchItems(rootPath.value);
    }
});
const handleItemClick = (item) => {
    if (item.extension === 'folder') {
        fetchItems(item.path);
    }
};
const navigateTo = (path) => fetchItems(path);
const navigateToPart = (index) => {
    const parts = currentPath.value.replace(rootPath.value, '').split('\\').filter(p => p !== '');
    const targetSubPath = parts.slice(0, index + 1).join('\\');
    fetchItems(rootPath.value + (targetSubPath ? '\\' + targetSubPath : ''));
};
const openItem = (item) => {
    // @ts-ignore
    window.electronAPI.openPath(item.path);
};
const showLocation = (item) => {
    // @ts-ignore
    window.electronAPI.showItemInFolder(item.path);
};
const moveToFolder = async (item) => {
    // @ts-ignore
    const targetFolder = await window.electronAPI.selectFolder();
    if (targetFolder) {
        // @ts-ignore
        const res = await window.electronAPI.moveItem(item.path, targetFolder);
        if (res && res.success) {
            items.value = items.value.filter(i => i.path !== item.path);
        }
        else {
            alert("No se pudo mover: " + (res?.error || "Error desconocido"));
        }
    }
};
const moveToTrash = async (item) => {
    // @ts-ignore
    const res = await window.electronAPI.trashItem(item.path);
    if (res && res.success === false) {
        alert("No se pudo enviar a la papelera. Posiblemente esté en uso por otro programa.\n\nError: " + res.error);
        return;
    }
    items.value = items.value.filter(i => i.path !== item.path);
};
const deleteItem = async (item) => {
    if (confirm(`¿Estás seguro de que quieres eliminar PERMANENTEMENTE "${item.name}"? Esta acción no se puede deshacer.`)) {
        // @ts-ignore
        const res = await window.electronAPI.deletePermanently(item.path);
        if (res && res.success === false) {
            alert("No se pudo borrar el archivo. Asegúrate de cerrarlo e inténtalo de nuevo.\n\nError: " + res.error);
            return;
        }
        items.value = items.value.filter(i => i.path !== item.path);
    }
};
const getFileIcon = (item) => {
    if (item.extension === 'folder')
        return '📁';
    if (!item.extension)
        return '📄';
    const ext = item.extension.toLowerCase();
    if (['.jpg', '.png', '.gif', '.webp'].includes(ext))
        return '🖼️';
    if (['.mp4', '.mkv', '.mov'].includes(ext))
        return '🎬';
    if (['.pdf', '.docx', '.txt', '.xlsx'].includes(ext))
        return '📄';
    if (['.exe', '.msi', '.bat', '.cmd', '.iso', '.img'].includes(ext))
        return '💿';
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext))
        return '📦';
    if (['.js', '.ts', '.vue', '.dart', '.py', '.java', '.cpp', '.c', '.cs', '.html', '.css', '.php', '.sql', '.sh', '.json', '.xml', '.yaml', '.md', '.go', '.rs'].includes(ext))
        return '💻';
    return '📄';
};
const goUp = () => {
    const parts = currentPath.value.split('\\');
    parts.pop();
    fetchItems(parts.join('\\'));
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
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['crumb']} */ ;
/** @type {__VLS_StyleScopedClasses['explorer-table']} */ ;
/** @type {__VLS_StyleScopedClasses['explorer-table']} */ ;
/** @type {__VLS_StyleScopedClasses['row-item']} */ ;
/** @type {__VLS_StyleScopedClasses['row-up']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "explorer-view" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "explorer-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "breadcrumb" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ onClick: (...[$event]) => {
            __VLS_ctx.navigateTo(__VLS_ctx.rootPath);
        } },
    ...{ class: "crumb" },
});
for (const [part, index] of __VLS_getVForSourceType((__VLS_ctx.breadcrumbs))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        key: (index),
        ...{ class: "crumb-wrapper" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "sep" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.navigateToPart(index);
            } },
        ...{ class: "crumb" },
    });
    (part);
}
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "explorer-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.table, __VLS_intrinsicElements.table)({
    ...{ class: "explorer-table" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.thead, __VLS_intrinsicElements.thead)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "text-right" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.th, __VLS_intrinsicElements.th)({
    ...{ class: "text-center" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.tbody, __VLS_intrinsicElements.tbody)({});
if (__VLS_ctx.currentPath !== __VLS_ctx.rootPath) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        ...{ onClick: (__VLS_ctx.goUp) },
        ...{ class: "row-up" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "icon" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "text-right" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
}
for (const [item] of __VLS_getVForSourceType((__VLS_ctx.items))) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.tr, __VLS_intrinsicElements.tr)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.handleItemClick(item);
            } },
        ...{ onDblclick: (...[$event]) => {
                item.extension === 'folder' ? __VLS_ctx.fetchItems(item.path) : __VLS_ctx.openItem(item);
            } },
        key: (item.path),
        ...{ class: "row-item" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "name-cell" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "icon" },
    });
    (__VLS_ctx.getFileIcon(item));
    (item.name);
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({});
    (item.extension === 'folder' ? 'Carpeta' : (item.extension || '').toUpperCase().replace('.', '') || 'ARCHIVO');
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "text-right size-cell" },
    });
    (__VLS_ctx.formatBytes(item.size));
    __VLS_asFunctionalElement(__VLS_intrinsicElements.td, __VLS_intrinsicElements.td)({
        ...{ class: "text-center" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "actions-cell" },
    });
    if (item.extension === 'folder') {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
            ...{ onClick: (...[$event]) => {
                    if (!(item.extension === 'folder'))
                        return;
                    __VLS_ctx.fetchItems(item.path);
                } },
            ...{ class: "btn-action btn-enter" },
            title: "Entrar",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
            width: "16",
            height: "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            'stroke-width': "2",
            'stroke-linecap': "round",
            'stroke-linejoin': "round",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
            x1: "5",
            y1: "12",
            x2: "19",
            y2: "12",
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
            points: "12 5 19 12 12 19",
        });
    }
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.showLocation(item);
            } },
        ...{ class: "btn-action btn-location" },
        title: "Abrir Locación",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
        points: "15 3 21 3 21 9",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "10",
        y1: "14",
        x2: "21",
        y2: "3",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.moveToFolder(item);
            } },
        ...{ class: "btn-action btn-move" },
        title: "Mover a carpeta específica",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "5",
        y1: "19",
        x2: "19",
        y2: "5",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
        points: "10 5 19 5 19 14",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.moveToTrash(item);
            } },
        ...{ class: "btn-action btn-trash" },
        title: "Mover a Papelera",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.polyline, __VLS_intrinsicElements.polyline)({
        points: "3 6 5 6 21 6",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "10",
        y1: "11",
        x2: "10",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "14",
        y1: "11",
        x2: "14",
        y2: "17",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.button, __VLS_intrinsicElements.button)({
        ...{ onClick: (...[$event]) => {
                __VLS_ctx.deleteItem(item);
            } },
        ...{ class: "btn-action btn-delete" },
        title: "Borrar Definitivo",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.svg, __VLS_intrinsicElements.svg)({
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        'stroke-width': "2",
        'stroke-linecap': "round",
        'stroke-linejoin': "round",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.path, __VLS_intrinsicElements.path)({
        d: "M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "18",
        y1: "9",
        x2: "12",
        y2: "15",
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.line, __VLS_intrinsicElements.line)({
        x1: "12",
        y1: "9",
        x2: "18",
        y2: "15",
    });
}
if (__VLS_ctx.items.length === 0) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty-state" },
    });
    if (!__VLS_ctx.rootPath) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    }
}
/** @type {__VLS_StyleScopedClasses['explorer-view']} */ ;
/** @type {__VLS_StyleScopedClasses['explorer-header']} */ ;
/** @type {__VLS_StyleScopedClasses['breadcrumb']} */ ;
/** @type {__VLS_StyleScopedClasses['crumb']} */ ;
/** @type {__VLS_StyleScopedClasses['crumb-wrapper']} */ ;
/** @type {__VLS_StyleScopedClasses['sep']} */ ;
/** @type {__VLS_StyleScopedClasses['crumb']} */ ;
/** @type {__VLS_StyleScopedClasses['explorer-container']} */ ;
/** @type {__VLS_StyleScopedClasses['explorer-table']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['row-up']} */ ;
/** @type {__VLS_StyleScopedClasses['name-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['row-item']} */ ;
/** @type {__VLS_StyleScopedClasses['name-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['icon']} */ ;
/** @type {__VLS_StyleScopedClasses['text-right']} */ ;
/** @type {__VLS_StyleScopedClasses['size-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['text-center']} */ ;
/** @type {__VLS_StyleScopedClasses['actions-cell']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-enter']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-location']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-move']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-trash']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-action']} */ ;
/** @type {__VLS_StyleScopedClasses['btn-delete']} */ ;
/** @type {__VLS_StyleScopedClasses['empty-state']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            items: items,
            rootPath: rootPath,
            currentPath: currentPath,
            breadcrumbs: breadcrumbs,
            fetchItems: fetchItems,
            handleItemClick: handleItemClick,
            navigateTo: navigateTo,
            navigateToPart: navigateToPart,
            openItem: openItem,
            showLocation: showLocation,
            moveToFolder: moveToFolder,
            moveToTrash: moveToTrash,
            deleteItem: deleteItem,
            getFileIcon: getFileIcon,
            goUp: goUp,
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
//# sourceMappingURL=FileExplorer.vue.js.map