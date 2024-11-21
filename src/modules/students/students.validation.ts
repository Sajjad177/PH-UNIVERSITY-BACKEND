import Joi from 'joi';

//! create a schema validation using joi :

const userNameSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .required()
    .min(3)
    .max(20)
    .custom((value, helpers) => {
      const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
      if (firstNameStr !== value) {
        return helpers.message({
          custom: `"${value}" is not a valid first name`,
        });
      }
      return value;
    }),
  middleName: Joi.string().trim().max(20),
  lastName: Joi.string()
    .trim()
    .required()
    .max(20)
    .pattern(/^[A-Za-z]+$/, '{#label} is not a valid last name'),
});

const guardianValidationSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherContactNo: Joi.string().trim().required(),
  fatherOccupation: Joi.string().trim().required(),
  motherName: Joi.string().trim().required(),
  motherContactNo: Joi.string().trim().required(),
  motherOccupation: Joi.string().trim().required(),
});

const localGuardianValidationSchema = Joi.object({
  name: Joi.string().required(),
  contactNo: Joi.string().trim().required(),
  occupation: Joi.string().trim().required(),
  address: Joi.string().trim().required(),
});

const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string().trim().required(),
  // .max(15, 'Password cannot be more than 15 characters')
  // .min(6, 'Password cannot be less than 6 characters'),
  name: userNameSchema.required(),
  gender: Joi.string()
    .valid('male', 'female')
    .required()
    .messages({ 'any.only': 'Provided value is not a valid gender' }),
  dateOfBirth: Joi.string(),
  email: Joi.string()
    .trim()
    .required()
    .email()
    .messages({ 'string.email': '{#label} is not a valid email' }),
  contactNo: Joi.string().trim().required(),
  emergencyContactNo: Joi.string().trim().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().trim().required(),
  permanentAddress: Joi.string().trim().required(),
  guardian: guardianValidationSchema.required(),
  localGuardian: localGuardianValidationSchema.required(),
  profileImage: Joi.string().uri(),
  isActive: Joi.string().valid('active', 'inactive').default('active'),
  isDeleted: Joi.boolean().default(false),
});

export default studentValidationSchema;
