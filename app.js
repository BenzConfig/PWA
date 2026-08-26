if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('Service Worker has been registered!'))
        .catch(err => console.log('Service Worker returned an error! ', err));
}

const offlineIndicator = document.getElementById('offlineIndicator');

function updateOnlineStatus() {
    if (navigator.onLine) {
        offlineIndicator.style.display = 'none';
    } else {
        offlineIndicator.style.display = 'block';
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

updateOnlineStatus();

function calculateFuel(distance, cityRate, roadRate, cityProp = 0.3, roadProp = 0.7) {
    const cityDistance = distance * cityProp;
    const roadDistance = distance * roadProp;
    const cityFuel = cityDistance * cityRate / 100;
    const roadFuel = roadDistance * roadRate / 100;
    const totalFuel = cityFuel + roadFuel;
    return { totalFuel, cityDistance, roadDistance, cityFuel, roadFuel };
}

function typeWriter(element, text, delay = 15) {
    element.innerHTML = '';
    let i = 0;

    function type() {
        if (i < text.length) {
            const char = text.charAt(i);
            element.innerHTML += char === "\n" ? "<br>" : char;
            i++;
            setTimeout(type, delay);
        }
    }
    type();
}

let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) event.preventDefault();
    lastTouchEnd = now;
}, false);

const defaultProportions = { city: 30, road: 70 };

const summerProportions =
    JSON.parse(localStorage.getItem('summerProportions')) ||
    { ...defaultProportions };

const winterProportions =
    JSON.parse(localStorage.getItem('winterProportions')) ||
    { ...defaultProportions };

const summerRates =
    JSON.parse(localStorage.getItem('summerRates')) ||
    { city: 11.5, road: 8.5 };

const winterRates =
    JSON.parse(localStorage.getItem('winterRates')) ||
    { city: 13.8, road: 10.2 };

const numericInputs = document.querySelectorAll('input[type="number"]');

function validateNumberInput(event) {
    const input = event.target;
    const value = input.value;

    if (/^\d*\.?\d*$/.test(value) && value !== '.' && value !== '') {
        input.classList.remove('error');
    } else {
        input.classList.add('error');
    }
}

numericInputs.forEach(input => {
    input.addEventListener('input', validateNumberInput);
});

document.addEventListener('click', function(event) {
    numericInputs.forEach(input => {
        input.classList.remove('error');
    });
});

function calcSummer() {
    const input = document.getElementById("summerDistance").value;
    const output = document.getElementById("summerResult");

    if (!input || isNaN(input)) {
        typeWriter(output, "Введите значение пробега");
        return;
    }

    const distance = Number(input);
    const cityRate = summerRates.city;
    const roadRate = summerRates.road;
    const cityProp = summerProportions.city / 100;
    const roadProp = summerProportions.road / 100;

    const { totalFuel, cityDistance, roadDistance } = calculateFuel(distance, cityRate, roadRate, cityProp, roadProp);

    const text = `Общий расход ${totalFuel.toFixed(2)} л

Детализация
Пробег по городу ${cityDistance.toFixed(2)} км
Пробег по трассе ${roadDistance.toFixed(2)} км

Нормы расхода
Город ${cityRate} л на 100 км
Трасса ${roadRate} л на 100 км

Пропорции
Городской режим ${Math.round(cityProp * 100)} %
Трассовый режим ${Math.round(roadProp * 100)} %`;

    typeWriter(output, text, 15);
}

function calcWinter() {
    const input = document.getElementById("winterDistance").value;
    const output = document.getElementById("winterResult");

    if (!input || isNaN(input)) {
        typeWriter(output, "Введите значение пробега");
        return;
    }

    const distance = Number(input);
    const cityRate = winterRates.city;
    const roadRate = winterRates.road;
    const cityProp = winterProportions.city / 100;
    const roadProp = winterProportions.road / 100;

    const { totalFuel, cityDistance, roadDistance } = calculateFuel(distance, cityRate, roadRate, cityProp, roadProp);

    const text = `Общий расход ${totalFuel.toFixed(2)} л

Детализация
Пробег по городу ${cityDistance.toFixed(2)} км
Пробег по трассе ${roadDistance.toFixed(2)} км

Нормы расхода
Город ${cityRate} л на 100 км
Трасса ${roadRate} л на 100 км

Пропорции
Городской режим ${Math.round(cityProp * 100)} %
Трассовый режим ${Math.round(roadProp * 100)} %`;

    typeWriter(output, text, 15);
}

function openSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-background';

    const container = document.createElement('div');
    container.className = 'modal-container';

    // Заголовок
    const title = document.createElement('div');
    title.innerText = 'Настройки';
    title.style.fontSize = '17px';
    title.style.fontWeight = '400';
    title.style.marginBottom = '8px';
    title.style.textAlign = 'center';

    container.appendChild(title);


    // --------------------------------------------------
    // Создание секции режима
    // --------------------------------------------------

    function createModeSection(titleText, rates, proportions) {

        const section = document.createElement('div');
        section.style.marginTop = '4px';

        // Название режима
        const modeTitle = document.createElement('div');
        modeTitle.innerText = titleText;
        modeTitle.style.fontSize = '15px';
        modeTitle.style.fontWeight = '400';
        modeTitle.style.marginBottom = '2px';
        modeTitle.style.color = '#FFFFFF';
        modeTitle.style.textAlign = 'center';
        
        section.appendChild(modeTitle);


        // Заголовок "Нормы расхода"
        const ratesTitle = document.createElement('div');
        ratesTitle.innerText = 'Нормы расхода';
        ratesTitle.style.fontSize = '12px';
        ratesTitle.style.color = '#B2B2B2';
        ratesTitle.style.marginTop = '4px';
        ratesTitle.style.textAlign = 'center';
        
        section.appendChild(ratesTitle);


        // Создание поля
        function createInput(labelText, value, type) {

            const wrapper = document.createElement('div');

            wrapper.style.display = 'flex';
            wrapper.style.flexDirection = 'column';
            wrapper.style.width = '100%';
            wrapper.style.marginTop = '2px';


            const label = document.createElement('label');

            label.innerText = labelText;
            label.style.fontSize = '12px';
            label.style.color = '#B2B2B2';
            label.style.marginBottom = '3px';

            wrapper.appendChild(label);


            const input = document.createElement('input');

            input.type = 'number';
            input.value = value;
            input.dataset.type = type;

            input.style.width = '100%';
            input.style.marginTop = '0';
            input.style.padding = '6px 8px';
            input.style.borderRadius = '8px';
            input.style.border = '1px solid #333333';
            input.style.backgroundColor = '#1F1F1F';
            input.style.color = '#B2B2B2';
            input.style.boxSizing = 'border-box';

            wrapper.appendChild(input);

            return wrapper;
        }


        // Нормы
        section.appendChild(
            createInput('Город', rates.city, 'cityRate')
        );

        section.appendChild(
            createInput('Трасса', rates.road, 'roadRate')
        );


        // Заголовок "Пропорции"
        const proportionsTitle = document.createElement('div');

        proportionsTitle.innerText = 'Пропорции';
        proportionsTitle.style.fontSize = '12px';
        proportionsTitle.style.color = '#B2B2B2';
        proportionsTitle.style.marginTop = '4px';
        proportionsTitle.style.textAlign = 'center';
        
        section.appendChild(proportionsTitle);


        // Пропорции
        const cityPropInput = createInput(
            'Город',
            proportions.city,
            'cityProp'
        );

        const roadPropInput = createInput(
            'Трасса',
            proportions.road,
            'roadProp'
        );


        section.appendChild(cityPropInput);
        section.appendChild(roadPropInput);


        // Автоматическое соотношение 100%
        const cityInput = cityPropInput.querySelector('input');
        const roadInput = roadPropInput.querySelector('input');


        cityInput.addEventListener('input', () => {

            let value = parseInt(cityInput.value) || 0;

            if (value > 100) value = 100;
            if (value < 0) value = 0;

            cityInput.value = value;
            roadInput.value = 100 - value;
        });


        roadInput.addEventListener('input', () => {

            let value = parseInt(roadInput.value) || 0;

            if (value > 100) value = 100;
            if (value < 0) value = 0;

            roadInput.value = value;
            cityInput.value = 100 - value;
        });


        return section;
    }


    // --------------------------------------------------
    // Летний режим
    // --------------------------------------------------

    const summerSection = createModeSection(
        'Летний',
        summerRates,
        summerProportions
    );

    container.appendChild(summerSection);


    // Разделитель
    const separator = document.createElement('div');

    separator.style.height = '1px';
    separator.style.backgroundColor = '#333333';
    separator.style.margin = '10px 0';

    container.appendChild(separator);


    // --------------------------------------------------
    // Зимний режим
    // --------------------------------------------------

    const winterSection = createModeSection(
        'Зимний',
        winterRates,
        winterProportions
    );

    container.appendChild(winterSection);


    // --------------------------------------------------
    // Кнопки
    // --------------------------------------------------

    const btnWrapper = document.createElement('div');

    btnWrapper.style.display = 'flex';
    btnWrapper.style.justifyContent = 'flex-end';
    btnWrapper.style.marginTop = '8px';


    const btnClose = document.createElement('button');

    btnClose.innerText = 'Закрыть';
    btnClose.className = 'modal-close';

    btnClose.addEventListener('click', () => {

        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }

    });


    const btnSave = document.createElement('button');

    btnSave.innerText = 'Сохранить';
    btnSave.className = 'modal-close';
    btnSave.style.marginLeft = '8px';


    btnSave.addEventListener('click', () => {

        // -----------------------------
        // Лето
        // -----------------------------

        const summerInputs = summerSection.querySelectorAll('input');

        summerRates.city =
            parseFloat(summerInputs[0].value) || summerRates.city;

        summerRates.road =
            parseFloat(summerInputs[1].value) || summerRates.road;

        summerProportions.city =
            parseInt(summerInputs[2].value) || 0;

        summerProportions.road =
            parseInt(summerInputs[3].value) || 0;


        // -----------------------------
        // Зима
        // -----------------------------

        const winterInputs = winterSection.querySelectorAll('input');

        winterRates.city =
            parseFloat(winterInputs[0].value) || winterRates.city;

        winterRates.road =
            parseFloat(winterInputs[1].value) || winterRates.road;

        winterProportions.city =
            parseInt(winterInputs[2].value) || 0;

        winterProportions.road =
            parseInt(winterInputs[3].value) || 0;


        // -----------------------------
        // Сохранение
        // -----------------------------

        localStorage.setItem(
            'summerRates',
            JSON.stringify(summerRates)
        );

        localStorage.setItem(
            'winterRates',
            JSON.stringify(winterRates)
        );

        localStorage.setItem(
            'summerProportions',
            JSON.stringify(summerProportions)
        );
        
        localStorage.setItem(
            'winterProportions',
            JSON.stringify(winterProportions)
        );
        
        // Закрываем окно

        if (modal && modal.parentNode) {
            modal.parentNode.removeChild(modal);
        }

    });


    btnWrapper.appendChild(btnClose);
    btnWrapper.appendChild(btnSave);

    container.appendChild(btnWrapper);


    // --------------------------------------------------
    // Показываем окно
    // --------------------------------------------------

    modal.appendChild(container);
    document.body.appendChild(modal);
}

