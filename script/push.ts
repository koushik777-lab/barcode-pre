import "dotenv/config";
import { execa } from "execa";

async function main() {
  try {
    await execa("drizzle-kit", ["push"], { stdio: "inherit" });
  } catch (error) {
    console.error("Error pushing database schema:", error);
    process.exit(1);
  }
}

main();
