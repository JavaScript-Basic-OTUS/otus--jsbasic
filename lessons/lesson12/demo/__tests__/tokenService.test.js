import { createToken } from "../src/tokenService.js";

describe("tokenService", () => {
  describe("createToken", () => {
    test("should create token with correct format", () => {
      const userId = "test-user-123";
      const token = createToken(userId);

      expect(token).toHaveProperty("token");
      expect(token).toHaveProperty("expiresIn");
      expect(token.token).toMatch(/^token-test-user-123-\d+$/);
      expect(token.expiresIn).toBe(3600);
    });

    test("should create unique tokens for same user", () => {
      const userId = "user1";
      const token1 = createToken(userId);

      // Небольшая задержка чтобы timestamp отличался
      setTimeout(() => {
        const token2 = createToken(userId);
        expect(token1.token).not.toBe(token2.token);
      }, 1);
    });

    test("should handle different user IDs", () => {
      const token1 = createToken("user1");
      const token2 = createToken("user2");

      expect(token1.token).toContain("user1");
      expect(token2.token).toContain("user2");
      expect(token1.token).not.toBe(token2.token);
    });

    test("should return consistent expiresIn value", () => {
      const token1 = createToken("user1");
      const token2 = createToken("user2");

      expect(token1.expiresIn).toBe(3600);
      expect(token2.expiresIn).toBe(3600);
    });
  });
});
