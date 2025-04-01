import { users, type User, type InsertUser, gameSaves, type GameSave, type InsertGameSave, type GameState } from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game save operations
  getSavesByUserId(userId: number): Promise<GameSave[]>;
  getLatestSaveByUserId(userId: number): Promise<GameSave | undefined>;
  saveGameState(save: InsertGameSave): Promise<GameSave>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameSaves: Map<number, GameSave>;
  private userIdCounter: number;
  private saveIdCounter: number;

  constructor() {
    this.users = new Map();
    this.gameSaves = new Map();
    this.userIdCounter = 1;
    this.saveIdCounter = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSavesByUserId(userId: number): Promise<GameSave[]> {
    return Array.from(this.gameSaves.values())
      .filter(save => save.userId === userId)
      .sort((a, b) => b.lastSaved.getTime() - a.lastSaved.getTime());
  }

  async getLatestSaveByUserId(userId: number): Promise<GameSave | undefined> {
    const saves = await this.getSavesByUserId(userId);
    return saves.length > 0 ? saves[0] : undefined;
  }

  async saveGameState(insertGameSave: InsertGameSave): Promise<GameSave> {
    const id = this.saveIdCounter++;
    const gameSave: GameSave = {
      ...insertGameSave,
      id,
      lastSaved: new Date()
    };
    this.gameSaves.set(id, gameSave);
    return gameSave;
  }
}

export const storage = new MemStorage();
