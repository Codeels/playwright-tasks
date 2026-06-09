import { test, expect } from '@playwright/test';

// Тесты для формы входа
test.describe('Параметризованные тесты формы входа', () => {
  const loginTestCases = [
    {
      username: 'admin',
      password: 'admin123',
      expected: 'Успешный вход!',
    },
    {
      username: '',
      password: 'anypassword',
      expected: 'Все поля обязательны',
    },
    {
      username: 'testuser',
      password: '123',
      expected: 'Пароль должен быть не менее 6 символов',
    },
  ];

  // Нужно реализовать параметризованный тест на основе массива loginTestCases
  // Шаги теста:
  // 1. Перейти на страницу формы входа
  // 2. Заполнить поле имени пользователя (если не пустое)
  // 3. Заполнить поле пароля
  // 4. Нажать кнопку "Войти"
  // 5. Проверить сообщение системы
  // 6. Проверить класс сообщения (success/error)

  loginTestCases.forEach(({ username, password, expected }) => {
    test(`Тест с username = ${username}, password = ${password}, expected = ${expect}`, async ({
      page,
    }) => {
      const nameField = page.locator('#username');
      const passwordField = page.locator('#password');
      const enterButton = page.getByRole('button', { name: 'Войти' });
      const message = page.locator('#message');

      await page.goto('https://osstep.github.io/parametrize');
      await nameField.fill(username);
      await passwordField.fill(password);
      await enterButton.click();
      await expect(message).toHaveText(expected);
      if (expected === 'Успешный вход!') {
        await expect(message).toHaveClass(/success/);
      } else {
        await expect(message).toHaveClass(/error/);
      }
    });
  });
});

// Тесты для калькулятора
test.describe('Параметризованные тесты калькулятора', () => {
  const calculatorTestCases = [
    { a: 5, b: 3, operation: 'add', expected: 8 },
    { a: 10, b: 0, operation: 'add', expected: 10 },
    { a: 4, b: 5, operation: 'multiply', expected: 20 },
  ];
  // Нужно реализовать параметризованный тест на основе массива calculatorTestCases
  // Шаги теста:
  // 1. Перейти на страницу калькулятора
  // 2. Ввести первое число
  // 3. Ввести второе число
  // 4. Нажать кнопку операции (сложение/умножение)
  // 5. Проверить результат вычисления

  calculatorTestCases.forEach(({ a, b, operation, expected }) => {
    test(`Тест с a = ${a}. b = ${b}, operation = ${operation}, expected = ${expected}`, async ({
      page,
    }) => {
      const number1 = page.locator('#num1');
      const number2 = page.locator('#num2');
      const addButton = page.locator('#add-btn');
      const multiplyButton = page.locator('#multiply-btn');
      const result = page.locator('#result');

      await page.goto('https://osstep.github.io/parametrize');
      await number1.fill(a.toFixed());
      await number2.fill(b.toFixed());
      if (operation === 'add') {
        await addButton.click();
        await expect(result).toContainText((a + b).toString());
      } else {
        await multiplyButton.click();
        await expect(result).toContainText((a * b).toString());
      }
    });
  });
});
