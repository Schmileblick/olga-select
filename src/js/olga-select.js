export function oSelect(selectElem, options) {

    let select = oSelectDivSelectElem(selectElem, options.placeholder);
    let dropdown = oSelectDropdownElem(options.classes.dropdown);
    let list = oSelectListElem(selectElem, select, options.multiple_placeholder);
    let search = oSelectSearchElem(list, options.classes.search, options.search_placeholder);

    dropdown.append(search);
    dropdown.append(list);
    select.append(dropdown);

    select.addEventListener("click", (ev) => dropdownEvent(ev, select, dropdown, options.placeholder));
    insertAfter(select, selectElem);
}

/**
 * Returns a division containing the same classes as the select element passed in parameter.
 * @param select select element
 * @param placeholder text specified in options.placeholder
 * @returns {HTMLDivElement}
 */
function oSelectDivSelectElem(select, placeholder) {
    let selectDiv = document.createElement("div");
    selectDiv.classList = select.classList;
    selectDiv.classList.add("oselect");

    let span = document.createElement("span");
    span.dataset.oselectPlaceholder = span.textContent = selectDiv.ariaPlaceholder = placeholder;
    selectDiv.append(span);

    return selectDiv;
}

/**
 * Returns a division corresponding to the options of a select element
 * @param classes classes specified in options.classes.dropdown
 * @returns {HTMLDivElement}
 */
function oSelectDropdownElem(classes) {
    let dropdown = document.createElement("div");
    dropdown.dataset.oselectDropdown = "";
    classes.forEach(dropdownClass => dropdown.classList.add(dropdownClass));
    dropdown.classList.add("hidden");
    return dropdown;
}

/**
 *
 * @returns {HTMLElement}
 */
function oSelectListElem(selectElem, select, multiplePlaceholder) {
    let list = document.createElement("ul");
    for (const option of selectElem.options) {
        list.append(oSelectOptionElem(selectElem, select, option, multiplePlaceholder));
    }
    sortSelectedOptions(list);
    return list;
}

/**
 * Returns an input element to search item in options
 * @param list
 * @param classes classes specified in options.classes.search
 * @param placeholder text specified in options.search_placeholder
 * @returns {HTMLInputElement}
 */
function oSelectSearchElem(list, classes, placeholder) {
    let search = document.createElement("input");
    search.placeholder = placeholder;
    classes.forEach(searchClass => search.classList.add(searchClass));
    search.addEventListener("keyup", () => searchInList(search, list));
    return search;
}

function oSelectOptionElem(selectElem, select, option, multiplePlaceholder) {
    let placeholder = select.querySelector("[data-oselect-placeholder]");
    let li = document.createElement("li");

    li.textContent = option.text;
    li.dataset.value = option.value;
    if (option.selected) {
        li.classList.add("selected");
    }

    let optionsSelected = countSelectedOption(option);

    if (option.selected && selectElem.multiple && countSelectedOption(option) > 1) {
        placeholder.dataset.oselectPlaceholder = placeholder.textContent = `${optionsSelected} ${multiplePlaceholder}`;
    }

    if ((option.selected && !selectElem.multiple) || (option.selected && selectElem.multiple && optionsSelected <=1)) {
        placeholder.dataset.oselectPlaceholder = placeholder.textContent = option.text;
    }

    li.addEventListener("click", () => optionEvent(li, selectElem, option, placeholder, multiplePlaceholder));

    return li;
}

/**
 * Makes dropdown element visible or not
 * @param ev event
 * @param select parent element
 * @param dropdown dropdown element
 */
async function dropdownEvent(ev, select, dropdown, placeholder) {
    if (ev.target === select || ev.target === select.querySelector("span")) {
        if (dropdown.classList.contains("hidden")) {
            dropdown.classList.remove("hidden");
            await updateSelects(dropdown, placeholder);
        } else {
            dropdown.classList.add("hidden");
        }
        dropdownSpacing(select, dropdown);
    }
    closeListIfOutsideClick(select, dropdown);
}

