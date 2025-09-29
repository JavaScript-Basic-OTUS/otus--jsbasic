import { renderHook, act } from "@testing-library/react";
import { useInput } from "./useInput";

describe("useInput", () => {
  it("должен устанавливать начальное значение", () => {
    const { result } = renderHook(() => useInput("начальное значение"));
    expect(result.current.value).toBe("начальное значение");
  });

  it("должен обновлять значение при вызове onChange", () => {
    const { result } = renderHook(() => useInput(""));

    // act() гарантирует, что все обновления состояния будут обработаны
    act(() => {
      result.current.onChange({ target: { value: "новое значение" } });
    });

    expect(result.current.value).toBe("новое значение");
  });
});
