import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'carbonloop_secret_jwt_key_for_hackathon_demo_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const DEMO_PASSWORD = process.env.DEMO_PASSWORD || 'DemoPassword123!';

export class UserService {
  private users: Map<string, User> = new Map();
  private userCounter: number = 100;

  constructor() {
    this.seedDemoUsers();
  }

  private async seedDemoUsers() {
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash(DEMO_PASSWORD, salt);
    const now = new Date().toISOString();

    const demoUsers: User[] = [
      {
        id: 'usr-generator-1',
        name: 'Gujarat Agro Producer Cooperative',
        email: 'generator@carbonloop.demo',
        passwordHash: demoPasswordHash,
        role: 'waste_generator',
        organization: 'Gujarat Agro FPO Cluster (Ahmedabad)',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'usr-facility-1',
        name: 'Sanand Biochar Plant Manager',
        email: 'facility@carbonloop.demo',
        passwordHash: demoPasswordHash,
        role: 'facility_operator',
        organization: 'BioChar Plant A (Sanand Industrial Eco-Park)',
        facilityId: 'fac-biochar-a',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'usr-municipality-1',
        name: 'Ahmedabad Municipal Climate Cell',
        email: 'municipality@carbonloop.demo',
        passwordHash: demoPasswordHash,
        role: 'municipality',
        organization: 'AMC Waste Diversion & Environment Wing',
        createdAt: now,
        updatedAt: now,
      },
      {
        id: 'usr-admin-1',
        name: 'CarbonLoop Global Administrator',
        email: 'admin@carbonloop.demo',
        passwordHash: demoPasswordHash,
        role: 'admin',
        organization: 'CarbonLoop Ecosystem Governance',
        createdAt: now,
        updatedAt: now,
      },
    ];

    demoUsers.forEach((u) => this.users.set(u.email.toLowerCase(), u));
  }

  public async register(input: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    organization: string;
    facilityId?: string;
  }): Promise<User> {
    const normalizedEmail = input.email.trim().toLowerCase();

    if (this.users.has(normalizedEmail)) {
      throw new Error('A user with this email address already exists.');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(input.password, salt);
    const now = new Date().toISOString();
    const id = `usr-${++this.userCounter}`;

    const newUser: User = {
      id,
      name: input.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: input.role,
      organization: input.organization.trim(),
      facilityId: input.facilityId,
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(normalizedEmail, newUser);
    return newUser;
  }

  public async authenticateUser(
    email: string,
    password: string
  ): Promise<{ user: Omit<User, 'passwordHash'>; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.get(normalizedEmail);

    if (!user || !user.passwordHash) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    const token = this.generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return { user: safeUser, token };
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users.get(email.trim().toLowerCase());
  }

  public getUserById(id: string): User | undefined {
    return Array.from(this.users.values()).find((u) => u.id === id);
  }

  public getAllUsers(): Omit<User, 'passwordHash'>[] {
    return Array.from(this.users.values()).map(({ passwordHash: _, ...safe }) => safe);
  }

  public generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      organization: user.organization,
      facilityId: user.facilityId,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions);
  }

  public verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch {
      return null;
    }
  }
}

export const userService = new UserService();
