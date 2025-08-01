# JavaScript Developer. Basic

Это репозиторий курса ["OTUS JavaScript Developer. Basic"](https://otus.ru/lessons/javascript-basic/)

<details>
  <summary>Структура репозитория</summary>

Репозиторий имеет следующую структуру

- в корне проекта находятся файлы настроек проекта и используемых инструментов
- в директории `lessons` находится под-директории по маске `lesson{XX}` с материалами для каждого занятия
</details>

<details>
  <summary>Работа с репозиторием</summary>

Репозиторий обслуживается инструментами на базе Node.js. Для работы понадобится `node.js` и `npm` (в качестве пакетного менеджера).

```bash
# Склонируйте репозиторий
git clone https://github.com/vvscode/otus--javascript-basic

# Установите зависимости
cd otus--javascript-basic && npm install

# Создайте директорию для нового занятия
mkdir lessons/lessonXX

# Создайте файл для нового занятия
touch lessons/lessonXX/lesson.md

# Запустите reveal-md в режиме разработки
npm run dev -- lessons/lessonXX/lesson.md
```

При коммите должны сработать husky-хуки для проверки и форматирования измененных файлов. Дополнительная проверка настроена через github-actions.

При мерже пуллреквеста в мастер автоматически произойдет деплой изменений на сервис gh-pages. Результат можно будет увидеть здесь [otus--jsbasic](https://javascript-basic-otus.github.io/otus--jsbasic/).

Если для занятия (для демонстрации или для активностей) нужно запускать примеры кода - используйте codesandbox, разместив код в поддиректории соответствующего урока (чтобы держать все материалы в одном месте).

</details>
