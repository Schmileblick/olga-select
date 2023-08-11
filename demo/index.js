import {oSelect} from "../dist/js/olga-select.js";

document.addEventListener("DOMContentLoaded", () => {

    const selectItems = document.querySelectorAll("[data-oselect]");

    if (selectItems) {
        selectItems.forEach((selectItem) => {
            let options = {
                "classes": {
                    "dropdown": ["border", "border-neutral-content", "rounded-md", "bg-base-100"],
                    "search": ["input", "input-sm", "input-bordered"],
                },
                "placeholder": "Sélectionner une option",
                "search_placeholder": "Rechercher",
                "multiple_placeholder": "sélectionnés",
            };
            oSelect(selectItem, options);
        });
    }
});
