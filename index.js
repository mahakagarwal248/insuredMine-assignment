import app from "./configs/express.config.js";
import "./configs/mongodb.config.js";

app.listen(process.env.PORT, () => {
  console.log(`Server Started 💚 On Port (${process.env.PORT})`);
});

export default app;
