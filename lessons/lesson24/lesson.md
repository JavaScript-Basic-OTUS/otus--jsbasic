## OTUS Javascript Basic

### Разбиение кода на модули (чистые функции, внедрение зависимостей, принцип единственной ответственности)

<!--s-->

### Разбиение кода на модули (SRP, чистые функции, DI, низкая связанность)

#### Цели занятия

- Узнать подходы к проектированию частей приложения, которые упрощают поддержку и развитие.
- Разобраться, почему важна низкая связанность и высокая связанность внутри модуля (cohesion), и как этого достичь.
- Научиться выделять чистые функции и выносить побочные эффекты.
- Освоить внедрение зависимостей (Dependency Injection) на функциях и модулях.

<!--v-->

#### Компетенции

- Владение синтаксисом JavaScript (модули `import`/`export`).
- Применение метанавыков для обработки информации и принятия решений в разработке.
- Умение структурировать программы и проектировать API модулей.

<!--v-->

#### Формат и результаты

- Конспект занятия с примерами.
- Длительность: 90 минут.

<!--s-->

### План занятия

1. Зачем делить код и что такое модуль.
2. Модули ECMAScript: `export`/`import`.
3. Принцип единственной ответственности (SRP): определения и примеры.
4. Чистые функции vs побочные эффекты.
5. Низкая связанность (low coupling) и высокая связность (high cohesion).
6. Хранилище: `localStorage`.
7. Мини-рефакторинг «до/после».
8. Практика, итоги, домашнее задание.

<!--s-->

### 1. Что такое модуль и зачем делить код?

Модуль — это логически связанный кусок кода с чёткой зоной ответственности и внешним API (экспортами). Делим код, чтобы:

- уменьшить когнитивную нагрузку (проще понимать части);
- переиспользовать и тестировать;
- изолировать изменения (правка внутри модуля не ломает остальные);
- управлять зависимостями явно.

<!--v-->

Пример «до» (всё в одном месте):

```js
// app.js
const form = document.querySelector("#form");
const list = document.querySelector("#list");

const items = [];

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = form.elements.namedItem("title").value;
  items.push(value);
  list.innerHTML = items.map((x) => `<li>${x}</li>`).join("");
});
```

Проблема: логика ввода и рендер — всё смешано.

<!--v-->

### Коротко о модулях: export/import

Именованные экспорты и импорт:

```js
// math.js — экспортируем ИМЕНОВАННО
export function add(a, b) {
  return a + b;
}

// app.js — импортируем ИМЕНОВАННО
import { add } from "./math.js";
console.log(add(2, 3));
```

<!--v-->

Разделим по ролям (после):

```js
// view.js — модуль представления
// export: функция renderList — отвечает только за отображение списка
export function renderList(container, items) {
  container.replaceChildren(
    Object.assign(document.createElement("ul"), {
      innerHTML: items.map((x) => `<li>${x}</li>`).join(""),
    })
  );
}
```

<!--v-->

```js
// model.js — модуль чистой логики (без DOM и побочных эффектов)
// export: addItem — ЧИСТАЯ функция, возвращает новый массив
export function addItem(model, value) {
  return [...model, value];
}
```

<!--v-->

```js
// app.js — композиция модулей и работа с DOM-событиями
// import: берём renderList из view.js и addItem из model.js
import { renderList } from "./view.js";
import { addItem } from "./model.js";

// ссылки на DOM-элементы и локальное состояние
const form = document.querySelector("#form");
const list = document.querySelector("#list");
let items = [];

// первый рендер пустого списка
renderList(list, items);

// обработчик: читаем ввод → обновляем модель → перерисовываем
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = form.elements.namedItem("title").value; // читаем значение из формы
  items = addItem(items, value); // чистая логика
  renderList(list, items); // отображение
});
```

<!--s-->

### 2. Принцип единственной ответственности (SRP)

Определение: модуль/функция должна иметь одну причину для изменения. Иначе — хрупкость, дублирование, сложность.

<!--v-->

#### Пример SRP

Разделяем расчёт и показ:

```js
// logic.js — чистая логика (export)
export function fullName(first, last) {
  return `${first} ${last}`.trim();
}

// view.js — представление (export)
export function renderName(container, text) {
  container.textContent = text;
}

// app.js — импортируем и «склеиваем»
import { fullName } from "./logic.js";
import { renderName } from "./view.js";

const name = fullName("Иван", "Иванов"); // чистая логика
renderName(document.getElementById("out"), name); // отображение
```

<!--v-->

Антипример SRP:

