# API Documentation

This document provides detailed information about the API endpoints available in the application.

## Base URL

All API endpoints are relative to the base URL:

```
http://127.0.0.1:8000/api
```

## Authentication

The API uses two types of authentication:

1. **Bearer Token Authentication** - For user-specific operations
2. **API Key Authentication** - For public API access

### Bearer Token Authentication

To authenticate using Bearer Token:

1. Obtain a token by registering or logging in
2. Include the token in the Authorization header of your requests:

```
Authorization: Bearer {your_token}
```

### API Key Authentication

To authenticate using API Key:

1. Generate an API key through the `/api/api-keys` endpoint (requires Bearer Token)
2. Include the API key in the X-API-KEY header of your requests:

```
X-API-KEY: {your_api_key}
```

## Endpoints

### Authentication

#### Register a New User

- **URL**: `/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }
  ```
- **Success Response**: 
  ```json
  {
    "access_token": "1|abcdefghijklmnopqrstuvwxyz",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Login

- **URL**: `/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: 
  ```json
  {
    "access_token": "1|abcdefghijklmnopqrstuvwxyz",
    "token_type": "Bearer",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Logout

- **URL**: `/logout`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

#### Get User Info

- **URL**: `/user`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2023-01-01T00:00:00.000000Z",
    "updated_at": "2023-01-01T00:00:00.000000Z"
  }
  ```

### API Keys

#### Generate API Key

- **URL**: `/api-keys`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "name": "My API Key"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "API key generated successfully",
    "data": {
      "name": "My API Key",
      "key": "abcdefghijklmnopqrstuvwxyz"
    }
  }
  ```

#### List API Keys

- **URL**: `/api-keys`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "My API Key",
        "created_at": "2023-01-01T00:00:00.000000Z"
      }
    ]
  }
  ```

#### Delete API Key

- **URL**: `/api-keys/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "API key deleted successfully"
  }
  ```

### Products

#### Get All Products

