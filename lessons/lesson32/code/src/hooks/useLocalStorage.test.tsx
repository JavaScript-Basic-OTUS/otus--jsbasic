import { renderHook, act } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage";

const TEST_KEY = "test-key";

beforeEach(() => {
  window.localStorage.clear();
});

describe("useLocalStorage", () => {
  it("должен возвращать initialValue, если в localStorage пусто", () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, "default"));
    expect(result.current[0]).toBe("default");
  });

  it("должен читать существующее значение из localStorage", () => {
    window.localStorage.setItem(TEST_KEY, JSON.stringify("stored value"));

    const { result } = renderHook(() => useLocalStorage(TEST_KEY, "default"));
    expect(result.current[0]).toBe("stored value");
  });

  it("должен обновлять значение и записывать его в localStorage", () => {
    const { result } = renderHook(() => useLocalStorage(TEST_KEY, ""));

    act(() => {
      const setValue = result.current[1];
      setValue("new value");
    });

    expect(result.current[0]).toBe("new value");

    const storedValue = window.localStorage.getItem(TEST_KEY);
    expect(JSON.parse(storedValue)).toBe("new value");
  });
});
