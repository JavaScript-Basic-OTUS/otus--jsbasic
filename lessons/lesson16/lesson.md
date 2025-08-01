---
title: Занятие 16
description: Базовое использование API и JavaScript. Как работать с сетевыми ресурсами
---

# OTUS

## Javascript Basic

<!--v-->

### Вопросы?

<!--s-->

### Базовое использование API и JavaScript.

#### Как работать с сетевыми ресурсами

<!-- s -->

### Асинхронный код - минимум для работы

_Подробнее будет в третьем модуле на занятии про асинхронный код_

<!-- v -->

#### JS - ОДНОПОТОЧНЫЙ ЯЗЫК

- Отрисовка DOM
- Обработка пользовательского ввода
- Выполнение JS кода

<!-- v -->

#### [ОЧЕРЕДЬ ЗАДАЧ В JS](https://developer.mozilla.org/ru/docs/Web/JavaScript/EventLoop)

- Среда выполнения содержит очередь событий (список событий, подлежащих обработке)
- Каждое событие ассоциируется с некоторой функцией.
- Каждый вызов функции добавляет запись в стек
- При завершении функции запись изымается из стека
- Когда стек освобождается, событие извлекается из очереди и обрабатывается (функция вызывается).

<!-- v -->

На бытовом уровне мы могли бы это объяснить так...

<!-- v -->

