import Joi from 'joi';

const buildJobSchema = Joi.object({
  end: Joi.string().required(),
});

const buildHostSchema = Joi.object({
  url: Joi.string().required(),
  jobs: Joi.array().items(buildJobSchema).required(),
});

export const startBuildsSchema = Joi.object().keys({
  build: Joi.object().keys({
    hosts: Joi.array().items(buildHostSchema).required(),
  }),
});
