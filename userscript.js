// ==UserScript==
// @name         BetterCanvas Tweaks
// @namespace    http://tampermonkey.net/
// @version      2025-03-21
// @description  Fixes everything* wrong with BetterCampus.
// @author       George K.
//
// @include      https://canvas.*.edu/*
//
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // s: (string) selector
    // f: (function) modification
    // The modification function is run over all elements that match the selector.
    // It also searches for elements inside the BetterCampus sidebar shadow DOM.
    let modifications = [
        {s: ".ic-sidebar-logo", f: rem(0)},
        {s: ".lucide-bug", f: rem(5)},
        {s: ".lucide-ellipsis", f: rem(2)},
        {s: ".w-\\[13px\\].h-\\[13px\\]", f: rem(4)},
        {s: ".flex.flex-col.items-center.gap-1\\.5.w-full", f: rem(0)},
        {s: ".right-of-crumbs.right-of-crumbs-no-reverse", f: rem(0)},
        {s: ".sidebar-edge-hover", f: rem(0)},
        {s: ".flex.items-center.justify-center.cursor-pointer.px-2.py-1.mt-4.mb-2.select-none.group.relative.rounded-md > div", f: rem(0)},
        {s: ".flex.items-center.justify-center.cursor-pointer.px-2.py-1.mt-4.mb-2.select-none.group.relative.rounded-md > span", f: rem(0)},
        {
            s: ".flex.items-center.justify-center.cursor-pointer.px-2.py-1.mt-4.mb-2.select-none.group.relative.rounded-md",
            f: repClass("mt-4", "mt-0"),
        },
        {s: "#doc_preview > div", f: restyle({height: "", resize: "none"})},
        {s: "#bettercanvas-sidebar", f: (el) => {el.style.width = el.offsetWidth * 1.5 + "px"}},
        {s: "#wrapper", f: delay(restyle({marginLeft: "calc(var(--bcsidebarwidth) * 1.5)"}), 1e3)},
    ];

    function modifyAll() {
        for (let mod of modifications) {
            let els;
            if ((els = Array.from(document.querySelectorAll(mod.s))).length) {
                for (let el of els) {
                    mod.f(el);
                }
                modifications.splice(modifications.indexOf(mod), 1);
            } else if ((els = Array.from(document.querySelector("bettercampus-element")?.shadowRoot?.querySelectorAll(mod.s) ?? [])).length) {
                for (let el of els) {
                    mod.f(el);
                }
                modifications.splice(modifications.indexOf(mod), 1);
            }
        }
        if (!modifications.length) {
            clearInterval(int);
        }
    }

    const int = setInterval(modifyAll, 100);
    setTimeout(clearInterval, 1e4, int);

    function rem(ct) {
        return (el) => {
            for (let i = 0; i < ct; i++) {
                el = el.parentElement;
            }
            el.remove();
        }
    }

    function repClass(f, t) {
        return (el) => {
            el.classList.replace(f, t);
        }
    }

    function restyle(keyVals) {
        return (el) => {
            for (let key in keyVals) {
                el.style[key] = keyVals[key];
            }
        }
    }

    function delay(f, ms) {
        return (el) =>
            setTimeout(f, ms, el);
    }
})();
