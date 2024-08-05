import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.number().min(10).max(13).required(),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.number().min(10).max(13),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});
