# Short Response Questions

Answer each question below in your own words. Aim for 3–5 sentences per answer. Be specific. Use exact terms and concepts from the lesson.

Your responses will each be evaluated out of 3 points for writing quality and 3 points for technical accuracy (6 points per question, 30 points total).

---

## Question 1 - REST Principles

The Todo Tracker API is a **RESTful** API. Identify at least **3 specific design decisions** in the API that make it RESTful, and explain what each one communicates to a client developer. Consider the URL structure, HTTP methods, and status codes used.

**Your answer here:**

The Todo Tracker API follows REST principles in several ways. First, it uses resource-based URLs like `/todos`, which clearly communicates that the endpoint represents a collection of todo resources. Second, it uses HTTP methods for their intended purpose, such as `GET` to retrieve todos, `POST` to create a new todo, and `PATCH` to update an existing todo. Finally, it uses meaningful status codes like `200` for successful requests, `201` when a new todo is created, and `404` when a resource cannot be found. This helps client developers understand the result of their request without needing additional explanation.

---

## Question 2 - Separation of Concerns

What problem is caused by mixing data logic and request/response logic in a single file? What does separating them into a model and controller enable? Be specific about what gets harder and what gets easier.

**Your answer here:**

When data logic and request/response logic are mixed together in one file, the code becomes harder to maintain, test, and understand. Every change requires digging through unrelated code, and business logic becomes tied directly to Express-specific code. Separating them into models and controllers allows each file to have a single responsibility. Controllers handle requests and responses, while models manage data operations. This makes the application easier to organize, debug, and reuse.

---

## Question 3 - Request Lifecycle

Walk through what happens, step by step, when the user clicks a checkbox to toggle a todo's `isDone` field. Name each file and function in your MVC structure that gets involved, in the order it runs, and describe what it does.

**Your answer here:**

When a user clicks a checkbox, the frontend sends a `PATCH` request to the API endpoint for that specific todo. The route file receives the request and passes it to the controller function responsible for updating todos. Inside the controller, the request data is validated and then passed to a model function that updates the todo's `isDone` field in the data store. The model returns the updated todo to the controller, which then sends a response back to the client with the updated data and an appropriate status code. Finally, the frontend receives the response and updates the UI to reflect the todo's new completion status.

---

## Question 4 - Code Sorting

Below is a `createTodo` function that does everything in one place. For each numbered line, identify whether it belongs in the **model** or the **controller**, and explain why.

```js
const createTodo = (req, res) => {
  /* 1 */ const { task } = req.body;
  /* 2 */ if (!task) return res.status(400).send({ message: 'task is required' });
  /* 3 */ const newTodo = { id: getId(), task, isDone: false };
  /* 4 */ todos.push(newTodo);
  /* 5 */ res.status(201).send(newTodo);
};
```

**Your answer here:**

## 1. `const { task } = req.body;` -> Controller

This belongs in the controller because it reads data from the incoming HTTP request.

## 2. `if (!task) return res.status(400).send({ message: 'task is required' });` -> Controller

This belongs in the controller because it handles request validation and sends an HTTP response when the request is invalid.

## 3. `const newTodo = { id: getId(), task, isDone: false };` -> Model

This belongs in the model because it creates and defines the data object being stored.

## 4. `todos.push(newTodo);` -> Model

This belongs in the model because it performs the actual data operation of storing the new todo.

## 5. `res.status(201).send(newTodo);` -> Controller

This belongs in the controller because it is responsible for building and sending the HTTP response back to the client.
