import createHttpError from 'http-errors';
import {
  createContact,
  deleteContact,
  getAllcontacts,
  getContactById,
  updateContact,
} from '../services/contacts.js';

// Пошут всіх контактів
export const getContactsController =
  ('/contacts',
  async (req, res) => {
    const contacts = await getAllcontacts();

    res.status(200).json({
      status: 200,
      data: contacts,
      message: 'Successfully found contacts!',
    });
  });

// Пошук контакту по айді
export const getContactByIdController =
  ('/contacts/:contactId',
  async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    // Відповідь, якщо контакт не знайдено
    if (!contact) {
      throw createHttpError(404, 'Contact not found');
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
      message: `"Successfully found contact with id ${contactId}!"`,
      data: contact,
    });
  });

//   Створення контакту
export const createContactController = async (req, res) => {
  const contact = await createContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a Contact!',
    data: contact,
  });
};

// Оновлення даних контакту
export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const result = await updateContact(contactId, req.body);

  if (!result) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};

// Видалення контакту
export const deleteContactController = async (req, res, next) => {
  const { contactId } = req.params;

  const contact = await deleteContact(contactId);

  if (!contact) {
    next(createHttpError(404, 'Contact not found'));
    return;
  }

  res.status(204).end('Contact successfully deleted');
};
