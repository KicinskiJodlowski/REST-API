import { Passenger } from '.'
import { User } from '../user'

let user, passenger

beforeEach(async () => {
  user = await User.create({ email: 'a@a.com', password: '123456' })
  passenger = await Passenger.create({ user, longitude: 'test', latitude: 'test' })
})

describe('view', () => {
  it('returns simple view', () => {
    const view = passenger.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(passenger.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.longitude).toBe(passenger.longitude)
    expect(view.latitude).toBe(passenger.latitude)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = passenger.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(passenger.id)
    expect(typeof view.user).toBe('object')
    expect(view.user.id).toBe(user.id)
    expect(view.longitude).toBe(passenger.longitude)
    expect(view.latitude).toBe(passenger.latitude)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
