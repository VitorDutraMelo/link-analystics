import bcrypt from 'bcrypt';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../utils/app-error.js';
import { signToken } from '../utils/jwt.js';
export const authService = {
  async register(input: { name: string; email: string; password: string }) {
    if (await userRepository.findByEmail(input.email))
      throw new AppError(409, 'EMAIL_IN_USE', 'Email is already registered');
    const passwordHash = await bcrypt.hash(input.password, 12);
    return userRepository.create({ name: input.name, email: input.email, passwordHash });
  },
  async login(input: { email: string; password: string }) {
    const user = await userRepository.findByEmail(input.email);
    if (!user || !(await bcrypt.compare(input.password, user.passwordHash)))
      throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    const token = signToken({ sub: user.id, email: user.email });
    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    };
  },
};
