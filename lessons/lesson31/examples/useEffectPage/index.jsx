import { useEffect, useState } from "react";

// 1. Не передать ничего
function UseEffectPage1() {
  const [, setValue] = useState({});

  useEffect(() => {
    // Эффект срабатывает при монтировании компонента и при каждом рендере.
    console.log("Срабатываю на каждый рендер");
  });

  return (
    <div>
      <h1>useEffect</h1>
      <button onClick={() => setValue({})}>Обновить состояние</button>
    </div>
  );
}

// 2. Передать пустой массив - []
function UseEffectPage2() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Эффект срабатывает только при монтировании компонента.
    console.log("Сработаю 1 раз");
  }, []);

  return (
    <div>
      <h1>useEffect</h1>
      <h3>{count}</h3>
      <button onClick={() => setCount((prev) => prev + 1)}> + 1</button>
    </div>
  );
}

// 3. Передать массив с переменными для отслеживания - [value]
function UseEffectPage3({ userId = 2 }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Эффект, зависящий от userId
  useEffect(() => {
    if (!userId) return;

    console.log("Сработаю при монтировании и изменении userId");

    fetch(`https://jsonplaceholder.typicode.com/users/${userId}`)
      .then((response) => response.json)
      .then((json) => setUser(json))
      .catch((error) => console.error("Ошибка загрузки:", error))
      .finally(() => setIsLoading(false));
  }, [userId]); // Запускается заново, если изменился userId

  if (isLoading) return <div>Загрузка...</div>;
  if (!user) return <div>Выберите пользователя</div>;

  return (
    <div>
      <h1>useEffect</h1>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// 4. Пример очистки функции с интервалом
function UseEffectPage() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    console.log("✅ Таймер запущен");

    // Запускаем интервал при монтировании
    const intervalId = setInterval(() => {
      const currentTime = new Date().toLocaleTimeString();
      setTime(currentTime);
      console.log("🕒 Время обновлено:", currentTime);
    }, 1000);

    // Функция очистки
    return () => {
      console.log("Таймер остановлен");
      clearInterval(intervalId);
    };
  }, []); // Пустой массив - эффект только при монтировании/размонтировании

  return (
    <div>
      <h3>Текущее время: {time}</h3>
    </div>
  );
}

export default UseEffectPage;
