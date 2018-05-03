import appModel from './app';
import router from './router';
import datapreview from './datapreview'
import pointdetail from './pointdetail'

export function registerModels(app) {
  app.model(appModel);
  app.model(router);
  app.model(datapreview);
  app.model(pointdetail);
}
