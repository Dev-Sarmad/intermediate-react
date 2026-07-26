# Redux Toolkit Notes

## State

State is mutable data that is managed by React. When state changes, React re-renders the affected part of the UI.

Keep the state as local as possible. Only make it global when multiple unrelated parts of the application need it.

If we make a state global without Redux, we have to pass it from the `App` component to all its children, which introduces:

- Unnecessary passing of props to components that don't need them.
- Unnecessary re-renders when state changes in one part of the application but all components re-render.
- Lots of prop drilling.

---

## Why Components Never Modify the Store Directly

Components never modify the store directly.

### Why?

Imagine 20 developers working on the same project.

- One component modifies the cart.
- Another component modifies it differently.
- Another component removes items.

No one knows who changed what.

Debugging becomes a nightmare.

---

## Full Redux State Flow

```text
Component
    │
    ▼
Dispatch Action
    │
    ▼
Reducer Updates Store
    │
    ▼
React Updates UI
```

---

## What Is a Slice?

Think of a slice as:

> A manager responsible for one part of the store.

---

## `configureStore()`

`configureStore()`:

- Creates a store object.
- Attaches the Redux Thunk middleware.
- Enables the Redux DevTools.

---

## `createSlice()`

`createSlice()` creates:

- A reducer (logic that updates state).
- Action creators (functions you dispatch).
- Action types (e.g. `"cart/add"`).

A slice represents one feature or domain of the application's state. It contains the initial state, reducer logic for updating that state, and automatically generates the corresponding action creators and action types.

---

## `initialState`

`initialState` defines the default state for that slice when the Redux store is initialized.

If no previous state exists, Redux uses `initialState` as the starting state.

---

## Why Does a Slice Have a Name?

It prefixes all generated action types.

```js
name: "cart"

reducers: {
   addItem() {}
}
```

Automatically creates:

```text
cart/addItem
```

---

## What Goes Inside `reducers`?

We put the functions that modify the state.

Think of it as:

> "If this action happens, how should this slice's state change?"

---

## What Does `createSlice()` Return?

It returns:

- `actions`
- `reducer`

---

## Immutability in Redux

In Redux, state is immutable.

We create a brand new updated object instead of modifying the existing one.

### Before Immer

```js
return {
  ...state,
  counter: state.counter + 1,
};
```

### After Redux Toolkit (Immer Built In)

```js
state.counter++;
```

It looks like mutation, but it isn't.

Redux Toolkit uses Immer internally.

The `state` parameter is actually a draft state.

When you write:

```js
state.value++;
```

Immer tracks the change and produces a new immutable state object under the hood.

---

## Action Payload

An action payload is the data carried by an action.

It provides the reducer with the information needed to update the state.

---

## `counterSlice.reducer` vs `counterSlice.actions`

### `counterSlice.reducer`

Contains the reducer function responsible for updating the slice's state and is registered in the Redux store.

### `counterSlice.actions`

Contains automatically generated action creator functions that create action objects to be dispatched to the store.

---

## How `createSlice()` Works

```text
createSlice()
        │
        ▼
Creates
        │
        ├── reducer
        │
        └── actions

Store
   │
   └── uses reducer

Component
      │
      ▼
dispatch(increment())
      │
      ▼
increment()

returns

{
   type: "counter/increment"
}
      │
      ▼
dispatch sends it
      │
      ▼
Redux
      │
      ▼
Reducer
      │
      ▼
Store
      │
      ▼
React
```

---

# Connecting React with Redux

## `Provider`

`Provider` is a way by which we connect the application with the Redux store state.

`Provider` uses React Context internally.

Internally, it's roughly like:

```jsx
<MyReduxContext.Provider value={store}>
    <App />
</MyReduxContext.Provider>
```

So every `useSelector()` and `useDispatch()` reads the store from that Context.

Components re-render only if they use `useSelector()` and the value returned by their selector changes.

Components that don't subscribe to Redux state are unaffected by store updates.

---

# Component Re-rendering

## Why Doesn't Every Redux Dispatch Re-render Every Component?

