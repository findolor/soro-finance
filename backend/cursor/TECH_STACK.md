# Tech Stack

- Bun 
- Express server
- PrismaORM
- SQLite
- Node cron
- UUID for request tracking

## File Structure

backend/
├── src/
│   ├── config/                 # Configuration files
│   │   ├── database.ts        # Database configuration
│   │   ├── environment.ts     # Environment variables
│   │   └── express.ts         # Express configuration
│   │
│   ├── api/                   # API routes and controllers
│   │   ├── routes/           # Route definitions
│   │   │   ├── user.routes.ts
│   │   │   ├── project.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   └── expense.routes.ts
│   │   │
│   │   ├── controllers/      # Route controllers
│   │   │   ├── user.controller.ts
│   │   │   ├── project.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   └── expense.controller.ts
│   │   │
│   │   ├── middlewares/      # Custom middlewares
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validation.middleware.ts
│   │   │   └── error.middleware.ts
│   │   │
│   │   └── validators/       # Request validation schemas
│   │       ├── user.validator.ts
│   │       └── project.validator.ts
│   │
│   ├── services/             # Business logic
│   │   ├── user.service.ts
│   │   ├── project.service.ts
│   │   ├── payment.service.ts
│   │   └── expense.service.ts
│   │
│   ├── models/               # Prisma models and types
│   │   └── index.ts
│   │
│   ├── types/                # Global type definitions
│   │   └── express.d.ts      # Express type extensions
│   │
│   ├── utils/                # Utility functions
│   │   ├── logger.ts
│   │   ├── errors.ts
│   │   └── helpers.ts
│   │
│   ├── jobs/                 # Cron jobs
│   │   ├── payment.jobs.ts
│   │   └── report.jobs.ts
│   │
│   └── app.ts               # Express app setup
│
├── prisma/                   # Prisma schema and migrations
│   └── schema.prisma
│
├── tests/                    # Test files
│   ├── unit/
│   └── integration/
│
├── .env                      # Environment variables
├── .env.example             # Example environment variables
├── package.json
├── tsconfig.json
└── README.md

## Architecture Principles

1. **Modular Design**: Each component has a single responsibility
2. **Clean Architecture**: Separation of concerns between layers
3. **Type Safety**: Strict TypeScript usage throughout the application
4. **Testing First**: Comprehensive test coverage
5. **Security Best Practices**: Following OWASP guidelines
6. **API Design**: RESTful API principles
7. **Error Handling**: Centralized error handling and logging
8. **Configuration Management**: Environment-based configuration
9. **Code Quality**: Enforced through ESLint and Prettier
10. **Request Tracing**: UUID-based request tracking across the application

## Monitoring and Logging
- Winston for logging
- Request ID tracking with UUID
- Error tracking with request correlation
- Performance monitoring
- Database query monitoring
- Cron job monitoring

