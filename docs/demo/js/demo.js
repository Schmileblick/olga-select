import OlgaSelect from "../dist/js/olga-select.min.js";

document.addEventListener("DOMContentLoaded", () => {


    new OlgaSelect(document.getElementById("simpleExample"));

    let options = {
        placeholder: "New placeholder",
        selectedplaceholder: "options",
        searchplaceholder: "John Doe",
        config: {
            searchable: true,
            updatable: true
        },
    };
    new OlgaSelect(document.getElementById("placeholderExample"), options);
});