In Redux, the selected state is compared with the previous selected state.

If there is a difference, the component re-renders because the state is updated.

The component does **not** compare the entire Redux state.

Instead, `useSelector()` compares only the value returned by your selector.

---

## How Does `useSelector()` Determine Whether to Re-render?

`useSelector()` compares:

- Previous selected value
- New selected value

If there is a difference, the component re-renders.

---

## Why Is Returning an Object Directly from `useSelector()` Often a Problem?

Returning an object from `useSelector()` is often a problem because objects are compared by reference.

Even if two objects contain the same values, creating a new object results in a new reference.

Since `useSelector()` compares references, the component re-renders.

---

## Why Is `useSelector(state => state)` a Bad Practice?

Because if anything inside the store changes, every component subscribing to the entire store will re-render, even if it doesn't need the changed state.

---

## Is It Okay to Use Multiple `useSelector()` Calls?

Yes.

It is okay to use multiple `useSelector()` calls because each selector subscribes only to a small part of the store.

If only that part changes, only that component re-renders.

If you subscribe to the whole store, any change causes unnecessary re-renders.

---

## How Are Primitives and Objects Compared?

During selector updates:

- Primitive values are compared by value.
- Objects are compared by reference.

---

# Best Practices

Imagine building an application for millions of users.

Tiny mistakes like selecting too much state can cause:

- Unnecessary re-renders
- Lower Lighthouse scores
- Increased battery usage
- Slow UI

### Best Practices

1. Select only what you need.
2. Multiple selectors are okay.
3. Never mutate selected state because Redux is immutable. Always dispatch actions.
4. Keep business logic inside slice reducers.
5. Never call `dispatch()` while rendering.

Example:

```jsx
function Home() {
    dispatch(fetchProducts());

    return <div>Home</div>;
}
```

This causes an infinite loop.

Because whenever the store updates, subscribed components re-render, which dispatches again, updating the store repeatedly.

---

# When to Use `useState`

Use `useState` when:

- The state will not be shared with unrelated components.
- The state is local to a component.

---

# Derived State

Derived state is discouraged because there is no need to store another state variable whose value can be derived from other state variables of that slice.

---

# Why Dispatching During Render Causes an Infinite Loop

When you dispatch an action:

1. The reducer updates the state.
2. State changes.
3. React re-renders.
4. Rendering dispatches another action.
5. The cycle repeats forever.

---

# Business Logic

The business logic should be present inside the slice reducers.

---

# Multiple `useSelector()` Calls

Multiple calls to `useSelector()` are acceptable.

If only a subscribed part of the store changes, only that component re-renders.

If you subscribe to the whole store, any change causes all subscribed components to re-render.

---

# How Redux Updates Immutable State

Redux does not allow direct mutation.

It uses Immer internally.

```text
Real State
     │
     ▼
Immer creates Draft
     │
     ▼
You modify Draft
     │
     ▼
Immer compares changes
     │
     ▼
Creates NEW immutable state
```

---

# Which Reducers Receive an Action?

Every reducer inside the store receives every dispatched action.

## What Do Other Reducers Return?

Reducers that don't handle the action simply return their current state unchanged.

---

# `extraReducers`

## Scenario

```text
User clicks Logout
        │
        ▼
authSlice logs the user out
        │
        ▼
cartSlice automatically clears the cart
```

But...

`logout` belongs to `authSlice`.

How can `cartSlice` respond to an action that it didn't create?

That's exactly what `extraReducers` solves.

---

## What Do We Actually Want?

We already have:

```js
dispatch(logout());
```

Can the cart listen to this action?

**YES.**

Remember:

Every reducer receives every action.

So we simply tell the cart:

> "If you ever receive an `auth/logout` action, clear yourself."

That's exactly what `extraReducers` does.

It allows one slice to listen to another slice's actions.

---

## Common Mistake

Thinking `extraReducers` replaces `reducers`.

**No.**

```text
reducers
    │
    ▼
Own actions

----------------

extraReducers
    │
    ▼
Other slice actions
```

---

# Difference Between `reducers` and `extraReducers`

