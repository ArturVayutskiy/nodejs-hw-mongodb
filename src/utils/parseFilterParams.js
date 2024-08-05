// const CONTACT_TYPE_VALUES = ['work', 'home', 'personal'];

const parseType = (type) => {
  if (typeof type !== 'string') return null;

  const isType = (type) => ['work', 'home', 'personal'].includes(type);

  return isType(type) ? type : null;
};

const parseIsFavourite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return null;

  if (isFavourite === 'true') return true;
  if (isFavourite === 'false') return false;

  return null;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;

  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    parsedIsFavourite: parsedIsFavourite,
  };
};
