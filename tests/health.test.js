const request = require('supertest');
const express = require('express');

// Mock deps
jest.mock('../redis', () => ({
  on: jest.fn(),
  get: jest.fn(),
  set: jest.fn(),
}));
jest.mock('../db', () => ({
    userModel: { findOne: jest.fn(), create: jest.fn() },
    courseModel: { find: jest.fn() },
    adminModel: {},
    purchaseModel: {}
}));
// We need to mock the routes too if they are loaded in index.js and try to connect to things
jest.mock('../routes/user', () => ({ userRouter: (req, res, next) => next() }));
jest.mock('../routes/admin', () => ({ adminRouter: (req, res, next) => next() }));
jest.mock('../routes/course', () => ({ courseRouter: (req, res, next) => next() }));

// Helper to get app without starting server
// We might need to refactor index.js to export app, but for now let's try to require it
// If index.js calls app.listen, it will hang the tests. 
// Standard practice: separate app.js and server.js.
// I will refactor index.js slightly to export app.

describe('Health Check', () => {
    it('should return 200 OK', async () => {
        // Since we can't easily import app if it listens on import, 
        // I will create a simple app here or mock the require.
        // BETTER PLAN: Refactor index.js in a separate tool call to export app.
        // For now, I'll write the test assuming app is exported.
        const { app } = require('../index'); 
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.body.status).toEqual('OK');
    });
});