## `reducers`

Defines actions that belong to the current slice.

Redux Toolkit automatically generates action creators for them.

## `extraReducers`

Allows the current slice to respond to actions created elsewhere, such as actions from another slice.

# Redux Reducers and Async Operations

The Redux reducers can't pause execution. The state should be predictable because reducers are **pure functions**, which means that for the same input they always return the same output.

If we put an API call inside a reducer, the returned data can be different every time, making the reducer impure. For example:

- Sometimes the request takes **2 seconds**.
- Sometimes it takes **4 seconds**.
- Sometimes the response is `[]`.
- Next time it could be `[{ name: "ali" }]`.
- Another time it could return something completely different.

Because of this, reducers cannot contain async operations. Reducers should only calculate the next state synchronously.

---

# `createAsyncThunk`

Before `createAsyncThunk`, we had to manually create three actions:

- `fetchUserStart` (loading)
- `fetchUserSuccess`
- `fetchUserFailure` (error)

We also had to create three reducers to handle these actions.

Example:

```js
try {
  dispatch(fetchUserStart);

  const res = await fetch("/users");
  const data = await res.json();

  dispatch(fetchUsersSuccess(data));
} catch (err) {
  dispatch(fetchUsersFailure(err.message));
}
```

After `createAsyncThunk`:

```js
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async () => {
    const response = await fetch(
      "https://jsonplaceholder.typicode.com/users"
    );

    return await response.json();
  }
);
```

`createAsyncThunk` automatically creates these action types:

- `users/fetchUsers/pending`
- `users/fetchUsers/fulfilled`
- `users/fetchUsers/rejected`

---

# Error Handling with `rejectWithValue`

If we want to display business-related errors, `state.error` should use `action.payload`. This payload comes from `rejectWithValue`.

Example:

```js
createAsyncThunk("...", async (_, thunkAPI) => {
  return thunkAPI.rejectWithValue();
});
```

In production, we should handle both:

- Unexpected/runtime errors
- Business errors returned by the backend

Example:

```js
builder.addCase(login.rejected, (state, action) => {
  state.error = action.payload || action.error.message;
});
```

---

# Use `status` Instead of `loading`

Instead of a boolean `loading` state, use a `status` field.

Possible values:

- `idle`
- `loading`
- `success`
- `failed`

Also, maintain a separate `status` for each feature instead of sharing a single loading state across the entire application.

# Extra Reducers

`extraReducers` allows one slice to respond to actions created outside of that slice.

Entity adapters are used in production applications like CRM and eCommerce, where we maintain collections such as:

- Products
- Todos
- Users
- Posts
- Comments
- Likes

They maintain the state in a normalized format like this:

```js
{
  ids: [1, 2, 3, 4],
  entities: {
    1: { name: "Ali" }
  }
}
```

## Example

```js
import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchUser } from "./entityThunk";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

const entitySlice = createSlice({
  name: "entityAdapter",
  initialState,
  reducers: {
    removeUser(state, action) {
      usersAdapter.removeOne(state, action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        usersAdapter.setAll(state, action.payload);

        // There are multiple methods based on the use case
        usersAdapter.updateOne(state, {
          id: 1,
          changes: { name: "sarmad" },
        });

        usersAdapter.updateMany(state, objectsArray);
        usersAdapter.addOne(state, object);
        usersAdapter.addMany(state, objectsArray);
        usersAdapter.setOne(state, object);
        usersAdapter.removeOne(state, id);
        usersAdapter.removeMany(state, [id, id]);

        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      });
  },
});

export const { removeUser } = entitySlice.actions;
export const { selectAll } = usersAdapter.getSelectors(
  (state) => state.users
);

export default entitySlice.reducer;
```

## Mental Model: When to Use Entity Adapter

