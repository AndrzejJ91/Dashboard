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
    console.log("⚠️ Użytkownik już istnieje w bazie danych.");
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const user = new User({ email, password: hashedPassword });

  await user.save();
  console.log("✅ Użytkownik został dodany do bazy danych.");
  process.exit(0);
};

seedUser().catch((error) => {
  console.error("❌ Błąd przy dodawaniu użytkownika:", error);
  process.exit(1);
});
