# Eugenia Ohenewa Amadi — Portfolio

A single-page, static portfolio site. Plain HTML/CSS/JS, no build step, no dependencies.

## Structure

```
portfolio/
  index.html
  css/style.css
  js/main.js
  assets/images/     (drop photos here)
```

## Adding images

**Headshot** — done. `assets/images/headshot.jpg` is live in the hero. A second option, `assets/images/headshot-alt.jpg` (the office/desk shot), is saved in the same folder if you'd rather swap it in; just change the `src` on the `<img class="hero-photo">` tag in `index.html`.

**JiXuan screenshots** — still a placeholder. Save images as `assets/images/jixuan-1.jpg`, `jixuan-2.jpg`, etc., then in the Builder section replace the `<div class="img-placeholder shot-placeholder">` block with `<img>` tags (or a small `<div class="shot-row">` of a few images) pointing at those files.

No other markup needs to change.

## Deploying

### GitHub Pages
1. Push this repo to GitHub (already done if you're reading this from the repo).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch."
4. Choose the branch this site lives on, and set the folder to `/portfolio`.
5. Save. GitHub will publish at `https://<username>.github.io/<repo>/`.

If you'd rather serve it at the root of a GitHub Pages URL, copy the contents of `portfolio/` into a separate repo named `<username>.github.io` (or into the root of this repo) instead of using the `/portfolio` subfolder option.

### Netlify
1. New site from Git → pick this repository and branch.
2. **Base directory:** `portfolio`
3. **Build command:** (leave empty)
4. **Publish directory:** `portfolio` (or `.` if base directory is already set to `portfolio`)
5. Deploy.

Netlify also supports drag-and-drop: zip the `portfolio/` folder's contents and drop them on netlify.com/drop for an instant preview URL.

## Local preview

Any static file server works, e.g.:

```
cd portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.
