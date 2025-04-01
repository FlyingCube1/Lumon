import { 
  employees, type Employee, type InsertEmployee, type UpdateEmployee, type Department
} from "@shared/schema";

export interface IStorage {
  // Employee operations
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByCode(code: string): Promise<Employee | undefined>;
  getEmployeeByName(name: string): Promise<Employee | undefined>;
  getAllEmployees(): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, updates: UpdateEmployee): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  validateAdmin(name: string, code: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private employees: Map<number, Employee>;
  private employeeIdCounter: number;

  constructor() {
    this.employees = new Map();
    this.employeeIdCounter = 1;
    
    // Add default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Add default admin user - name: Admin, code: 99999
    const adminEmployee: InsertEmployee = {
      name: "Admin",
      code: "99999",
      department: "MIND_SECURITY",
      job: "System Administrator",
      isAdmin: 1
    };
    
    // Add our original employee - name: Felix, code: 00000
    const felixEmployee: InsertEmployee = {
      name: "Felix",
      code: "00000",
      department: "UNASSIGNED",
      job: "",
      isAdmin: 0
    };
    
    this.createEmployee(adminEmployee);
    this.createEmployee(felixEmployee);
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByCode(code: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.code === code
    );
  }

  async getEmployeeByName(name: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.name.toLowerCase() === name.toLowerCase()
    );
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.employeeIdCounter++;
    // Ensure all required fields have values
    const employee: Employee = { 
      ...insertEmployee, 
      id,
      department: insertEmployee.department || "UNASSIGNED",
      job: insertEmployee.job || "",
      isAdmin: insertEmployee.isAdmin || 0
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: number, updates: UpdateEmployee): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    
    if (!employee) {
      return undefined;
    }
    
    const updatedEmployee = {
      ...employee,
      ...updates
    };
    
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    // Don't allow deletion of default admin
    const employee = await this.getEmployee(id);
    if (employee && employee.code === "99999") {
      return false;
    }
    
    return this.employees.delete(id);
  }

  async validateAdmin(name: string, code: string): Promise<boolean> {
    const employee = await this.getEmployeeByName(name);
    
    if (!employee) {
      return false;
    }
    
    return employee.code === code && employee.isAdmin === 1;
  }
}

export const storage = new MemStorage();
