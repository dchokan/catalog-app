---
name: git-workflow
description: "Git workflow, branching strategy, commit message format, and code review guidelines. Use this skill PROACTIVELY whenever making commits, creating branches, opening PRs, merging code, resolving conflicts, or any git-related operation in this project. Also trigger when the user asks about commit format, branch naming, PR process, hotfix procedures, or deployment workflow. Even if the user doesn't mention 'git' explicitly — if they're committing, branching, or preparing a release, use this skill."
---

# Git Workflow Guide

## Commit Message Format

### All commit messages should follow this structure

```
[action]:[short description of what was done]

[element/file/section]:[brief description of all changes]
```

### Action Types

- **feat**: When adding new features, files, or components
- **fix**: When fixing bugs or issues
- **docs**: When updating documentation
- **style**: When formatting code, adding semicolons, etc (no production code change)
- **refactor**: When refactoring production code, renaming variables, etc
- **test**: When adding or modifying tests
- **chore**: When updating build tasks, package manager configs, etc
- **perf**: When improving performance
- **ci**: When changing CI/CD configuration files and scripts
- **build**: When changing build system or external dependencies
- **revert**: When reverting a previous commit

### Examples

```
feat: add user authentication system

auth.service.ts: implement login and logout methods

auth.component.tsx: create login form component

auth.store.ts: add authentication state management
```

```
fix: resolve payment processing error

payment.api.ts: fix API endpoint URL typo

payment.component.tsx: add error handling for failed payments
```

```
refactor: improve product card responsive design

product-card.component.tsx: adjust layout for mobile devices

product-card.service.ts: optimize image loading logic
```

```
docs: update API documentation

README.md: add authentication endpoints documentation

api.md: update payment flow examples
```

```
test: add user authentication tests

auth.service.spec.ts: add login/logout test cases

auth.component.spec.ts: add form validation tests
```

```
chore: update build configuration

package.json: update dependencies to latest versions

webpack.config.js: add new build optimization
```

### Commit Message Best Practices

- **Use the imperative mood**: "add feature" not "added feature"
- **Keep the first line under 50 characters** for better readability
- **Capitalize the first letter** of the action type
- **No period at the end** of the subject line
- **Use present tense**: "change" not "changed" or "changes"
- **Reference issues when applicable**: `fix: resolve login error (#123)`
- **Be specific and descriptive** in the description
- **Separate subject from body** with a blank line if needed

### Advanced Commit Examples

```
feat!: add breaking changes to user API

BREAKING CHANGE: user endpoint now requires authentication

user.api.ts: add authentication middleware

user.service.ts: update method signatures
```

```
fix(auth): resolve token expiration handling

auth.service.ts: fix token refresh logic

auth.interceptor.ts: add proper error handling
```

```
perf(images): optimize image loading performance

image.component.tsx: implement lazy loading

image.service.ts: add image compression

image.util.ts: add caching mechanism
```

## Branch Structure

### Main Branches (Permanent)

These branches should always exist and never be deleted:

#### `main`

- **Purpose**: Production-ready code
- **Environment**: Production
- **Deployment**: Automatically deployed to production
- **Protection**: Requires pull request reviews, no direct pushes
- **Merge from**: `staging` branch only

#### `staging`

- **Purpose**: Stable code for testing
- **Environment**: Staging/Testing
- **Deployment**: Automatically deployed to staging environment
- **Protection**: Requires pull request reviews
- **Merge from**: `develop` branch and hotfix branches
- **Merge to**: `main` branch after testing

#### `develop`

- **Purpose**: Integration branch for features
- **Environment**: Development
- **Deployment**: Automatically deployed to development environment
- **Protection**: Requires pull request reviews
- **Merge from**: Feature branches, bugfix branches
- **Merge to**: `staging` branch

#### Feature Branches

```
feature/[short-description]
```

Examples:

- `feature/user-authentication`
- `feature/payment-integration`
- `feature/product-comparison`
- `feature/admin-dashboard`

#### Fix Branches

```
fix/[short-description]
```

Examples:

- `fix/login-validation-error`
- `fix/mobile-responsive-issues`
- `fix/payment-gateway-timeout`
- `fix/image-loading-performance`

#### Hotfix Branches

```
hotfix/[short-description]
```

Examples:

- `hotfix/critical-security-patch`
- `hotfix/payment-gateway-outage`
- `hotfix/database-connection-issue`

**Note**: Hotfix branches are created from `main` and merged back to both `main` and `develop`

### Best Practices

- **Keep descriptions concise** - use hyphens to separate words
- **Use lowercase** - all branch names should be lowercase
- **Be descriptive** - the name should clearly indicate what the branch does
- **Avoid special characters** - stick to letters, numbers, and hyphens
- **Delete merged branches** - clean up after successful merges

### Branch Workflow

#### Feature Development Workflow

- Create feature branch from `develop`: `git checkout -b feature/user-authentication`
- Work on your feature/fix
- Commit changes following the message format
- Push branch: `git push origin feature/user-authentication`
- Create Pull Request to `develop`
- After code review and merge, delete the branch

#### Release Workflow

- Create release from `develop` to `staging`
- Test thoroughly on staging environment
- If tests pass, create Pull Request from `staging` to `main`
- Deploy to production automatically after merge