```
Am I storing many objects?
        │
        ▼
Do they each have an ID?
        │
        ▼
Will I frequently:
- Add
- Update
- Delete
- Find
- Replace
them?
        │
      YES
        │
        ▼
Use Entity Adapter

# Memoized Selector

A **selector** is a function that extracts data from the store.

```js
useSelector((state) => state.cart.items);
```

This is a simple selector that re-renders the component only when the selected state changes.

Suppose I want to calculate the total cart price inside the component using `reduce()`. It will calculate the total, but it will not cache the result. If the component re-renders because its parent re-rendered, it will perform the same computation again using `reduce()`, even though the state has not changed.

To tackle this, Redux Toolkit introduces the **memoized selector**. It basically saves the output when it sees that the input hasn't changed.

## Creating a Memoized Selector

```js
import { createSelector } from "@reduxjs/toolkit";

const selectCartItems = (state) => state.cart.items;

export const selectTotalPrice = createSelector(
  [selectCartItems],
  (items) => {
    return items.reduce(
      (sum, item) => sum + item.price,
      0
    );
  }
);
```

## Using It Inside the Component

```js
const total = useSelector(selectTotalPrice);
```

## How `createSelector` Works Internally

```text
Input
  │
  ▼
Compare with previous input
  │
  ▼
Changed?
 /      \
No       Yes
│         │
▼         ▼
Return    Recalculate
Cache     Cache Again
```

## Selectors Can Combine Multiple Slices

```js
const selectProducts = (state) => state.products.items;

const selectCategory = (state) => state.products.category;

export const selectFilteredProducts = createSelector(
  [selectProducts, selectCategory],
  (products, category) => {
    return products.filter(
      (p) => p.category === category
    );
  }
);
```

We have to perform filtering, sorting, searching, discount calculations, and inventory-related logic inside selectors instead of inside the component.

## Example

```js
state = {
  cart: {
    items: [...]
  },
  user: {...},
  notifications: [...]
};

const selectTotal = createSelector(
  [state => state.cart.items],
  items => items.reduce((sum, item) => sum + item.price, 0)
);
```

### Question

Will `selectTotal` run its `reduce()` function again? Why or why not?

Will the component using `useSelector(selectTotal)` necessarily re-render?

### Answer

`selectTotal` will not recompute because `state.cart.items` still points to the same array reference. `createSelector` compares its input selector's result with the previous one using reference equality (`===`). Since the input hasn't changed, it returns the cached total instead of running `reduce()` again.

The component using `useSelector(selectTotal)` will not re-render because the total does not change.

### What Happens Internally?

1. Redux store updates because `notifications` changed.
2. `useSelector(selectTotal)` runs the selector again.
3. `createSelector` sees that `cart.items` is the same reference.
4. It returns the cached total.
5. `useSelector` compares the returned value with the previous one.
6. Since the total is unchanged (same primitive value), React skips re-rendering that component.

# Middleware

Middleware are the normal function which sit between the dispatch and the reducer. Mostly use for the logging, authentication, analytics, performance monitor, Token refresh, error report which action dispatched.

Middleware in Redux Toolkit have 3 arguments: `store`, `next`, and `action`.

The order matters:

- `store` gives us state. We get it by `store.getState()`.
- `next` function receive the action. The job of the `next()` is send action to a next middleware or reducer.
- Returning the `next()` is important because the reducer wont get the action and will not update the state.

Middleware is mainly for side effects and cross-cutting concerns.

## Logger middleware example

```js
const loggerMiddleware = store => next => action => {
  console.log("Old State");

  console.log(store.getState());

  next(action);

  console.log("New State");

  console.log(store.getState());
};
```

## Usage inside the store

```js
const store = configureStore({
  reducer,

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(logger)
});
```

# Why RTK Query Exists

Before RTK Query, we fetched data inside React + Redux applications using `useEffect`, `axios`, and `createAsyncThunk`.

The problem is that it works fine when we have a small number of APIs, but in production there are many APIs. For each API, we have to create a `createAsyncThunk` which fetches data for a slice, and the reducer gets the data and updates it.

For every single endpoint, we have to create:

- Loading state
- Error state
- Slice
- `createAsyncThunk`

This results in a lot of repetitive code. Also, there is no cache of the response.

After that, RTK Query came in, which handles:

- Caching
- API requests
- Loading state
- Error state
- Refetch
- Retry

---

# Without RTK Query

```jsx
useEffect(() => {
  dispatch(fetchUsers());
}, [dispatch]);

