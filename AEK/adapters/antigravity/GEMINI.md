# Agentic Engineering Kit (AEK)

This project uses the Agentic Engineering Kit (AEK) as its engineering framework across the software development lifecycle.

AEK provides the standards, workflows, specialist roles, skills, prompts, and quality gates to guide development.

## AEK Runtime Components

- **Rules (`.agents/rules/`)**: Always-applicable engineering rules and constraints.
  - Core engineering rules: `.agents/rules/aek-core.md`
- **Skills (`.agents/skills/`)**: Antigravity-compatible specialist skills loaded on demand.

## Specialist Skills

Select the appropriate specialist skill from `.agents/skills/` based on the task:

- `founder`
- `product-manager`
- `ux-reviewer`
- `principal-software-architect`
- `senior-software-engineer`
- `software-engineer`
- `qa-engineer`
- `security-engineer`
- `devops-engineer`
- `technical-writer`

## Project Context

AEK provides the reusable engineering methodology, not project-specific knowledge.

The consuming project provides:
- Product requirements and business context (PRD, user stories)
- Architecture and technical constraints
- Existing codebase and implementation patterns
- Project-specific documentation and rules

Inspect the consuming project's relevant documentation and codebase before making substantive changes.

## Source of Truth Hierarchy

When resolving requirements or decisions, follow this priority order:

1. Explicit user requirements and decisions
2. Project-specific requirements and documentation
3. AEK engineering rules and applicable specialist skills
4. Existing implementation patterns

Never silently override explicit project requirements; identify and surface conflicts when necessary.

## Engineering Behavior

- Understand the task and context before acting.
- Identify the appropriate AEK workflow and specialist skill.
- Inspect existing code and relevant documentation.
- Make the smallest appropriate change.
- Validate changes with tests and quality gates before declaring completion.
- Avoid unrelated modifications, unnecessary dependencies, and overengineering.

Detailed engineering rules, workflows, and quality gates are defined in `.agents/rules/aek-core.md`.