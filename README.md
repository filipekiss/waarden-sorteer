# Waarden Sorteertaak

A small client-side app for the ACT in Actie "Waarden Sorteertaak" exercise. Sort 125 values
into three piles, pick your top 10, rank them, and mark which ones are already present in your life.

The full state lives in the URL hash (`#u=…&z=…&b=…&n=…&t=…&p=…`), so the address bar always
shows the current layout and the link can be shared. Nothing is sent to or stored on a server.

## Development

```sh
npm install
npm run dev      # local dev server
npm run build    # production build into dist/
```

## Deploying to GitHub Pages

The workflow in `.github/workflows/pages.yml` builds the app and deploys it on every push to `main`.

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the Actions tab).

The site will be available at `https://<your-username>.github.io/<repo-name>/`. The build uses
relative asset paths, so it works from any subpath.
