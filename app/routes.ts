import { Application } from 'express'
import { initRestaurantRoutes } from './restaurant/routes'
import { initConfigRoutes } from './config/routes'

const routeFnToInit = [initRestaurantRoutes, initConfigRoutes]

export function initRoutes(app: Application) {
  routeFnToInit.forEach((initFn) => initFn(app))
}