- **URL**: `/products`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: 
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Product 1",
        "description": "Description of product 1",
        "price": 10.99,
        "stock": 100,
        "image": "product1.jpg",
        "category_id": 1,
        "category": {
          "id": 1,
          "name": "Category 1"
        },
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
    ]
  }
  ```

#### Get Product by ID

- **URL**: `/products/{id}`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: 
  ```json
  {
    "data": {
      "id": 1,
      "name": "Product 1",
      "description": "Description of product 1",
      "price": 10.99,
      "stock": 100,
      "image": "product1.jpg",
      "category_id": 1,
      "category": {
        "id": 1,
        "name": "Category 1"
      },
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Create Product

- **URL**: `/products`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "name": "New Product",
    "description": "Description of new product",
    "price": 15.99,
    "stock": 50,
    "category_id": 1,
    "image": "new-product.jpg"
  }
  ```
- **Success Response**: 
  ```json
  {
    "data": {
      "id": 2,
      "name": "New Product",
      "description": "Description of new product",
      "price": 15.99,
      "stock": 50,
      "image": "new-product.jpg",
      "category_id": 1,
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Update Product

- **URL**: `/products/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "name": "Updated Product",
    "description": "Updated description",
    "price": 19.99,
    "stock": 75,
    "category_id": 2,
    "image": "updated-product.jpg"
  }
  ```
- **Success Response**: 
  ```json
  {
    "data": {
      "id": 1,
      "name": "Updated Product",
      "description": "Updated description",
      "price": 19.99,
      "stock": 75,
      "image": "updated-product.jpg",
      "category_id": 2,
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Delete Product

- **URL**: `/products/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "status": 204
  }
  ```

### Categories

#### Get All Categories

- **URL**: `/categories`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: 
  ```json
  {
    "data": [
      {
        "id": 1,
        "name": "Category 1",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
    ]
  }
  ```

#### Get Category by ID

- **URL**: `/categories/{id}`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: 
  ```json
  {
    "data": {
      "id": 1,
      "name": "Category 1",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "products": [
        {
          "id": 1,
          "name": "Product 1",
          "description": "Description of product 1",
          "price": 10.99,
          "stock": 100,
          "category_id": 1,
          "image": "product1.jpg"
        }
      ]
    }
  }
  ```

#### Create Category

- **URL**: `/categories`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "name": "New Category"
  }
  ```
- **Success Response**: 
  ```json
  {
    "data": {
      "id": 2,
      "name": "New Category",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Update Category

- **URL**: `/categories/{id}`
- **Method**: `PUT`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "name": "Updated Category"
  }
  ```
- **Success Response**: 
  ```json
  {
    "data": {
      "id": 1,
      "name": "Updated Category",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

#### Delete Category

- **URL**: `/categories/{id}`
- **Method**: `DELETE`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "status": 204
  }
  ```
- **Error Response** (if category has products):
  ```json
  {
    "success": false,
    "message": "Cannot delete category with products",
    "status": 422
  }
  ```

### Orders

#### Get All Orders

- **URL**: `/orders`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "user_id": 1,
        "status": "pending",
        "order_date": "2023-01-01T00:00:00.000000Z",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "details": [
          {
            "id": 1,
            "order_id": 1,
            "product_id": 1,
            "quantity": 2,
            "price": 10.99,
            "subtotal": 21.98,
            "product": {
              "id": 1,
              "name": "Product 1",
              "price": 10.99
            }
          }
        ],
        "total_amount": 21.98
      }
    ]
  }
  ```

#### Get Order by ID

- **URL**: `/orders/{id}`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "user_id": 1,
      "status": "pending",
      "order_date": "2023-01-01T00:00:00.000000Z",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "details": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "price": 10.99,
          "subtotal": 21.98,
          "product": {
            "id": 1,
            "name": "Product 1",
            "price": 10.99
          }
        }
      ],
      "payment": {
        "id": 1,
        "order_id": 1,
        "amount": 21.98,
        "payment_method": "credit_card",
        "payment_date": "2023-01-01T00:00:00.000000Z"
      },
      "total_amount": 21.98
    }
  }
  ```

#### Create Order (Checkout)

- **URL**: `/orders`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "items": [
      {
        "product_id": 1,
        "quantity": 2
      },
      {
        "product_id": 2,
        "quantity": 1
      }
    ],
    "shipping_address": "123 Main St",
    "shipping_city": "New York",
    "shipping_state": "NY",
    "shipping_zip": "10001",
    "shipping_country": "USA",
    "shipping_phone": "123-456-7890",
    "notes": "Please deliver after 6pm"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Order created successfully",
    "data": {
      "id": 1,
      "user_id": 1,
      "status": "pending",
      "order_date": "2023-01-01T00:00:00.000000Z",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "details": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "price": 10.99,
          "subtotal": 21.98,
          "product": {
            "id": 1,
            "name": "Product 1",
            "price": 10.99
          }
        },
        {
          "id": 2,
          "order_id": 1,
          "product_id": 2,
          "quantity": 1,
          "price": 15.99,
          "subtotal": 15.99,
          "product": {
            "id": 2,
            "name": "Product 2",
            "price": 15.99
          }
        }
      ],
      "total_amount": 37.97
    }
  }
  ```

#### Cancel Order

- **URL**: `/orders/{id}/cancel`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Order cancelled successfully",
    "data": {
      "id": 1,
      "user_id": 1,
      "status": "cancelled",
      "order_date": "2023-01-01T00:00:00.000000Z",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "details": [
        {
          "id": 1,
          "order_id": 1,
          "product_id": 1,
          "quantity": 2,
          "price": 10.99,
          "subtotal": 21.98
        }
      ],
      "total_amount": 21.98
    }
  }
  ```

### Payments

#### Process Payment

