import { renderHook } from "@testing-library/react";
import { useDocumentTitle } from "./useDocumentTitle";

describe("useDocumentTitle", () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
  });

  it("должен устанавливать заголовок документа", () => {
    renderHook(() => useDocumentTitle("Новый заголовок"));
    expect(document.title).toBe("Новый заголовок");
  });

  it("должен обновлять заголовок документа при изменении", () => {
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: "Первый заголовок" },
    });

    expect(document.title).toBe("Первый заголовок");

    rerender({ title: "Второй заголовок" });
    expect(document.title).toBe("Второй заголовок");
  });

  it("должен (опционально) восстанавливать исходный заголовок при размонтировании", () => {
    const { unmount } = renderHook(() =>
      useDocumentTitle("Временный заголовок")
    );

    expect(document.title).toBe("Временный заголовок");

    unmount();

    expect(document.title).toBe(originalTitle);
  });
});
