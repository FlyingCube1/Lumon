import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameSaveSchema, insertUserSchema, gameStateSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User authentication routes
  app.post("/api/users/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByUsername(userData.username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser(userData);
      res.status(201).json({ id: newUser.id, username: newUser.username });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid user data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating user" });
    }
  });

  app.post("/api/users/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set user session
      if (req.session) {
        req.session.userId = user.id;
      }
      
      res.status(200).json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Error during login" });
    }
  });

  // Game save routes
  app.get("/api/saves", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const saves = await storage.getSavesByUserId(userId);
      res.status(200).json(saves);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving saves" });
    }
  });

  app.get("/api/saves/latest", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const latestSave = await storage.getLatestSaveByUserId(userId);
      
      if (!latestSave) {
        return res.status(404).json({ message: "No saves found" });
      }
      
      res.status(200).json(latestSave);
    } catch (error) {
      res.status(500).json({ message: "Error retrieving latest save" });
    }
  });

  app.post("/api/saves", async (req: Request, res: Response) => {
    try {
      const userId = req.session?.userId;
      
      if (!userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      // Validate game state
      const gameState = gameStateSchema.parse(req.body.gameState);
      
      const saveData = {
        userId,
        gameState: req.body.gameState
      };
      
      const savedGame = await storage.saveGameState(saveData);
      res.status(201).json(savedGame);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid game state data", errors: error.errors });
      }
      res.status(500).json({ message: "Error saving game" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