const users = useSelector((state) => state.users.data);
const loading = useSelector((state) => state.users.loading);
const error = useSelector((state) => state.users.error);
```

---

# With RTK Query

```jsx
const { data: users, isLoading, error } = useGetUsersQuery();
```

---

# `createApi`

This is a central service from where we make our API calls.

```jsx
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "apiname",

  baseQuery: fetchBaseQuery({
    baseUrl: "https://www.google/users",
  }),

  endpoints: (builder) => ({
    builder.query({ ... }),
    builder.mutation({ ... }),
  }),
});
```

### `reducerPath`

`reducerPath` is, you can say, the name of the API.

### `baseQuery`

The way every request is made.

### `fetchBaseQuery`

`fetchBaseQuery` is the default HTTP client built on the browser's `fetch` API.

---

# Inside the Store

```jsx
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

---

# Store State Structure

This is how the store state looks:

```js
{
  apiname: {
    queries: {},
    mutations: {}
  }
}
```

RTK Query sends the data via middleware internally. Without it, we can make API requests because it relies on:

- Polling
- Managing cache
- Deduplicating requests
- Invalidating cache
- Refetching

---

# `builder.query`

The `builder` is a helper object that RTK Query provides. It has two methods:

- `query`
- `mutation`

```jsx
endpoints: (builder) => ({
  getUsers: builder.query({
    query: () => "users",
  }),
});
```

`query: () => "users"` is the endpoint for `getUsers`.

When everything goes well and we want to use the fetched data from this endpoint, we have to export it and use it inside the component.

You can use it like this:

```jsx
useGetUsersQuery();
```

The hook name is automatically generated by RTK Query from the endpoint name (`getUsers`).

The hook returns an object containing fields like:

```jsx
{
  data,
  isLoading,
  isFetching,
  isSuccess,
  error,
  ...
}
```

# `builder.mutation`

Mutation is changing data via HTTP methods i.e. `POST`, `PATCH`, `PUT`, and `DELETE`.

`builder.mutation` function return us an array instead of the object like `useGetUserQuery` hook `builder.query`.

The array contains the trigger function and the mutation state.

But why not an object like `builder.query` because when we use the mutation hook if it returns array each time the component mount it create new object like whenever the components mounts it immediately fetch the data.

The trigger function trigger the mutation.

## Imagine if mutations worked like queries

```jsx
const { data } = useCreateUserMutation();
```

When would RTK Query know when to create the user?

- On component mount?
- After a button click?
- After form submission?

It can't know.

That's why it returns:

```jsx
function AddUser() {
  const [
    createUser,
    { isLoading, isSuccess, error },
  ] = useCreateUserMutation();

  const handleSubmit = async () => {
    try {
      await createUser({
        firstName: "Ali",
        age: 22,
      }).unwrap();
    } catch (error) {
      throw new Error(error);
    }
  };

  return (
    <>
      <button onClick={handleSubmit}>
        Create User
      </button>

      {isLoading && <p>Creating...</p>}

      {isSuccess && <p>User Created!</p>}

      {error && <p>Something went wrong</p>}
    </>
  );
}
```

## Why do we use `unwrap()`?

Here we `unwrap` when using `try catch` because it does throw errors.

You're not awaiting a normal Promise returned by `fetch()` or `axios`. Instead, you're awaiting a Redux action promise.

It resolves in both of the cases, if the promise rejects due to some error it resolves it and in success it still resolves that's why we don't get error in catch block.

`unwrap()` converts the Redux action promise into a normal JavaScript Promise.

```text
updateUser(user)
       │
       ▼
dispatch(initiateMutation())
       │
       ▼
Redux Middleware
       │
       ▼
API Request
       │
       ▼
Returns an action object even if server response 500 RTK Query still resolves the promise with an action describing the result instead of rejecting it.
```

## Why should you never call a mutation directly during component rendering?

Because it will mutate on every render so that we have to use trigger function provided by RTK Query.
