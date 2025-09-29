# Lesson 23

## OTUS Javascript Basic

### Разделение логики и представления

<!--s-->

### Разделение логики и представления (шаблонизация, сервисный слой)

#### Цели занятия

- Разобрать, как разделение кода на составляющие помогает с переиспользованием кода и его поддержкой (на простых примерах с запросами и DOM).
- Узнать подходы: принцип единственной ответственности, представление, шаблонизация, сервисный слой, MVC и увидеть, как они выражаются в коде (используя то, что уже известно: функции, async/await, fetch, DOM, события).
- На практике: маленькие примеры и рефакторинг (без классов — только функции).

<!--v-->

#### **Компетенции:**

- Применение метанавыков для обработки информации и принятия решений.
- Умение структурировать программы.

<!--v-->

### План занятия

- Введение: Зачем разделять — как "сортировка" в коде
- Теория: Определения и подходы.
- Маленькие примеры с запросами и DOM: "до/после"
- Лайвкодинг: Плохой код → шаг за шагом в MVC
- Итоги

<!--s-->

### Введение:

<!--v-->

### Почему разделение — это легко и выгодно?

Вы уже знаете DOM, async/await и fetch, функции и объекты. Но в простых скриптах часто всё смешивается: fetch в обработчике клика + innerHTML там же. Результат — дубли, ошибки при изменении (сломал UI — сломал запрос).

Разделение — как разложить по полочкам: запросы в "сервисах" (функциях), показ — в view. Переиспользуем: тот же fetch для списка и деталей. Поддержка: меняй дизайн — логика остаётся целой.

Мотивация: редактирование и поддержка кода

<!--s-->

### Принцип единственной ответственности

Определение: каждый кусок кода выполняет одну задачу (fetch — только данные, innerHTML — только показ).

<!--v-->

### fetch в обработчике + DOM

```javascript
document.getElementById("btn").addEventListener("click", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await response.json();
  document.getElementById("output").innerHTML = `<div>${JSON.stringify(
    data
  )}</div>`;
});
```

Плохо: данные и отображение смешаны, нет переиспользования, любая ошибка в fetch ломает UI

<!--s-->

### Представление (View)

Только отображение (innerHTML, querySelector). Не знает, откуда данные.

Пример: renderData()

<!--v-->

### renderData смешано с логикой

```javascript
function renderDataAndFetch() {
  fetch("https://jsonplaceholder.typicode.com/users/1")
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("output").innerHTML = `<pre>${JSON.stringify(
        data,
        null,
        2
      )}</pre>`;
    });
}
renderDataAndFetch();
```

Плохо: функция одновременно делает fetch и вставку в DOM, нарушается принцип единственной ответственности

<!--s-->

### Шаблонизация

Определение: генерация HTML из заготовки и данных.

Пример:

<!--v-->

```js
for (let i = 0; i < data.length; i++) {
  html += "<p>" + data[i] + "</p>";
}
```

<!--s-->

### Сервисный слой

Функции для запросов и расчётов.

Пример:

<!--v-->

### сервисный fetch встроен в обработчик

```javascript
document.getElementById("btn").addEventListener("click", async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  console.log(data);
});
```

Плохо: нет переиспользования, каждый обработчик дублирует fetch, тестировать сложно

<!--s-->

### Теория: MVC

Model — данные и сервисы (fetch-функции).

View — показ (шаблоны и DOM).

Controller — связывает (addEventListener → model → view).

Преимущества: структура и масштабируемость.

<!--s-->

### Примеры: "До" и "После"

Используем fetch, addEventListener, innerHTML.

Каждый пример: "плохой" (смешанный) и "хороший" (разделённый).

<!--s-->

### Пример 1: "До"

```html
<button id="btn">Показать</button>
<div id="name"></div>
<script>
  function showName() {
    var name = "Алекс";
    document.getElementById("name").innerHTML = "Имя: " + name;
  }
  document.getElementById("btn").addEventListener("click", showName);
</script>
```

