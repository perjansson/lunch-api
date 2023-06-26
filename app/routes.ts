import { Application } from 'express'
import { initRestaurantRoutes } from './restaurant/routes'
import { initConfigRoutes } from './config/routes'
import { initSlackRoutes } from './slack/routes'

const routeFnToInit = [initRestaurantRoutes, initConfigRoutes, initSlackRoutes]

export function initRoutes(app: Application) {
  routeFnToInit.forEach((initFn) => initFn(app))
}