async function optionEvent(li, selectElem, option, placeholder, multiplePlaceholder) {
    if (selectElem.multiple) {
        await optionEventIfMultiple(li, selectElem, option, placeholder, multiplePlaceholder);
    } else {
        await optionEventIfNotMultiple(li, selectElem, option, placeholder);
    }
    await resetSearchList(li.parentNode.parentNode.querySelector("input"), li.parentNode);
    sortSelectedOptions(li.parentNode);
}

function searchInList(input, list) {
    const items = Array.from(list.querySelectorAll("li"));
    items.forEach(item => {
        if (!item.dataset.value.includes(input.value)) {
            if (!item.classList.contains("hidden")) item.classList.add("hidden");
        } else {
            if (item.classList.contains("hidden")) item.classList.remove("hidden");
        }
    });
}

async function resetSearchList(input, list) {
    const items = Array.from(list.querySelectorAll("li"));
    input.value = "";
    items.forEach(item => {
        if (item.classList.contains("hidden")) item.classList.remove("hidden");
    });
}

function optionEventIfNotMultiple(li, selectElem, option, placeholder) {
    if (!li.classList.contains("selected")) {
        for (const liElem of li.parentNode.children) {
            if (liElem.classList.contains("selected")) {
                liElem.classList.remove("selected");
            }
        }
        li.classList.add("selected");
        selectElem.selectedIndex = option.index;
        placeholder.dataset.oselectPlaceholder = placeholder.textContent = option.text;
    }
}

function optionEventIfMultiple(li, selectElem, option, placeholder, multiplePlaceholder) {
    if (li.classList.contains("selected")) {
        li.classList.remove("selected");
        option.attributes.removeNamedItem("selected");
    } else {
        li.classList.add("selected");
        option.setAttribute("selected", true);
    }

    let optionsSelected = countSelectedOption(option);

    if (optionsSelected > 1) {
        placeholder.dataset.oselectPlaceholder = placeholder.textContent = `${optionsSelected} ${multiplePlaceholder}`;
    } else {
        for (const liElem of li.parentNode.children) {
            if (liElem.classList.contains("selected")) placeholder.dataset.oselectPlaceholder = placeholder.textContent = liElem.textContent;
        }
    }
}

function closeListIfOutsideClick(parentElem, childElem) {
    window.addEventListener("click", (ev) => {
        if (ev.target !== parentElem && !parentElem.contains(ev.target)) {
            if (!childElem.classList.contains("hidden")) {
                childElem.classList.add("hidden");
            }
        }
    })
}

function updateSelects(dropdown, placeholder) {
    const select = dropdown.parentNode.parentNode.querySelector("select");
    let list = dropdown.querySelector("ul");
    list.innerHTML = "";

    for (const option of select.options) {
        list.append(oSelectOptionElem(select, dropdown.parentNode, option, placeholder));
    }
    sortSelectedOptions(list);
}

/**
 * Insert new element after existing element in DOM
 * @param newElem
 * @param existingElem
 */
function insertAfter(newElem, existingElem) {
    existingElem.parentNode.insertBefore(newElem, existingElem.nextSibling);
}

/**
 * Adds a top margin to ensure equal space between elements, regardless of the size of the parent element.
 * @param parent
 * @param child
 */
function dropdownSpacing(parent, child) {
    child.style.marginTop = `${parent.offsetHeight + 0.25 * 16}px`;
}

function countSelectedOption(option) {
    let selectedOptions = 0;
    for (let optElem of option.parentNode.children) {
        if (optElem.selected) selectedOptions++;
    }
    return selectedOptions;
}

function sortSelectedOptions(selectElem) {
    const liElements = Array.from(selectElem.querySelectorAll("li"));

    const selectedElements = liElements.filter(li => li.classList.contains("selected"));
    const unselectedElements = liElements.filter(li => !li.classList.contains("selected"));

    selectElem.innerHTML = "";

    selectedElements.forEach(li => selectElem.appendChild(li));
    unselectedElements.forEach(li => selectElem.appendChild(li));
}