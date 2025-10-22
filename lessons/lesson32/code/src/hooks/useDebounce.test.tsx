import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

// Используем фейковые таймеры Jest для управления временем в тестах
jest.useFakeTimers();

describe("useDebounce", () => {
  it("должен возвращать начальное значение немедленно", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));
    expect(result.current).toBe("initial");
  });

  it("не должен обновлять значение до истечения задержки", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 500 },
      }
    );

    rerender({ value: "b", delay: 500 });

    expect(result.current).toBe("a");

    act(() => {
      jest.advanceTimersByTime(499);
    });

    expect(result.current).toBe("a");
  });

  it("должен обновить значение после истечения задержки", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "a", delay: 500 },
      }
    );

    rerender({ value: "b", delay: 500 });

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("b");
  });
});
