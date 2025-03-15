# Professional Commit Message Prompt

## Instructions

Use the following structure to write clear and professional commit messages that accurately describe the changes made in each commit.

### Structure

1. **Header**: A concise summary of the changes (max 50 characters).
2. **Body** (optional): Detailed explanation of the changes, including the reason for the change and any relevant context. Use bullet points or paragraphs as needed.
3. **Footer** (optional): Include any references to issues, pull requests, or other relevant information.

### Example

```
feat: Add user authentication

- Implemented login and registration functionality
- Added password encryption using bcrypt
- Updated database schema to include user table

Closes #123
```

### Guidelines

- Use the imperative mood in the header (e.g., "Add" instead of "Added").
- Limit the header to 50 characters.
- Keep the body at 72 characters per line.
- Explain the "why" and "what" in the body, not the "how".
- Reference issues or pull requests in the footer when applicable.

## Template

```
<type>: <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc)
- `refactor`: Code refactoring (no functional changes)
- `test`: Adding or updating tests
- `chore`: Maintenance tasks (updating dependencies, etc)

### Subject

A brief description of the changes.

### Body

- Detailed explanation of what changes were made and why.
- Use bullet points for multiple changes.
- Include any relevant context or background information.

### Footer

- Reference any related issues or pull requests (e.g., "Closes #123").
