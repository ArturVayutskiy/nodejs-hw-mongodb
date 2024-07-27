import dotenv from 'dotenv';

dotenv.config();

export function env(name, defaultValue) {
  const value = process.env[name] || defaultValue;
  if (value) return value;
  throw new Error(`Missing: '${name}'].`);
}
