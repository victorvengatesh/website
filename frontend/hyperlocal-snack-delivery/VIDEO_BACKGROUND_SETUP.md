# Video Background Integration in Antigravity

## Easiest Method

Do not upload the MP4 inside Antigravity's chat/editor.

Put the video directly inside your project folder:

```text
frontend/public/videos/hero-snacks.mp4
```

React/Vite serves everything under `public/` automatically.

Use it like this:

```jsx
<video autoPlay muted loop playsInline>
  <source src="/videos/hero-snacks.mp4" type="video/mp4" />
</video>
```

No JavaScript import is required.

## If you are using Windows

1. Extract the project ZIP.
2. Open File Explorer.
3. Open:
   `frontend/public/videos/`
4. Keep the file name:
   `hero-snacks.mp4`
5. Open the full `hyperlocal-snack-delivery` folder in Antigravity.

## Run

Backend:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Browser Autoplay

Background videos should use:

- `autoPlay`
- `muted`
- `loop`
- `playsInline`

Browsers normally block autoplay with sound.

## Replacing the Video Later

Replace only:

```text
frontend/public/videos/hero-snacks.mp4
```

Keep the same file name and no code changes are required.
