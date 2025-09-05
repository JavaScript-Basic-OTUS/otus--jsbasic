# Lesson 21

# OTUS

## JavaScript Basic

<!-- s -->

### Работа с асинхронным кодом

#### Цель занятия

Разобрать асинхронность и неблокирующее выполнение кода: стек, очереди задач, callbacks, Promise, async/await, цикл событий и реальный порядок логов.

<!-- v -->

### План занятия

1. Синхронный vs асинхронный код: где возникает «зависание»
2. Модель выполнения: Call Stack, Web APIs, очереди макро- и микрозадач, Event Loop
3. Callbacks: стиль, проблемы, error-first
4. Промисы: состояние, resolve/reject, then/catch/finally, цепочки, статические методы
5. `async/await`: синтаксис, обработка ошибок, параллельные и последовательные операции
6. Event Loop на практике: порядок выполнения логов, макротаски и микротаски

<!-- v -->

### Синхронный код

В JavaScript код выполняется сверху вниз. Если операция занимает много времени, она блокирует выполнение следующих инструкций.

```js
console.log("1");
for (let i = 0; i < 1e9; i++) {} // долгая операция
console.log("2");
```

Вывод: `1`, потом спустя время — `2`. Пользовательский интерфейс «замер».

<!-- v -->

### Асинхронный код

Асинхронность позволяет не блокировать поток. Долгие операции (таймеры, запросы) выполняются в фоне.

```js
console.log("1");
setTimeout(() => console.log("2"), 1000);
console.log("3");
```

Вывод: `1`, затем `3`, через секунду — `2`.

<!-- v -->

### Callbacks

**Callback** — функция, переданная другой функции для вызова позже.

```js
function loadData(cb) {
  setTimeout(() => cb("данные загружены"), 1000);
}

loadData((result) => {
  console.log(result);
});
```

Проблема: вложенность (callback hell).

```js
step1((res1) => {
  step2(res1, (res2) => {
    step3(res2, (res3) => {
      console.log(res3);
    });
  });
});
```

<!-- v -->

### Промисы

**Promise** — объект для работы с асинхронным результатом.

Состояния:

- pending (ожидание)
- fulfilled (успех)
- rejected (ошибка)

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("ok"), 1000);
});

promise.then((result) => console.log(result));
```

<!-- v -->

#### Обработка ошибок

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => reject("ошибка"), 1000);
});

promise
  .then((result) => console.log(result))
  .catch((err) => console.error("Ошибка:", err))
  .finally(() => console.log("Завершено"));
```

<!-- v -->

#### Цепочки промисов

```js
fetch("https://jsonplaceholder.typicode.com/todos/1")
  .then((res) => res.json())
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

<!-- v -->

### Async / Await

Синтаксический сахар над промисами.

```js
async function loadTodo() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/1");
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

loadTodo();
```

<!-- v -->

#### Параллельные запросы

```js
async function loadAll() {
  const [todo, user] = await Promise.all([
    fetch("https://jsonplaceholder.typicode.com/todos/1").then((r) => r.json()),
    fetch("https://jsonplaceholder.typicode.com/users/1").then((r) => r.json()),
  ]);
  console.log(todo, user);
}

loadAll();
```

<!-- v -->

### Event Loop и очередь задач

JavaScript работает в одном потоке. Важно понимать:

- Call Stack (стек вызовов)
- Queue (очередь макротасок)
- Microtask queue (очередь микрозадач)

Пример с порядком выполнения:

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");
```

Порядок: `1`, `4`, `3`, `2`.

<!-- v -->

Еще пример:

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");
```

Вывод: `A`, `D`, `C`, `B`.

<!-- v -->

### Вопросы для самопроверки

1. В чем разница между синхронным и асинхронным кодом?
2. Какие состояния может иметь промис?
3. Чем `async/await` удобнее цепочек `then`?
4. Что выполняется раньше: `setTimeout(fn, 0)` или `Promise.resolve().then(fn)`?
5. Как правильно обрабатывать ошибки в асинхронном коде?

<!-- v -->

### Дополнительные материалы

1. [JavaScript Event Loop Explained](https://developer.mozilla.org/ru/docs/Web/JavaScript/EventLoop)
2. [Promises/A+ Specification](https://promisesaplus.com/)
3. [Async/Await MDN](https://developer.mozilla.org/ru/docs/Learn/JavaScript/Asynchronous/Promises)
4. [You Don’t Know JS Yet: Async & Performance](https://github.com/getify/You-Dont-Know-JS/tree/2nd-ed/async%20%26%20performance)
