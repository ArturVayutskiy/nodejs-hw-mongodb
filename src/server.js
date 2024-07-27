import express from 'express';
import pino from 'pino-http';
import cors from 'cors';

import { getAllcontacts, getContactById } from './services/contacts.js';
import { env } from './utils/env.js';

const PORT = Number(env('PORT', 3000));

export const setupServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllcontacts();

    res.status(200).json({
      status: 200,
      data: contacts,
      message: 'Successfully found contacts!',
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    // Відповідь, якщо контакт не знайдено
    if (!contact) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      status: 200,
      message: `"Successfully found contact with id ${contactId}!"`,
      data: contact,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