```js
function submitFormAndRenderAndTrack(form, container, analytics) {
  const value = form.elements.namedItem("email").value;
  analytics.track("submit", { value });
  fetch("https://jsonplaceholder.typicode.com/users/1")
    .then((r) => r.json())
    .then((data) => {
      container.innerHTML = `<p>${data.name}</p>`;
    });
}
```

Здесь и сбор данных формы, и запрос, и рендер, и аналитика.

<!--v-->

Разделим обязанности:

```js
// domain.js (чистая логика)
export function getEmail(form) {
  return form.elements.namedItem("email").value.trim();
}

// api.js (эффект)
// загрузка пользователя по id (GET)
export async function loadUser(id, http) {
  const res = await http(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}

// view.js (представление)
export function renderStatus(container, status) {
  container.textContent = `Ок: ${status}`;
}

// app.js (склейка)
import { getEmail } from "./domain.js";
import { loadUser } from "./api.js";
import { renderStatus } from "./view.js";

const http = window.fetch.bind(window); // внедряем зависимость

async function onSubmit(form, container, analytics) {
  const email = getEmail(form);
  analytics.track("submit", { email });
  const user = await loadUser(1, http); // загрузка пользователя
  renderStatus(container, user.name);
}
```

<!--s-->

### 3. Чистые функции и побочные эффекты

Чистая функция:

- зависит только от входных параметров;
- не меняет внешнее состояние (нет побочных эффектов);
- при одинаковом входе — одинаковый выход.

<!--v-->

Примеры чистых функций:

```js
function sum(a, b) {
  return a + b;
}

function addItem(items, v) {
  return [...items, v];
}

function formatName(user) {
  return `${user.last} ${user.first}`.trim();
}
```

<!--v-->

Побочные эффекты (IO):

- DOM-операции (`innerHTML`, `addEventListener`),
- сеть (`fetch`, `WebSocket`),
- логирование (`console.log`).

Подход: вынести эффекты на «края» приложения, оставить «ядро» чистым.

<!--v-->

До/после:

```js
// до — смешение расчёта и эффекта (лог)
function addAndLog(items, v) {
  const next = [...items, v];
  console.log("Updated:", next);
  return next;
}

// после — чистое ядро + эффект отдельно
function add(items, v) {
  return [...items, v];
} // чистая

function logItems(prefix, items) {
  console.log(prefix, items);
}
```

<!--s-->

### 4. Низкая связанность и высокая связность

Низкая связанность (low coupling) — модули мало знают друг о друге; взаимодействуют через простое, стабильное API.

Высокая связность (high cohesion) — внутри модуля код решает «одну тему» и тесно связан по смыслу.

<!--v-->

#### Пример высокой связности (одна предметная область)

```js
// price.js — все функции про цены/суммы (одна тема)
export function subtotal(items) {
  return items.reduce((sum, p) => sum + p.price * p.qty, 0);
}

export function applyDiscount(total, percent) {
  return total - total * (percent / 100);
}

export function formatCurrency(value) {
  return `${value.toFixed(2)} ₽`;
}
```

```js
// app.js — используем связный модуль как единое целое
import { subtotal, applyDiscount, formatCurrency } from "./price.js";

const items = [
  { price: 100, qty: 2 },
  { price: 50, qty: 1 },
];
const sum = subtotal(items);
const discounted = applyDiscount(sum, 10);
console.log(formatCurrency(discounted));
```

<!--v-->

Пример низкой связанности через интерфейс:

```js
// api/users.js — функция зависит только от интерфейса http(url, init)
export async function getUser(http, id) {
  const res = await http(`https://jsonplaceholder.typicode.com/users/${id}`);
  if (!res.ok) throw new Error("HTTP error");
  return res.json();
}

// app.js — передаём fetch как http
const http = fetch.bind(window);
getUser(http, 1).then(console.log);
```

API `users` зависит только от контракта `http`, а не от глобального `fetch`.

<!--s-->

### 5. Внедрение зависимостей (Dependency Injection)

Идея: зависимости передаём снаружи (в аргументах функции или фабриках), а не «берём» их внутри. Это повышает тестируемость и гибкость.

<!--v-->

DI на функции:

```js
function loadProfile(http, id) {
  return http(`/api/profile/${id}`).then((r) => r.json());
}

// в приложении
const http = (url, init) => fetch(url, init);
loadProfile(http, 1);
```

В тесте можно подменить `http` стабом:

```js
const fakeHttp = async () => ({ json: async () => ({ id: 1, name: "Test" }) });
loadProfile(fakeHttp, 1).then((p) => console.log(p));
```

<!--v-->

DI на модуле (фабрика):

```js
// counter.js — чистая фабрика, состояние в замыкании
export function makeCounter(start = 0) {
  let value = start;
  return {
    inc() {
      value += 1;
      return value;
    },
    dec() {
      value -= 1;
      return value;
    },
    get() {
      return value;
    },
  };
}

