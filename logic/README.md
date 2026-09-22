# Logic Diagram Tool

Browser tool for digital-logic coursework: type a Boolean equation with up to
four inputs and get the equivalent gate diagram in standard ANSI/IEEE symbols
plus the full truth table, ready to export for a typed lab report.

Live: [ahmet-keles.github.io/logic/](https://ahmet-keles.github.io/logic/)

## Features

- Inputs `A`–`D` and constants `0`/`1`; every common notation is accepted:
  `A·B`, `A*B`, `AB`, `A AND B`, `A&B` for AND; `A+B`, `A OR B`, `A|B` for OR;
  `A'`, `!A`, `~A`, `NOT A`, `¬A` for NOT; `A⊕B`, `A^B`, `A XOR B` for XOR;
  and the words `NAND`, `NOR`, `XNOR`
- Precedence NOT > AND > XOR > OR, left-associative, with parentheses for
  grouping; an optional `Y2 = …` prefix names the output
- A NOT applied directly to an AND/OR/XOR group is drawn as one NAND/NOR/XNOR
  gate with an output bubble, and `A·B·C` is one 3-input gate (2–4 inputs per
  gate)
- Automatic layout: labelled input rails on the left, gates placed by depth,
  orthogonal wires with junction dots only where a wire actually branches, and
  small inverters on the branches that need `A'` so `A` and `A'` can both be
  used
- Intermediate sub-expression labels on each gate output (toggleable) and a
  74LS chip legend for the gate types used
- Full truth table (inputs, every intermediate gate output, final output) with
  rows where the output is 1 highlighted; copy as Markdown or CSV
- Export: download the diagram as SVG or as a 2× PNG, and the truth table as PNG
- Symbol palette for `·`, `+`, `'`, `⊕`, `(`, `)`; four preloaded examples;
  live updates as you type; clear error messages with the character position
- The equation lives in the URL hash (`#eq=…`) so a diagram can be shared by
  link; `?test=1` runs the built-in self-tests

## Stack

A single `index.html` — HTML, CSS, and vanilla JavaScript rendering inline
SVG. No dependencies, no build step, no network requests.

## Local preview

Any static file server works. From the repository root:

```bash
python3 -m http.server 8000
# then open http://localhost:8000/logic/
```
