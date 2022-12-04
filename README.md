# Test Front-end
## Tech Stack
- React-Typescript
- Redux-Tookit: state management
- React-Router-Dom: internal page component routing
- package Manager: Yarn

## Instruction to Run the project:
```sh
cd frontend
yarn install
yarn
```

## Notes
- data source: https://jsonplaceholder.typicode.com/, use the url parameter of '?_limit=30' to limit the amount of each data object to 30 items
- use post objects as the base item to render item on the page, display the user name by userId as the foreign reference of the post
- for each of the post, select the random album title which belongs to that user, display within the post item
- use entity adapter and creatAsyncThunk from Redux for editing the post title and delete post actions, send the request to https://jsonplaceholder.typicode.com/
- If the promise request fulfilled and receive the 200 success response, update the frontend data state accordingly, to display the latest version of data at UI


