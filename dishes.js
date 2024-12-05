document.addEventListener('DOMContentLoaded', () => {
    fetch('https://edu.std-900.ist.mospolytech.ru/labs/api/dishes')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд по первой букве
            const sortedDishes = data.sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            // Заполнение карточек блюд, используя айди
            const SectionSoup = document.querySelectorAll('#soup .dishes-grid')[0];
            const SectionMainDish = document.querySelectorAll('#main .dishes-grid')[0];
            const SectionDrink = document.querySelectorAll('#drink .dishes-grid')[0];
            const SectionSalad = document.querySelectorAll('#salad .dishes-grid')[0];
            const SectionDessert = document.querySelectorAll('#dessert .dishes-grid')[0];

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
                dishName.classList.add('price');
                dishName.textContent = dish.name;

                const volume = document.createElement('p');
                volume.classList.add('ml_gr');
                volume.textContent = dish.count;

                const buttonDiv = document.createElement('div');
                const button = document.createElement('button');
                button.textContent = 'Добавить';
                button.className = 'add-button';
                buttonDiv.appendChild(button);

                card.appendChild(img);
                card.appendChild(price);
                card.appendChild(dishName);
                card.appendChild(volume);
                card.appendChild(buttonDiv);

                // Функционал кнопки
                button.addEventListener('click', () => {
                    addToOrder(dish);
                });

                return card;
            }


            // Отвечает за заполнение карточек блюд в определенную секцию на основе заданной категории
            function populateCards(sectionElement, category) {
                const categoryCompare = {
                    'soup': 'Супы',
                    'main-course': 'Главные блюда',
                    'salad': 'Салаты',
                    'drink': 'Напитки',
                    'dessert': 'Десерты'
                }

                sortedDishes.forEach(dish => {
                    if (categoryCompare[dish['category']] === category) {
                        const card = createCard(dish);
                        sectionElement.appendChild(card);
                    }
                });
            }
            
            // Вызов функции
            populateCards(SectionSoup, 'Супы');
            populateCards(SectionMainDish, 'Главные блюда');
            populateCards(SectionDrink, 'Напитки');
            populateCards(SectionSalad, 'Салаты');
            populateCards(SectionDessert, 'Десерты'); 

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
            
            const combos = [
                { name: 'Ланч 1', items: ['Супы', 'Главные блюда', 'Салаты', 'Напитки'] },
                { name: 'Ланч 2', items: ['Супы', 'Главные блюда', 'Напитки'] },
                { name: 'Ланч 3', items: ['Супы', 'Салаты', 'Напитки'] },
                { name: 'Ланч 4', items: ['Главные блюда', 'Салаты', 'Напитки'] },
                { name: 'Ланч 5', items: ['Главные блюда', 'Напитки'] },
            ];

            function validateOrder(selectedItems) {
                let dishes = Object.keys(selectedItems).filter(key => key !== 'Десерты' && selectedItems[key] !== null);
                let text = '';

                if (dishes.length === 0 && selectedItems['Десерты'] === null) {
                    text = 'Ничего не выбрано. Выберите блюда для заказа'
                } else if (!(dishes.includes('Напитки')) && dishes.length > 0) {
                    text = 'Выберите drink';
                } else if ((dishes.includes('Напитки') || !(selectedItems['Десерты'] === null) && !dishes.includes('Главные блюда'))) {
                    text = 'Выберите main-course';
                }

                if (dishes.includes('Супы') && !dishes.includes('Главные блюда') && !dishes.includes('Салаты')) {
                    text = 'Выберите main-course или salad';
                } else if (dishes.includes('Салаты') && (!dishes.includes('Главные блюда') || !dishes.includes('Супы'))) {
                    text = 'Выберите soup или main-course';
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

            const order_info = document.getElementById('order_info');
            const msg = document.getElementById('order_message');
            msg.style.display = 'none';
            order_info.style.display = 'none';



            function addToOrder(dish) {
                if (dish['category'] === 'soup') {
                    updateCategory('Супы', dish);
                    window.localStorage.setItem('selected_soup', dish['id']);
                } else if (dish['category'] === 'main-course') {
                    updateCategory('Главные блюда', dish);
                    window.localStorage.setItem('selected_main-course', dish['id']);
                } else if (dish['category'] === 'salad') {
                    updateCategory('Салаты', dish);
                    window.localStorage.setItem('selected_salad', dish['id']);
                }
                else if (dish['category'] === 'drink') {
                    updateCategory('Напитки', dish);
                    window.localStorage.setItem('selected_drink', dish['id']);
                } else if (dish['category'] === 'dessert') {
                    updateCategory('Десерты', dish);
                    window.localStorage.setItem('selected_dessert', dish['id']);
                }

                totalpriceElement.textContent = `Стоимость заказа: ${totalprice}₽`;
                totalpriceElement.style.display = 'block';

                order_info.style.display = '';

                const result = validateOrder(selectedDishes);
                if (result.valid) {
                    msg.style.display = '';
                    console.log(msg.style);
                }
            }

            function fromLocalStorage() {
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
                });
            }

            fromLocalStorage();

            function updateCategory(category, dish) {
                    // Если блюдо из этой категории уже выбрано, вычитаем его цену
                    if (selectedDishes[category] !== null) {
                        totalprice -= selectedDishes[category]['price'];
                    }

                    // Обновляем выбранное блюдо
                    selectedDishes[category] = dish;

                    // Добавляем цену выбранного блюда
                    totalprice += dish['price'];
            }

            const soupFilters = document.querySelectorAll('.soup-filter');
            const mainFilters = document.querySelectorAll('.main-filter');
            const drinkFilters = document.querySelectorAll('.drink-filter');
            const saladFilters = document.querySelectorAll('.salad-filter');
            const dessertFilters = document.querySelectorAll('.dessert-filter');

            function addFiltersToCategory(filters) {
                filters.forEach(filter => {
                    filter.addEventListener('click', function(e) {
                        e.preventDefault();

                        const className = filter.classList[0].split('-')[0];
                        const dishes = document.querySelectorAll(`#${className} .dish-item`);

                        if (!filter.classList.contains('active')) {
                            filters.forEach(f => f.classList.remove('active'));
                            filter.classList.add('active');
                            const kind = filter.dataset.kind;
                            dishes.forEach(dish => {
                                if (dish.dataset.kind === kind) {
                                    dish.classList.remove('hidden');
                                } else {
                                    dish.classList.add('hidden');
                                }
                            });
                        } else {
                            filter.classList.remove('active');
                            dishes.forEach(dish => dish.classList.remove('hidden'));
                        }
                    });
                });
            }

            addFiltersToCategory(soupFilters);
            addFiltersToCategory(mainFilters);
            addFiltersToCategory(saladFilters);
            addFiltersToCategory(drinkFilters);
            addFiltersToCategory(dessertFilters);
        });
});
