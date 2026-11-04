import ExpenseHome from "./components/ExpenseHome";

const defaultTokens = {
  refresh_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTU3YzJhMTZkNTUyMDM0NmEzZTdkNWIiLCJpYXQiOjE3OTM2OTEzNTUsImV4cCI6MTc5NDI5NjE1NX0.ipdIkAM10tQxrrjPDdJ9Q7QdrBezl6qYW-WgVPJrk_E",
  access_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTU3YzJhMTZkNTUyMDM0NmEzZTdkNWIiLCJ3b3Jrc3BhY2VfaWQiOiI2OTU3YzJhMDZkNTUyMDM0NmEzZTdkNTkiLCJpYXQiOjE3OTM2OTEzNTUsImV4cCI6MTc5MzY5MjU1NX0.nv4CX78LqjOz9Ndjae7AKJrzSx40likh6Vex9QyABvU",
  _id: "6957c2a16d5520346a3e7d5b",
};

function App() {
  return <ExpenseHome baseurl="/" tokens={defaultTokens} />;
}

export default App;
