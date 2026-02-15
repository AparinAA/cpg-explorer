# CPG Explorer

Web-IDE для исследования и понимания кодовых баз Go через визуализацию Code Property Graph (CPG).

**!!!** Информация про запуск в пункте **Запуск через Docker Compose**

## Реализованный функционал

### Call Graph Explorer (основной фокус)

В соответствии с заданием реализован **Call Graph Explorer** — центральный элемент интерфейса:

- **Визуализация графа вызовов**: клик на функцию → BFS-обход по `call` рёбрам → интерактивный граф (10-60 узлов)
- **Навигация по графу**: двойной клик на узел открывает граф его окружения
- **Исходный код**: при выборе узла отображается исходный код функции из таблицы `sources`
- **Цветовая кодировка**: разные цвета для функций, методов, внешних вызовов и корневого узла

### Дополнительные возможности

- **Поиск функций**: поиск и фильтрация по имени функции или пакету
- **Просмотр исходного кода**: Monaco Editor с подсветкой синтаксиса Go и навигацией по строкам
- **Статистика**: обзор метрик кодовой базы (узлы, рёбра, сложность, типы рёбер)
- **Переключение режимов**: Call Graph / Data Flow / Packages

## Архитектура

### Frontend (React 19 + Vite)
- Cytoscape.js + dagre для визуализации графов
- Monaco Editor для исходного кода
- Zustand для управления состоянием
- Tailwind CSS для стилизации

### Backend (Node.js + Express)
- better-sqlite3 для работы с базой данных
- BFS-алгоритмы обхода графа
- Сервисный слой для бизнес-логики

### База данных
- SQLite (cpg.db, ~900 MB)

### Docker-образы

- **Frontend** — только собирает статику и копирует её в shared volume, затем завершается
- **Nginx** — раздаёт статику и проксирует `/api` запросы к backend
- **Backend** — недоступен извне, только nginx может обращаться к нему

### Взаимодействие
- REST API `/api/v1/*`

## Быстрый старт

### Требования

- Docker и Docker Compose
- Сгенерированный файл `cpg.db`

### Запуск через Docker Compose

```bash
docker compose up
```

Откройте http://localhost:8000 в браузере. (nginx будет ждать окончания сборки фронта)

> **Примечание**: По умолчанию БД монтируется из `../cpg-test-release/cpg.db`. 
> Путь настраивается в `.env` через переменную `DOCKER_DATA_PATH`.

### Локальная разработка

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Конфигурация

Все настройки вынесены в `.env`:

| Переменная | Описание | По умолчанию |
|------------|----------|--------------|
| `API_VERSION` | Версия API | `v1` |
| `BACKEND_PORT` | Порт бэкенда | `3001` |
| `DB_PATH` | Путь к БД (для локального запуска, относительно .env файла) | `./cpg.db` |
| `DOCKER_DATA_PATH` | Путь к директории с БД (для Docker, относительно .env файла) | `../cpg-test-release` |
| `DOCKER_FRONTEND_PORT` | Порт фронтенда в Docker | `8000` |

## API Endpoints

| Endpoint | Описание |
|----------|----------|
| `GET /api/health` | Health check с версией API |
| `GET /api/v1/functions` | Список/поиск функций |
| `GET /api/v1/functions/:id` | Детали функции |
| `GET /api/v1/callgraph/:id` | Call graph для функции |
| `GET /api/v1/dataflow/:id` | Data flow graph |
| `GET /api/v1/packages` | Список пакетов |
| `GET /api/v1/source/*` | Исходный код файла |
| `GET /api/v1/stats` | Статистика БД |

## Принятые решения

### Почему BFS с ограничением глубины?
- Графы остаются управляемыми (10-60 узлов на представление)
- Предсказуемая производительность рендеринга
- Пользователь может углубляться через двойной клик

### Почему граф рендерится на сервере?
- Эффективнее чем отправка всего графа клиенту
- Контролируемый размер ответа
- Меньше нагрузка на браузер


## Структура проекта

```
cpg-explorer/
├── backend/
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Бизнес-логика
│   │   ├── db.js        # Подключение к БД
│   │   └── index.js     # Entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/         # API клиент
│   │   ├── components/  # React компоненты
│   │   ├── shared/      # Константы, хуки
│   │   ├── store/       # Zustand store
│   │   └── App.jsx
│   ├── Dockerfile
│   └── package.json
├── nginx/
│   ├── Dockerfile       # nginx:alpine образ
│   └── nginx.conf        # Конфиг с proxy_pass к backend
├── .env                  # Конфигурация
├── .env.example          # Шаблон конфигурации
└── docker-compose.yml
```

## Компоненты фронтенда

Интерфейс разделён на несколько областей экрана:

### SearchPanel (`components/SearchPanel/`) с виртуализацией

Левая панель поиска функций и отображение списка с виртуализацией бесконечно больших списков:

### Panels (`components/Panels/`)

`SourcePanel` Контейнер исходного кода с header и Monaco Editor

### GraphViewer (`components/GraphViewer/`)

Визуализация графов (Call Graph, Package Dependencies)

### SourceViewer (`components/SourceViewer/`)

Monaco Editor

### StatsPanel (`components/StatsPanel/`)

Статистика на стартовом экране до выбора функции

### Shared (`shared/`)

### Store (`store/`)

Zustand store с состоянием приложения:
- View mode (callgraph/packages)
- Выбранная функция и граф
- Исходный код и подсветка строки
- Данные пакетов
- Actions для загрузки данных и навигации
