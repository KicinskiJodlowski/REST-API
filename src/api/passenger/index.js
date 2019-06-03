import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { token } from '../../services/passport'
import { create, index, show, update, destroy } from './controller'
import { schema } from './model'
export Passenger, { schema } from './model'

const router = new Router()
const { longitude, latitude } = schema.tree

/**
 * @api {post} /passengers Create passenger
 * @apiName CreatePassenger
 * @apiGroup Passenger
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam longitude Passenger's longitude.
 * @apiParam latitude Passenger's latitude.
 * @apiSuccess {Object} passenger Passenger's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Passenger not found.
 * @apiError 401 user access only.
 */
router.post('/',
  token({ required: true }),
  body({ longitude, latitude }),
  create)

/**
 * @api {get} /passengers Retrieve passengers
 * @apiName RetrievePassengers
 * @apiGroup Passenger
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiUse listParams
 * @apiSuccess {Number} count Total amount of passengers.
 * @apiSuccess {Object[]} rows List of passengers.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 401 admin access only.
 */
router.get('/',
  token({ required: true, roles: ['admin'] }),
  query(),
  index)

/**
 * @api {get} /passengers/:id Retrieve passenger
 * @apiName RetrievePassenger
 * @apiGroup Passenger
 * @apiPermission admin
 * @apiParam {String} access_token admin access token.
 * @apiSuccess {Object} passenger Passenger's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Passenger not found.
 * @apiError 401 admin access only.
 */
router.get('/:id',
  token({ required: true, roles: ['admin'] }),
  show)

/**
 * @api {put} /passengers/:id Update passenger
 * @apiName UpdatePassenger
 * @apiGroup Passenger
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiParam longitude Passenger's longitude.
 * @apiParam latitude Passenger's latitude.
 * @apiSuccess {Object} passenger Passenger's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Passenger not found.
 * @apiError 401 user access only.
 */
router.put('/:id',
  token({ required: true }),
  body({ longitude, latitude }),
  update)

/**
 * @api {delete} /passengers/:id Delete passenger
 * @apiName DeletePassenger
 * @apiGroup Passenger
 * @apiPermission user
 * @apiParam {String} access_token user access token.
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Passenger not found.
 * @apiError 401 user access only.
 */
router.delete('/:id',
  token({ required: true }),
  destroy)

export default router
