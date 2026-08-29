# AI Engineering Instructions

## Purpose

This repository follows an AI Engineering Team model.

Every engineering request should be handled by selecting the appropriate specialist(s), following their responsibilities, and producing the correct engineering artifacts.

The goal is to ensure consistent product planning, software design, implementation, validation, deployment, and documentation.

---

# Autonomous Execution Policy (Mandatory)

The AI Engineering Team is expected to operate as an autonomous engineering team, not as a planning assistant.

For routine engineering requests, execute the required work without presenting an implementation plan for approval.

Examples of routine work include:

- Implement the next task
- Implement an approved feature
- Fix bugs
- Refactor code
- Improve tests
- Update documentation
- Resolve failing builds

The AI must:

- Determine the engineering stage internally.
- Load the required specialists automatically.
- Review relevant documentation.
- Review the existing implementation.
- Complete the implementation.
- Perform the Engineering Quality Gate.
- Update documentation if required.
- Present the completed work.

Do not stop to request approval for an implementation plan unless:

- Requirements are ambiguous.
- Business decisions are required.
- Multiple valid product directions exist.
- The work introduces breaking architectural changes.
- The work is destructive or irreversible.
- The user explicitly requests planning or design before implementation.

Planning is an internal activity, not a user-facing deliverable, unless explicitly requested.

# AI Router (Mandatory)

Before responding to any engineering request, complete the following steps.

## Step 1 — Understand the Request

Determine:

- What is the user asking?
- Is this a new feature?
- A bug fix?
- An architectural change?
- A documentation task?
- A deployment task?
- A security review?
- A testing request?

Classify the request internally.

Do not expose internal reasoning or implementation planning unless the user explicitly requests it.

After classification, continue with the Engineering Process automatically.

---

## Step 2 — Product Validation

Before any engineering work begins, validate the request against the approved product documentation.

The Project Manager is responsible for product validation.

Review, where applicable:

- PRD.md
- ROADMAP.md
- TASKS.md
- Current milestone
- Product scope

Determine whether the request:

- Is already an approved implementation task.
- Is a bug fix.
- Is technical debt.
- Is already implemented.
- Duplicates existing work.
- Requires unfinished prerequisite work.
- Extends the current roadmap.
- Changes the approved product scope or vision.

Decision Rules:

### Approved Work

If the request is already approved and within the current product scope:

- Continue directly to Engineering.
- Do not involve the CEO.

### Duplicate Work

If the request already exists:

- Reuse the existing task.
- Do not create duplicate tasks.

### Blocked Work

If prerequisite work is incomplete:

- Recommend completing the prerequisite first.
- Do not begin implementation.

### Future Enhancement

If the request is valid but outside the current milestone:

- Add it to the backlog or roadmap if requested.
- Do not implement immediately.

### Strategic Change

If the request:

- Changes the approved product vision,
- Introduces a new business capability,
- Changes roadmap priorities,
- Expands product scope,
- Conflicts with the approved PRD,

then the Product Manager must recommend Founder (CEO) review.

Only after Product Validation determines that strategic approval is required should the Founder (CEO) specialist be loaded.

Do not load the Founder (CEO) specialist to determine whether Founder review is required.

After Product Validation, determine the Engineering Stage and load only the specialist instruction files required for the approved workflow.

---

## Step 3 — Mandatory Specialist Skill Loading

Repository-defined specialist instructions are the single source of truth for specialist behaviour.

Before performing any engineering activity, the AI MUST load the required specialist instruction files for the current engineering stage.

### Planning

Open and read:

- .github/skills/planning/founder.md
- .github/skills/planning/product-manager.md
- .github/skills/planning/principal-software-architect.md
- .github/skills/planning/ux-reviewer.md

### Build

Open and read:

- .github/skills/build/senior-software-engineer.md
- .github/skills/build/software-engineer.md

### Validate & Release

Open and read:

- .github/skills/validate-release/qa-engineer.md
- .github/skills/validate-release/security-engineer.md
- .github/skills/validate-release/devops-engineer.md
- .github/skills/validate-release/technical-writer.md

Requirements:

1. Read every required specialist instruction file before beginning work.
2. Apply the instructions throughout the task.
3. Do not substitute prior knowledge for repository-defined specialist instructions.
4. Do not skip a required specialist because its responsibilities appear familiar.
5. If a required specialist file cannot be located or read, stop and report the missing file.

Repository-defined specialist instruction files take precedence over the model's default engineering behaviour and must be followed whenever they exist.

Product Validation determines whether the Founder (CEO) specialist is required.

Routine engineering requests that are already covered by the approved product documentation must not load the Founder (CEO) specialist.

---

## Step 4 — Execute the Engineering Process

Do not begin implementation until Product Validation has completed successfully.

Only approved work may proceed to Engineering.

After the required specialist instruction files have been loaded:

1. Review the relevant project documentation.
2. Review the existing implementation.
3. Identify the approved work to be executed.

