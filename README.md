# Multi Tenant Inventory Management Service

A **Microservice built with NestJS** that let's tenants manage products and warehouses, and also track inventory and stock movements across warehouses for each product.

This microservice was developed as part of **Inventra- A SaaS that let's organizations manage their inventory across warehouses** project.

---

## Objective

The **Multi Tenant Inventory Management Service** is designed to:

* CRUD Products
* CRUD Warehouses
* Create and manage inventory for Products in Warehouses
* Track Stock movement in warehouses
* Track Stock levels and emit an event when stock levels goes below a threshold

---

## Tech Stack

| Technology     | Purpose                                       |
| -------------- | --------------------------------------------- |
| **NestJS**     | Backend framework                             |
| **Node.js**    | Runtime environment                           |
| **TypeScript** | Type safety and modern JavaScript features    |
| **PostgreSQL** | SQL database for storing inventory data       |
| **Prisma**     | ORM for PostgreSQL                            |
| **Redis**      | For caching product and warehouse information |
| **Swagger**    | For documenting REST API                      |
|

---

## Setup & Installation

### Clone the Repository

```bash
git clone https://github.com/iamarvy/inventra-inventory-management-service.git
cd inventra-inventory-management-service
```

### Install Dependencies

```bash
pnpm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory and define:

```bash
DATABASE_URL=your_postgres_connection_string
REDIS_URL=your_redis_connection_string
PORT=3000
```

> If `PORT` is not provided, the application defaults to **3000**.

### Start the Development Server

```bash
docker compose up -d
pnpm prisma migrate dev
pnpm start:dev
```

Once running, visit:
[http://localhost:3000](http://localhost:3000)

---

## Api Documentation

Rest API documentation can be found at: [http://localhost:3000/docs](http://localhost:3000/api)

---

## Features

* RESTful API architecture
* Request validation using `class-validator`
* PostgreSQl Database for data persistence via Prisma
* Swagger documentation
* Multi-tenancy

---

## Author

**Oluwaseyi Oke**
🌐 [GitHub](https://github.com/iamarvy)
📧 [iamarvytech@gmail.com](mailto:iamarvytech@gmail.com)

