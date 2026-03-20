# Short Response Questions

Answer each question below in your own words. Aim for 3–5 sentences per answer. Be specific — use exact terms and concepts from the lesson.

Your responses will each be evaluated out of 3 points for writing quality and 3 points for technical accuracy (6 points per question, 30 points total).

---

## Question 1 — REST Principles

The Todo Tracker API is a **RESTful** API. Identify at least **3 specific design decisions** in the API that make it RESTful, and explain what each one communicates to a client developer. Consider the URL structure, HTTP methods, and status codes used.

**Your answer here**:

The API is restful since it's endpoint URLs point to resources, as opposed to naming actions.

The API is restful since it's stateless and doesn't need or use any specific or session information other than what its given.

The API is restful since it's endpoints in a way, map out data using a logical hierarchal structure reflecting our model.

## Question 2 — Separation of Concerns

What problem is caused by mixing data logic and request/response logic in a single file? What does separating them into a model and controller enable? Be specific about what gets harder and what gets easier.

Mutation of our database without proper validation or inaccurate prescription of a response status. It gets easier to Isolate and root out issues in our code across our MVC, however if we have a complex hefty API it can get messy quickly.

---

## Question 3 — Request Lifecycle

Walk through what happens, step by step, when the user clicks a checkbox to toggle a todo's `isDone` field. Name each file and function in your MVC structure that gets involved, in the order it runs, and describe what it does.

**Your answer here**:

The interface makes a fetch patch request, our corresponding controller picks this request up (after it is processed by middleware) and sends the signal to our Model, our model then makes the changes to our database Accordingly.

---

## Question 4 — Code Sorting

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

This belongs in the controller since it's dealing with the req and res.
**Controllers validate requests, ship actions to our model, and formulate responses.**


**Your answer here**:
