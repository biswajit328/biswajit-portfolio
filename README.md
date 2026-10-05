# Biswajit — Portfolio

A small, dependency-free static portfolio. The layouts and product illustrations are authored in HTML/CSS/SVG; the JavaScript handles responsive navigation, a restrained pointer-driven hero image, progressive enhancement, and configured links. The hero uses the portrait supplied for this portfolio in `assets/biswajit-hero.jpg`.

## Run locally

Requires Node.js 20 or later (no package install is needed).

```sh
npm run build
npm start
```

Open http://localhost:4173.

## Personal details to configure

Edit `site-data.js` before publishing:

- Set `siteUrl` to the final HTTPS domain. The build then writes a canonical URL and `sitemap.xml`, and adds the sitemap to `robots.txt`.
- Add verified `email`, `linkedin`, Nexora `repository`, and `deployment` URLs if they are ready to share.
- Set `resume` to a real PDF path after adding that file to the site.
- Update the education dates, institution, and coursework in `index.html` when confirmed.
- Add further project details only when their links and claims are verified.

For Vercel, import the repository with the included `vercel.json`. The build command is `npm run build` and the output directory is `dist`. For other static hosts, publish `dist/`.

## Notes

- No analytics, form backend, external image assets, or UI framework are required.
- Google Fonts are progressive enhancement; the system falls back to installed sans-serif, serif, and monospace fonts.
- No canonical URL or sitemap is generated until a real site origin is configured.
- The Nexora bundle change is shown as the approximate result provided for the project; confirm its measurement context before adding further performance claims.
