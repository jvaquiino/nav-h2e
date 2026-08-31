# Blogs Admin Module

Admin UI for managing Blogs (metadata in `page.tsx`/`_components`, content blocks in `[blogId]/content/`).

## Features
- Markdown + LaTeX editor with live preview (`[blogId]/content/_components/MarkdownField.tsx`, via `@uiw/react-md-editor` + `remark-math`/`rehype-katex`)
- Cover image upload via presigned S3 URLs (`@/actions/uploads`)
- Content blocks (markdown or video) with reorder/delete

## Dependencies
- [`@uiw/react-md-editor`](https://github.com/uiwjs/react-md-editor)
- [`remark-math`](https://github.com/remarkjs/remark-math)
- [`rehype-katex`](https://github.com/remarkjs/remark-math/tree/main/packages/rehype-katex)
- [`katex`](https://katex.org/)

# Math Examples

## Inline Math
- Sum: $\sum_{i=1}^{n} x_i$
- Fraction: $\frac{a}{b}$

## Block Math
$$
\begin{align}
y &= mx + b
\end{align}
$$
