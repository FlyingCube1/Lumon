import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertEmployeeSchema, 
  updateEmployeeSchema, 
  adminCredentialsSchema
} from "@shared/schema";
import { z } from "zod";

// No need for helper function anymore as we're using sessions

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { name, code } = req.body;
      
      if (!name || !code) {
        return res.status(400).json({ message: "Name and code are required" });
      }

      const employee = await storage.getEmployeeByName(name);

      if (!employee || employee.code !== code) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session data
      req.session.employeeId = employee.id;
      req.session.isAdmin = employee.isAdmin === 1;

      return res.status(200).json({
        id: employee.id,
        name: employee.name,
        department: employee.department,
        job: employee.job,
        isAdmin: employee.isAdmin === 1
      });
    } catch (error) {
      return res.status(500).json({ message: "Error logging in" });
    }
  });
  
  app.post("/api/auth/admin", async (req: Request, res: Response) => {
    try {
      const credentials = adminCredentialsSchema.parse(req.body);
      const isAdmin = await storage.validateAdmin(credentials.name, credentials.code);
      
      if (!isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      return res.status(200).json({ message: "Admin access granted" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Error validating admin" });
    }
  });
  
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    // Clear the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Employee management endpoints (protected by admin auth)
  app.get("/api/employees", async (req: Request, res: Response) => {
    try {
      // Check if user is admin from session
      if (!req.session.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const employees = await storage.getAllEmployees();
      return res.status(200).json(employees);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving employees" });
    }
  });
  
  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is admin from session
      if (!req.session.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const employeeId = parseInt(req.params.id);
      
      if (isNaN(employeeId)) {
        return res.status(400).json({ message: "Valid employee ID is required" });
      }
      
      const employee = await storage.getEmployee(employeeId);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      return res.status(200).json(employee);
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving employee" });
    }
  });
  
  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      // Check if user is admin from session
      if (!req.session.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const validatedData = insertEmployeeSchema.parse(req.body);
      
      // Check if employee code already exists
      const existingEmployee = await storage.getEmployeeByCode(validatedData.code);
      if (existingEmployee) {
        return res.status(400).json({ message: "Employee code already exists" });
      }
      
      const employee = await storage.createEmployee(validatedData);
      return res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Error creating employee" });
    }
  });
  
  app.put("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is admin from session
      if (!req.session.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const employeeId = parseInt(req.params.id);
      
      if (isNaN(employeeId)) {
        return res.status(400).json({ message: "Valid employee ID is required" });
      }
      
      const validatedData = updateEmployeeSchema.parse(req.body);
      
      const updatedEmployee = await storage.updateEmployee(employeeId, validatedData);
      
      if (!updatedEmployee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      return res.status(200).json(updatedEmployee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      return res.status(500).json({ message: "Error updating employee" });
    }
  });
  
  app.delete("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      // Check if user is admin from session
      if (!req.session.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const employeeId = parseInt(req.params.id);
      
      if (isNaN(employeeId)) {
        return res.status(400).json({ message: "Valid employee ID is required" });
      }
      
      const success = await storage.deleteEmployee(employeeId);
      
      if (!success) {
        return res.status(404).json({ message: "Employee not found or cannot be deleted" });
      }
      
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error deleting employee" });
    }
  });
  
  // Get employee info from session
  app.get("/api/employee-info", async (req: Request, res: Response) => {
    try {
      const employeeId = req.session.employeeId;
      
      if (!employeeId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const employee = await storage.getEmployee(employeeId);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      return res.status(200).json({
        name: employee.name,
        department: employee.department,
        job: employee.job
      });
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving employee info" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
