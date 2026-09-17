# K-Map Looper

Browser tool for digital-logic coursework: fill a Karnaugh map, draw colored
group loops (with wrap-around), and export a clean PNG for typed submissions.

**It draws — it doesn't solve.** You decide which cells are 1/0/don't-care and
which cells belong to each group; the tool only renders the loops neatly so the
image can be pasted into a document.

Live: [ahmet-keles.github.io/kmap-looper/](https://ahmet-keles.github.io/kmap-looper/)

## Features

- 2-, 3-, and 4-variable maps (`A \ B`, `A \ BC`, `AB \ CD`) in Gray-code order
- Click cells to cycle `0 → 1 → blank`; optional minterm numbers in each cell
- Up to six colored loops; wrap-around groups (top↔bottom, left↔right) are
  drawn as open-ended pieces automatically
- Optional text label per loop (e.g. the product term it represents)
- Export: Copy PNG to the clipboard, show it inline, or download `kmap.png`

## Stack

A single `index.html` — HTML, CSS, and vanilla JavaScript drawing to a
`<canvas>`. No dependencies, no build step.

## Local preview

Any static file server works. From the repository root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/kmap-looper/
```
