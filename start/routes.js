'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */

const Route = use('Route')

const Database = use('Database')

Route.on('/').render('welcome')


Route.get('/users', async ({ response }) => {
  try {
    const data = await Database.table('coins_list').select('*')
    response.status(200).send({ data })
  } catch (error) {
    response.status(500).send({ error: error.message })
  }
})



