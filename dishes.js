document.addEventListener('DOMContentLoaded', () => {
    fetch('dishes_list.json')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд по первой букве
            const sortedDishes = data['dishes'].sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            // Заполнение карточек блюд, используя айди
            const SectionSoup = document.querySelectorAll('#soup .dishes-grid')[0];
            const SectionMainDish = document.querySelectorAll('#main_dish .dishes-grid')[0];
            const SectionDrink = document.querySelectorAll('#drink .dishes-grid')[0];
            const SectionSalad = document.querySelectorAll('#salad .dishes-grid')[0];
            const SectionCakes = document.querySelectorAll('#cakes .dishes-grid')[0];

            function createCard(dish) {
                const card = document.createElement('div');
                card.classList.add('dish-item');
                card.dataset.type = dish.type

                const img = document.createElement('img');
                img.src = dish.image;
                img.alt = dish.name;

                const price = document.createElement('p');
                price.classList.add('price');
                price.textContent = `${dish.price}₽`;

                const dishName = document.createElement('p');
                dishName.classList.add('price');
                dishName.textContent = dish.name;

                const volume = document.createElement('p');
                volume.classList.add('ml_gr');
                volume.textContent = dish.volume;

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
                sortedDishes.forEach(dish => {
                    if (dish['category'] === category) {
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
            populateCards(SectionCakes, 'Десерты'); 

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
            const chosen_cakes = document.getElementById('chosen_cakes');
            const soup_label = document.getElementById('soup_label');
            const main_label = document.getElementById('main_label');
            const drink_label = document.getElementById('drink_label');
            const salad_label = document.getElementById('salad_label');
            const cakes_label = document.getElementById('cakes_label');
            const emptyMessage = document.querySelector('.form-section p:nth-of-type(1)');

            // Изначально элементы скрыты
            soup_label.style.display = 'none';
            chosen_soup.style.display = 'none';
            main_label.style.display = 'none';
            chosen_main.style.display = 'none';
            drink_label.style.display = 'none';
            chosen_drink.style.display = 'none';
            chosen_salad.style.display = 'none';
            salad_label.style.display = 'none';
            chosen_cakes.style.display = 'none';
            cakes_label.style.display = 'none';
            totalpriceElement.style.display = 'none';

            const foodpriceElements = document.getElementById('order_summary');
            const priceCount = document.getElementById('price_count')

            function addToOrder(dish) {
                let isUpdated = false;

                if (dish['category'] === 'Супы') {
                    updateCategory('Супы', dish, chosen_soup, soup_label);
                    isUpdated = true;
                } 
                else if (dish['category'] === 'Главные блюда') {
                    updateCategory('Главные блюда', dish, chosen_main, main_label);
                    isUpdated = true;
                } 
                else if (dish['category'] === 'Напитки') {
                    updateCategory('Напитки', dish, chosen_drink, drink_label);
                    isUpdated = true;
                }
                else if (dish['category'] === 'Салаты') {
                    console.log(salad_label)
                    console.log(chosen_salad)
                    updateCategory('Салаты', dish, chosen_salad, salad_label);
                    isUpdated = true;
                }
                else if (dish['category'] === 'Десерты') {
                    console.log(cakes_label)
                    console.log(chosen_cakes)
                    updateCategory('Десерты', dish, chosen_cakes, cakes_label);
                    isUpdated = true;
                }

                if (isUpdated) {
                    emptyMessage.style.display = 'none';
                }

                totalpriceElement.textContent = `Стоимость заказа: ${totalprice}₽`;
                totalpriceElement.style.display = 'block';

                showEmptyCategories();
            }

            function updateCategory(category, dish, chosenElement, labelElement) {
                // Если блюдо из этой категории уже выбрано, вычитаем его цену
                if (selectedDishes[category] !== null) {
                    totalprice -= selectedDishes[category].price;
                }

                // Обновляем выбранное блюдо
                selectedDishes[category] = dish;
                chosenElement.textContent = `${dish['name']} ${dish['price']}₽`;
                chosenElement.style.display = 'block';
                labelElement.style.display = 'block';

                // Добавляем цену выбранного блюда
                totalprice += dish['price'];
            }

            // Показываем пустые категории
            function showEmptyCategories() {
                console.log(selectedDishes)
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
                    chosen_cakes.textContent = 'Блюдо не выбрано';
                    cakes_label.style.display = 'block';
                    chosen_cakes.style.display = 'block';
                }
            }
            
            //* Написать фильтровку */

            const SoupFilter = document.querySelectorAll('.soup-filter');
            const MainFilter = document.querySelectorAll('.main_dish-filter');
            const DrinkFilter = document.querySelectorAll('.drink-filter');
            const SaladFilter = document.querySelectorAll('.salad-filter');
            const CakesFilter = document.querySelectorAll('.cakes-filter');
            
            function DishFilter(filters){
                filters.forEach(filter => {
                    filter.addEventListener('click', function(e) {
                        e.preventDefault();

                        const className = filter.classList[0].split('-')[0];
                        const dishes = document.querySelectorAll(`#${className} .dish-item`);

                        if (!filter.classList.contains('active')) {
                            filters.forEach(f => f.classList.remove('active'));
                            filter.classList.add('active');
                            const type = filter.dataset.type;
                            dishes.forEach(dish => {
                                if (dish.dataset.type === type) {
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

            DishFilter(SoupFilter);
            DishFilter(MainFilter);
            DishFilter(DrinkFilter);
            DishFilter(SaladFilter);
            DishFilter(CakesFilter);
            
        });
});