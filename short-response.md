# Short Response Questions

Answer each question below in your own words. Aim for 3–5 sentences per answer. Be specific. Use exact terms and concepts from the lesson.

Your responses will each be evaluated out of 3 points for writing quality and 3 points for technical accuracy (6 points per question, 30 points total).

---

## Question 1 - REST Principles

The Todo Tracker API is a **RESTful** API. Identify at least **3 specific design decisions** in the API that make it RESTful, and explain what each one communicates to a client developer. Consider the URL structure, HTTP methods, and status codes used.

**Your answer here:**

#### the menu analogy

Think of a **REST** API like a restaurant menu — the menu doesn't say "press this button to make the kitchen do a specific secret thing," it lists *dishes* (resources), and you order using a small set of universal verbs (pick one, add one, change one, cancel one). That's basically what this API does and its lowkey the whole point of REST.

#### 3 things that make it RESTful

1. **Resource-based URLs** — everything lives under `/api/todos` (and `/api/todos/:id` for one specific todo). There's no `/api/getTodos` or `/api/deleteTodo` anywhere — the URL names the *thing*, not the action. That tells a client dev "this is a collection of todos, and here's how you address one of them."
2. **HTTP methods carry the verb** — `GET` reads, `POST` creates, `PATCH` updates, `DELETE` removes. Since the method already says what you're doing, the URL doesn't have to. A client dev can guess `PATCH /api/todos/3` updates todo 3 without ever reading a single line of my code.
3. **Status codes tell the story of what happened** — `200` for a normal success, `201` specifically when something new got created, `404` when the id just doesn't exist, `400` when the request itself was bad (like missing `task`). That way the client doesn't have to parse a message string to figure out what happened, it can just check the number.

Put all three together and a client dev could probably use this API correctly without ever opening `todoControllers.js`. *That's* the whole promise of REST — predictability over guesswork.

---

## Question 2 - Separation of Concerns

What problem is caused by mixing data logic and request/response logic in a single file? What does separating them into a model and controller enable? Be specific about what gets harder and what gets easier.

**Your answer here:**

#### one big drawer problem

Mixing data logic and request/response logic in one file is like keeping your socks, your tax documents, and your phone charger all in the same drawer — technically it works, but the second you need just one of those things you're digging through everything else to find it. Before the refactor, `index.js` had the `todos` array, the `getId` function, *and* the route handlers all tangled together. Every route was reading and mutating that array directly, right next to the `req`/`res` code.

#### what gets harder

When it's all one file, changing how data gets stored (say, swapping the array for a real database later) means touching every single route handler, because they all reach directly into `todos`. Testing is harder too — you can't test "does creating a todo work" without also spinning up Express and firing a fake request at it, since the logic is welded to `req`/`res`.

#### what gets easier

Splitting it into a **model** (`todoModel.js`) and **controller** (`todoControllers.js`) gives each file exactly one job. The model owns the `todos` array and the CRUD-y functions (`list`, `find`, `create`, `update`, `destroy`) — nothing in there knows Express even exists. The controller's whole job is reading `req`, calling the right model function, and sending `res` back. Now I can test the model with plain function calls, no server needed, and if I ever swap the data source out for a real database, only `todoModel.js` has to change. Everything else stays exactly the same — *that's* the actual payoff of MVC, not just "it looks cleaner."

---

## Question 3 - Request Lifecycle

Walk through what happens, step by step, when the user clicks a checkbox to toggle a todo's `isDone` field. Name each file and function in your MVC structure that gets involved, in the order it runs, and describe what it does.

**Your answer here:**

#### the chain of custody

Here's the full trip a single checkbox click takes through my app, step by step:

1. **Frontend (`frontend/src/main.js`)** — the click handler on the checkbox fires and sends a `PATCH` request to `/api/todos/:id` with `{ isDone: true/false }` in the body (using the fetch helpers).
2. **`server/index.js`** — this is where the route lives: `app.patch('/api/todos/:id', todoControllers.updateTodo)`. Its only job is matching the method + URL to the right controller function, it does not touch the request data itself.
3. **`server/controllers/todoControllers.js` → `updateTodo(req, res)`** — this pulls `req.params.id` and `req.body` off the request and hands them straight to the model with `todoModel.update(req.params.id, req.body)`. It doesn't know or care *how* the update actually happens.
4. **`server/models/todoModel.js` → `update(id, changes)`** — this is where the actual data mutation happens. It finds the matching todo in the `todos` array by id, merges in the changes (`Object.assign`), and returns a *copy* of the updated todo (or `null` if no todo matched that id).
5. **Back in `updateTodo`** — if the model returned `null`, the controller sends a `404`. Otherwise it sends `res.json(todo)` with a `200`.
6. **Frontend again** — the fetch call resolves, and the DOM helper re-renders that todo's checkbox to match the new `isDone` value.

Notice the model never sees `req` or `res`, and the controller never touches the `todos` array directly — that boundary is the entire point of MVC and its kind of satisfying once you see it actually hold up end to end.

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

#### quick sort before the reasoning

Line 1 -> Controller, Line 2 -> Controller, Line 3 -> Model, Line 4 -> Model, Line 5 -> Controller. Basically the rule i used: if the line touches `req` or `res`, its controller. if it touches the `todos` array, its model.

#### 1. `const { task } = req.body;` -> Controller

This is pulling data straight off the `req` object, and the model isn't supposed to know `req` exists at all. So this stays with the controller.

#### 2. `if (!task) return res.status(400).send({ message: 'task is required' });` -> Controller

Same deal — this is *request validation*, and it sends a response (`res.status(400).send`) directly. Anything that builds or sends a response has to live in the controller, no exceptions.

#### 3. `const newTodo = { id: getId(), task, isDone: false };` -> Model

This is building the actual data object that gets stored — no `req` or `res` anywhere in sight, just shaping the todo. That's data logic, so it belongs in the model (probably inside a `create(task)` function).

#### 4. `todos.push(newTodo);` -> Model

This directly mutates the `todos` array, which is the one thing only the model is allowed to touch. If the controller did this instead, it'd have direct access to the data store and the whole point of separating concerns falls apart.

#### 5. `res.status(201).send(newTodo);` -> Controller

Back to the controller for this one — its sending the final response with the right status code (`201` since something got created). The model already handed back the finished `newTodo`, the controller's only job left is packaging it up for the client.

*Here's the thing though* — lines 3 and 4 together are basically just what `todoModel.create(task)` should do, and lines 1, 2, and 5 are what `createTodo(req, res)` in the controller should look like once its calling that model function. Split cleanly like that, neither file needs to know anything about the other's internals.
