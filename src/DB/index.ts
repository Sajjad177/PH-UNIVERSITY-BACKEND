import config from '../config';
import { USER_ROLE } from '../modules/user/user.constant';
import { User } from '../modules/user/user.model';

const superUser = {
  id: '0001',
  email: 'nishat177100@gmail.com',
  password: config.supper_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  isDeleted: false,
  status: 'in-progress',
};

// automatc added that
const seedSuperAdmin = async () => {
  // when database is connected will check is here any user who is super admin

  const isSuperAdminExist = await User.findOne({ role: USER_ROLE.superAdmin });

  if (!isSuperAdminExist) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin