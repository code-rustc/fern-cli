# Contributing

Thanks for your interest in contributing to this SDK! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm

### Installation

Install the project dependencies:

```bash
npm install
```

### Building

Build the project:

```bash
npm run build
```

### Testing

Type-check the project:

```bash
npm test
```

## About Generated Code

**Important**: This SDK is automatically generated from the API definition. Direct modifications to generated files will be overwritten the next time the SDK is regenerated.

While we value open-source contributions to this SDK, this library is generated programmatically.
Additions made directly to this library would have to be moved over to our generation code,
otherwise they would be overwritten upon the next generated release. Feel free to open a PR as
a proof of concept, but know that we will not be able to merge it as-is. We suggest opening
an issue first to discuss with us!

On the other hand, contributions to the README are always very welcome!

## Making Changes

### Workflow

1. Create a new branch for your changes
2. Make your modifications
3. Type-check to ensure nothing breaks: `npm test`
4. Build the project: `npm run build`
5. Commit your changes with a clear commit message
6. Push your branch and open an issue to discuss before opening a pull request

### Commit Messages

Write clear, descriptive commit messages that explain what changed and why.

## Questions or Issues?

If you have questions or run into issues, please open an issue to discuss.