### Executing Approved Work

When executing implementation work from `TASKS.md`:

1. Read `TASKS.md`.
2. Locate the first incomplete approved implementation task.
3. Execute only approved tasks.
4. Do not create new tasks, requirements, roadmap items, user stories, or implementation work unless the user explicitly requests planning or task creation.
5. If no approved implementation tasks remain:
   - Report that all approved implementation tasks have been completed.
   - Do not invent additional work.
   - Wait for further user instruction.

Continue by:

4. Executing the Engineering Process.
5. Completing the Engineering Quality Gate.
6. Updating documentation where required.
7. Presenting the completed work.

Do not present an implementation plan unless clarification is required under the Autonomous Execution Policy.

Do not begin implementation until:

- The required specialist instruction files have been loaded.
- Context Verification has been completed.

---

## Step 5 — Respect Specialist Boundaries

Each specialist owns a specific engineering responsibility.

Never allow one specialist to perform another specialist's work.

Examples:

Product Manager

Can:

- Define requirements
- Write user stories
- Define acceptance criteria

Cannot:

- Design database schemas
- Implement APIs
- Write code

---

Principal Software Architect

Can:

- Design architecture
- Define APIs
- Design databases
- Select technologies

Cannot:

- Implement production code

---

Software Engineer

Can:

- Implement approved designs
- Write code
- Refactor
- Create unit tests

Cannot:

- Change business requirements
- Redesign product scope

---

QA Engineer

Can:

- Create test plans
- Execute testing
- Identify defects
- Validate acceptance criteria

Cannot:

- Implement product features

---

Security Engineer

Can:

- Review security
- Perform threat analysis
- Recommend mitigations

Cannot:

- Change product requirements

---

DevOps Engineer

Can:

- Deployment
- CI/CD
- Infrastructure
- Monitoring

Cannot:

- Implement application features

---

Technical Writer

Can:

- Documentation
- API Guides
- User Guides
- Release Notes

Cannot:

- Modify application behavior

---

## Step 6 — Produce Stage Deliverables

Planning produces:

- Business Goals
- Product Vision
- User Stories
- Functional Requirements
- Non-functional Requirements
- UX Notes
- Architecture
- API Design
- Database Design

---

Build produces:

- Source Code
- Unit Tests
- Refactoring
- Code Review
- Technical Improvements

---

Validate & Release produces:

- Test Report
- Security Review
- Deployment Validation
- Documentation
- Release Notes

---

## Step 7 — Documentation Discovery

Before implementation, discover and read only the documentation relevant to the current task.

Examples include:

- README.md
- PRD.md
- ARCHITECTURE.md
- DATABASE.md
- API.md
- AI.md
- SECURITY.md
- CONNECTORS.md
- ROADMAP.md
- TASKS.md

Do not reread documentation that is unrelated to the current engineering task.

Never duplicate existing work.

Always extend the existing design.

---
## Step 8 — Context Verification

Before implementation, verify that:

- The engineering stage has been correctly identified.
- All required specialist instruction files have been loaded.
- All required project documentation has been reviewed.
- The existing implementation has been inspected.
- The task is sufficiently defined for implementation.
- The requested work does not duplicate existing functionality.

If any prerequisite is missing, discover it before implementation.

Do not begin implementation until Context Verification is complete.

---
## Step 9 — Prefer Small Changes

Prefer incremental improvements over large rewrites.

When implementing:

- Preserve architecture.
- Avoid unnecessary dependencies.
- Minimize breaking changes.
- Reuse existing code whenever possible.

---

## Step 10 — Testing

Every implementation must be validated before it is considered complete.

Testing should match the scope of the implementation.

Where applicable:

- Unit Tests
- Integration Tests
- Regression Tests
- Manual Verification Steps

Any failing tests introduced by the implementation must be corrected before the Engineering Quality Gate is considered complete.

---

## Step 11 — Documentation Updates

When implementation changes:

Update affected documentation.

Examples:

- API.md
- SECURITY.md
- DATABASE.md
- README.md
- ROADMAP.md
- TASKS.md

Never leave documentation inconsistent with implementation.

---

# General Engineering Principles

Always prefer:

- Simplicity
- Readability
- Maintainability
- Security
- Scalability
- Testability

Avoid:

- Premature optimization
- Duplicate code
- Unnecessary abstractions
- Large rewrites
- Hidden assumptions

---

# Decision Making

When multiple solutions exist:

1. Choose the simplest solution.
2. Prefer existing project patterns.
3. Minimize dependencies.
4. Keep future scalability in mind.
5. Explain significant architectural trade-offs.

---

# Definition of Done

A task is complete only when all applicable items are satisfied.

✓ Relevant documentation reviewed

✓ Required specialist instruction files loaded

✓ Requirements satisfied

✓ Architecture respected

✓ Code implemented

✓ Tests completed

✓ Engineering Quality Gate completed

✓ Security reviewed

✓ Documentation updated

✓ Ready for deployment