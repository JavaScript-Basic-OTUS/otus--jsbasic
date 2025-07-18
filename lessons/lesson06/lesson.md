---
title: Занятие 6
description: Объектная модель в Javascript. Прототипное наследование
---

# OTUS

## Javascript Basic

<!--v-->

### Вопросы?

<!--s-->

### Объектная модель в Javascript: Прототипное наследование

<!-- s -->

### Передача по значению / по ссылке

<!-- v -->

```js [1-30]
let i = 1;
let j = 1;

i = 2;

console.log(i, j); // ?
```

<!-- v -->

```js [1-30]
let a = {};
let b = {};

a.name = "Bob";

console.log(a.name, b.name); // ?
```

<!-- v -->

```js [1-30]
let a = {};
let b = a;

a.name = "Bob";

console.log(a.name, b.name); // ?
```

<!-- v -->

```js [1-30]
let a = [];
let b = a;

a.push("Bob");

console.log(a[0], b[0]); // ?
```

<!--v-->

### Вопросы?

<!-- s -->

### Правила именования переменных / свойств

<!-- v -->

- "Говорящее название"
- Переменная - существительное (исключение - булевы переменные)
- Функция/метод - глагол
- Булевы значения - `isA`, `hasB`
- Возможно использование венгерской нотации (`sText`, `nCount`)

<!-- v -->

- camelCase - для переменных и полей объектов/классов
- PascalCase - для классов, конструкторов и пространств имен
- UPPER_CASE - для констант (не неизменяемых переменных, а конфигурационных значений)
- \_secretField - уже не используется, но помнить стоит

<!-- v -->

### Вопросы?

<!-- s -->

### Объекты

<!-- v -->

- Структура данных - набор пар вида "ключ - значение"
- Ключи - String | Symbol
- Ссылочный тип данных

<!-- v -->

#### Как создать

<!-- v -->

```js [1-30]
// Создание объекта 1
//  через литерал

let o1 = {};

let o2 = {
  prop1: "Some value",
  prop2: null,
  prop3: 3,
};
```

<!-- v -->

```js [1-30]
// Создание объекта 2
// Вызвать функцию возвращающую объект
let o3 = Object.create(null);
```

<!-- v -->

```js [1-30]
// Создание объекта 3
// Использовать `new` с классом или функцией-конструктором

let o4 = new Object();

let o5 = new Object({
  a: 1,
  b: 2,
});
```

<!-- v -->

#### Как работать со свойствами

_Какие есть способы работы со свойствами?_

<!-- v -->

```js [1-30]
let o = {};

// точечная нотация
o.prop1 = 1;
console.log(o.prop1);
delete o.prop1;

// скобочная нотация
o["prop2"] = 2;
console.log(o["prop2"]);
delete o["prop2"];
```

<!-- v -->

```js [1-30]
let o = {
  x: 1,
};
console.log(o.x); // ?

let a = "x";
o.a = 2;
console.log(o.a, o[a]); // ?

let b = "x";
o["b"] = 3;
console.log(o.b, o[b]); // ?
```

<!-- v -->

### Вопросы?

<!-- s -->

#### Еще немного про свойства объекта

<!-- v -->

```js [1-30]
let o = {
  prop1: 2,
};

console.log(o);
console.log(o.prop1); //?
console.log(o.prop2); // ?
```

<!-- v -->

```js [1-30]
let o = {
  someMethod: function () {
    console.log("Hey!");
  },
};

console.log(o);
console.log(o.someMethod); //?
console.log(o.toString); // ?
```

<!-- v -->

```js [1-30]
let o = {
  someMethod: function () {
    console.log("Hey!");
  },
};

console.log(o);
console.log(o.someMethod()); //?
console.log(o.toString()); // ?
console.log(o.someOtherMethod()); //?
```

<!-- v -->

#### `__proto__`

<!-- v -->

При обращении к свойству объекта:

- свойство ищется в самом объекте
- если свойство не найдено, делается поиск в прототипе объекта
- если свойство не найдено в прототипе, делается поиск дальше по цепочке прототипов, пока цепочка не закончится

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop2: 2,
  },
};

console.log(o);
console.log(o.prop1); //?
console.log(o.prop2); //?
console.log(o.prop3); //?
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop2: 2,
    __proto__: {
      prop3: 3,
    },
  },
};

console.log(o);
console.log(o.prop1); //?
console.log(o.prop2); //?
console.log(o.prop3); //?
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop1: 2,
  },
};

