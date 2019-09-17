/*
ДЗ 7 - Создать редактор cookie с возможностью фильтрации

7.1: На странице должна быть таблица со списком имеющихся cookie. Таблица должна иметь следующие столбцы:
- имя
- значение
- удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)

7.2: На странице должна быть форма для добавления новой cookie. Форма должна содержать следующие поля:
- имя
- значение
- добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)

Если добавляется cookie с именем уже существующей cookie, то ее значение в браузере и таблице должно быть обновлено

7.3: На странице должно быть текстовое поле для фильтрации cookie
В таблице должны быть только те cookie, в имени или значении которых, хотя бы частично, есть введенное значение
Если в поле фильтра пусто, то должны выводиться все доступные cookie
Если добавляемая cookie не соответсвует фильтру, то она должна быть добавлена только в браузер, но не в таблицу
Если добавляется cookie, с именем уже существующей cookie и ее новое значение не соответствует фильтру,
то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена */

/*
homeworkContainer - это контейнер для всех ваших домашних заданий
Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

Пример:
const newDiv = document.createElement('div');
homeworkContainer.appendChild(newDiv);
*/
const homeworkContainer = document.querySelector('#homework-container');
// текстовое поле для фильтрации cookie
const filterNameInput = homeworkContainer.querySelector('#filter-name-input');
// текстовое поле с именем cookie
const addNameInput = homeworkContainer.querySelector('#add-name-input');
// текстовое поле со значением cookie
const addValueInput = homeworkContainer.querySelector('#add-value-input');
// кнопка "добавить cookie"
const addButton = homeworkContainer.querySelector('#add-button');
// таблица со списком cookie
const listTable = homeworkContainer.querySelector('#list-table tbody');

let COOKIE = objectFromCookie();

function objectFromCookie() {
    return document.cookie.split('; ').reduce((prev, current) => {
        const [name, value] = current.split('=');

        prev[name] = value;

        return prev;
    }, {});
}

function addRow(tableRef, name, value) {
    let row = document.createElement('tr'),
        nameCol = document.createElement('td'),
        valueCol = document.createElement('td'),
        buttonCol = document.createElement('td'),
        deletButton = document.createElement('button');

    nameCol.textContent = name;
    valueCol.textContent = value;

    deletButton.textContent = 'Удалить';

    deletButton.addEventListener('click', () => {
        tableRef.removeChild(row);
        document.cookie = `${name}= ; max-age=-1`;
    })

    buttonCol.appendChild(deletButton);

    row.append(nameCol, valueCol, buttonCol);

    tableRef.append(row);
}

function updateTable() {
    listTable.innerHTML = '';
    COOKIE = objectFromCookie();

    if (filterNameInput.value != '') {
        for (let key in COOKIE) {
            if (key.indexOf(filterNameInput.value) >= 0 ||
                COOKIE[key].indexOf(filterNameInput.value) >= 0) {
                addRow(listTable, key, COOKIE[key]);
            } else {
                delete COOKIE[key];
            }
        }
    } else {
        for (let key in COOKIE) {
            addRow(listTable, key, COOKIE[key]);
        }
    }
}

filterNameInput.addEventListener('keyup', function () {
    // здесь можно обработать нажатия на клавиши внутри текстового поля для фильтрации cookie
    updateTable();
});

addButton.addEventListener('click', () => {
    // здесь можно обработать нажатие на кнопку "добавить cookie"
    document.cookie = addNameInput.value + '=' + addValueInput.value;
    for (const key in COOKIE) {
        if (key === addNameInput.value) {
            COOKIE[key] = addValueInput.value;
        }
    }
    updateTable();
});

updateTable();