---
title: Занятие 13
description: CI/CD с GitHub Actions. Автоматизация разработки JS приложений с помощью GitHub Actions — настройка workflow, деплой, тестирование и лучшие практики
---

## CI/CD с [GitHub Actions](https://docs.github.com/en/actions)

**Автоматизация разработки для JavaScript проектов**

<!--v-->

### Что такое CI/CD и зачем это нужно?

**Continuous Integration / Continuous Deployment**

**CI (Continuous Integration)** — автоматическая интеграция и тестирование кода при каждом коммите ([Wikipedia](https://ru.wikipedia.org/wiki/Непрерывная_интеграция))

**CD (Continuous Deployment)** — автоматический деплой готового кода в продакшн ([Martin Fowler](https://martinfowler.com/bliki/ContinuousDelivery.html))

<!--v-->

#### Зачем нужен CI/CD?

- **Быстрые циклы разработки** — от идеи до продакшна за минуты ([GitHub Blog](https://github.blog/enterprise-software/ci-cd/build-ci-cd-pipeline-github-actions-four-steps/))
- **Меньше багов** — автоматическое тестирование на каждом этапе ([Spacelift Tutorial](https://spacelift.io/blog/github-actions-tutorial))
- **Надёжность** — стабильные и предсказуемые релизы ([Dev.to Guide](https://dev.to/vishnusatheesh/how-to-set-up-a-cicd-pipeline-with-github-actions-for-automated-deployments-j39))
- **Экономия времени** — никаких ручных операций ([GitHub Docs](https://docs.github.com/en/actions))

<!--v-->

#### Вопросы?

<!--s-->

### [GitHub Actions](https://docs.github.com/en/actions) — встроенная CI/CD платформа

- Запускается от событий в репозитории (push, PR, release) ([Workflow Syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions))
- Виртуальные машины на Linux, Windows, macOS ([Runner Types](https://docs.github.com/en/actions/using-github-hosted-runners/about-github-hosted-runners))
- Более **20 000 готовых Actions** в [Marketplace](https://github.com/marketplace?type=actions)
- **Бесплатно**: 2000 минут в месяц для приватных репозиториев ([Free Tier Details](https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions))

<!--v-->

### Плюсы конфигурации через файлы

**Infrastructure as Code** для CI/CD

- **Версионирование** — история изменений в pipeline ([Git Tutorial](https://git-scm.com/book/en/v2/Git-Branching-Rebasing))
- **Code Review** — коллеги проверяют не только код, но и CI/CD ([GitHub PR Guide](https://docs.github.com/en/pull-requests))
- **Переносимость** — легко скопировать конфигурацию между проектами ([Starter Workflows](https://github.com/actions/starter-workflows))
- **Прозрачность** — весь процесс виден в коде ([Open Source Example](https://github.com/torvalds/linux/tree/master/.github/workflows))

```yaml
## .github/workflows/ci.yml
name: CI Pipeline
on: [push, pull_request]
```

<!--v-->

#### Вопросы?

<!--s-->

### Основные компоненты workflow файлов

**Анатомия GitHub Actions workflow** ([Workflow Syntax Docs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions))

```yaml
name: My Workflow # Название workflow
run-name: ${{ github.actor }} тестирует код

on: [push, pull_request] # Триггеры запуска

jobs: # Группа заданий
  test: # Имя job'а
    runs-on: ubuntu-latest # Среда выполнения
    steps: # Шаги выполнения
      - uses: actions/checkout@v4 # Готовый Action
      - run: npm test # Команда shell
```

<!--v-->

#### Структура файлов

- **Расположение**: `.github/workflows/` ([Docs](https://docs.github.com/en/actions/using-workflows))
- **Формат**: YAML файлы
- **Конвенция**: один файл — один workflow

```
.github/
  workflows/
    ci.yml        # Continuous Integration
    deploy.yml    # Deployment
    release.yml   # Release процесс
```

<!--v-->

#### Вопросы?

<!--s-->

### GitHub Actions vs конкуренты

<table>
<thead><tr><th>Параметр</th><th>GitHub Actions</th><th>GitLab CI</th><th>Travis CI</th></tr></thead>
<tbody>
<tr><td><strong>Интеграция</strong></td><td>Встроена в <a href="https://github.com/features/actions">GitHub</a></td><td>Часть <a href="https://about.gitlab.com/stages-devops-lifecycle/continuous-integration/" rel="nofollow">GitLab</a></td><td>Внешний сервис <a href="https://www.travis-ci.com/" rel="nofollow">Travis</a></td></tr>
<tr>
<td><strong>Marketplace</strong></td><td>20 000+ Actions (<a href="https://github.com/marketplace?type=actions">Marketplace</a>)</td><td><a href="https://gitlab.com/explore" rel="nofollow">GitLab Catalog</a></td><td>Ограниченный каталог</td></tr>
<tr><td><strong>Free Tier</strong></td><td>2 000 мин (<a href="https://docs.github.com/en/billing/managing-billing-for-github-actions/about-billing-for-github-actions">Billing</a>)</td><td>400 мин (<a href="https://about.gitlab.com/pricing/" rel="nofollow">GitLab Pricing</a>)</td><td>Ограничено (<a href="https://travis-ci.com/plans" rel="nofollow">Travis Pricing</a>)</td></tr>
</tbody>
</table>
<!--v-->

#### Преимущества GitHub Actions

- **Нативная интеграция** — webhook’и, PR, Issues из коробки
- **Огромный Marketplace** — готовые решения для любых задач
- **Простота входа** — настройка за 5 минут по [Quickstart](https://docs.github.com/en/actions/get-started/quickstart)
- **Гибкая настройка окружений** — matrix builds, разные ОС ([Matrix Strategy](https://docs.github.com/en/actions/using-jobs/using-job-strategy))

<!--v-->

#### Вопросы?

<!--s-->

### Основные Jobs для JS разработки

**Практические примеры для Node.js** ([Building & Testing Node](https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs))

<!--v-->

#### 1. Сборка и тестирование

```yaml
name: Build & Test
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: ["18", "20"] # Тесты на разных Node
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: "npm"
      - run: npm ci
      - run: npm run build --if-present
      - run: npm test
```

<!--v-->

#### 2. Линтинг и форматирование

```yaml
lint:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "npm"
    - run: npm ci
    - run: npm run lint
    - run: npm run format:check
```

<!--v-->

#### 3. Деплой на GitHub Pages

```yaml
deploy:
  runs-on: ubuntu-latest
  needs: [test, lint]
  if: github.ref == 'refs/heads/main'
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: "20"
        cache: "npm"
    - run: npm ci
    - run: npm run build
    - uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

Action **peaceiris/actions-gh-pages** в [Marketplace](https://github.com/marketplace/actions/deploy-to-github-pages).

<!--v-->

#### Вопросы?

<!--s-->

### Работа с артефактами

- **Концепция** — [Workflow Artifacts Docs](https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts)
- **Блог Earthly** «[Uploading Artifacts](https://earthly.dev/blog/github-action-artifacts/)»
- **v4 пакет** — [GitHub Blog](https://github.blog/news-insights/product-news/get-started-with-v4-of-github-actions-artifacts/)

<!--v-->

#### Пример загрузки артефактов

```yaml
- uses: actions/upload-artifact@v4
  with:
    name: dist-files
    path: dist/
    retention-days: 30
```

<!--v-->

#### Вопросы?

<!--s-->

### Секреты и переменные окружения

- **Типы секретов** — [Docs](https://docs.github.com/en/actions/security-guides/using-secrets-in-github-actions)
- **Best Practices** — [StepSecurity Blog](https://www.stepsecurity.io/blog/github-actions-secrets-management-best-practices)

<!--v-->

#### Пример использования секретов

```yaml
- name: Deploy
  run: curl -H "Authorization: Bearer ${{ secrets.DEPLOY_TOKEN }}" https://api.example.com/deploy
```

<!--v-->

#### Вопросы?

<!--s-->

### Триггеры запуска workflows

- **Полный список** — [Triggering a Workflow](https://docs.github.com/en/actions/using-workflows/triggering-a-workflow)

<!--v-->

#### Manual dispatch

Используйте `workflow_dispatch` для ручного запуска через UI или [GitHub CLI](https://cli.github.com/manual/gh_workflow_run).

<!--v-->

#### Cron расписание

Генерировать выражения удобно на [crontab.guru](https://crontab.guru/).

<!--v-->

#### Webhooks

Интеграция с внешними системами через `repository_dispatch` ([Example Guide](https://mattstauffer.com/blog/how-to-trigger-a-webhook-on-a-schedule-using-github-actions/)).

<!--v-->

#### Вопросы?

<!--s-->

### Полезные ресурсы

- **Awesome Actions** — <https://github.com/sdras/awesome-actions>
- **Awesome GitHub Actions** — <https://github.com/Alliedium/awesome-github-actions>
- **GitHub Learning Lab** — <https://lab.github.com/>
- **Nektos act** (запуск локально) — <https://github.com/nektos/act>
- **Actionlint** (статический анализ) — <https://github.com/rhysd/actionlint>
- [GitHub Discussions](https://github.com/orgs/community/discussions)

<!--v-->

### [Домашнее задание](https://github.com/JavaScript-Basic-OTUS/otus--jsbasic/blob/master/lessons/lesson13/task.md)

<!--v-->

### Спасибо за внимание!

**Вопросы и обсуждение**