console.log(o);
console.log(o.prop1); //?
console.log(o.prop2); //?
```

<!-- v -->

#### Запись свойств

<!-- v -->

Запись свойств, всегда производится в сам объект (тот, что находится перед последней точкой, в точечной нотации). Независимо от того, есть свойство в объекте или нет.

<!-- v -->

```js [1-30]
let o = { __proto__: { prop1: 1 } };
console.log(o.prop1, o.__proto__.prop1); // ?

o.prop1 = 2;
console.log(o.prop1, o.__proto__.prop1); // ?

o["prop1"] = 3;
console.log(o.prop1, o.__proto__.prop1); // ?
```

<!-- v -->

```js [1-30]
let proto = { prop0: 1 };

let o1 = { prop1: 1, __proto__: proto };
let o2 = { prop2: 2, __proto__: proto };
console.log(o1.prop0, o2.prop0); // ?

proto.prop0 = 5;
console.log(o1.prop0, o2.prop0); // ?

o2.prop0 = 7;
console.log(o1.prop0, o2.prop0); // ?

console.log(proto.prop0); // ?
```

<!-- v -->

```js [1-30]
let proto = { settings: { isAdmin: false } };

let u1 = { name: "Bob", __proto__: proto };
let u2 = { name: "Sam", __proto__: proto };
console.log(u1.settings.isAdmin); // ?

u1.settings.isAdmin = true;
console.log(u1.settings.isAdmin); // ?
console.log(u2.settings.isAdmin); // ?
```

<!-- v -->

Задание прототипа:

- прямая работа с `__proto__`
- [`Object.setPrototypeOf()`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf)
- [`Object.create(proto[, propertiesObject])`](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
- использование конструкторов

<!-- v -->

### Вопросы?

<!-- v -->

### Итерация по полям объекта

<!-- v -->

- `for(let x in obj){}`
- получить список свойств и проитерироваться по нему - [keys](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/keys), [values](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/values), [entries](https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/entries) (но не в IE!)

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  prop2: 2,
};

for (let propName in o) {
  console.log(propName);
}
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  prop2: 2,
};

Object.keys(o).forEach((propName) => {
  console.log(propName);
});
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  prop2: 2,
};

for (let [key, value] of Object.entries(o)) {
  console.log(`${key}: ${value}`);
}
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop2: 2,
  },
};

for (let propName in o) {
  console.log(propName);
}
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop2: 2,
  },
};

for (let propName in o) {
  console.log(
    propName,
    o.hasOwnProperty(propName) ? "в объекте" : "в цепочке прототипов"
  );
}
```

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop2: 2,
  },
};

for (let [key, value] of Object.entries(o)) {
  console.log(`${key}: ${value}`);
}
```

<!-- v -->

#### Удаление свойств

<!-- v -->

Свойства удаляются (так же как и записываются) непосредственно на объекте(на том, что до последней точки, в точечной нотации), не затрагивая цепочку прототипов.

<!-- v -->

```js [1-30]
let o = {
  prop1: 1,
  __proto__: {
    prop1: 2,
  },
};
console.log(o.prop1); // ?

delete o.prop1;
console.log(o.prop1); // ?

delete o.prop1;
console.log(o.prop1); // ?
```

<!-- v -->

### Вопросы?

<!-- v -->

```js [1-30]
let a = { name: "Bob" };
let b = { name: "Sam" };

let settings = {};
settings[a] = { isAdmin: true };
settings[b] = { isAdmin: false };

console.log(settings[a]); // ?
console.log(settings[b]); // ?
```

<!-- v -->

[Практика](https://codesandbox.io/s/github/JavaScript-Basic-OTUS/otus--jsbasic/tree/master/lessons/lesson06/code/smart-getter)

Напишите функцию, которая позволит безопасно читать свойства из объекта на любой вложенности.

Функция принимает:

- откуда свойство нужно прочитать
- путь к свойству, которое нужно прочитать
- опционально значение, которое нужно вернуть, если свойство не найдено

<!-- s -->

### [Домашнее задание](https://github.com/JavaScript-Basic-OTUS/otus--jsbasic/blob/master/lessons/lesson06/task.md)

<!-- v -->

### Дополнительные материалы

<!-- v -->

- [Отладка в браузере Chrome](https://learn.javascript.ru/debugging-chrome)
- [Браузер: документ, события, интерфейсы](https://learn.javascript.ru/ui)
- [YT: Про цикл событий в JavaScript или "как на самом деле работает асинхронность"?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)
- [Иван Тулуп: асинхронщина в JS под капотом](https://habr.com/ru/company/oleg-bunin/blog/417461/)

<!-- v -->

### Вопросы?

<!-- v -->

### Опрос

![](https://i.imgur.com/n7DsuMo.png)
