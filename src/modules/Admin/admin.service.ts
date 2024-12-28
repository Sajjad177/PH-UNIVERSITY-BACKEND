import mongoose from 'mongoose';
import QueryBuilder from '../builder/Querybuilder';
import { AdminSearchableFields } from './admin.constant';
import { TAdmin } from './admin.interface';
import { Admin } from './admin.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';

const getSingleAdminFromDB = async (id: string) => {
  const result = await Admin.findById(id);
  return result;
};

const getAllAdminFromDB = async (query: Record<string, unknown>) => {
  const adminQuery = new QueryBuilder(Admin.find(), query)
    .search(AdminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await adminQuery.modelQuery;
    const meta = await adminQuery.countTotal();

    return {
      meta,
      result,
    };
};

const updateAdminInDB = async (id: string, payload: Partial<TAdmin>) => {
  const { name, ...remainingAdminData } = payload;

  // modified update data for admin
  const modifiedUpdateData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  // update name data :
  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdateData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findByIdAndUpdate(id, modifiedUpdateData, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteAdminFromDB = async (id: string) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // transaction-1 : delete admin
    const deletedAdmin = await Admin.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );


    if (!deletedAdmin) {
      throw new AppError('Failed to delete admin', StatusCodes.BAD_REQUEST);
    }

    // get user id
    const userId = deletedAdmin.user;

    // transaction-2 : delete user
    const deletedUser = await User.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError('Failed to delete user', StatusCodes.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();

    return deletedAdmin;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(error.message, StatusCodes.BAD_REQUEST);
  }
};

export const AdminService = {
  getSingleAdminFromDB,
  getAllAdminFromDB,
  updateAdminInDB,
  deleteAdminFromDB,
};