document.getElementById('btnSettings').addEventListener('click', () => {
    openSettingsModal();
});

document.getElementById('btnAbout').addEventListener('click', function() { 
    const modal = document.createElement('div');
    modal.className = 'modal-background';

    const container = document.createElement('div');
    container.className = 'modal-container';

    const leftBlock = document.createElement('div');
    leftBlock.className = 'about-left';
    const img = document.createElement('img');
    img.src = 'res/logo_about.svg';
    img.className = 'modal-logo';
    leftBlock.appendChild(img);

    const rightBlock = document.createElement('div');
    rightBlock.className = 'about-right';

    const title = document.createElement('div');
    title.innerText = 'BenzConfig 2.5';
    title.className = 'about-title';
    rightBlock.appendChild(title);

    // Лицензия
    const license = document.createElement('div');
    license.innerHTML = 'Лицензия <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">www.gnu.org</a>';
    license.className = 'about-text';
    rightBlock.appendChild(license);

    // Сайт
    const materials = document.createElement('div');
    materials.innerHTML = 'Сайт <a href="https://soloist.ai/nrg" target="_blank">www.soloist.ai/nrg</a>';
    materials.className = 'about-text';
    rightBlock.appendChild(materials);

    // Исходник
    const source = document.createElement('div');
    source.innerHTML = 'Исходник <a href="https://github.com/benzenergy/BenzConfig-PWA" target="_blank">www.github.com</a>';
    source.className = 'about-text';
    rightBlock.appendChild(source);

    // Копирайт
    const copyright = document.createElement('div');
    copyright.innerText = '© 2025 NRG Software';
    copyright.className = 'about-copyright';
    rightBlock.appendChild(copyright);

    const content = document.createElement('div');
    content.className = 'about-content';
    content.appendChild(leftBlock);
    content.appendChild(rightBlock);

    container.appendChild(content);

    const closeBtn = document.createElement('button');
    closeBtn.innerText = "Закрыть";
    closeBtn.className = 'modal-close';
    closeBtn.addEventListener('click', () => document.body.removeChild(modal));
    container.appendChild(closeBtn);

    modal.appendChild(container);
    document.body.appendChild(modal);
});
