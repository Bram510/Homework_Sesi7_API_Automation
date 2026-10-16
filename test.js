const request = require('supertest');
const { expect } = require('chai');

const baseUrl = 'https://belajar-bareng.onrender.com/api';

describe('API Automation Test - Mocha & Supertest', function () {
    this.timeout(15000);

    let token = '';

    // 1a. POST Login
    describe('POST /login', function () {
        it('1. Berhasil Login', async function () {
            const payload = {
                username: 'admin',
                password: 'admin'
            };

            const response = await request(baseUrl)
                .post('/login')
                .send(payload);

            token = response.body.token;

            expect(response.status).to.equal(200);
            expect(response.body).to.have.property('token');
        });
    });

    // 1b. GET Users
    describe('GET /users', function () {
        it('2. Get list users pakai token', async function () {
            const response = await request(baseUrl)
                .get('/users')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).to.equal(200);
            expect(response.body).to.be.an('object');
        });
    });

    // 1c. POST Add User (Positive Case)
    describe('POST /add-user (Positive Case)', function () {
        it('3. Add user berhasil', async function () {
            const newUser = {
                "username": "aoaobaru", // untuk menghindari duplikasi username, gunakan username unik setiap kali menjalankan test
                "age": 200
            };

            const response = await request(baseUrl)
                .post('/add-user')
                .set('Authorization', `Bearer ${token}`)
                .send(newUser);

            expect(response.status).to.be.oneOf([200, 201]);
            expect(response.body).to.be.an('object');
        });
    });

    // 1c. POST Add User (Negative Case)
    describe('POST /add-user (Negative Case)', function () {
        it('4. gagal add user karena payload kosong', async function () {
            const invalidUser = {}; // Payload kosong

            const response = await request(baseUrl)
                .post('/add-user')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidUser);

            expect(response.status).to.be.oneOf([400, 422, 500, 401]); // Menampung status error yang mungkin dikembalikan server
            expect(response.body).to.be.an('object');
        });
    });
});