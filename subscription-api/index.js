const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 3100;

app.use(cors());
app.use(express.json());
app.use('/swagger', express.static(require('path').join(__dirname, 'swagger')));

// In-memory storage (reset on server restart). Simple and laptop-friendly.
const productTypes = [];
const products = [];
const subscriptions = [];
const customers = [];

// Seed some default data so API isn't empty on startup
function seedData() {
  if (productTypes.length || products.length || subscriptions.length || customers.length) return;
  // Fixed UUIDs for deterministic data each run
  const ids = {
    ptSaaS: '11111111-1111-4111-8111-111111111111',
    ptAddon: '22222222-2222-4222-8222-222222222222',
    ptSupport: '33333333-3333-4333-8333-333333333333',
    pBasic: '44444444-4444-4444-8444-444444444444',
    pPro: '55555555-5555-4555-8555-555555555555',
    pAddon: '66666666-6666-4666-8666-666666666666',
    cAlice: '77777777-7777-4777-8777-777777777777',
    cBob: '88888888-8888-4888-8888-888888888888',
    s1: '99999999-9999-4999-8999-999999999999',
    s2: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  };
  const now = new Date().toISOString();

  // Product types
  productTypes.push(
    { id: ids.ptSaaS, name: 'SaaS', description: 'Software as a Service plans', createdAt: now },
    { id: ids.ptAddon, name: 'Addon', description: 'Optional add-ons', createdAt: now },
    { id: ids.ptSupport, name: 'Support', description: 'Support packages', createdAt: now }
  );

  // Products
  products.push(
    { id: ids.pBasic, name: 'Basic Plan', productTypeId: ids.ptSaaS, price: 9.99, createdAt: now },
    { id: ids.pPro, name: 'Pro Plan', productTypeId: ids.ptSaaS, price: 19.99, createdAt: now },
    {
      id: ids.pAddon,
      name: 'Priority Support',
      productTypeId: ids.ptSupport,
      price: 49.0,
      createdAt: now,
    }
  );

  // Customers
  customers.push(
    { id: ids.cAlice, name: 'Alice', email: 'alice@example.com', createdAt: now },
    { id: ids.cBob, name: 'Bob', email: 'bob@example.com', createdAt: now }
  );

  // Subscriptions
  subscriptions.push(
    {
      id: ids.s1,
      productId: ids.pPro,
      customerId: ids.cAlice,
      startDate: now,
      status: 'active',
      createdAt: now,
    },
    {
      id: ids.s2,
      productId: ids.pBasic,
      customerId: ids.cBob,
      startDate: now,
      status: 'active',
      createdAt: now,
    }
  );
}
seedData();

// Health/root
app.get('/', (req, res) => {
  res.json({ status: 'ok', name: 'subscription-api', version: '1.0.0' });
});

// Swagger schema endpoint (static file)
app.get('/swagger.json', (req, res) => {
  try {
    const swagger = require('./swagger.json');
    res.json(swagger);
  } catch (e) {
    res.status(500).json({ message: 'Swagger schema not found', error: String(e) });
  }
});

// Utilities
function findProductType(id) {
  return productTypes.find(pt => pt.id === id);
}
function findProduct(id) {
  return products.find(p => p.id === id);
}
function findSubscription(id) {
  return subscriptions.find(s => s.id === id);
}
function findCustomer(id) {
  return customers.find(c => c.id === id);
}

// Product Types
app.post('/product-types', (req, res) => {
  const { name, description } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'name is required' });
  }
  const item = {
    id: randomUUID(),
    name: name.trim(),
    description: description ? String(description) : null,
    createdAt: new Date().toISOString(),
  };
  productTypes.push(item);
  return res.status(201).json(item);
});

app.get('/product-types', (req, res) => {
  res.json(productTypes);
});

// Products
app.post('/products', (req, res) => {
  const { name, productTypeId, price } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'name is required' });
  }
  if (!productTypeId || typeof productTypeId !== 'string') {
    return res.status(400).json({ message: 'productTypeId is required' });
  }
  const pt = findProductType(productTypeId);
  if (!pt) {
    return res.status(404).json({ message: 'Product type not found' });
  }
  const item = {
    id: randomUUID(),
    name: name.trim(),
    productTypeId,
    price: typeof price === 'number' ? price : null,
    createdAt: new Date().toISOString(),
  };
  products.push(item);
  return res.status(201).json(item);
});

app.get('/products', (req, res) => {
  res.json(products);
});

// Subscriptions
app.post('/subscriptions', (req, res) => {
  const { productId, customerId, startDate } = req.body || {};
  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({ message: 'productId is required' });
  }
  if (!customerId || typeof customerId !== 'string' || customerId.trim().length === 0) {
    return res.status(400).json({ message: 'customerId is required' });
  }
  const product = findProduct(productId);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  const item = {
    id: randomUUID(),
    productId,
    customerId: customerId.trim(),
    startDate: startDate ? new Date(startDate).toISOString() : new Date().toISOString(),
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  subscriptions.push(item);
  return res.status(201).json(item);
});

app.get('/subscriptions', (req, res) => {
  res.json(subscriptions);
});

// By-ID endpoints
app.get('/product-types/:id', (req, res) => {
  const item = findProductType(req.params.id);
  if (!item) return res.status(404).json({ message: 'Product type not found' });
  res.json(item);
});

app.get('/products/:id', (req, res) => {
  const item = findProduct(req.params.id);
  if (!item) return res.status(404).json({ message: 'Product not found' });
  res.json(item);
});

app.get('/subscriptions/:id', (req, res) => {
  const item = findSubscription(req.params.id);
  if (!item) return res.status(404).json({ message: 'Subscription not found' });
  res.json(item);
});

// Customers
app.post('/customers', (req, res) => {
  const { name, email } = req.body || {};
  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ message: 'name is required' });
  }
  const item = {
    id: randomUUID(),
    name: name.trim(),
    email: email ? String(email) : null,
    createdAt: new Date().toISOString(),
  };
  customers.push(item);
  return res.status(201).json(item);
});

app.get('/customers', (req, res) => {
  res.json(customers);
});

app.get('/customers/:id', (req, res) => {
  const item = findCustomer(req.params.id);
  if (!item) return res.status(404).json({ message: 'Customer not found' });
  res.json(item);
});

// Start server
app.listen(PORT, () => {
  console.log(`[subscription-api] Listening on http://localhost:${PORT}`);
});
