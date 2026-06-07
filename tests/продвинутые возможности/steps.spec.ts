import { test, expect } from '@playwright/test';

test.describe('Тестирование формы регистрации', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://osstep.github.io/steps');
  });

  test('Проверка полного цикла регистрации', async ({ page }) => {
    // Тест проверяет полный цикл работы с формой:
    // 1. Начальное состояние
    // 2. Негативные сценарии
    // 3. Успешную регистрацию
    // 4. Проверку профиля
    // 5. Выход из системы

    // Создай test.step ПРЕДУСЛОВИЯ: Проверить начальное состояние формы
    // В рамках шага выполни проверки
    // Что проверяем:
    // - Все поля формы пустые
    // - Сообщения об ошибке и успехе скрыты
    // - Секция профиля не отображается
    const name = page.getByPlaceholder('Имя пользователя');
    const email = page.getByPlaceholder('Email');
    const password = page.getByPlaceholder('Пароль');
    const registrationButton = page.getByRole('button', { name: 'Зарегистрироваться' });
    const errorMessage = page.locator('#error-message');
    const successMessage = page.locator('#success-message');
    const profileSection = page.locator('#profile-section');
    const profileName = page.locator('#profile-username');
    const profileEmail = page.locator('#profile-email');
    const logoutButton = page.locator('#logout-btn');

    await test.step('ПРЕДУСЛОВИЯ: Проверить начальное состояние формы', async () => {
      await expect(name).toBeEmpty();
      await expect(email).toBeEmpty();
      await expect(password).toBeEmpty();
      await expect(errorMessage).toBeHidden();
      await expect(successMessage).toBeHidden();
      await expect(profileSection).toBeHidden();
    });

    // Создай test.step ШАГ 1: Попытка регистрации с пустыми полями
    // В рамках шага выполни проверки
    // Что выполняем:
    // - Нажимаем кнопку без заполнения полей
    // Что проверяем:
    // - Появилось сообщение о необходимости заполнить все поля
    // - Сообщение об успехе осталось скрытым

    await test.step('ШАГ 1: Попытка регистрации с пустыми полями', async () => {
      await registrationButton.click();
      await expect(errorMessage).toBeVisible();
      await expect(successMessage).toBeHidden();
    });

    // Создай test.step ШАГ 2: Попытка регистрации с некорректными данными
    // В рамках шага выполни проверки
    // Что выполняем:
    // - Заполняем имя пользователя
    // - Вводим email без @
    // - Вводим слишком короткий пароль
    // Что проверяем:
    // - Соответствующие сообщения об ошибках

    await test.step('ШАГ 2: Попытка регистрации с некорректными данными', async () => {
      await name.fill('test');
      await email.fill('mailmail.com');
      await password.fill('x');
      await registrationButton.click();
      await expect(errorMessage).toHaveText('Пароль должен быть не менее 6 символов');
    });

    // Создай test.step ШАГ 3: Успешная регистрация
    // В рамках шага выполни проверки
    // Что выполняем:
    // - Заполняем все поля корректными данными
    // Что проверяем:
    // - Исчезло сообщение об ошибке
    // - Появилось сообщение об успехе
    // - Отобразилась секция профиля

    await test.step('ШАГ 3: Успешная регистрация', async () => {
      await name.fill('testName');
      await email.fill('mail@mail.com');
      await password.fill('123456');
      await registrationButton.click();
      await expect(errorMessage).toBeHidden();
      await expect(successMessage).toBeVisible();
      await expect(profileSection).toBeVisible();
    });

    // Создай test.step ШАГ 4: Проверка данных профиля
    // В рамках шага выполни проверки
    // Что проверяем:
    // - Данные в профиле соответствуют введенным при регистрации

    await test.step('ШАГ 4: Проверка данных профиля', async () => {
      await expect(profileName).toHaveText('testName');
      await expect(profileEmail).toHaveText('mail@mail.com');
    });

    // Создай test.step ШАГ 5: Выход из системы
    // В рамках шага выполни проверки
    // Что выполняем:
    // - Нажимаем кнопку выхода
    // Что проверяем:
    // - Форма регистрации сброшена
    // - Секция профиля скрыта
    await test.step('ШАГ 5: Выход из системы', async () => {
      await logoutButton.click();
      await expect(name).toBeEmpty();
      await expect(email).toBeEmpty();
      await expect(password).toBeEmpty();
      await expect(profileSection).toBeHidden();
    });
  });

  // Демонстрационный тест
  test.describe('Параметризованные тесты регистрации', () => {
    const testCases = [
      {
        title: 'Короткий пароль (5 символов)',
        data: { username: 'user1', email: 'user1@test.com', password: '12345' },
        expectedError: 'Пароль должен быть не менее 6 символов',
      },
    ];

    for (const testCase of testCases) {
      test(testCase.title, async ({ page }) => {
        await test.step('ЗАПОЛНЕНИЕ: Ввести тестовые данные', async () => {
          await page.locator('#username').fill(testCase.data.username);
          await page.locator('#email').fill(testCase.data.email);
          await page.locator('#password').fill(testCase.data.password);
        });

        await test.step('ДЕЙСТВИЕ: Отправить форму', async () => {
          await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        });

        await test.step('ПРОВЕРКА: Сообщение об ошибке', async () => {
          await expect(page.locator('#error-message')).toBeVisible();
          await expect(page.locator('#error-message')).toContainText(testCase.expectedError);
        });
      });
    }
  });

  // Демонстрационный тест
  test('Вложенные шаги с группами проверок', async ({ page }) => {
    await test.step('ГРУППА: Проверки валидации формы', async () => {
      await test.step('ПУСТЫЕ ПОЛЯ: Отправка пустой формы', async () => {
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#error-message')).toHaveText(/Все поля обязательны/);
      });

      await test.step('ЧАСТИЧНО ЗАПОЛНЕННАЯ: Только имя пользователя', async () => {
        await page.locator('#username').fill('partialuser');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#error-message')).toHaveText(/Все поля обязательны/);
      });
    });

    await test.step('ГРУППА: Проверки успешных сценариев', async () => {
      await test.step('КОРРЕКТНЫЕ ДАННЫЕ: Полное заполнение формы', async () => {
        await page.locator('#username').fill('validuser');
        await page.locator('#email').fill('valid@example.com');
        await page.locator('#password').fill('validpassword123');
        await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
        await expect(page.locator('#success-message')).toBeVisible();
      });
    });
  });
});
