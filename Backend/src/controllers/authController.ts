import dotenv from 'dotenv';
import connectDB from '../config/db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

const seedUser = async () => {
  await connectDB();

  const email = "admin@example.com";
  const password = "admin123";

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    console.log("⚠️ User already exists in the database.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({ email, password: hashedPassword });

  await user.save();
  console.log("✅ User has been added to the database.");
  process.exit(0);
};

seedUser().catch((error) => {
  console.error("❌ Error while adding user:", error);
  process.exit(1);
});
