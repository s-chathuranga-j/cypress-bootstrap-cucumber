# Subscription Management API

A simple testing API for managing product types, products, and subscriptions. Uses in-memory storage and serves a Swagger schema.

Location: subscription-api (isolated from the root project)

## Requirements

- Node.js 16+ (or any modern LTS)

## Install and Run

```
cd subscription-api
npm install
npm start
```

Server starts at http://localhost:3100 (override with PORT environment variable).

## Swagger Docs

- UI: http://localhost:3100/swagger/index.html
- Schema JSON: http://localhost:3100/swagger.json
  - Save or import into your preferred API tool (e.g., Postman, Swagger UI).

## Endpoints

- GET /
  - Health check
- GET /product-types
- POST /product-types
  - body: { name: string, description?: string }
- GET /product-types/{id}
- GET /products
- POST /products
  - body: { name: string, productTypeId: string, price?: number }
- GET /products/{id}
- GET /subscriptions
- POST /subscriptions
  - body: { productId: string, customerId: string, startDate?: string ISO8601 }
- GET /subscriptions/{id}
- GET /customers
- POST /customers
  - body: { name: string, email?: string }
- GET /customers/{id}

Notes:

- productTypeId is required to create a product (must exist).
- productId is required to create a subscription (must exist).
- Storage is in-memory and resets on server restart.
- Preloaded sample data is injected at startup (3 product types, 3 products, 2 customers, 2 subscriptions) so lists are not empty on first run.

## Quick Usage (curl)

1. Create a product type

```
curl -s -X POST http://localhost:3100/product-types \
  -H "Content-Type: application/json" \
  -d '{"name":"SaaS"}'
```

2. Create a product (replace <PT_ID> with id from step 1)

```
curl -s -X POST http://localhost:3100/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Pro Plan","productTypeId":"<PT_ID>","price":19.99}'
```

3. Create a subscription (replace <P_ID> with id from step 2)

```
curl -s -X POST http://localhost:3100/subscriptions \
  -H "Content-Type: application/json" \
  -d '{"productId":"<P_ID>","customerId":"cust-001"}'
```

4. List data

```
curl -s http://localhost:3100/product-types
curl -s http://localhost:3100/products
curl -s http://localhost:3100/subscriptions
```

## License

MIT
