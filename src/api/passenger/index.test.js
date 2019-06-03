import request from 'supertest'
import { apiRoot } from '../../config'
import { signSync } from '../../services/jwt'
import express from '../../services/express'
import { User } from '../user'
import routes, { Passenger } from '.'

const app = () => express(apiRoot, routes)

let userSession, anotherSession, adminSession, passenger

beforeEach(async () => {
  const user = await User.create({ email: 'a@a.com', password: '123456' })
  const anotherUser = await User.create({ email: 'b@b.com', password: '123456' })
  const admin = await User.create({ email: 'c@c.com', password: '123456', role: 'admin' })
  userSession = signSync(user.id)
  anotherSession = signSync(anotherUser.id)
  adminSession = signSync(admin.id)
  passenger = await Passenger.create({ user })
})

test('POST /passengers 201 (user)', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
    .send({ access_token: userSession, longitude: 'test', latitude: 'test' })
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
  expect(body.longitude).toEqual('test')
  expect(body.latitude).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('POST /passengers 401', async () => {
  const { status } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /passengers 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(Array.isArray(body.rows)).toBe(true)
  expect(Number.isNaN(body.count)).toBe(false)
})

test('GET /passengers 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /passengers 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(401)
})

test('GET /passengers/:id 200 (admin)', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${passenger.id}`)
    .query({ access_token: adminSession })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(passenger.id)
})

test('GET /passengers/:id 401 (user)', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${passenger.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(401)
})

test('GET /passengers/:id 401', async () => {
  const { status } = await request(app())
    .get(`${apiRoot}/${passenger.id}`)
  expect(status).toBe(401)
})

test('GET /passengers/:id 404 (admin)', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
    .query({ access_token: adminSession })
  expect(status).toBe(404)
})

test('PUT /passengers/:id 200 (user)', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${passenger.id}`)
    .send({ access_token: userSession, longitude: 'test', latitude: 'test' })
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(passenger.id)
  expect(body.longitude).toEqual('test')
  expect(body.latitude).toEqual('test')
  expect(typeof body.user).toEqual('object')
})

test('PUT /passengers/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${passenger.id}`)
    .send({ access_token: anotherSession, longitude: 'test', latitude: 'test' })
  expect(status).toBe(401)
})

test('PUT /passengers/:id 401', async () => {
  const { status } = await request(app())
    .put(`${apiRoot}/${passenger.id}`)
  expect(status).toBe(401)
})

test('PUT /passengers/:id 404 (user)', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
    .send({ access_token: anotherSession, longitude: 'test', latitude: 'test' })
  expect(status).toBe(404)
})

test('DELETE /passengers/:id 204 (user)', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${passenger.id}`)
    .query({ access_token: userSession })
  expect(status).toBe(204)
})

test('DELETE /passengers/:id 401 (user) - another user', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${passenger.id}`)
    .send({ access_token: anotherSession })
  expect(status).toBe(401)
})

test('DELETE /passengers/:id 401', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${passenger.id}`)
  expect(status).toBe(401)
})

test('DELETE /passengers/:id 404 (user)', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
    .query({ access_token: anotherSession })
  expect(status).toBe(404)
})
