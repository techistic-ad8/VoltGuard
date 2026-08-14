# VoltGuard Agent Rules & Guidelines (Workspace Rules)

This document contains guidelines and constraints loaded automatically by the Antigravity agent during execution.

## 1. Core Codebase Guidelines
- **Architecture**: Enforce the 3-tier Spring Boot architecture (Controller -> Service -> Entity/Repository).
- **Frontend**: The frontend is served directly as static files from [src/main/resources/static](file:///d:/Springboot%20Project/src/main/resources/static). Keep JS vanilla and CSS in style.css.
- **Database**: H2 in-memory is the default. Do not change default database properties in `application.properties` unless explicitly asked.

## 2. GitHub Publishing Rules (Mandatory)
Every time a code modification, new file creation, or document edit is made:
1. Document the exact changes in [changes and what changes.md](file:///d:/Springboot%20Project/changes%20and%20what%20changes.md).
2. Stage all modifications: `git add .`
3. Commit with a structured Conventional Commits message.
4. Push directly to origin: `git push origin main` (or the active branch).
