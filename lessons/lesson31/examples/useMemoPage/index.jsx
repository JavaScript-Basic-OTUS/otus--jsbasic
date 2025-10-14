import { useState } from 'react';
import TodoList from "./TodoList";

const todos = [
  { id: 1, text: 'Изучить React', completed: true },
  { id: 2, text: 'Написать компонент', completed: false },
  { id: 3, text: 'Разобраться с хуками', completed: false },
  { id: 4, text: 'Создать приложение', completed: true },
  { id: 5, text: 'Оптимизировать производительность', completed: false },
  { id: 6, text: 'Изучить useMemo', completed: true },
  { id: 7, text: 'Понять useCallback', completed: false },
  { id: 8, text: 'Сделать домашнее задание', completed: false }
];

function UseMemoPage() {
  const [filter, setFilter] = useState('all');

  return (
    <div style={{ padding: '20px' }}>
      <h1>useMemo</h1>
      
      {/* Кнопки фильтров */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Выберите фильтр:</h3>
        <button onClick={() => setFilter('all')} style={{marginRight: '20px'}}>Все задачи</button>
        <button onClick={() => setFilter('active')} style={{marginRight: '20px'}}>Активные</button>
        <button onClick={() => setFilter('completed')}>Завершенные</button>
      </div>

      {/* Компонент со списком задач */}
      <TodoList todos={todos} filter={filter} />
    </div>
  );
}

export default UseMemoPage;
