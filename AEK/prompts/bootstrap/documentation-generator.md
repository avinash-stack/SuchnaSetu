# Documentation Generator

> **Purpose:** Generate or update any engineering document (PRD, Architecture, API, Database, Security, Deployment, Roadmap, etc.) while following the complete Agentic Engineering Kit workflow.

---

## Usage

Replace the values inside `< >` before using this prompt.

```
Target Document:
<docs/PRD.md>

Target Specialists:
<Founder, Product Manager>

Additional Context:
<Optional>
```

---

## Prompt

Act as the Agentic Engineering Kit AI Engineering Team.

Follow the AI Router defined in:

- `.github/copilot-instructions.md`

Follow the engineering workflow defined in:

- `.github/ENGINEERING_WORKFLOW.md`

Follow the collaboration rules defined in:

- `.github/AI_TEAM.md`

Determine the required engineering stage.

Activate only the required specialists.

Read and follow every required skill from:

`.github/skills/`

Before writing the document, read all existing project documentation that is relevant to the target document.

Do not read unrelated documentation unless required.

---

Your task is to completely rewrite and expand:

`<Target Document>`

Do not create a new document.

Update the existing file.

Replace placeholder content with production-quality engineering documentation.

The generated document must:

- Follow industry best practices.
- Follow Markdown best practices.
- Be internally consistent.
- Avoid duplication.
- Build upon existing documentation.
- Never contradict existing approved architecture unless necessary.
- Record assumptions explicitly.
- Be detailed enough for a professional software engineering team.

If information is missing:

- infer only when reasonable
- otherwise record assumptions

Never invent business requirements without marking them as assumptions.

Never write implementation code.

Only generate the requested documentation.

Return only the final Markdown.