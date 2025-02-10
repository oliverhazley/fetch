
let items = [
  { id: 1, name: 'Sample Item1' },
  { id: 2, name: 'Sample Item2' },
  { id: 3, name: 'Sample Item3' },
  { id: 4, name: 'Sample Item4' },
  { id: 5, name: 'Sample Item5' },

];

const getItems = (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  const paginatedItems = items.slice(startIndex, endIndex);
  res.status(200).json({
    currentPage: page,
    totalPages: Math.ceil(items.length / limit),
    data: paginatedItems,
  });
};

const getItemById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = items.find(item => item.id === id);
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  res.status(200).json(item);
};

const addItem = (req, res) => {
  const newItem = req.body;
  if (!newItem || !newItem.name) {
    return res.status(400).json({ error: 'Invalid data' });
  }
  newItem.id = items.length + 1;
  items.push(newItem);
  res.status(201).json(newItem);
};

const deleteItem = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = items.findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  items.splice(index, 1);
  res.status(204).send();
};

export { getItems, getItemById, addItem, deleteItem };
