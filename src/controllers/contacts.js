/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllContacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { env } from '../utils/env.js';

// Пошут всіх контактів
export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

// Пошук контакту по айді
export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);

  // Відповідь, якщо контакт не знайдено
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  // Відповідь, якщо контакт знайдено
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

//   Створення контакту

export const createContactController = async (req, res, next) => {
  try {
    const { body } = req;
    const userId = req.user._id;
    const photo = req.file;

    let photoUrl;
    const enableCloudinary = env('ENABLE_CLOUDINARY', 'false');
    if (photo) {
      if (enableCloudinary === 'true') {
        photoUrl = await saveFileToCloudinary(photo);
      } else {
        photoUrl = await saveFileToUploadDir(photo);
      }
    }

    const contact = await createContact({
      ...body,
      userId,
      photo: photoUrl,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a Contact!',
      data: contact,
    });
  } catch (error) {
    console.error('Error creating contact:', error);
    next(error);
  }
};
// Оновлення даних контакту
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const photo = req.file;

  let photoUrl;
  const enableCloudinary = env('ENABLE_CLOUDINARY', 'false');
  if (photo) {
    if (enableCloudinary === 'true') {
      photoUrl = await saveFileToCloudinary(photo);
    } else {
      photoUrl = await saveFileToUploadDir(photo);
    }
  }
  try {
    const result = await updateContact(
      contactId,
      {
        ...req.body,
        photo: photoUrl,
      },
      userId,
    );

    if (!result) {
      next(createHttpError(404, 'Contact not found'));
      return;
    }

    res.json({
      status: 200,
      message: `Successfully patched a contact!`,
      data: result.contact,
    });
  } catch (error) {
    next(error);
  }
};

// Видалення контакту
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).end('Contact successfully deleted');
};