#### Hotfix Workflow

- Create hotfix branch from `main`: `git checkout -b hotfix/critical-fix`
- Fix the critical issue
- Create Pull Request to `main` for immediate production deployment
- Create Pull Request to `develop` to keep branches synchronized
- Delete hotfix branch after both merges

#### Branch Protection Rules

- **main**: Requires 1 approvals, status checks must pass
- **staging**: Requires 1 approval, status checks must pass
- **develop**: Requires 1 approval, status checks must pass
- No direct pushes to main branches allowed

## Environment Mapping

| Branch    | Environment | URL                        | Auto-Deploy | Purpose                         |
| --------- | ----------- | -------------------------- | ----------- | ------------------------------- |
| `main`    | Production  | https://domain.com         | Yes         | Live application for end users  |
| `staging` | Staging     | https://staging.domain.com | Yes         | Final testing before production |
| `develop` | Development | https://develop.domain.com | Yes         | Feature integration and testing |

## Workflow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   DEVELOP   │───▶│   STAGING   │───▶│    MAIN     │
│ (features)  │    │ (testing)   │    │ (production)│
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                  ▲                  │
       │                  │                  │
       │                  │                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   FEATURE   │    │   HOTFIX    │    │   HOTFIX    │
│  BRANCHES   │    │  BRANCHES   │    │  BRANCHES   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## Important Rules

### Branch Management

- **Never delete main branches** (`main`, `staging`, `develop`)
- **Always create PR** - no direct pushes to main branches
- **Test before merging** - ensure all tests pass in CI/CD
- **Keep branches up to date** - regularly sync with parent branch
- **Delete merged branches** - clean up feature/fix branches after merge
- **Rebase before merging** - keep commit history clean
- **Squash related commits** - combine small fixes into logical units
- **Use descriptive branch names** - make the purpose clear

### Code Quality

- **Always write commit messages in English** (comments in code should also be in English)
- **Reference issue numbers** when applicable: `fix: resolve login error (#123)`
- **Use present tense** in commit messages: "add feature" not "added feature"
- **Keep the first line under 50 characters** for better readability
- **Use bullet points** for multiple changes in the description

### Emergency Procedures

- **Production hotfixes** must be created from `main` branch
- **Critical fixes** require immediate review and deployment
- **Rollback plan** must be prepared for production deployments
- **Staging tests** are mandatory before production release

### Team Workflow

- **Code reviews** are mandatory for all Pull Requests
- **Approval required** from at least one team member
- **Status checks** must pass before merging
- **Documentation** should be updated with significant changes
- **Assign reviewers** based on code expertise
- **Address feedback** before requesting re-review

## Conflict Resolution

### Handling Merge Conflicts

- **Pull latest changes** from target branch before creating PR
- **Resolve conflicts locally** using your preferred merge tool
- **Test after resolving** - ensure functionality still works
- **Commit conflict resolution** with clear message
- **Push resolved changes** and notify reviewers

## Security Guidelines

- **Never commit sensitive data** (passwords, API keys, secrets)
- **Use environment variables** for configuration
- **Review dependencies** before adding new packages
- **Scan for vulnerabilities** regularly
- **Follow security best practices** in code reviews

## Performance Considerations

- **Keep commits atomic** - one logical change per commit
- **Avoid large binary files** - use Git LFS if necessary
- **Regular cleanup** - remove unused branches and files
- **Monitor repository size** - consider splitting large repos

## Troubleshooting

### Common Issues

- **Branch behind main**: `git pull origin main` then resolve conflicts
- **Failed CI/CD**: Check logs, fix issues, push again
- **Merge conflicts**: Use `git mergetool` or IDE merge tools
- **Lost commits**: Use `git reflog` to recover
- **Wrong branch**: Use `git cherry-pick` to move commits

### Emergency Procedures

- **Broken production**: Create hotfix from `main` immediately
- **Accidental push**: Use `git revert` for safe rollback
- **Corrupted branch**: Create new branch from last stable commit
- **CI/CD failure**: Investigate logs, fix configuration, redeploy

## Automation & Integration

### GitHub Actions Integration

- **Automated testing** on every PR
- **Code quality checks** (ESLint, TypeScript, etc.)
- **Security scanning** for vulnerabilities
- **Automatic deployment** to staging/production
- **Dependency updates** via Dependabot

### Required Status Checks

Before merging to main branches, ensure:

- All tests pass
- Code quality checks pass
- Security scan passes
- Build succeeds
- Documentation is updated

### Automated Workflows (example)

```yaml
name: CI/CD Pipeline

on:
  pull_request:
    branches: [main, staging, develop]
  push:
    branches: [main, staging, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint
```

## Code Review Guidelines

### Review Checklist

- **Code functionality** - Does it work as expected?
- **Code quality** - Is it readable and maintainable?
- **Performance** - Are there any performance implications?
- **Security** - Are there any security concerns?
- **Tests** - Are there adequate tests?
- **Documentation** - Is documentation updated?
- **Breaking changes** - Are breaking changes documented?

### Review Process

- **Self-review** before requesting others
- **Request specific reviewers** based on expertise
- **Address feedback** constructively
- **Re-request review** after making changes
- **Merge only after approval** and passing checks
