# Contributing to OmPathy

We welcome contributions to the OmPathy project! This document provides guidelines for contributing to the codebase.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature or bugfix
4. Make your changes
5. Test your changes thoroughly
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager
- PostgreSQL database (for production features)

### Local Development
```bash
# Clone your fork
git clone https://github.com/your-username/ompathy-website.git
cd ompathy-website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

## Code Style and Standards

### TypeScript/JavaScript
- Use TypeScript for all new code
- Follow existing code style and formatting
- Use meaningful variable and function names
- Add proper type annotations
- Write JSDoc comments for complex functions

### React Components
- Use functional components with hooks
- Keep components small and focused
- Use proper prop types with TypeScript interfaces
- Follow the existing component structure

### CSS/Styling
- Use Tailwind CSS for styling
- Follow the existing design system
- Ensure responsive design for all screen sizes
- Use semantic color names from the design system

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
├── shared/                 # Shared types and schemas
└── attached_assets/        # Static assets and images
```

## Commit Message Guidelines

Use conventional commit messages:

```
feat: add new contact form validation
fix: resolve navigation menu mobile responsiveness
docs: update README with deployment instructions
style: improve button hover animations
refactor: simplify database connection logic
test: add unit tests for contact form
```

## Pull Request Process

1. **Update Documentation**: Update README.md if needed
2. **Test Your Changes**: Ensure all existing functionality works
3. **Check Code Style**: Follow the existing code conventions
4. **Write Clear Descriptions**: Explain what your PR does and why
5. **Link Issues**: Reference any related GitHub issues

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing
- [ ] I have tested my changes locally
- [ ] All existing tests pass
- [ ] I have added new tests if needed

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Related Issues
Fixes #(issue number)
```

## Issues and Bug Reports

When creating an issue, please include:

1. **Clear Description**: What is the problem or feature request?
2. **Steps to Reproduce**: For bugs, provide step-by-step instructions
3. **Expected Behavior**: What should happen?
4. **Actual Behavior**: What actually happens?
5. **Environment**: Browser, OS, Node.js version, etc.
6. **Screenshots**: If applicable

## Feature Requests

For new features:

1. **Use Case**: Explain why this feature would be useful
2. **Proposed Solution**: How should it work?
3. **Alternative Solutions**: What other approaches did you consider?
4. **Additional Context**: Any other relevant information

## Code Review Process

All contributions require code review:

1. **Automated Checks**: Ensure all CI checks pass
2. **Code Quality**: Review for code style and best practices
3. **Functionality**: Verify the feature works as expected
4. **Security**: Check for potential security issues
5. **Performance**: Consider impact on application performance

## Resources

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)

## Questions?

If you have questions about contributing:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Contact the maintainers

Thank you for contributing to OmPathy!