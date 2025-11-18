# AI Sandbox Prototype

Команди приклади (English):

- move north 3
- mine east
- place south
- scan
- build tower
- go to 15 12
- inventory

Voice: натиснути 🎤 і сказати команду англійською.

Deploy на GitHub Pages:

1. Створити репозиторій, додати файли цього каталогу в корінь.
2. Git:
   git init
   git add .
   git commit -m "init game"
   git branch -M main
   git remote add origin <your_repo_url>
   git push -u origin main
3. У Settings -> Pages обрати branch main / root.
4. Через ~30 сек гра доступна за https://<username>.github.io/<repo>/

Покращення (можна додати пізніше):

- Збереження світу в localStorage.
- Більше типів блоків.
- Взаємодія з реальним LLM API (парсинг складніших інструкцій).
- Анімації та zoom.
