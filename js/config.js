/* ─────────────────────────────────────────────────────────────
   AERIS — подключение Google Таблицы
   Заявки приходят на maria.zolotaya79@gmail.com

   Один раз (5 минут), аккаунт: maria.zolotaya79@gmail.com

   1. Откройте https://sheets.google.com и создайте таблицу
      «AERIS Заявки».
   2. Расширения → Apps Script. Удалите код по умолчанию.
   3. Вставьте содержимое файла google-apps-script/Code.gs
   4. Нажмите «Развернуть» → «Новое развертывание»:
        Тип: Веб-приложение
        Запуск от имени: Меня
        У кого есть доступ: Все
   5. Скопируйте URL веб-приложения и вставьте ниже
      в GOOGLE_SCRIPT_URL (между кавычками).
   ───────────────────────────────────────────────────────────── */

window.AERIS_CONFIG = {
  googleScriptUrl:
    "https://script.google.com/macros/s/AKfycbzl9WD0ZTuKub9d5AKQrg8_NQqEHJDZtX9tWdIeP4UctDxgJxyljmbzgBWp6sXmVNSR/exec",
  notifyEmail: "maria.zolotaya79@gmail.com",
};