- **URL**: `/payments`
- **Method**: `POST`
- **Auth Required**: Yes (Bearer Token)
- **Body**:
  ```json
  {
    "order_id": 1,
    "payment_method": "credit_card",
    "card_number": "4242424242424242",
    "card_expiry": "12/25",
    "card_cvv": "123"
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Payment processed successfully",
    "data": {
      "order": {
        "id": 1,
        "user_id": 1,
        "status": "processing",
        "order_date": "2023-01-01T00:00:00.000000Z",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z",
        "total_amount": 21.98
      },
      "payment": {
        "id": 1,
        "order_id": 1,
        "amount": 21.98,
        "payment_method": "credit_card",
        "payment_date": "2023-01-01T00:00:00.000000Z",
        "created_at": "2023-01-01T00:00:00.000000Z",
        "updated_at": "2023-01-01T00:00:00.000000Z"
      }
    }
  }
  ```

#### Get Payment Details

- **URL**: `/orders/{orderId}/payment`
- **Method**: `GET`
- **Auth Required**: Yes (Bearer Token)
- **Success Response**: 
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "order_id": 1,
      "amount": 21.98,
      "payment_method": "credit_card",
      "payment_date": "2023-01-01T00:00:00.000000Z",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z"
    }
  }
  ```

### Contact

#### Submit Contact Form

- **URL**: `/contact`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Hello, I have a question about your products."
  }
  ```
- **Success Response**: 
  ```json
  {
    "success": true,
    "message": "Your message has been sent successfully!",
    "data": {
      "name": "John Doe",
      "email": "john@example.com",
      "message": "Hello, I have a question about your products.",
      "created_at": "2023-01-01T00:00:00.000000Z",
      "updated_at": "2023-01-01T00:00:00.000000Z",
      "id": 1
    }
  }
  ```

## API Key Authenticated Endpoints

The following endpoints can be accessed using an API key in the `X-API-KEY` header:

- **URL**: `/api/products`
- **Method**: `GET`
- **Auth Required**: Yes (API Key)

- **URL**: `/api/products/{id}`
- **Method**: `GET`
- **Auth Required**: Yes (API Key)

- **URL**: `/api/categories`
- **Method**: `GET`
- **Auth Required**: Yes (API Key)

- **URL**: `/api/categories/{id}`
- **Method**: `GET`
- **Auth Required**: Yes (API Key)

## Error Responses

All API endpoints return appropriate HTTP status codes and error messages in case of failure:

### Validation Error (422)

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "field_name": [
      "Error message for field"
    ]
  }
}
```

### Authentication Error (401)

```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Not Found Error (404)

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Server Error (500)

```json
{
  "success": false,
  "message": "An error occurred",
  "error": "Error details"
}
```

## Integration with React

To integrate this API with a React frontend, you can use the following example code:

```javascript
import axios from 'axios';

// Set the base URL for all API requests
axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

// Function to set the authentication token
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Function to set the API key
const setApiKey = (apiKey) => {
  if (apiKey) {
    axios.defaults.headers.common['X-API-KEY'] = apiKey;
  } else {
    delete axios.defaults.headers.common['X-API-KEY'];
  }
};

// Example login function
const login = async (email, password) => {
  try {
    const response = await axios.post('/login', { email, password });
    const { access_token } = response.data;
    
    // Save token to localStorage
    localStorage.setItem('token', access_token);
    
    // Set the token for future requests
    setAuthToken(access_token);
    
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Example function to fetch products
const getProducts = async () => {
  try {
    const response = await axios.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Example function to create an order
const createOrder = async (orderData) => {
  try {
    const response = await axios.post('/orders', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

## Conclusion

This API provides a comprehensive set of endpoints for managing products, categories, orders, payments, and user authentication. It supports both Bearer Token and API Key authentication methods, making it suitable for both user-specific operations and public API access.

For any questions or issues, please contact the development team.
