// @ts-check

// @ts-ignore
import { app } from "../../scripts/app.js";
import { MobileFormUI } from "./ui.js";

const log = console.log.bind(console, "[MobileForm]");
const error = console.error.bind(console, "[MobileForm]");

const BASE_PATH = import.meta.url.replace(/\/[^/]*$/, "");

const ENABLE_BY_DEFAULT = document.location.hash.startsWith("#mobile");

/** @type {MobileFormUI} */
let ui;
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && ui?.visible) {
        ui.toggleVisible();
    }
});

// Phone icon as an SVG mask class, filled with currentColor to match the theme.
const PHONE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><line x1="10" y1="5.5" x2="14" y2="5.5"/><circle cx="12" cy="18.2" r="0.9" fill="#000" stroke="none"/></svg>`;
const MOBILEFORM_ICON_CLASS = "mobileform-phone-icon";

function ensureIconStyle() {
    if (document.getElementById("mobileform-icon-style")) return;
    const style = document.createElement("style");
    style.id = "mobileform-icon-style";
    style.textContent = `
        .${MOBILEFORM_ICON_CLASS} {
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }
        .${MOBILEFORM_ICON_CLASS}::before {
            content: "";
            display: inline-block;
            width: 1.15em;
            height: 1.15em;
            background-color: currentColor;
            -webkit-mask: url("data:image/svg+xml,${encodeURIComponent(PHONE_SVG)}") center / contain no-repeat;
            mask: url("data:image/svg+xml,${encodeURIComponent(PHONE_SVG)}") center / contain no-repeat;
        }
    `;
    document.head.appendChild(style);
}

app.registerExtension({
    name: "MobileForm",
    async init(app) {
        log("Initializing...");

        const style_elem = document.createElement('link');
        style_elem.rel = "stylesheet";
        style_elem.href = `${BASE_PATH}/style.css`;
        document.head.appendChild(style_elem);

        ensureIconStyle();

        const ui_root_elem = document.createElement('div');
        ui = new MobileFormUI(app, ui_root_elem);

        const graph_canvas_container = document.querySelector(".graph-canvas-container");
        if(!graph_canvas_container) {
            error("Couldn't find a place to add main MobileForm UI!");
            return;
        }

        graph_canvas_container.appendChild(ui_root_elem);
    },
    setup(_) {
        if(ENABLE_BY_DEFAULT) ui.toggleVisible();
    },
    actionBarButtons: [{ icon: MOBILEFORM_ICON_CLASS, tooltip: "Mobile Form", onClick: () => ui?.toggleVisible() }],
    async afterConfigureGraph(_, app) {
        ui?.setGraph(app.graph);
    },
});
