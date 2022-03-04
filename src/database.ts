import { connect } from "mongoose";

export default async function connectDB() {
  connect(process.env.DB_URL!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => {
      console.log("Database connected successfully!");
    })
    .catch(() => {
      console.log("Failed to connect Database!");
    });
}
