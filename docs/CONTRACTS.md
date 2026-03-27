## API Contracts

## Base URL and Auth
- Base URL (dev): `http://localhost:5001`
- Optional global auth header: `Authorization: Bearer <MASTER_API_KEY>`

## Common Headers
- `Content-Type: application/json`
- `Accept: application/json`

## Routes
- `GET /` -> service metadata
- `GET /health` -> health check
- `GET /api/v1/example` -> example starter endpoint

## Example Requests
### Health check
```
GET /health
```

### Example endpoint
```
GET /api/v1/example
```
