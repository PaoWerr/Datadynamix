// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Migrate } = initSchema(schema);

export {
  Migrate
};