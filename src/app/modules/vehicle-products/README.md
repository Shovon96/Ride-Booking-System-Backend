# Vehicle Products API Documentation

## Base URL
```
/api/v1/vehicle-products
```

## Endpoints

### 1. Create Product (Admin Only)
**POST** `/api/v1/vehicle-products/create`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Request Body:**
```json
{
  "title": "Racing Motorcycle Helmet",
  "images": [
    "https://images.pexels.com/photos/1413412/pexels-photo-1413412.jpeg",
    "https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg"
  ],
  "description": "DOT certified full-face racing helmet featuring advanced aerodynamic design...",
  "price": 149.99,
  "status": "In Stock",
  "type": "Safety Gear",
  "brand": "SafeRide",
  "sku": "SR-HLM-001",
  "warranty": "3 Years",
  "category": "BIKE",
  "specifications": {
    "Certification": "DOT, ECE 22.05",
    "Shell Material": "Composite Fiber",
    "Weight": "1450g",
    "Sizes Available": "XS, S, M, L, XL, XXL",
    "Visor": "Anti-Fog, UV Protection",
    "Ventilation": "Multi-Port System"
  },
  "features": [
    "DOT and ECE certified for maximum safety",
    "Aerodynamic shell design reduces wind noise",
    "Anti-fog visor with UV protection",
    "Advanced ventilation system",
    "Moisture-wicking, removable interior",
    "Quick-release visor mechanism",
    "Emergency quick-release cheek pads"
  ],
  "rating": 4.9,
  "reviews": 234
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle product created successfully",
  "statusCode": 201,
  "data": {
    "_id": "...",
    "title": "Racing Motorcycle Helmet",
    ...
  }
}
```

---

### 2. Get All Products (Public)
**GET** `/api/v1/vehicle-products`

**Query Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in title, description, brand, features | `?search=helmet` |
| `category` | string | Filter by category (CAR/BIKE) | `?category=BIKE` |
| `status` | string | Filter by status | `?status=In Stock` |
| `brand` | string | Filter by brand | `?brand=SafeRide` |
| `type` | string | Filter by product type | `?type=Safety Gear` |
| `minPrice` | number | Minimum price | `?minPrice=50` |
| `maxPrice` | number | Maximum price | `?maxPrice=200` |
| `sortBy` | string | Sort fields (comma-separated, prefix with `-` for descending) | `?sortBy=-price,title` |
| `page` | number | Page number (default: 1) | `?page=2` |
| `limit` | number | Items per page (default: 12) | `?limit=20` |

**Example Requests:**

1. **Search for helmets:**
   ```
   GET /api/v1/vehicle-products?search=helmet
   ```

2. **Get bike products under $100:**
   ```
   GET /api/v1/vehicle-products?category=BIKE&maxPrice=100
   ```

3. **Get products by brand, sorted by price (low to high):**
   ```
   GET /api/v1/vehicle-products?brand=SafeRide&sortBy=price
   ```

4. **Get in-stock car products, page 2:**
   ```
   GET /api/v1/vehicle-products?category=CAR&status=In Stock&page=2&limit=12
   ```

5. **Search and filter combined:**
   ```
   GET /api/v1/vehicle-products?search=brake&category=CAR&minPrice=50&maxPrice=150&sortBy=-rating
   ```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle products retrieved successfully",
  "statusCode": 200,
  "data": [
    {
      "_id": "...",
      "title": "Racing Motorcycle Helmet",
      "images": [...],
      "price": 149.99,
      ...
    }
  ],
  "meta": {
    "page": 1,
    "limit": 12,
    "total": 45,
    "totalPages": 4
  }
}
```

---

### 3. Get Product by ID (Public)
**GET** `/api/v1/vehicle-products/:id`

**Example:**
```
GET /api/v1/vehicle-products/507f1f77bcf86cd799439011
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle product retrieved successfully",
  "statusCode": 200,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Racing Motorcycle Helmet",
    "images": [...],
    "description": "...",
    "price": 149.99,
    "status": "In Stock",
    "type": "Safety Gear",
    "brand": "SafeRide",
    "sku": "SR-HLM-001",
    "warranty": "3 Years",
    "category": "BIKE",
    "specifications": {...},
    "features": [...],
    "rating": 4.9,
    "reviews": 234,
    "createdAt": "2024-01-20T10:30:00.000Z",
    "updatedAt": "2024-01-20T10:30:00.000Z"
  }
}
```

---

### 4. Update Product (Admin Only)
**PATCH** `/api/v1/vehicle-products/update/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Request Body:** (All fields are optional)
```json
{
  "price": 139.99,
  "status": "Low Stock",
  "rating": 4.8,
  "reviews": 250
}
```

**Response:**
```json
{
  "success": true,
  "message": "Vehicle product updated successfully",
  "statusCode": 200,
  "data": {
    "_id": "...",
    "price": 139.99,
    "status": "Low Stock",
    ...
  }
}
```

---

### 5. Delete Product (Admin Only)
**DELETE** `/api/v1/vehicle-products/delete/:id`

**Headers:**
```json
{
  "Authorization": "Bearer <admin_token>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully",
  "statusCode": 200,
  "data": null
}
```

---

## Data Models

### Product Status Enum
```typescript
enum ProductStatus {
  IN_STOCK = "In Stock",
  LOW_STOCK = "Low Stock",
  OUT_OF_STOCK = "Out of Stock"
}
```

### Product Category Enum
```typescript
enum ProductCategory {
  CAR = "CAR",
  BIKE = "BIKE"
}
```

---

## Search & Filter Examples

### 1. Search by keyword in multiple fields
```
GET /api/v1/vehicle-products?search=brake
```
Searches in: title, description, brand, features

### 2. Filter by price range
```
GET /api/v1/vehicle-products?minPrice=50&maxPrice=200
```

### 3. Sort by multiple fields
```
GET /api/v1/vehicle-products?sortBy=-rating,price
```
Sorts by rating (descending), then price (ascending)

### 4. Complex query
```
GET /api/v1/vehicle-products?category=CAR&search=brake&status=In Stock&minPrice=50&maxPrice=150&sortBy=-rating&page=1&limit=12
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "statusCode": 400,
  "errors": [...]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "User not authenticated",
  "statusCode": 401
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Product not found",
  "statusCode": 404
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Product with this SKU already exists",
  "statusCode": 409
}
```

---

## Notes

- All **POST**, **PATCH**, and **DELETE** operations require **Admin authentication**
- **GET** operations are **public** and don't require authentication
- SKU must be unique across all products
- Images must be valid URLs
- Price must be a positive number
- Rating must be between 0 and 5
- Search is case-insensitive
- Pagination defaults: page=1, limit=12
