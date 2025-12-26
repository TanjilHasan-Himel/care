import { NextResponse } from 'next/server';
import { addUser } from '@/lib/users';

export async function POST(request: Request) {
  const body = await request.json();
  const { nid, name, email, contact, password } = body;

  if (!email || !password || !name || !nid || !contact) {
    return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
  }

  const passwordValid = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password);
  if (!passwordValid) {
    return NextResponse.json({ message: 'Password must be 6+ chars with uppercase and lowercase' }, { status: 400 });
  }

  try {
    const user = addUser({ nid, name, email, contact, password });
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to register' }, { status: 400 });
  }
}
