import bcrypt from 'bcryptjs';

export type UserRecord = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  nid: string;
  contact: string;
};

const seededUsers: UserRecord[] = [];

function ensureSeedUser() {
  if (seededUsers.length === 0) {
    const demoPassword = 'DemoPass1';
    const hash = bcrypt.hashSync(demoPassword, 10);
    seededUsers.push({
      id: 'user-demo',
      name: 'Demo User',
      email: 'demo@care.xyz',
      passwordHash: hash,
      nid: '0000000000',
      contact: '+8801000000000'
    });
  }
}

export function findUserByEmail(email: string) {
  ensureSeedUser();
  return seededUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function addUser(user: Omit<UserRecord, 'id' | 'passwordHash'> & { password: string }) {
  ensureSeedUser();
  const existing = findUserByEmail(user.email);
  if (existing) {
    throw new Error('User already exists');
  }
  const passwordHash = bcrypt.hashSync(user.password, 10);
  const newUser: UserRecord = { ...user, passwordHash, id: `user-${Date.now()}` };
  seededUsers.push(newUser);
  return newUser;
}

export async function validateUser(email: string, password: string) {
  ensureSeedUser();
  const user = findUserByEmail(email);
  if (!user) return null;
  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) return null;
  return user;
}
