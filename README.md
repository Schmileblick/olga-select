# Olga Select

A small Vanilla JavaScript library for enhanced native select elements.

## Usage

1 - Download and install the library

```js
npm i olga-select
```

2 - Include the library

```html
<script src="path/to/olga-select.js"></script>
```

3 - Include CSS style

```html
<link rel="stylesheet" href="path/to/olga-select.css">
```

4 - Use oSelect function

```js
new OlgaSelect(document.getElementById("your_select"));
```

## Options

### Placeholders

| Attribute           | Default                | Desc.                                                                                                                                    |
|---------------------|------------------------|------------------------------------------------------------------------------------------------------------------------------------------|
| placeholder         | "Select an option"     | Placeholder for a select element with multiple attribute.                                                                                |
| selectedplaceholder | &lt;qty&gt; "selected" | Placeholder for a select element with multiple attribute when multiple options are selected (only the "selected" string can be changed). |
| searchplaceholder   | "Search"               | Input element placeholder to search for options.                                                                                         |

### Searchable

You can add a seach to the select element

```js
let options = {searchable: true}new OlgaSelect(document.getElementById("your_select"), options);
```

### Sortable

The list of options can be long. To find selected items easily, you can specify `sortable: true`

```js
let options = {sortable: true}new OlgaSelect(document.getElementById("your_select"), options);
```

### Updatable

You may need to update the list of options. Use `updatable`

```js
let options = {updatable: true}
new OlgaSelect(document.getElementById("your_select"), options);
```

### Your own CSS

Olga Select doesn't want to impose a CSS style. You can therefore use your own classes.

Example with Bootstrap 5 :

```js
const options = {
    classes: {
        select: ["form-select"],
        dropdown: ["bg-white", "border", "border-secondary"],
        search: ["form-control"]
    }
};
```

Full documentation : https://schmileblick.github.io/olga-select/