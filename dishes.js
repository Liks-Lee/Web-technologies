document.addEventListener('DOMContentLoaded', () => {
    let loc = window.location.pathname;
    let dir = loc.substring(0, loc.lastIndexOf('/'));
    console.log(dir)
    fetch('dishes_list.json')
        .then(response => response.json())
        .then(data => {
            // Сортировка блюд

            const sortedDishes = data['dishes'].sort((a, b) => {
                return a['name'].localeCompare(b['name'], 'ru');
            });

            // Заполнение карточек блюд
            const SectionSoup = document.querySelectorAll('#soup .dish')[0];
            const SectionMainDish = document.querySelectorAll('#main_dish .dish')[0];
            const SectionDrink = document.querySelectorAll('#drink .dish')[0];

            function createCard(dish) {
                const card = document.createElement('div');
                card.classList.add('dish-item');

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

            function populateCards(sectionElement, category) {
            //     sortedDishes.forEach(dish => {
            //         if (dish['category'] === category) {
            //             const card = createCard(dish);
            //             sectionElement.appendChild(card);
            //         }
            //     });
            // }
                if (!sectionElement) {
                    console.error(`Section element not found for category: ${category}`);
                    return;
                }
                
                sortedDishes.forEach(dish => {
                    if (dish.category === category) {
                        const card = createCard(dish);
                        if (!card) {
                            console.error(`Failed to create card for dish: ${JSON.stringify(dish)}`);
                            return;
                        }
                        sectionElement.appendChild(card);
                    }
                });
            }

            populateCards(SectionSoup, 'Супы');
            populateCards(SectionMainDish, 'Главные блюда');
            populateCards(SectionDrink, 'Напитки');

            // Добавление товаров в заказ и подсчет цены
            let totalprice = 0;
            const totalpriceElement = document.getElementById('total_price');

            let selectedDishes = {
                'Супы': null,
                'Главные блюда': null,
                'Напитки': null
            };

            const chosen_soup = document.getElementById('chosen_soup');
            const chosen_main = document.getElementById('chosen_main');
            const chosen_drink = document.getElementById('chosen_drink');
            const soup_label = document.getElementById('soup_label');
            const main_label = document.getElementById('main_label');
            const drink_label = document.getElementById('drink_label');
            const EmptyMessage = document.querySelector('.empty_message');

            // Изначально элементы скрыты
            soup_label.style.display = 'none';
            chosen_soup.style.display = 'none';
            main_label.style.display = 'none';
            chosen_main.style.display = 'none';
            drink_label.style.display = 'none';
            chosen_drink.style.display = 'none';
            totalpriceElement.style.display = 'none';

            const foodpriceElements = document.getElementById('order_summary');
            const priceCount = document.getElementById('price_count');

            function addToOrder(dish) {
                let isUpdated = false;

                if (dish['category'] === 'Супы') {
                    updateCategory('Супы', dish, chosen_soup, soup_label);
                    isUpdated = true;
                } else if (dish['category'] === 'Главные блюда') {
                    updateCategory('Главные блюда', dish, chosen_main, main_label);
                    isUpdated = true;
                } else if (dish['category'] === 'Напитки') {
                    updateCategory('Напитки', dish, chosen_drink, drink_label);
                    isUpdated = true;
                }

                if (isUpdated) {
                    emptyMessage.style.display = 'none';
                }

                foodpriceElements.textContent = 'Стоимость заказа';
                foodpriceElements.style.display = 'block';
                priceCount.textContent = `${totalprice}₽`;
                priceCount.style.display = 'block';

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
            }
        });
});