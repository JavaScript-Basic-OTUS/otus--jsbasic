import { useState } from "react"

// const heavyDouble = (num) => {
//   let result = 0;
//   // Двойной цикл для большей задержки
//   for (let i = 0; i < 100000; i++) {
//     for (let j = 0; j < 10000; j++) {
//       result = num * 2 + i + j;  // Какая-то "полезная" работа
//     }
//   }
//   return result;
// }

export default function ExamplePage() {
  const [count, setCount] = useState(0)

  const incrementCount = () => {}

  return (
    <>
      <Title />
      <CountInfo />
      <button> + 1 </button>
    </>
  )
}

const Title = () => {
  <h1>Example</h1>
}

const CountInfo = ({count}) => <h3>Count value {count}</h3>
