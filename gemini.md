# VoltGuard Agent Rules & Guidelines

This document outlines the development standards and workflow rules for developers and AI agents working on the VoltGuard project.

## 1. General Principles
- Maintain Java code style: Use standard camelCase for variables/methods and PascalCase for classes.
- Ensure Spring Boot 3-tier layering (Controller, Service, Entity, Repository) is followed strictly.
- Keep comments and docstrings intact unless they are directly refactored or deleted.

## 2. Database Standards
- Default profile is set to H2 In-Memory database for quick local iterations.
- Do not check in database passwords or credentials; load them via environment variables or Spring profiles if changing from the local configuration.
- Any entity updates must align with repository definitions.

## 3. Custom GitHub Publishing Rule
After making changes to any code, configuration, or documentation in this repository, you must immediately stage, commit, and push these changes to GitHub.

### Committing and Pushing Changes
- **Format**: Follow the Conventional Commits specification.
  - `feat`: A new feature (e.g., adding a controller endpoint or a UI view).
  - `fix`: A bug fix (e.g., correcting a compile error).
  - `docs`: Documentation-only changes (e.g., updating README or architecture.md).
  - `refactor`: Code change that neither fixes a bug nor adds a feature.
- **Commit Structure**:
  ```text
  <type>(<scope>): <short summary description>

  <detailed explanation of the changes, listing the modified files and why the changes were made>
  ```
- **Execution**: Run the following git sequence:
  ```bash
  git add .
  git commit -m "<formatted message>"
  git push origin <branch-name>
  ```
- Make sure to write a detailed change log file named `changes and what changes.md` in the root directory tracing the changes.