// app.js
import { makeCounter } from "./counter.js";
const counter = makeCounter(0);
counter.inc();
```

<!--s-->

### 6. Хранилище: localStorage

Минимум, который нужно знать:

```js
// запись строки
localStorage.setItem("greeting", "hello");

// чтение строки
const text = localStorage.getItem("greeting"); // 'hello' или null

// удаление
localStorage.removeItem("greeting");
```

<!--v-->

Работа с объектами: используем JSON

```js
// сохраняем объект — сначала сериализуем
const user = { id: 1, name: "Alex" };
localStorage.setItem("user", JSON.stringify(user));

// читаем и парсим
const raw = localStorage.getItem("user");
const parsed = raw ? JSON.parse(raw) : null;
```

<!--v-->

Совет: выделяйте функции-обёртки

```js
// storage.js — простые обёртки с JSON и безопасной загрузкой
export function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadJSON(key, fallback = null) {
  const raw = localStorage.getItem(key);
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
```

<!--s-->

### Пример: Список дел с сохранением

Разделим на три файла.

```js
// model.js — чистые функции для списка (без id)
// addTodo — не меняет исходный массив, возвращает новый
export function addTodo(list, text) {
  return [...list, text];
}

// clearTodos — возвращает новый пустой список
export function clearTodos() {
  return [];
}
```

<!--v-->

```js
// storage.js — обёртки над localStorage
// ключ, под которым храним список задач
const KEY = "todos";

// save — сохраняет список как JSON-строку
export function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

// load — читает список и парсит JSON, при ошибке вернёт []
export function load() {
  const raw = localStorage.getItem(KEY);
  try {
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
```

<!--v-->

```html
<!-- index.html — разметка -->
<!-- форма ввода новой задачи и кнопка очистки -->
<form id="todo-form">
  <input id="todo-input" placeholder="Новая задача" />
  <button type="submit">Добавить</button>
  <button type="button" id="todo-clear">Очистить</button>
</form>

<!-- контейнер для списка -->
<ul id="todo-list"></ul>
```

<!--v-->

```js
// view.js — отображение
// простая отрисовка элементов списка в виде <li>
// export: функция, которая принимает контейнер и массив строк
export function renderList(container, list) {
  container.innerHTML = list.map((t) => `<li>${t}</li>`).join("");
}

// renderListWithIndex — отрисовка списка с индексами
// export: функция, которая принимает контейнер и массив строк
export function renderListWithIndex(container, list) {
  container.innerHTML = list
    .map((t, i) => `<li data-index="${i}">${t}</li>`)
    .join("");
}
```

<!--v-->

```js
// app.js — склейка
// import: берём чистые функции модели, обёртки для storage и функцию отображения
import { addTodo, clearTodos } from "./model.js";
import { save, load } from "./storage.js";
import { renderList } from "./view.js";

// ссылки на элементы интерфейса
const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const listEl = document.querySelector("#todo-list");
const clearBtn = document.querySelector("#todo-clear");

// инициализация состояния из localStorage
let todos = load();
renderList(listEl, todos);

// обработка добавления: берём текст → новая версия списка → сохраняем → перерисовываем
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  todos = addTodo(todos, text);
  save(todos);
  renderList(listEl, todos);
  input.value = "";
});

// очистка списка по кнопке
clearBtn.addEventListener("click", () => {
  todos = clearTodos();
  save(todos);
  renderList(listEl, todos);
});
```

<!--v-->

```js
// Дополнительно: если нужен timestamp — внедряем now() как зависимость
export function makeAddWithNow(now) {
  return function addWithNow(list, text) {
    const stamp = now();
    return [...list, `${text} @ ${stamp}`];
  };
}

// пример использования
const addWithNow = makeAddWithNow(() => Date.now());
```

<!--v-->

```js
// Дополнительно: удаление последнего элемента
// model.popLast — возвращает новый список без последнего элемента
export function popLast(list) {
  return list.slice(0, -1);
}

// app.js — добавляем обработчик для кнопки #todo-pop
// const popBtn = document.querySelector('#todo-pop');
// popBtn.addEventListener('click', () => {
//   todos = popLast(todos);
//   save(todos);
//   renderList(listEl, todos);
// });
```

<!--v-->

```js
// Дополнительно: удаление по клику на пункт
// model.removeAt — удаляет элемент по индексу, не мутируя исходный массив
export function removeAt(list, index) {
  return list.filter((_, i) => i !== index);
}

// view.js — добавляем data-index для каждого <li> (пример альтернативной отрисовки)
export function renderListWithIndex(container, list) {
  container.innerHTML = list
    .map((t, i) => `<li data-index="${i}">${t}</li>`)
    .join("");
}

// app.js — делегирование событий: удаляем пункт, по которому кликнули
// listEl.addEventListener('click', (e) => {
//   const li = e.target.closest('li');
//   if (!li) return;
//   const idx = Number(li.dataset.index);
//   todos = removeAt(todos, idx);
//   save(todos);
//   renderListWithIndex(listEl, todos);
// });
```

<!-- s -->

### 7. Мини-рефакторинг: «до/после»

До (смешение всего):

```js
async function onClick(btn, container) {
  btn.disabled = true;
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const user = await res.json();
  container.innerHTML = `<h3>${user.name}</h3>`;
  btn.disabled = false;
}
```

<!--v-->

После (разделение + DI):

```js
// domain/userViewModel.js
export function toUserViewModel(user) {
  return { title: user.name };
}

// ui/render.js
export function renderUser(container, vm) {
  container.innerHTML = `<h3>${vm.title}</h3>`;
}

// app/flows.js
export function makeShowUserFlow({ http, toVM, render }) {
  return async function show(container, id) {
    const user = await (await http(`/api/users/${id}`)).json();
    const vm = toVM(user);
    render(container, vm);
  };
}

// app.js
import { makeShowUserFlow } from "./app/flows.js";
import { toUserViewModel } from "./domain/userViewModel.js";
import { renderUser } from "./ui/render.js";

const http = (url, init) => fetch(url, init);

const showUser = makeShowUserFlow({
  http,
  toVM: toUserViewModel,
  render: renderUser,
});
```

Результат: проще тестировать и менять отдельно представление и сеть.

<!--s-->

### 8. Частые анти-паттерны и как их исправить

#### (плохо) → SRP и разбиение (хорошо)

```js
// плохо — функция делает и валидацию, и запрос, и рендер
async function handle(form, container) {
  const email = form.elements.namedItem("email").value;
  if (!email.includes("@")) {
    container.textContent = "bad email";
    return;
  }
  const res = await fetch("https://jsonplaceholder.typicode.com/users/1");
  const data = await res.json();
  container.textContent = data.name;
}
```

```js
// хорошо — разделение обязанностей
function validateEmail(email) {
  return email.includes("@");
}
function renderStatus(container, text) {
  container.textContent = text;
}
async function loadUser(http, id) {
  return (
    await http(`https://jsonplaceholder.typicode.com/users/${id}`)
  ).json();
}

async function onSubmit(http, form, container) {
  const email = form.elements.namedItem("email").value;
  if (!validateEmail(email)) {
    renderStatus(container, "bad email");
    return;
  }
  const data = await loadUser(http, 1);
  renderStatus(container, data.name);
}
```

<!--v-->

#### Скрытая мутация (плохо) → иммутабельность (хорошо)

```js
// плохо — функция меняет переданный объект
function addTag(user, tag) {
  user.tags.push(tag);
  return user;
}
```

```js
// хорошо — возвращаем новый объект, входной не меняем
function addTag(user, tag) {
  return { ...user, tags: [...user.tags, tag] };
}
```

<!--v-->

#### Зависимость от времени — передавать now() как зависимость

```js
// плохо
function isExpired(expAt) {
  return Date.now() > expAt;
}

// хорошо (DI времени)
function makeIsExpired(now) {
  return (expAt) => now() > expAt;
}
const isExpired = makeIsExpired(() => Date.now());
```

<!--s-->

### Практика

—

<!--s-->

### Итоги

Основные выводы:

- SRP упрощает сопровождение: одна ответственность — одна причина менять код.
- Чистые функции — ядро, эффекты — по краям.
- Низкая связанность достигается через явные интерфейсы и DI.
- Модули `import/export` помогают структурировать код и API.

<!-- v -->

### Домашнее задание: смотрите на портале

– Подготовить мини-проект с выделением модулей: `domain`, `storage`, `api`, `ui`.
– Написать по 2–3 чистые функции и покрыть их тестами (по желанию).

<!--s-->

### Дополнительные материалы

- MDN: Modules — `import`/`export`.
- Статья: Принцип единственной ответственности (SRP).
- Pure functions and side effects (FP intro).
- Внедрение зависимостей без фреймворков (на функциях и фабриках).

<!--s-->

### Вопросы?
