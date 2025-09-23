import 'dotenv/config'
import { connectDB } from "../lib/utils.js";
import User from "../models/user.model.js";

// Replace fullName with explicit firstname/lastname
const seedUsers = [
  { email: "luffy.mugiwara@example.com", firstname: "Monkey D.", lastname: "Luffy", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/5/56/Monkey_D._Luffy_Portrait.png" },
  { email: "zoro.swordsman@example.com", firstname: "Roronoa", lastname: "Zoro", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/6/6f/Roronoa_Zoro_Portrait.png" },
  { email: "nami.navigator@example.com", firstname: "Nami", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/e/e2/Nami_Portrait.png" },
  { email: "sanji.chef@example.com", firstname: "Vinsmoke", lastname: "Sanji", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/f/fd/Vinsmoke_Sanji_Portrait.png" },
  { email: "usopp.sniper@example.com", firstname: "Usopp", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/5/59/Usopp_Portrait.png" },
  { email: "chopper.doctor@example.com", firstname: "Tony Tony", lastname: "Chopper", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/d/d7/Tony_Tony_Chopper_Portrait.png" },
  { email: "robin.archaeologist@example.com", firstname: "Nico", lastname: "Robin", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/c/c4/Nico_Robin_Portrait.png" },
  { email: "franky.shipwright@example.com", firstname: "Franky", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/d/d0/Franky_Portrait.png" },
  { email: "brook.musician@example.com", firstname: "Brook", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/c/c9/Brook_Portrait.png" },
  { email: "jinbe.helmsman@example.com", firstname: "Jinbe", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/f/f2/Jinbe_Portrait.png" },
  { email: "ace.firefist@example.com", firstname: "Portgas D.", lastname: "Ace", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/8/8a/Portgas_D._Ace_Portrait.png" },
  { email: "shanks.redhair@example.com", firstname: "Shanks", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/2/23/Shanks_Portrait.png" },
  { email: "law.traffy@example.com", firstname: "Trafalgar D.", lastname: "Water Law", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/9/91/Trafalgar_D._Water_Law_Portrait.png" },
  { email: "boa.hancock@example.com", firstname: "Boa", lastname: "Hancock", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/6/6c/Boa_Hancock_Portrait.png" },
  { email: "kaido.beast@example.com", firstname: "Kaido", lastname: "", password: "123456", profilePic: "https://static.wikia.nocookie.net/onepiece/images/e/e4/Kaido_Portrait.png" },
];

const run = async () => {
  try {
    await connectDB();

    // Map directly to schema fields
    const docs = seedUsers.map(u => ({
      email: u.email,
      firstname: u.firstname,
      lastname: u.lastname,
      password: u.password,     // pre-save hook should hash
      profilePic: u.profilePic,
    }));

    await User.create(docs);

    console.log("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

run();
