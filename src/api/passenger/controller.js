import { success, notFound, authorOrAdmin } from '../../services/response/'
import { Passenger } from '.'

export const create = ({ user, bodymen: { body } }, res, next) =>
  Passenger.create({ ...body, user })
    .then((passenger) => passenger.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  Passenger.count(query)
    .then(count => Passenger.find(query, select, cursor)
      .populate('user')
      .then((passengers) => ({
        count,
        rows: passengers.map((passenger) => passenger.view())
      }))
    )
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
  Passenger.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then((passenger) => passenger ? passenger.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ user, bodymen: { body }, params }, res, next) =>
  Passenger.findById(params.id)
    .populate('user')
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((passenger) => passenger ? Object.assign(passenger, body).save() : null)
    .then((passenger) => passenger ? passenger.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ user, params }, res, next) =>
  Passenger.findById(params.id)
    .then(notFound(res))
    .then(authorOrAdmin(res, user, 'user'))
    .then((passenger) => passenger ? passenger.remove() : null)
    .then(success(res, 204))
    .catch(next)
