import { getMap } from './map.js';
import { isUserInputCorrect } from './checkUserInput.js';


const apiKey = 'f623081260f363d8e8a15fe44e841483';

const form = document.querySelector('#main-form');
const inputLatitude = document.querySelector('#latitude');
const inputLongitude = document.querySelector('#longitude');
const cardsContainer = document.querySelector('.cards');

// Функция для получения данных с API
async function fetchWeatherData(latitude, longitude) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=ru&appid=${apiKey}`;
    const response = await fetch(url);
    return await response.json();
}

// Функция для создания HTML карточки
function createCard(data, mapId) {
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}.png`;

    return `
        <div class="results">
            <div class="text-information">
                <p>${data.name}</p>
                <p>${Math.round(data.main.temp)} °C</p>
                <img src="${iconUrl}" alt="${data.weather[0].description}" />
            </div>
            <div class='other-info'>
                <p><span>Ощущается как</span> <span>${Math.round(data.main.feels_like)} °C</span></p>
                <p><span>Скорость ветра:</span> <span>${data.wind.speed} м/с</span></p>
                <p><span>Влажность:</span> <span>${data.main.humidity} %</span></p>
            </div>
            <div class="map-container">
                <div id="${mapId}" style="width:500px; height:400px"></div>
            </div>
            <button class="delete-card">Удалить</button>
        </div>
    `;
}

// Функция для рендеринга карточки и ограничения их количества
function renderCard(html) {
    const allCards = cardsContainer.querySelectorAll('.results');
    if (allCards.length >= 3) {
        alert('Перед добавлением удалите виджет')
        return
    }
    cardsContainer.insertAdjacentHTML('beforeend', html);
}

// Функция для добавления обработчика удаления карточки
function attachDeleteHandler(card) {
    const deleteButton = card.querySelector('.delete-card');
    deleteButton.addEventListener('click', () => {
        card.remove();
    });
}

// Функция для обработки ошибок
function handleError(message) {
    alert(message);
}

// Основная логика формы
form.onsubmit = async function (e) {
    e.preventDefault();

    const latitude = inputLatitude.value.trim();
    const longitude = inputLongitude.value.trim();
    console.log('test')
    // Проверяем пользовательский ввод
    if (!isUserInputCorrect(longitude, latitude)) {
        handleError('Некорректно введены данные');
        return;
    }

    try {
        const data = await fetchWeatherData(latitude, longitude);
        console.log(data)
        if (data.message) {
            handleError('Ошибка: данные не найдены');
            return;
        }

        const mapId = `map-${Date.now()}`; // так присваивается айдишник для карты
        const cardHtml = createCard(data, mapId);

        renderCard(cardHtml);

        const currentCard = cardsContainer.lastElementChild;
        attachDeleteHandler(currentCard);

        getMap(latitude, longitude, mapId);
    } catch (error) {
        handleError('Ошибка загрузки данных');
        console.error(error);
    }
};
