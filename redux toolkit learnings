````md
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
````
