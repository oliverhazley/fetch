let users = [
  { id: 1, username: 'johndoe', password: 'password1', email: 'johndoe@example.com' },
  { id: 2, username: 'janedoe', password: 'password2', email: 'janedoe@example.com' },
  { id: 3, username: 'bobsmith', password: 'password3', email: 'bobsmith@example.com' },
];

const getUsers = (req, res) => {
  res.status(200).json(users);
};

const getUserById = (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find(user => user.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(200).json(user);
};

const createUser = (req, res) => {
    const newUser = req.body;

    // Validate user data
    if (!newUser || !newUser.username || !newUser.password || !newUser.email) {
        return res.status(400).json({ error: 'Invalid data' });
    }

    // Find the highest existing ID
    const maxId = users.length > 0 ? Math.max(...users.map(user => user.id)) : 0;

    // Assign a new unique ID
    newUser.id = maxId + 1;

    // Add the new user to the array
    users.push(newUser);

    // Send success response
    res.status(201).json({ message: 'User created successfully', user: newUser });
};

const deleteUser = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = users.findIndex(user => user.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
    users.splice(index, 1);
    res.status(200).json({ message: 'User deleted successfully' });
};

const loginUser = (req, res) => {
  const { username, password } = req.body;
  const user = users.find(user => user.username === username && user.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  res.status(200).json({ message: 'Login successful', user });
};

export { getUsers, getUserById, createUser, loginUser, deleteUser };