[Демонстрация](https://codesandbox.io/s/github/vvscode/otus--javascript-basic/tree/lesson04/lessons/lesson04/code/singleThreadInJs?file=/index.html)

<!-- v -->

Поэтому операции, которые занимают длительное (больше 50 ms) операции стараются

- переложить на внешнего исполнителя
- отложить исполнение и разбить на части

<!-- v -->

Так появляется **асинхронный код** - когда результат вы получаете не немедленно, а отложено во времени.

<!-- v -->

Как работать с таким асинхронным кодом? Как это выглядит?

<!-- v -->

```js [1-30]
// работа с callback-функциями
const x = 2;
// результат мы можем обработать в callback-функции
calculateSomethingAsyncWithCallback(x, (result) => {
  console.log(result);
});
// в node.js было принято
calculateSomethingAsyncWithCallback(x, (error, result) => {
  if (error) {
    return console.error(error);
  }
  // ...
});
```

<!-- v -->

```js [1-30]
// работа с callback-функциями
const x = 2;
calculateSomethingAsyncWithCallback(x, (result) => {
  calculateSomethingElseAsyncWithCallback(result, (secondResult) => {
    console.log(result);
  });
});
```

<!-- v -->

### Вопросы?

<!-- v -->

Для решения проблемы [callback hell](http://callbackhell.com/) ввели интерфейс [Promise](https://developer.mozilla.org/ru/docs/Web/JavaScript/Guide/Ispolzovanie_promisov).

<!-- v -->

```js [1-30]
function doSomething() {
  return new Promise((resolve, reject) => {
    console.log("Готово.");
    // Успех в половине случаев.
    if (Math.random() > 0.5) {
      resolve("Успех");
    } else {
      reject("Ошибка");
    }
  });
}

const promise = doSomething();
promise.then(successCallback, failureCallback);
promise.then(successCallback).catch(failureCallback);
```

<!-- v -->

```js [1-30]
calculateSomethingAsyncWithPromise(x)
  .then((result) => calculateSomethingElseAsyncWithPromise(result))
  .then((secondResult) => console.log(secondResult));
```

<!-- v -->

### Вопросы?

<!-- v -->

Но в Javascript приходит все больше и больше людей с других языков, и им непривычно читать такой код. Кроме того он имеет некоторые проблемы (например нам нужен одновременный доступ к `result` и `secondResult`).

<!-- v -->

Появились `async` функции. Которые предоставляют [`await` механизм](https://learn.javascript.ru/async-await).

<!-- v -->

Мы можем пометить функцию ключевым словом async. Это дает следующее:

1. функция теперь неявно возвращает Promise

1. внутри функции мы можем использовать ключевое слово `await` для разворачивания Promise-результатов

<!-- v -->

```js [1-30]
(async function () {
  const x = 2;
  const result = await calculateSomethingAsyncWithPromise(x);
  const secondResult = await calculateSomethingElseAsyncWithPromise(result);
  console.log(secondResult);
})();
```

<!-- v -->

[Top-level await](https://github.com/tc39/proposal-top-level-await).

```js [1-30]
const x = 2;
const result = await calculateSomethingAsyncWithPromise(x);
const secondResult = await calculateSomethingElseAsyncWithPromise(result);
console.log(secondResult);
```

<!-- v -->

Краткий итог:

- некоторый функции нужно вызывать с ключевым словом `await`
- `await` работает только внутри функций, которые помечены как `async` и в top-level

Подробнее мы будем разбирать на занятии про асинхронность

<!-- v -->

### Вопросы?

<!-- v -->

В разработке принято писать на уровне интерфейсов (абстракций), а не реализаций. То есть вы должны знать ЧТО делает функция или модуль, но не КАК.

Когда вы начинаете использовать детали реализации - это называется "протекающая абстракция".

<!-- v -->

Типичные кандидаты на асинхронные операции:

- запрос данных от пользователя
- сохранение и чтение данных
- обращение к стороннему сервису
- валидации и сложные вычисления

<!-- v -->

Но при этом

- для запроса данных от пользователя есть синхронные `alert` / `prompt`
- для чтения и сохранения данных есть синхронный `localStorage`

<!-- v -->

Лучше сразу заложить возможность для расширения, и использовать асинхронные обертки. Тогда в любой момент можно будет поменять реализацию, и вместо `localStorage` сохранять данные на сервере, например. А вместо `alert` показывать красивое стилизованное модальное окно (которое не блокирует поток).

<!-- v -->

```js [1-30]
async function asyncPrompt(request) {
  return prompt(request);
}
// const x = asyncPrompt(); работать не будет
const x = await asyncPrompt();
```

<!-- v -->

### Вопросы?

<!-- s -->

### [Работа со сторонними сервисами](https://learn.javascript.ru/network)

<!-- v -->

Для работы с HTTP запросами у нас есть два варианта (на самом деле больше, если подключать библиотеки):

- [XMLHttpRequest](https://learn.javascript.ru/xmlhttprequest)
- [fetch](https://learn.javascript.ru/fetch)

<!-- v -->

`fetch` - поддерживается современными браузерами, предоставляет Promise-based интерфейс (удобен для `async` функций) и прост в использовании.

<!-- v -->

```js [1-30]
// await-friendly окружение
let response = await fetch(url);

let text = await response.text();

console.log(text);
```

<!-- v -->

```js [1-30]
// await-friendly окружение
let response = await fetch("https://jsonplaceholder.typicode.com/users");

let jsonData = await response.json();
console.log(jsonData);
```

<!-- v -->

`fetch` возвращает вам объект типа [`Response`](https://developer.mozilla.org/ru/docs/Web/API/Response).

Чаще всего используются

- поле `ok`
- поле `status`
- методы `text()` и `json()`

<!-- v -->

### Вопросы?

<!-- v -->

[Практика](https://codesandbox.io/s/github/vvscode/otus--javascript-basic/tree/lesson04/lessons/lesson04/code/fetchPractice)

[OpenWeather API](https://openweathermap.org/current)

<!-- v -->

### Вопросы?

<!-- v -->

Дополнительное задание:

при заходе на страницу показать пользователю погоду в его городе. Для получения этой информации можно сделать запрос на `https://get.geojs.io/v1/ip/geo.json`, который вернет данные в формате JSON.

[GeoAPI](https://www.geojs.io/docs/v1/endpoints/geo/)

<!-- s -->

Если вы хотите собрать все вместе, можете выполнить следующий проект (его уже можно показывать друзьям).

[Сайт с прогонозом погоды](https://github.com/vvscode/otus--javascript-basic/blob/master/lessons/lesson09/homework.md)

Само домашнее задание у вас будет позже, но уже сейчас вы можете выполнять часть, связанную со страницей.

<!-- v -->

### Вопросы?

<!-- s -->

#### Дополнительные материалы

<!-- v -->

1. [Путеводитель по JavaScript Promise для новичков](https://habr.com/ru/company/zerotech/blog/317256/)
2. [Public APIs](https://github.com/public-apis/public-apis#open-source-projects)
3. [JavaScript. Как работать с API Telegram, Youtube и VK](https://live.ithillel.ua/javascript.-rabota-s-api)
4. [Что на самом деле происходит, когда пользователь вбивает в браузер адрес google.com](https://habr.com/ru/company/htmlacademy/blog/254825/)

<!-- v -->

#### Вопросы для самопроверки

1. Что такое CORS?

2. Что такое и какие есть коды ответов HTTP?

3. Что такое jsonp-запрос?

4. Быть в состоянии рассказать что такое XHR, AJAX, CDN

5. Чем XMLHTTPRequest отличается от fetch?
