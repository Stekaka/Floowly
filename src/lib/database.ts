// Simple in-memory database for development and testing
interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  companyId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Company {
  id: string;
  name: string;
  domain: string;
  plan: string;
  maxUsers: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  address: any;
  tags: string[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Quote {
  id: string;
  customerId: string;
  title: string;
  description: string;
  items: any;
  subtotal: number;
  taxAmount: number;
  total: number;
  status: string;
  hours: number;
  materialCost: number;
  markupPercentage: number;
  profitEstimate: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface Job {
  id: string;
  customerId: string;
  quoteId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
  hours: number;
  materialCost: number;
  quotedPrice: number;
  status: string;
  notes: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage
let users: User[] = [];
let companies: Company[] = [];
let customers: Customer[] = [];
let quotes: Quote[] = [];
let jobs: Job[] = [];

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

// Database operations
export const db = {
  // User operations
  user: {
    findUnique: async (where: any) => {
      if (where.email) {
        return users.find(user => user.email === where.email) || null;
      }
      if (where.id) {
        return users.find(user => user.id === where.id) || null;
      }
      return null;
    },
    findFirst: async (where: any) => {
      if (where.email && where.companyId) {
        return users.find(user => user.email === where.email && user.companyId === where.companyId) || null;
      }
      if (where.email) {
        return users.find(user => user.email === where.email) || null;
      }
      return null;
    },
    findMany: async (where: any = {}) => {
      if (where.companyId) {
        return users.filter(user => user.companyId === where.companyId);
      }
      return users;
    },
    create: async (data: any) => {
      const user: User = {
        id: generateId(),
        email: data.email,
        password: data.password,
        name: data.name,
        role: data.role,
        companyId: data.companyId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      users.push(user);
      return user;
    },
    update: async (where: { id: string }, data: any) => {
      const index = users.findIndex(user => user.id === where.id);
      if (index === -1) throw new Error('User not found');
      users[index] = { ...users[index], ...data, updatedAt: new Date() };
      return users[index];
    },
    delete: async (where: { id: string }) => {
      const index = users.findIndex(user => user.id === where.id);
      if (index === -1) throw new Error('User not found');
      users.splice(index, 1);
      return users[index];
    },
    count: async () => users.length,
  },

  // Company operations
  company: {
    findUnique: async (where: any) => {
      if (where.name) {
        return companies.find(company => company.name === where.name) || null;
      }
      if (where.id) {
        return companies.find(company => company.id === where.id) || null;
      }
      return null;
    },
    create: async (data: any) => {
      const company: Company = {
        id: generateId(),
        name: data.name,
        domain: data.domain,
        plan: 'professional',
        maxUsers: 50,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      companies.push(company);
      return company;
    },
    count: async () => companies.length,
  },

  // Customer operations
  customer: {
    findMany: async (where: any = {}) => {
      return customers;
    },
    create: async (data: any) => {
      const customer: Customer = {
        id: generateId(),
        name: data.name,
        company: data.company,
        email: data.email,
        phone: data.phone,
        address: data.address,
        tags: data.tags,
        status: data.status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      customers.push(customer);
      return customer;
    },
    update: async (where: { id: string }, data: any) => {
      const index = customers.findIndex(customer => customer.id === where.id);
      if (index === -1) throw new Error('Customer not found');
      customers[index] = { ...customers[index], ...data, updatedAt: new Date() };
      return customers[index];
    },
    delete: async (where: { id: string }) => {
      const index = customers.findIndex(customer => customer.id === where.id);
      if (index === -1) throw new Error('Customer not found');
      customers.splice(index, 1);
      return customers[index];
    },
    count: async (where: any = {}) => {
      if (where.status) {
        return customers.filter(customer => customer.status === where.status).length;
      }
      return customers.length;
    },
  },

  // Quote operations
  quote: {
    findMany: async (where: any = {}) => {
      return quotes;
    },
    findUnique: async (where: { id: string }) => {
      return quotes.find(quote => quote.id === where.id) || null;
    },
    findFirst: async (where: { id: string }) => {
      return quotes.find(quote => quote.id === where.id) || null;
    },
    create: async (data: any) => {
      const quote: Quote = {
        id: generateId(),
        customerId: data.customerId,
        title: data.title,
        description: data.description,
        items: data.items,
        subtotal: data.subtotal,
        taxAmount: data.taxAmount,
        total: data.total,
        status: data.status,
        hours: data.hours,
        materialCost: data.materialCost,
        markupPercentage: data.markupPercentage,
        profitEstimate: data.profitEstimate,
        expiresAt: data.expiresAt,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      quotes.push(quote);
      return quote;
    },
    update: async (where: { id: string }, data: any) => {
      const index = quotes.findIndex(quote => quote.id === where.id);
      if (index === -1) throw new Error('Quote not found');
      quotes[index] = { ...quotes[index], ...data, updatedAt: new Date() };
      return quotes[index];
    },
    delete: async (where: { id: string }) => {
      const index = quotes.findIndex(quote => quote.id === where.id);
      if (index === -1) throw new Error('Quote not found');
      quotes.splice(index, 1);
      return quotes[index];
    },
    count: async (where: any = {}) => {
      if (where.status) {
        return quotes.filter(quote => quote.status === where.status).length;
      }
      return quotes.length;
    },
  },

  // Job operations
  job: {
    findMany: async (where: any = {}) => {
      return jobs;
    },
    create: async (data: any) => {
      const job: Job = {
        id: generateId(),
        customerId: data.customerId,
        quoteId: data.quoteId,
        title: data.title,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        startTime: data.startTime,
        endTime: data.endTime,
        hours: data.hours,
        materialCost: data.materialCost,
        quotedPrice: data.quotedPrice,
        status: data.status,
        notes: data.notes,
        timezone: data.timezone,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jobs.push(job);
      return job;
    },
    count: async (where: any = {}) => {
      if (where.status) {
        return jobs.filter(job => job.status === where.status).length;
      }
      return jobs.length;
    },
  },

  // Transaction support
  $transaction: async (callback: (tx: any) => Promise<any>) => {
    return await callback(db);
  },
};
