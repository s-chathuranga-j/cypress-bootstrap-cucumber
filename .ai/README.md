# Central AI Agent Guidance

This folder is the centralized source of truth for AI agents working in this framework.

Agent-specific entrypoints should stay thin and refer here:

- Codex: `.codex/skills/cypress-bootstrap-cucumber/SKILL.md`
- Claude: `CLAUDE.md` and `.claude/skills/cypress-bootstrap-cucumber/SKILL.md`
- GitHub Copilot: `.github/copilot-instructions.md` and `.github/prompts/cypress-bootstrap-cucumber.prompt.md`
- Cursor: `.cursor/rules/framework.md`
- Windsurf: `.windsurfRules`
- Generic agents: `AGENTS.md`

Start with:

1. `.ai/agent-guidelines.md`
2. `.ai/skills/cypress-bootstrap-cucumber/SKILL.md`
3. `docs/conventions.md`
4. `docs/step-definitions.md`
