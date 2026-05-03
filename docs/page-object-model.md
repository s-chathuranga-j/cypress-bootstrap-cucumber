# Page Object Model

Page objects live in `cypress/pages` and centralize UI selectors and common page actions.

Rules:

- Extend `BasePage`.
- Use arrow functions for locators.
- Export a singleton instance.
- Keep selectors out of step definitions.

Example:

```typescript
import { BasePage } from '../testbase/BasePage';

class LoginPage extends BasePage {
  usernameInput = () => cy.get('[data-test="username"]');
  passwordInput = () => cy.get('[data-test="password"]');
  loginButton = () => cy.get('[data-test="login-button"]');
}

export default new LoginPage();
```

Step definitions should express workflow and assertions by calling these objects.