Недостаток: данные и DOM в одном месте.

<!--v-->

### Пример 1: "После"

```javascript
function getName() {
  return "Алекс";
}

function renderName(name) {
  document.getElementById("name").innerHTML = `Имя: ${name}`;
}

document
  .getElementById("btn")
  .addEventListener("click", () => renderName(getName()));
```

Разделение: данные и представление отделены.

<!--v-->

<!--s-->

### Пример 2: "До" — список имён

```javascript
const names = ["Маша", "Петя"];
let html = "<ul>";

for (let i = 0; i < names.length; i++) {
  // Здесь потенциальная уязвимость:
  // если names[i] придёт из ненадёжного источника,
  // вставка через + в innerHTML позволит выполнить HTML/JS
  html += "<li>" + names[i] + "</li>";
}

html += "</ul>";

// Здесь тоже уязвимость: innerHTML вставляет HTML напрямую
document.getElementById("list").innerHTML = html;
```

Недостаток: небезопасно.

<!--v-->

### Пример 2: "После" — шаблон

```javascript
const names = ["Маша", "Петя"];

function renderListSafe(items, containerId) {
  const container = document.getElementById(containerId);

  // создаём новый ul
  const ul = document.createElement("ul");

  items.map((name) => {
    const li = document.createElement("li");
    li.textContent = name; // безопасно
    ul.appendChild(li);
  });

  // заменяем старое содержимое новым ul
  container.replaceChildren(ul);
}

renderListSafe(names, "list");
```

безопаснее

<!--s-->

### Пример 3: "До" — расчёт суммы

```javascript
const prices = [100, 200];
let sum = 0;
for (let i = 0; i < prices.length; i++) {
  sum += prices[i];
}
document.getElementById("total").innerText = "Сумма: " + sum;
```

Недостаток: логика и DOM смешаны.

<!--v-->

### Пример 3: "После" — сервис

```javascript
function calculateSum(prices) {
  return prices.reduce((total, price) => total + price, 0);
}
function renderTotal(sum) {
  document.getElementById("total").innerText = `Сумма: ${sum}`;
}
renderTotal(calculateSum([100, 200]));
```

Функция расчёта выделена в сервис.

<!--s-->

### Пример 4: "До" — fetch в событии

```html
<button id="btn">Загрузить</button>
<div id="user"></div>
<script>
  document.getElementById("btn").addEventListener("click", function () {
    fetch("https://jsonplaceholder.typicode.com/users/1")
      .then((r) => r.json())
      .then((user) => {
        document.getElementById("user").innerHTML = user.name;
      });
  });
</script>
```

Недостаток: асинхронный код и DOM в обработчике.

<!--v-->

### Пример 4: "После" — сервис + View

```javascript
// Сервис: получает данные пользователя
async function getUser(id) {
  const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("Ошибка запроса");
  return await res.json();
}

// View: безопасно отображает данные в контейнере
function renderUser(user, containerId) {
  document.getElementById(containerId).textContent = user.name;
}

// Универсальный обработчик для кнопок
async function handleClick(id, containerId) {
  try {
    const user = await getUser(id);
    renderUser(user, containerId);
  } catch (err) {
    console.error(err);
  }
}

// Пример привязки к кнопке
document
  .getElementById("btn")
  .addEventListener("click", () => handleClick(1, "user"));
```

Код становится чище и надёжнее.

<!--s-->

### Практика

<!--s-->

### Итоги и домашнее задание

Основные выводы:

- SRP, View, шаблоны, сервисы и MVC разделяют fetch и DOM.
- Переиспользование: общие функции для разных мест.

<!-- v -->

### Домашнее задание: Смотрите на портале

<!--s-->

### Дополнительные материалы

- SRP и SOLID в JavaScript
- MVC без фреймворков
- Шаблоны в JavaScript

<!--s-->

### Вопросы?
