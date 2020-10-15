/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route';
import HealthCheck from '@ioc:Adonis/Core/HealthCheck';
import Application from '@ioc:Adonis/Core/Application';

Route.get('health', async ({ response }) => {
  const report = await HealthCheck.getReport();
  return report.healthy ? response.ok(report) : response.badRequest(report);
});

Route.group(() => {
  Route.group(() => {
    Route
      .resource('recipes', 'RecipesController')
      .middleware({ show: ['silentAuth'], store: ['auth'], update: ['auth'] })
      .except(['destroy'])
      .apiOnly();
    Route.get('recipes/search', 'RecipesController.search');
  });

  Route.group(() => {
    Route.resource('users', 'UsersController')
      .middleware({ show: ['silentAuth'], update: ['auth'] })
      .only(['show', 'update'])
      .apiOnly();
  });

  Route.resource('recipes.comments', 'CommentsController')
    .middleware({ store: ['auth'], update: ['auth'] })
    .except(['show', 'destroy'])
    .apiOnly();

  Route.post('/login', 'AuthController.login');
  Route.post('/logout', 'AuthController.logout');
  Route.post('/forgot', 'AuthController.forgot');
  Route.post('/reset', 'AuthController.reset');
  Route.post('/signup', 'AuthController.signup');
  Route
    .get('/me', 'AuthController.me')
    .middleware('auth');
})
  .prefix('/api/v1');

Route.get('storage/recipe_images/:filename', async ({ response, params }) => {
  response.download(Application.publicPath('/storage/recipe_images', params.filename));
});
