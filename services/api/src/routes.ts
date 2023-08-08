import {Router} from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

import * as UsersController from './components/users/controllers';
import * as JenkinsBuildsController from './components/jenkins/controllers';

const router = Router();

// Profile Routes
router.get('/profile', UsersController.getProfile);

// Jenkins Routes
router.post('/jenkins/start-builds', JenkinsBuildsController.postStartBuilds);

// OpenAPI Spec
const swaggerUiOptions = {customCss: '.swagger-ui .topbar { display: none }'};
const SWAGGER_YAML_FILEPATH = path.join(__dirname, '../openapi.yml');
const swaggerYaml = yaml.load(fs.readFileSync(SWAGGER_YAML_FILEPATH, 'utf8')) as Object;
router.use('/dev/api-docs', swaggerUi.serve as any);
router.get('/dev/api-docs', swaggerUi.setup(swaggerYaml, swaggerUiOptions) as any);

export default router;
