import app from "./app";
import mongoose from "mongoose";

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    //   await mongoose.connect(process.env.MONGO_URI!);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
