# Slice🍕 & Dice🎲 Express.js REST API with JWT Authentication

This is a simple Express.js application that provides a REST API for managing employee records and calculating summary statistics. The API is secured using JSON Web Tokens (JWT) for authentication.

## Features

- User login and token generation.
- CRUD operations on employee records.
- Calculation of summary statistics over the dataset.
- Middleware for checking the validity of tokens.

## Dependencies

- Express.js
- Body-parser
- JSON Web Token (JWT)

## Installation

1. Clone this repository to your local machine.
2. Run `npm install` to install all necessary dependencies.
3. To start the server, run `node index.js`.


## API Endpoints

### POST /login

Authenticates a user and returns a JWT token. 

Request body:

```json
{
  "username": "Akshay",
  "password": "Akshay@123"
}
```

### POST /add_record

Adds a new record to the dataset.

Request headers:

```
Authorization: Bearer <token>
```

Request body:

```json
{
  "name": "John Doe",
  "salary": "5000",
  "currency": "USD",
  "department": "Marketing",
  "sub_department": "Digital Marketing"
}
```
### DELETE /delete_record/:recordIndex

Deletes a record by index from the dataset.

Request headers:

```
Authorization: Bearer <token>
```

URL parameters:

```
/delete_record/0
```

### GET /summary_stats/all_salary

Fetches summary statistics for salary over the entire dataset.

Example Response:

```json
{
  "mean": 5000,
  "min": 5000,
  "max": 5000
}
```

### GET /summary_stats/on_contract_salary

Fetches summary statistics for salaries of records with `"on_contract": "true"`.

Example Response:

```json
{
  "mean": 5000,
  "min": 5000,
  "max": 5000
}
```

### GET /summary_stats/department_salary/:department

Fetches summary statistics for salaries of employees in a specific department.

URL parameters:

```
/summary_stats/department_salary/Engineering
```

Example Response:

```json
{
  "mean": 5000,
  "min": 5000,
  "max": 5000
}
```

### GET /summary_stats/department_sub_department_salary/:department/:sub_department

Fetches summary statistics for salaries of employees in a specific department and sub-department.

URL parameters:

```
/summary_stats/department_sub_department_salary/Engineering/Platform
```

Example Response:

```json
{
  "mean": 5000,
  "min": 5000,
  "max": 5000
}
```

Please replace `<token>` with the actual token received from the `/login` endpoint.

## Error Handling

The API will return an error response if:

- The request does not include a valid token.
- The payload for adding a record is invalid.
- A record index is invalid or out of range.
- There are no records found for a specific query.

## Testing

This application includes a test suite that tests all the API endpoints. The tests are written using the Chai assertion library and the Chai HTTP plugin to perform HTTP requests.

### Dependencies

- Chai
- Chai HTTP

### Running the Tests

To run the tests, use the following command:

```
npm test
```

### Test Suite

The test suite includes the following tests:

1. User login and token generation.
2. Adding a new record to the dataset.
3. Deleting a record by index from the dataset.
4. Fetching summary statistics for salary over the entire dataset.
5. Fetching summary statistics for salaries of records with `"on_contract": "true"`.
6. Fetching summary statistics for salaries of employees in a specific department.
7. Fetching summary statistics for salaries of employees in a specific department and sub-department.

The tests check the HTTP response status code and the structure and content of the response body to ensure the API is functioning correctly.

### Contributing

If you want to add more tests or improve the existing ones, feel free to submit a pull request.