# Web Dev Refresh

A hands-on web development refresh project focused on rebuilding and improving my JavaScript, Node.js, Express, TypeScript, API design, validation, and testing skills.

## About

This repository documents my progress while revisiting web development fundamentals and gradually moving toward more structured backend development.

The project started with JavaScript and Node.js exercises, then progressed into Express APIs, automated testing, TypeScript, runtime validation, and layered application structure.

## Current Focus

The most recent project is a TypeScript-based REST API that separates responsibilities across routes, services, repositories, validators, and shared types.

## Topics Covered

- JavaScript fundamentals
- Async / await and file operations
- Node.js
- Express
- REST API development
- CRUD operations
- Query filtering and sorting
- Runtime request validation
- TypeScript
- Type-safe API development
- Repository and service layers
- Integration testing
- Test isolation
- Error handling

## Project Structure

### `day-02`

JavaScript and Node.js practice including asynchronous operations and JSON data handling.

### `day-03-express`

Express REST API practice with:

- User CRUD operations
- Filtering and sorting
- User statistics
- Request validation
- File-based persistence
- Automated integration tests
- Isolated test data

### `day-13-typescript`

A TypeScript version of the user API focused on stronger typing and code organization.

Current structure:

```text
src/
├── repositories/
├── routes/
├── services/
├── types/
├── validators/
├── app.ts
└── server.ts
```

It includes:

- Typed request and response models
- Runtime validation
- CRUD endpoints
- Service and repository separation
- Integration testing with Supertest
- Isolated in-memory test state

The `practice/` directory contains earlier TypeScript exercises kept separately from the active application code.

## Testing

The repository currently includes automated API tests for both Express projects.

### JavaScript / Express

```bash
cd day-03-express
npm install
npm test
```

### TypeScript / Express

```bash
cd day-13-typescript
npm install
npm test
```

## Tech Stack

- JavaScript
- TypeScript
- Node.js
- Express
- Supertest
- Node.js Test Runner

## Goals

- Strengthen modern JavaScript and TypeScript fundamentals
- Improve backend architecture and code organization
- Practice API validation and error handling
- Build reliable automated tests
- Improve debugging and independent problem-solving skills
- Build portfolio-ready backend projects

## Status

Active learning and development project.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.