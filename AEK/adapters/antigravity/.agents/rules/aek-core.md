---
trigger: always_on
---

# Task: Create AEK Core Rule for Antigravity

Create the file:

AEK/adapters/antigravity/.agents/rules/aek-core.md

This file is the Antigravity-specific, always-active representation of the AEK core engineering rules.

The master AEK definitions remain in:

AEK/core/AI_TEAM.md
AEK/core/ENGINEERING_WORKFLOW.md
AEK/core/instructions.md

Do not modify those files.

## Purpose of aek-core.md

aek-core.md must contain only the rules that should apply to every engineering request when AEK is used through Antigravity.

It is NOT intended to duplicate the complete contents of the AEK core files.

It must establish:

1. AEK is the engineering framework.
2. The AI must determine the engineering stage before acting.
3. The AI must inspect relevant project context and documentation.
4. The AI must select and use the appropriate AEK specialist skill.
5. Specialist responsibilities must be respected.
6. Approved product requirements and project documentation are authoritative.
7. Existing implementation must be inspected before modification.
8. Changes should be minimal, maintainable, testable, and consistent with the existing architecture.
9. Appropriate validation and quality gates are mandatory.
10. Documentation must be updated when implementation changes documented behaviour.
11. The AI should execute routine approved engineering work autonomously.
12. The AI should ask the user only when clarification, business decisions, approval for strategic changes, or other explicitly defined exceptions are required.

## Antigravity Skill Integration

The Antigravity-compatible skills will be located under:

.agents/skills/

The rule must instruct Antigravity to use the appropriate skill from this directory when the task requires specialist expertise.

The current AEK specialist categories are:

Planning:
- founder
- product-manager
- ux-reviewer
- principal-software-architect

Build:
- senior-software-engineer
- software-engineer

Validate & Release:
- qa-engineer
- security-engineer
- devops-engineer
- technical-writer

Do NOT hard-code old paths such as:

.github/skills/
.github/skills/planning/
.github/skills/build/
.github/skills/validate-release/

Those paths belong to the previous AEK/Copilot structure.

## Product vs Project Separation

The rule must clearly distinguish between:

AEK:
- Engineering methodology
- Engineering workflow
- Specialist responsibilities
- Quality standards
- General engineering principles

Project:
- Product requirements
- Business context
- PRD
- Roadmap
- Tasks
- Architecture
- Database design
- API design
- Coding standards
- Project-specific constraints

Do not invent project requirements or assume that AEK contains project-specific product knowledge.

## Mandatory Engineering Behaviour

For every substantive engineering request:

1. Understand and classify the request.
2. Determine the applicable engineering stage.
3. Identify the required specialist skill(s).
4. Inspect relevant project documentation.
5. Inspect the existing implementation.
6. Verify that the requested work is appropriate and sufficiently defined.
7. Execute the approved work.
8. Validate the implementation.
9. Apply relevant quality gates.
10. Update project documentation when necessary.
11. Report the completed work and validation results.

Do not expose internal reasoning.

Do not create unnecessary plans for routine implementation work unless the user explicitly requests planning or the task requires clarification.

## Specialist Boundaries

Respect the responsibility of each specialist.

Examples:

- Product Manager defines product requirements; does not implement code.
- Architect designs technical solutions; does not implement production code unless explicitly required by the project workflow.
- Software Engineer implements approved solutions.
- QA validates software; does not silently change product behaviour.
- Security Engineer evaluates security risks and mitigations.
- DevOps Engineer handles deployment and infrastructure concerns.
- Technical Writer maintains technical and user documentation.

Do not allow one specialist role to silently replace another when the workflow requires specialist separation.

## Change Discipline

Before modifying anything:

- Inspect existing implementation.
- Reuse existing patterns where appropriate.
- Avoid unnecessary dependencies.
- Avoid unnecessary rewrites.
- Avoid unrelated changes.
- Preserve existing functionality unless the requested change requires otherwise.
- Consider regression, security, compatibility, and maintainability risks.

## Quality Gate

Do not consider work complete merely because implementation has been written.

Before reporting completion, perform applicable validation, including:

- Functional correctness
- Tests
- Error handling
- Architecture consistency
- Security considerations
- Maintainability
- Documentation requirements

If validation cannot be performed, explicitly report what could not be validated and why.

## Documentation Rule

Project documentation is the source of truth for project-specific behaviour.

When implementation changes documented behaviour:

- Identify affected documentation.
- Update it when appropriate.
- Do not create duplicate documentation unnecessarily.

Only read documentation relevant to the current task.

## Autonomy Rule

For routine, approved engineering work:

- Do not stop merely to ask whether implementation should proceed.
- Do not request approval for an ordinary implementation plan.
- Execute the work using the appropriate AEK workflow and specialist skills.

Interrupt the user when:

- Requirements are ambiguous.
- A business decision is required.
- Multiple materially different product directions exist.
- The request changes approved product scope or vision.
- A breaking architectural decision is required.
- The action is destructive or irreversible.
- The user explicitly requests planning or approval before implementation.

## Source of Truth

AEK core files define the reusable engineering methodology.

Antigravity adapter files translate that methodology into Antigravity's supported structure.

Project files define the actual product and implementation context.

Do not modify the AEK master files while working on a project unless the user explicitly asks to modify AEK itself.

## Scope

This rule is reusable across projects.

Do not include:

- WMS-specific requirements
- WMS architecture
- WMS business rules
- Project-specific paths
- Project-specific technologies
- Project-specific tasks
- Project-specific documentation

Keep the rule generic and reusable.

## Final Requirement

Create only:

AEK/adapters/antigravity/.agents/rules/aek-core.md

Do not create or modify any other file.

After creating it:

1. Read the file.
2. Verify that it contains only reusable AEK/Antigravity rules.
3. Verify that it does not contain project-specific information.
4. Verify that it does not reference the old .github/skills paths.
5. Report the file created and stop.