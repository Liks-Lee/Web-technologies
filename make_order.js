document.addEventListener('DOMContentLoaded', () => {
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд по первой букве
            const sortedDishes = data.sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            const selectedDishesSection = document.querySelectorAll('#selected_dishes .dishes-grid')[0];

            function createCard(dish) {
                const card = document.createElement('div');
                card.classList.add('dish-item');
                card.dataset.kind = dish.kind

                const img = document.createElement('img');
                img.src = dish['image'];
                img.alt = dish.name;

                const price = document.createElement('p');
                price.classList.add('price');
                price.textContent = `${dish.price}₽`;

                const dishName = document.createElement('p');
                dishName.classList.add('name');
                dishName.textContent = dish.name;

                const volume = document.createElement('p');
                volume.classList.add('ml_gr');
                volume.textContent = dish.count;

                const buttonDiv = document.createElement('div');
                const button = document.createElement('button');
                button.textContent = 'Удалить';
                button.className = 'add-button';
                buttonDiv.appendChild(button);

                card.appendChild(img);
                card.appendChild(price);
                card.appendChild(dishName);
                card.appendChild(volume);
                card.appendChild(buttonDiv);

                // Функционал кнопки
                button.addEventListener('click', () => {
                    removeFromOrder(dish, card);
                });

                return card;
            }


            // Отвечает за заполнение карточек блюд в определенную секцию на основе заданной категории
            function populateCards(sectionElement) {
                const localStorageIds = [
                    window.localStorage.getItem('selected_soup'),
                    window.localStorage.getItem('selected_main-course'),
                    window.localStorage.getItem('selected_salad'),
                    window.localStorage.getItem('selected_drink'),
                    window.localStorage.getItem('selected_dessert'),
                ]

                sortedDishes.forEach(dish => {
                    if (localStorageIds.includes(String(dish['id']))) {
                        const card = createCard(dish);
                        sectionElement.appendChild(card);
                    }
                });
            }
            
            populateCards(selectedDishesSection);

            // Добавление товаров в заказ и подсчет цены
            let totalprice = 0;
            const totalpriceElement = document.getElementById('total_price');

            let selectedDishes = {
                'Супы': null,
                'Главные блюда': null,
                'Напитки': null,
                'Салаты': null,
                'Десерты': null,
            };

            const chosen_soup = document.getElementById('chosen_soup');
            const chosen_main = document.getElementById('chosen_main');
            const chosen_drink = document.getElementById('chosen_drink');
            const chosen_salad = document.getElementById('chosen_salad');
            const chosen_dessert = document.getElementById('chosen_dessert');
            const soup_label = document.getElementById('soup_label');
            const main_label = document.getElementById('main_label');
            const drink_label = document.getElementById('drink_label');
            const salad_label = document.getElementById('salad_label');
            const dessert_label = document.getElementById('dessert_label');
            const nothingSelectedMessages = document.querySelectorAll('.nothing_selected');

            // Изначально элементы скрыты
            soup_label.style.display = 'none';
            chosen_soup.style.display = 'none';
            main_label.style.display = 'none';
            chosen_main.style.display = 'none';
            drink_label.style.display = 'none';
            chosen_drink.style.display = 'none';
            chosen_salad.style.display = 'none';
            salad_label.style.display = 'none';
            chosen_dessert.style.display = 'none';
            dessert_label.style.display = 'none';
            totalpriceElement.style.display = 'none';

            function updateCategory(category, dish, chosenElement, labelElement) {
                // Если блюдо из этой категории уже выбрано, вычитаем его цену
                if (selectedDishes[category] !== null) {
                    totalprice -= selectedDishes[category]['price'];
                }

                // Обновляем выбранное блюдо
                selectedDishes[category] = dish;
                chosenElement.textContent = `${dish['name']} ${dish['price']}₽`;
                chosenElement.style.display = 'block';
                labelElement.style.display = 'block';

                // Добавляем цену выбранного блюда
                totalprice += dish['price'];
            }

            function addToOrder(dish) {
                let isUpdated = false;
                
                if (dish['category'] === 'soup') {
                    updateCategory('Супы', dish, chosen_soup, soup_label);
                    isUpdated = true;
                } 
                else if (dish['category'] === 'main-course') {
                    updateCategory('Главные блюда', dish, chosen_main, main_label);
                    isUpdated = true;
                } 
                else if (dish['category'] === 'drink') {
                    updateCategory('Напитки', dish, chosen_drink, drink_label);
                    isUpdated = true;
                }
                else if (dish['category'] === 'salad') {
                    updateCategory('Салаты', dish, chosen_salad, salad_label);
                    isUpdated = true;
                }
                else if (dish['category'] === 'dessert') {
                    updateCategory('Десерты', dish, chosen_dessert, dessert_label);
                    isUpdated = true;
                }

                if (isUpdated) {
                    nothingSelectedMessages[0].style.display = 'none';
                    nothingSelectedMessages[1].style.display = 'none';
                }

                totalpriceElement.textContent = `Стоимость заказа: ${totalprice}₽`;
                totalpriceElement.style.display = 'block';

                showEmptyCategories();
            }

            function removeFromOrder(dish, card) {
                if (window.localStorage.getItem('selected_soup') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_soup');
                    totalprice -= selectedDishes['Супы']['price'];
                    selectedDishes['Супы'] = null;
                } else if (window.localStorage.getItem('selected_main-course') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_main-course');
                    totalprice -= selectedDishes['Главные блюда']['price'];
                    selectedDishes['Главные блюда'] = null;
                } else if (window.localStorage.getItem('selected_salad') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_salad');
                    totalprice -= selectedDishes['Салаты']['price'];
                    selectedDishes['Салаты'] = null;
                } else if (window.localStorage.getItem('selected_drink') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_drink');
                    totalprice -= selectedDishes['Напитки']['price'];
                    selectedDishes['Напитки'] = null;
                } else if (window.localStorage.getItem('selected_dessert') === String(dish['id'])) {
                    window.localStorage.removeItem('selected_dessert');
                    totalprice -= selectedDishes['Десерты']['price'];
                    selectedDishes['Десерты'] = null;
                }

                card.parentNode.removeChild(card);
                showEmptyCategories();

                const cards = document.querySelectorAll('.dish-item');
                if (cards.length === 0) {
                    soup_label.style.display = 'none';
                    chosen_soup.style.display = 'none';
                    main_label.style.display = 'none';
                    chosen_main.style.display = 'none';
                    drink_label.style.display = 'none';
                    chosen_drink.style.display = 'none';
                    salad_label.style.display = 'none';
                    chosen_salad.style.display = 'none';
                    dessert_label.style.display = 'none';
                    chosen_dessert.style.display = 'none';
                    totalpriceElement.style.display = 'none';

                    nothingSelectedMessages[0].style.display = '';
                    nothingSelectedMessages[1].style.display = '';
                }
            }

            function fromLocalStorage() {
                // Кэш-браузер из которого берутся блюда
                const localStorageIds = [
                    window.localStorage.getItem('selected_soup'),
                    window.localStorage.getItem('selected_main-course'),
                    window.localStorage.getItem('selected_salad'),
                    window.localStorage.getItem('selected_drink'),
                    window.localStorage.getItem('selected_dessert'),
                ]
                sortedDishes.forEach( function (dish) {
                    if (localStorageIds.includes(String(dish['id']))) {
                        addToOrder(dish);
                    }
                })
            }

            fromLocalStorage();


            // Показываем пустые категории
            function showEmptyCategories() {
                if (selectedDishes['Супы'] === null) {
                    chosen_soup.textContent = 'Блюдо не выбрано';
                    soup_label.style.display = 'block';
                    chosen_soup.style.display = 'block';
                }
                if (selectedDishes['Главные блюда'] === null) {
                    chosen_main.textContent = 'Блюдо не выбрано';
                    main_label.style.display = 'block';
                    chosen_main.style.display = 'block';
                }
                if (selectedDishes['Напитки'] === null) {
                    chosen_drink.textContent = 'Блюдо не выбрано';
                    drink_label.style.display = 'block';
                    chosen_drink.style.display = 'block';
                }
                if (selectedDishes['Салаты'] === null) {
                    chosen_salad.textContent = 'Блюдо не выбрано';
                    salad_label.style.display = 'block';
                    chosen_salad.style.display = 'block';
                }
                if (selectedDishes['Десерты'] === null) {
                    chosen_dessert.textContent = 'Блюдо не выбрано';
                    dessert_label.style.display = 'block';
                    chosen_dessert.style.display = 'block';
                }
            }

            const combos = [
                { name: 'Ланч 1', items: ['Супы', 'Главные блюда', 'Напитки', 'Салаты'] },
                { name: 'Ланч 2', items: ['Супы', 'Главные блюда', 'Напитки'] },
                { name: 'Ланч 3', items: ['Супы', 'Салаты', 'Напитки'] },
                { name: 'Ланч 4', items: ['Главные блюда', 'Напитки', 'Салаты'] },
                { name: 'Ланч 5', items: ['Главные блюда', 'Напитки'] },
            ];

            function validateOrder(selectedItems) {
                let dishes = Object.keys(selectedItems).filter(key => key !== 'Десерты' && selectedItems[key] !== null);
                let text = '';

                if (dishes.length === 0 && selectedItems['Десерты'] === null) {
                    text = 'Ничего не выбрано. Выберите блюда для заказа'
                } else if (!(dishes.includes('Напитки')) && dishes.length > 0) {
                    text = 'Выберите напитки';
                } else if ((dishes.includes('Напитки') || !(selectedItems['Десерты'] === null) && !dishes.includes('Главные блюда'))) {
                    text = 'Выберите главное блюдо';
                }

                if (dishes.includes('Супы') && !dishes.includes('Главные блюда') && !dishes.includes('Салаты')) {
                    text = 'Выберите главное блюдо или салат';
                } else if (dishes.includes('Салаты') && (!dishes.includes('Главные блюда') || !dishes.includes('Супы'))) {
                    text = 'Выберите суп или главное блюдо';
                }

                let result;
                combos.forEach( function (combo) {
                    if (JSON.stringify(dishes) === JSON.stringify(combo.items)) {
                        result = {valid: true, message: 'Все блюда успешно выбраны'};
                    }
                });
                if (result) {
                    return result;
                }
                return {valid: false, message: text};
            }

            document.querySelector('form').addEventListener('submit', function (event) {
                const result = validateOrder(selectedDishes);
                event.preventDefault();
                if (!result.valid) {
                    displayNotification(result.message);
                } else {
                    let delivery_type;
                    if (document.querySelectorAll('input[name="time-type"]:checked')[0].value === 'asap') {
                        delivery_type = 'now';
                    }

                    const formData = new FormData();
                    formData.append('full_name', document.getElementById('full_name').value);
                    formData.append('email', document.getElementById('email').value);
                    formData.append('subscribe', document.getElementById('subscribe').value);
                    formData.append('phone', document.getElementById('phone').value);
                    formData.append('delivery_address', document.getElementById('address').value);
                    formData.append('delivery_type', delivery_type);
                    formData.append('delivery_time', document.getElementById('delivery-time').value);
                    formData.append('comment', document.getElementById('comment').value);
                    formData.append('soup_id', window.localStorage.getItem('selected_soup'));
                    formData.append('main_course_id', window.localStorage.getItem('selected_main-course'));
                    formData.append('salad_id', window.localStorage.getItem('selected_salad'));
                    formData.append('drink_id', window.localStorage.getItem('selected_drink'));
                    formData.append('dessert_id', window.localStorage.getItem('selected_dessert'));

                    console.log(formData);
                    for (let pair of formData.entries()) {
                        console.log(pair[0]+ ', ' + pair[1] + ', ' + typeof pair[1]);
                    }
                    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/orders?api_key=53c010a5-dd23-448e-ba0f-9df5fee7e3e3', {
                        method: 'POST',
                        body: formData
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data['error']) {
                                displayNotification(data['error']);
                            } else {
                                window.localStorage.removeItem('selected_soup');
                                window.localStorage.removeItem('selected_main-course');
                                window.localStorage.removeItem('selected_salad');
                                window.localStorage.removeItem('selected_drink');
                                window.localStorage.removeItem('selected_dessert');
                            }
                        })
                        .catch((error) => {
                            displayNotification(error);
                        })
                }
            })

            document.querySelector('form').addEventListener('reset', function () {
                soup_label.style.display = 'none';
                chosen_soup.style.display = 'none';
                main_label.style.display = 'none';
                chosen_main.style.display = 'none';
                drink_label.style.display = 'none';
                chosen_drink.style.display = 'none';
                salad_label.style.display = 'none';
                chosen_salad.style.display = 'none';
                dessert_label.style.display = 'none';
                chosen_dessert.style.display = 'none';
                totalpriceElement.style.display = 'none';

                nothingSelectedMessages[0].style.display = '';
                nothingSelectedMessages[1].style.display = '';

                selectedDishes = {
                    'Супы': null,
                    'Главные блюда': null,
                    'Салаты': null,
                    'Напитки': null,
                    'Десерты': null,
                };

                window.localStorage.removeItem('selected_soup');
                window.localStorage.removeItem('selected_main-course');
                window.localStorage.removeItem('selected_salad');
                window.localStorage.removeItem('selected_drink');
                window.localStorage.removeItem('selected_dessert');

                totalprice = 0;

                const cards = document.querySelectorAll('.dish-item');
                cards.forEach(function (card) {
                    card.parentNode.removeChild(card);
                });
            });



            function displayNotification(message) {
                const notification = document.getElementById('notification');
                notification.style.opacity = 1;

                const notificationMessage = document.createElement('p');
                notificationMessage.textContent = message
                notification.appendChild(notificationMessage);

                const notificationButton = document.createElement('button');
                notificationButton.innerHTML = 'Хорошо <span>&#x1f394;</span>';
                notificationButton.addEventListener('click', function () {
                    const notification = document.getElementById('notification');
                    notification.innerHTML = '';
                    notification.style.opacity = 0;
                })
                notification.appendChild(notificationButton);
            }
        })
})