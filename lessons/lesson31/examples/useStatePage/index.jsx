import { useState } from "react";
import code from "./../../assets/useState.png";

function UseStatePage() {
  const [count, setCount] = useState(0);

  const incrementCount = () => setCount((count) => count + 1);

  // Функциональное обновление
  const decrementCount = () => setCount((prev) => prev - 1);

  return (
    <>
      <h1>Hook useState</h1>

      <h3>{count}</h3>

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          marginBottom: "20px",
        }}
      >
        <button onClick={incrementCount}> + 1 </button>

        <button onClick={decrementCount}> - 1 </button>
      </div>

      <img src={code} alt="code" width="500px" />
    </>
  );
}

export default UseStatePage;
