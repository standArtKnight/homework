        /*
        При вводе в текстовое поле, под ним должен появляться список тех городов,
        в названии которых, хотя бы частично, есть введенное значение.
        Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.

        Во время загрузки городов, на странице должна быть надпись "Загрузка..."
        После окончания загрузки городов, надпись исчезает и появляется текстовое поле.

        Разметку смотрите в файле towns-content.hbs

        Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер

        *** Часть со звездочкой ***
        Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
        то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
        При клике на кнопку, процесс загрузки повторяется заново
        */

        /*
         homeworkContainer - это контейнер для всех ваших домашних заданий
         Если вы создаете новые html-элементы и добавляете их на страницу, то добавляйте их только в этот контейнер

         Пример:
           const newDiv = document.createElement('div');
           homeworkContainer.appendChild(newDiv);
         */
        const homeworkContainer = document.querySelector('#homework-container');

        /*
         Функция должна вернуть Promise, который должен быть разрешен с массивом городов в качестве значения

         Массив городов пожно получить отправив асинхронный запрос по адресу
         https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
         */
        function loadTowns() {
          return new Promise((resolve, reject) => {

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json');
            xhr.responseType = 'json';
            xhr.send();
            xhr.addEventListener('load', () => {
              if (xhr.status >= 400) {
                loadingBlock.style.display = 'none';
                filterBlock.style.display = 'none';

                const reloadDiv = document.createElement('div');
                reloadDiv.innerText = 'Не удалось загрузить города'
                homeworkContainer.appendChild(reloadDiv);

                const reload = document.createElement('button');
                reload.innerText = 'Повторить';
                homeworkContainer.appendChild(reload);

                reload.addEventListener('click', () => {
                  reloadDiv.remove();
                  reload.remove();
                  loadTowns();
                })
              } else {
                loadingBlock.style.display = 'block';
                const cities = xhr.response;
                resolve(cities.sort((a, b) => a.name.localeCompare(b.name)));
              }
            })
          })
        }

        /*
         Функция должна проверять встречается ли подстрока chunk в строке full
         Проверка должна происходить без учета регистра символов

         Пример:
           isMatching('Moscow', 'moscow') // true
           isMatching('Moscow', 'mosc') // true
           isMatching('Moscow', 'cow') // true
           isMatching('Moscow', 'SCO') // true
           isMatching('Moscow', 'Moscov') // false
         */
        function isMatching(full, chunk) {
          return (full.toLowerCase().indexOf(chunk.toLowerCase()) >= 0);
        }

        /* Блок с надписью "Загрузка" */
        const loadingBlock = homeworkContainer.querySelector('#loading-block');
        /* Блок с текстовым полем и результатом поиска */
        const filterBlock = homeworkContainer.querySelector('#filter-block');
        /* Текстовое поле для поиска по городам */
        const filterInput = homeworkContainer.querySelector('#filter-input');
        /* Блок с результатами поиска */
        const filterResult = homeworkContainer.querySelector('#filter-result');

        let cities = [];

        loadTowns()
          .then((elements) => {
            loadingBlock.style.display = 'none';
            filterBlock.style.display = 'inline';
            for (let {
                name
              } of elements) {
              cities.push(name);
            }
          })

        filterInput.addEventListener('keyup', function (event) {
          // это обработчик нажатия кливиш в текстовом поле
          filterResult.innerHTML = '';
          if (filterInput.value != '') {
            for (let city of cities) {
              if (isMatching(city, filterInput.value)) {
                const newDiv = document.createElement('div');
                newDiv.innerText = city;
                filterResult.appendChild(newDiv);
              }
            }
          }
        });

        export {
          loadTowns,
          isMatching
        };