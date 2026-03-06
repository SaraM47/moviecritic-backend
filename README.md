# MovieCritic Backend API
MovieCritic Backend is focusing on the server-side application for a movie discovery and review platform. The API proxies selected endpoints from The Movie Database, while managing its own authentication system and persistent review data. The responsiblility this backend has is user registration and login, JWT authentication using httpOnly cookies, CRUD operations for movie reviews, proxying selected TMDB endpoints and data validation and error handling.

## Project Structure

Below shows the backend modular structure separating concerns by responsibility:

```bash
src/
├── server.ts # Application entry point
├── config/ # Environment, database, plugins, TMDB config
├── controllers/ # Route logic and response handling
├── routes/ # Route registration
├── models/ # Mongoose models
├── middleware/ # Authentication middleware
```

## Tech Stack
- Node.js
- Fastify
- TypeScript
- MongoDB + Mongoose
- Zod (request validation)
- bcrypt (password hashing)
- @fastify/jwt (JWT authentication)
- @fastify/cookie (httpOnly cookie handling)
- TMDB API (external movie data)

## Application installation and run
1. Install dependencies
```bash
npm install
```

2. Create environment file with .env file that contains:
```bash
PORT=3001
MONGO_URI=mongodb://localhost:27017/moviecritic
JWT_SECRET=your_long_random_secret
COOKIE_SECRET=your_cookie_secret
TMDB_API_KEY=your_tmdb_api_key
TMDB_BASE_URL=https://api.themoviedb.org/3
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

3. Start development server
```bash
npm run dev
```

## Data Models
### User
| Field        | Type     | Notes       |
| ------------ | -------- | ----------- |
| _id          | ObjectId | Primary key |
| username     | String   | Required    |
| email        | String   | Unique      |
| passwordHash | String   | bcrypt hash |
| createdAt    | Date     | Auto        |

### Review
| Field     | Type     | Notes             |
| --------- | -------- | ----------------- |
| _id       | ObjectId | Primary key       |
| movieId   | Number   | TMDB movie ID     |
| userId    | ObjectId | Reference to User |
| text      | String   | 2–2000 characters |
| rating    | Number   | 1–10              |
| createdAt | Date     | Auto              |

## API Endpoints
### Health
| Method | Route   | Protected |
| ------ | ------- | --------- |
| GET    | /health | No        |

### Auth
| Method | Route              | Protected | Description      |
| ------ | ------------------ | --------- | ---------------- |
| POST   | /api/auth/register | No        | Create user      |
| POST   | /api/auth/login    | No        | Login user       |
| POST   | /api/auth/logout   | Yes       | Clear cookie     |
| GET    | /api/auth/me       | Yes       | Get current user |

### Movies (TMDB Proxy)
| Method | Route                        | Protected | Description       |
| ------ | ---------------------------- | --------- | ----------------- |
| GET    | /api/movies/search?query=... | No        | Search movies     |
| GET    | /api/movies/:id              | No        | Get movie details |

### Reviews
| Method | Route                   | Protected | Description           |
| ------ | ----------------------- | --------- | --------------------- |
| GET    | /api/reviews?movieId=ID | No        | Get reviews for movie |
| POST   | /api/reviews            | Yes       | Create review         |
| PUT    | /api/reviews/:id        | Yes       | Update review         |
| DELETE | /api/reviews/:id        | Yes       | Delete review         |

Ownership validation ensures users can only modify their own reviews.

## Authentication

Authentication in this application is implemented using JSON Web Tokens. When a user logs in or registers successfully, the server generates a JWT that is stored in a signed httpOnly cookie. This approach prevents the token from being accessed through client-side JavaScript and therefore improves security.

The authentication cookie is named token. The cookie is automatically included in requests made from the frontend when credentials are enabled.

Protected routes require a valid authentication cookie. Incoming requests are verified through a middleware that checks the presence and validity of the JWT before allowing access to the protected resource.

If the token is missing, invalid, or the user does not have permission to perform the requested operation, the API returns an appropriate error response.

### Error responses

The API returns consistent HTTP status codes depending on the type of error that occurs.

* 401 Unauthorized is returned when a request does not include a valid authentication token or when the user is not logged in.

* 403 Forbidden is returned when a user attempts to modify or delete a resource that they do not own.

* 400 Bad Request is returned when the request body or query parameters fail validation rules.

* 404 Not Found is returned when the requested resource does not exist in the database.

* 500 Internal Server Error is returned when an unexpected error occurs on the server.

All error responses follow a consistent JSON structure:
```bash
    {
    "message": "Error description",
    "details": "Optional additional information"
    }
```

## The rules on validations
Input validation is performed using the Zod validation library. Each incoming request is validated before the request reaches the database layer in order to prevent invalid or malformed data from being stored.

For user registration, the username must contain between two and fifty characters. The email field must contain a valid email address format, and the password must contain between eight and one hundred and twenty-eight characters.

When creating a review, the request body must contain a valid movie identifier obtained from the TMDB API. The rating must be a number between one and ten, and the review text must contain between two and two thousand characters. When updating a review, the rating and review text fields are optional. However, if they are provided, they must still satisfy the same validation rules used when creating a review.

If validation fails, the server responds with status code 400 Bad Request and returns a message describing the validation issue.

## Testing
Used ThunderClient for testning CRUD but any testing tool could work.
Test flow:

1. Register

2. Login

3. GET /api/auth/me

4. Create review

5. Update review

6. Delete review

7. Logout

8. Verify protected route returns 401

## TMDB API
This backend integrates with The Movie Database API in order to retrieve movie information such as titles, descriptions, and other metadata. The backend acts as a proxy between the frontend application and the TMDB service.

When a request for movie data is made, the backend forwards the request to the TMDB API using the configured API key. The response from TMDB is then returned to the frontend.

This design ensures that the TMDB API key remains securely stored on the server and is never exposed directly to the client application. It also allows the backend to control which movie endpoints are accessible and to standardize the responses sent to the frontend.

The backend does not store movie data locally. Instead, movie information is retrieved dynamically from TMDB whenever a request is made. Only user-generated content, such as reviews and user accounts, is stored in the application's database.