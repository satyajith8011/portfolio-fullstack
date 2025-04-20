import crypto from 'crypto';
import util from 'util';

const scryptAsync = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const password = "bootstrapsatya2025";
  const hashedPassword = await hashPassword(password);
  console.log(hashedPassword);
}

main().catch(console.error);