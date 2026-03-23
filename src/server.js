require("dotenv").config();

console.log("JWT_SECRET:", process.env.JWT_SECRET); // must be here

const app = require("./app");

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});