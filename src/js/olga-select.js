// import "../scss/olga-select.scss";

const defaultOptions = {
  placeholder: "Select an option",
  selectedplaceholder: "selected",
  searchplaceholder: "Search",
  config: {
    updatable: false,
    sortable: false,
    searchable: false,
  },
  classes: {
    select: ["select"],
    dropdown: ["modal"],
    search: ["search"]
  }
};

export default class OlgaSelect {
  constructor(element, options) {
    this.elem = element;
    this.options = Object.assign({}, options || defaultOptions);
    
    this.placeholder = this.options.placeholder || "Select an option";
    this.selectedplaceholder = this.options.selectedplaceholder || "selected";
    this.searchplaceholder = this.options.searchplaceholder || "Search";

    this.updatable = this.options.config?.updatable || false;
    this.sortable = this.options.config?.sortable || false;
    this.searchable = this.options.config?.searchable || false;
    this.selectClass = this.options.classes?.select || ["select"];
    this.dropdownClass = this.options.classes?.dropdown || ["modal"];
    this.searchClass = this.options.classes?.search || ["search"];

    this.multiple = attr(this.elem, "multiple");


    this.oSelect = null;
    this.allOptionItems = [];

    this.generate();
  };

  generate() {
    this.elem.classList.add("ohidden");

    this.getData();
    this.createDropdown();
    this.addEvents();
  };

  getData() {
    const options = this.elem.querySelectorAll("option");
    let optionItems = [];
    let selectedOptionItems = [];
    
    options.forEach(item => {
      let itemData = {
        text: item.innerText,
        value: item.value,
        selected: item.getAttribute("selected") !== null
      }
      
      if (this.sortable) {
        itemData.selected ? selectedOptionItems.push(itemData) : optionItems.push(itemData);
      } else optionItems.push(itemData);
    });

    this.allOptionItems = this.sortable ? selectedOptionItems.concat(optionItems) : optionItems;
  };

  createDropdown() {
    let search = `<input type="text" class="${this.searchClass.join(" ")}" placeholder="${this.searchplaceholder}">`;
    let spanPlaceholder = `<span>${this.placeholder}</span>`;
    let list = `<ul></ul>`;

    let dropdown = `<div class="${this.dropdownClass.join(" ")} dropdown ohidden">`;
    if (this.searchable) dropdown += search;
    dropdown += list;
    dropdown += `</div>`;

    let oSelect = `<div class="${this.selectClass.join(" ")} oselect">`;
    oSelect += spanPlaceholder;
    oSelect += dropdown;
    oSelect += `</div>`;

    this.elem.insertAdjacentHTML("afterend", oSelect);

    this.oSelect = this.elem.nextElementSibling;

    this._addOptions();
  };

  addEvents() {
    this.oSelect.addEventListener("click", (ev) => this._showableModal(ev));
    this.oSelect.querySelectorAll("li").forEach(option => option.addEventListener("click", (ev) => this._clickedOption(ev, option)));
    
    if (this.searchable) {
      let inputSearch = this.oSelect.querySelector("input");
      inputSearch.addEventListener("keyup", () => this._searchOptions(inputSearch.value));
    }

    modalSpacing(this.oSelect);
  }

  _addOptions() {
    let list = this.oSelect.querySelector("ul");
    this.allOptionItems.forEach(item => {
      list.appendChild(this._addOption(item));
    });
  };

  _addOption(item) {
    let option = document.createElement("li");
    option.innerText = item.text;
    option.dataset.value = item.value;
    if (item.selected) option.classList.add("selected");
    return option;
  }

  // Events

  _showableModal(ev) {
    let dropdown = this.oSelect.querySelector(".dropdown");

    if (ev.target === this.oSelect || ev.target === this.oSelect.querySelector("span")) {
      if (dropdown.classList.contains("ohidden")) {
        dropdown.classList.remove("ohidden");
      } else {
        dropdown.classList.add("ohidden");
      }
      if (this.updatable && !dropdown.classList.contains("ohidden")) this._update();
    }

    window.addEventListener("click", (ev) => this._clickOutsideModal(ev, dropdown), true);
  }

  _clickedOption(ev, option) {
    ev.preventDefault();
    this.multiple ? this._isMultiple(option) : this._isNotMultiple(option);
    this._changePlaceholder();
    if (this.searchable) {
      this._resetSearch();
    }
  }

  _searchOptions(search) {
    let list = this.oSelect.querySelectorAll("li");
    list.forEach(item => {
      if (!item.innerText.includes(search)) {
        if (!item.classList.contains("ohidden")) item.classList.add("ohidden");
      } else {
        if (item.classList.contains("ohidden")) item.classList.remove("ohidden");
      }
    });
  }

  _clickOutsideModal(ev, dropdown) {
    if (ev.target !== this.oSelect) {
      if (ev.target !== dropdown && !dropdown.contains(ev.target)) {
        if (!dropdown.classList.contains("ohidden")) {
          dropdown.classList.add("ohidden");
        }
      }
    }
  }

  _changePlaceholder() {
    let options = this.elem.querySelectorAll("option");
    let numberOfSelectedOptions = getNumberOfSelectedOptions(options);
    if (this.multiple && numberOfSelectedOptions > 1) {
      this.oSelect.querySelector("span").innerText = `${numberOfSelectedOptions} ${this.selectedplaceholder}`;
    } else if (!this.multiple || this.multiple && numberOfSelectedOptions === 1) {
      this.oSelect.querySelector("span").innerText = getSelectedOption(options).innerText;
    } else {
      this.oSelect.querySelector("span").innerText = this.placeholder;
    }
  }

  _isMultiple(option) {
    if (option.classList.contains("selected")) {
      option.classList.remove("selected");
      this.elem.querySelector(`option[value="${option.dataset.value}"]`).removeAttribute("selected");
    } else {
      option.classList.add("selected");
      this.elem.querySelector(`option[value="${option.dataset.value}"]`).setAttribute("selected", "selected");
    }
  }

  _isNotMultiple(option) {
    this.oSelect.querySelectorAll("li").forEach(item => {
      item.classList.remove("selected");
      this.elem.querySelector(`option[value="${item.dataset.value}"]`).removeAttribute("selected");
    });
    option.classList.add("selected");
    this.elem.querySelector(`option[value="${option.dataset.value}"]`).setAttribute("selected", "selected");
  }

  _resetSearch() {
    this.oSelect.querySelector("input").value = "";
    let options = this.oSelect.querySelectorAll("li");
    options.forEach(item => {
      if (item.classList.contains("ohidden")) item.classList.remove("ohidden");
    });
  }

  _update() {
    this.getData();
    this.oSelect.querySelector("ul").innerHTML = "";
    this._addOptions();
    this.oSelect.querySelectorAll("li").forEach(option => option.addEventListener("click", (ev) => this._clickedOption(ev, option)));
    this._changePlaceholder();
  }
}

// Utilities

const attr = (element, key) => {
  if (element[key] !== undefined) {
    return element[key];
  }
  return element.getAttribute(key);
}

const getNumberOfSelectedOptions = (options) => {
  let selected = 0;
  options.forEach(option => {
    if (option.selected) selected++;
  });
  return selected;
}

const getSelectedOption = (options) => {
  for (const option of options) {
    if (option.selected) {
      return option;
      break;
    }
  }
  return options[0];
}

const modalSpacing = (select) => select.querySelector(".dropdown").style.marginTop = `${select.offsetHeight + 0.25 * 16}px`;