import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Team Task Manager API",
      version: "1.0.0",
      description:
        "Role-based team task management API. Supports Admin and Member roles with JWT authentication.",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token obtained from /login",
        },
      },
      schemas: {
        // ─── Enums ───────────────────────────────────────────────
        Role: {
          type: "string",
          enum: ["ADMIN", "MEMBER"],
        },
        Status: {
          type: "string",
          enum: ["ACTIVE", "INACTIVE"],
        },
        TaskStatus: {
          type: "string",
          enum: ["TODO", "IN_PROGRESS", "DONE"],
        },
        Priority: {
          type: "string",
          enum: ["LOW", "MEDIUM", "HIGH"],
        },

        // ─── User ────────────────────────────────────────────────
        User: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            role: { $ref: "#/components/schemas/Role" },
            status: { $ref: "#/components/schemas/Status" },
            createdAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Project ─────────────────────────────────────────────
        Project: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            name: { type: "string" },
            description: { type: "string", nullable: true },
            ownerId: { type: "string", format: "uuid" },
            isDeleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Task ────────────────────────────────────────────────
        Task: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string" },
            description: { type: "string", nullable: true },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/Priority" },
            dueDate: { type: "string", format: "date-time", nullable: true },
            projectId: { type: "string", format: "uuid" },
            creatorId: { type: "string", format: "uuid" },
            assigneeId: { type: "string", format: "uuid", nullable: true },
            isDeleted: { type: "boolean" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },

        // ─── Request Bodies ───────────────────────────────────────
        RegisterInput: {
          type: "object",
          required: ["name", "email", "password"],
          properties: {
            name: { type: "string", minLength: 3, example: "Ahmad Khan" },
            email: { type: "string", format: "email", example: "ahmad@example.com" },
            password: {
              type: "string",
              minLength: 8,
              example: "Password123",
              description: "Min 8 chars, at least one uppercase letter",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email", example: "admin@taskmanager.com" },
            password: { type: "string", example: "Admin@123" },
          },
        },
        CreateProjectInput: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string", example: "Website Redesign" },
            description: { type: "string", example: "Redesign the company website" },
          },
        },
        UpdateProjectInput: {
          type: "object",
          properties: {
            name: { type: "string", example: "Website Redesign v2" },
            description: { type: "string", example: "Updated description" },
          },
        },
        AddMemberInput: {
          type: "object",
          required: ["userId"],
          properties: {
            userId: { type: "string", format: "uuid", example: "uuid-of-user" },
          },
        },
        CreateTaskInput: {
          type: "object",
          required: ["title"],
          properties: {
            title: { type: "string", example: "Design landing page" },
            description: { type: "string", example: "Create mockups for the landing page" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/Priority" },
            dueDate: { type: "string", format: "date", example: "2025-06-01" },
            assigneeId: { type: "string", format: "uuid", example: "uuid-of-member" },
          },
        },
        UpdateTaskInput: {
          type: "object",
          properties: {
            title: { type: "string", example: "Updated task title" },
            description: { type: "string", example: "Updated description" },
            status: { $ref: "#/components/schemas/TaskStatus" },
            priority: { $ref: "#/components/schemas/Priority" },
            dueDate: { type: "string", format: "date", example: "2025-06-15" },
            assigneeId: { type: "string", format: "uuid", nullable: true },
          },
        },
        UpdateRoleInput: {
          type: "object",
          required: ["role"],
          properties: {
            role: { $ref: "#/components/schemas/Role" },
          },
        },
        UpdateStatusInput: {
          type: "object",
          required: ["status"],
          properties: {
            status: { $ref: "#/components/schemas/Status" },
          },
        },

        // ─── Responses ────────────────────────────────────────────
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string" },
            data: { type: "object" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error description" },
          },
        },
        ValidationErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: { type: "object" },
          },
        },
      },
    },

    paths: {
      // ════════════════════════════════════════════════════════════
      // AUTH
      // ════════════════════════════════════════════════════════════
      "/register": {
        post: {
          tags: ["Auth"],
          summary: "Register a new user",
          description: "Creates a new user account with MEMBER role by default.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/RegisterInput" },
              },
            },
          },
          responses: {
            201: {
              description: "Account created successfully",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      message: { type: "string", example: "Account created successfully" },
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          token: { type: "string", example: "eyJhbGci..." },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Validation failed",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
                },
              },
            },
            409: {
              description: "Email already registered",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErrorResponse" },
                },
              },
            },
          },
        },
      },

      "/login": {
        post: {
          tags: ["Auth"],
          summary: "Login and get JWT token",
          description: "Returns a JWT token valid for 24 hours.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" },
              },
            },
          },
          responses: {
            200: {
              description: "Login successful",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          token: { type: "string", example: "eyJhbGci..." },
                          user: { $ref: "#/components/schemas/User" },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrorResponse" } } } },
            401: { description: "Invalid credentials", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Account inactive", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ════════════════════════════════════════════════════════════
      // USERS
      // ════════════════════════════════════════════════════════════
      "/users": {
        get: {
          tags: ["Users"],
          summary: "Get all users",
          description: "Returns a list of all users. Admin only.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "List of users",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: { type: "array", items: { $ref: "#/components/schemas/User" } },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Insufficient role", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/users/{id}": {
        get: {
          tags: ["Users"],
          summary: "Get user by ID",
          description: "Returns a single user by ID. Admin only.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "User found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/User" } } } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Insufficient role", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "User not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/users/{id}/role": {
        patch: {
          tags: ["Users"],
          summary: "Update user role",
          description: "Updates the role of a user. Admin only. Valid roles: ADMIN, MEMBER.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateRoleInput" } } } },
          responses: {
            200: { description: "Role updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            400: { description: "Invalid role", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Insufficient role", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/users/{id}/status": {
        patch: {
          tags: ["Users"],
          summary: "Update user status",
          description: "Activates or deactivates a user account. Admin only.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateStatusInput" } } } },
          responses: {
            200: { description: "Status updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            400: { description: "Invalid status", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Insufficient role", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ════════════════════════════════════════════════════════════
      // PROJECTS
      // ════════════════════════════════════════════════════════════
      "/projects": {
        post: {
          tags: ["Projects"],
          summary: "Create a project",
          description: "Creates a new project. Admin only. Creator is automatically added as a member.",
          security: [{ bearerAuth: [] }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateProjectInput" } } } },
          responses: {
            201: { description: "Project created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Project" } } } } } },
            400: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Insufficient role", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          tags: ["Projects"],
          summary: "Get all projects",
          description: "Admin sees all projects. Members see only projects they belong to.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "List of projects",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: { type: "array", items: { $ref: "#/components/schemas/Project" } },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/projects/{id}": {
        get: {
          tags: ["Projects"],
          summary: "Get project by ID",
          description: "Returns a single project. Only accessible to project members and admins.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "Project UUID" }],
          responses: {
            200: { description: "Project found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Project" } } } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Not a project member", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          tags: ["Projects"],
          summary: "Update a project",
          description: "Updates project details. Admin or project owner only.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateProjectInput" } } } },
          responses: {
            200: { description: "Project updated", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          tags: ["Projects"],
          summary: "Delete a project",
          description: "Soft deletes a project. Admin or project owner only.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Project deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Project not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/projects/{id}/members": {
        post: {
          tags: ["Projects"],
          summary: "Add member to project",
          description: "Adds a user to a project. Admin or project owner only.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "Project UUID" }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/AddMemberInput" } } } },
          responses: {
            201: { description: "Member added", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            400: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Project or user not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            409: { description: "User already a member", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/projects/{id}/members/{userId}": {
        delete: {
          tags: ["Projects"],
          summary: "Remove member from project",
          description: "Removes a user from a project. Admin or project owner only. Cannot remove the owner.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "Project UUID" },
            { name: "userId", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "User UUID to remove" },
          ],
          responses: {
            200: { description: "Member removed", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            400: { description: "Cannot remove project owner", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Project or membership not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ════════════════════════════════════════════════════════════
      // TASKS
      // ════════════════════════════════════════════════════════════
      "/projects/{projectId}/tasks": {
        post: {
          tags: ["Tasks"],
          summary: "Create a task",
          description: "Creates a task inside a project. Only project members can create tasks.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "projectId", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "Project UUID" }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/CreateTaskInput" } } } },
          responses: {
            201: { description: "Task created", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Task" } } } } } },
            400: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Not a project member", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        get: {
          tags: ["Tasks"],
          summary: "Get tasks in a project",
          description: "Returns paginated tasks for a project. Only accessible to project members and admins.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "projectId", in: "path", required: true, schema: { type: "string", format: "uuid" } },
            { name: "status", in: "query", schema: { $ref: "#/components/schemas/TaskStatus" }, description: "Filter by status" },
            { name: "priority", in: "query", schema: { $ref: "#/components/schemas/Priority" }, description: "Filter by priority" },
            { name: "assigneeId", in: "query", schema: { type: "string", format: "uuid" }, description: "Filter by assignee" },
            { name: "search", in: "query", schema: { type: "string" }, description: "Search in title and description" },
            { name: "overdue", in: "query", schema: { type: "boolean" }, description: "Filter overdue tasks only" },
            { name: "page", in: "query", schema: { type: "integer", default: 1 } },
            { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          ],
          responses: {
            200: {
              description: "Paginated task list",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      total: { type: "integer" },
                      page: { type: "integer" },
                      limit: { type: "integer" },
                      tasks: { type: "array", items: { $ref: "#/components/schemas/Task" } },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Not a project member", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/tasks/{id}": {
        get: {
          tags: ["Tasks"],
          summary: "Get task by ID",
          description: "Returns a single task. Only accessible to project members and admins.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Task found", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Task" } } } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        patch: {
          tags: ["Tasks"],
          summary: "Update a task",
          description: "Updates task fields. Any project member can update. Changing assignee requires assignee to be a project member.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/UpdateTaskInput" } } } },
          responses: {
            200: { description: "Task updated", content: { "application/json": { schema: { type: "object", properties: { success: { type: "boolean" }, data: { $ref: "#/components/schemas/Task" } } } } } },
            400: { description: "Validation failed", content: { "application/json": { schema: { $ref: "#/components/schemas/ValidationErrorResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
        delete: {
          tags: ["Tasks"],
          summary: "Delete a task",
          description: "Soft deletes a task. Admin or project owner only.",
          security: [{ bearerAuth: [] }],
          parameters: [{ name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }],
          responses: {
            200: { description: "Task deleted", content: { "application/json": { schema: { $ref: "#/components/schemas/SuccessResponse" } } } },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            403: { description: "Access denied", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
            404: { description: "Task not found", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      // ════════════════════════════════════════════════════════════
      // DASHBOARD
      // ════════════════════════════════════════════════════════════
      "/dashboard/summary": {
        get: {
          tags: ["Dashboard"],
          summary: "Get task summary",
          description: "Returns total, todo, in-progress, done, and overdue task counts. Admin sees platform-wide data. Members see only their projects.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Summary data",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean", example: true },
                      data: {
                        type: "object",
                        properties: {
                          totalTasks: { type: "integer", example: 42 },
                          todo: { type: "integer", example: 15 },
                          inProgress: { type: "integer", example: 10 },
                          done: { type: "integer", example: 12 },
                          overdue: { type: "integer", example: 5 },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/dashboard/by-project": {
        get: {
          tags: ["Dashboard"],
          summary: "Get task breakdown by project",
          description: "Returns per-project task counts including overdue.",
          security: [{ bearerAuth: [] }],
          responses: {
            200: {
              description: "Per-project breakdown",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            projectId: { type: "string", format: "uuid" },
                            projectName: { type: "string", example: "Website Redesign" },
                            total: { type: "integer", example: 10 },
                            todo: { type: "integer", example: 3 },
                            inProgress: { type: "integer", example: 4 },
                            done: { type: "integer", example: 2 },
                            overdue: { type: "integer", example: 1 },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },

      "/dashboard/recent": {
        get: {
          tags: ["Dashboard"],
          summary: "Get recently updated tasks",
          description: "Returns the last N tasks ordered by updatedAt descending.",
          security: [{ bearerAuth: [] }],
          parameters: [
            { name: "limit", in: "query", schema: { type: "integer", default: 5 }, description: "Number of tasks to return" },
          ],
          responses: {
            200: {
              description: "Recent tasks",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      success: { type: "boolean" },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Task" },
                      },
                    },
                  },
                },
              },
            },
            401: { description: "Unauthorized", content: { "application/json": { schema: { $ref: "#/components/schemas/ErrorResponse" } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);