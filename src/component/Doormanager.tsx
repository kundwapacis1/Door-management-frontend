import React, { useEffect, useState } from 'react';
import { getDoors, createDoor, updateDoor, deleteDoor } from '../api';

interface Door {
  id: string;
  name: string;
  location: string;
}

const DoorManager: React.FC = () => {
  const [doors, setDoors] = useState<Door[]>([]);
  const [form, setForm] = useState<{ name: string; location: string; status: string }>({ name: '', location: '', status: 'active' });
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    getDoors().then(setDoors);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId) {
      const updated = await updateDoor(editId, { ...form });
      setDoors(doors.map(d => (d.id === editId ? updated : d)));
      setEditId(null);
    } else {
      const newDoor = await createDoor(form);
      setDoors([...doors, newDoor]);
    }
    setForm({ name: '', location: '', status: 'active' });
  };

  const handleEdit = (door: Door) => {
    setForm({ name: door.name, location: door.location, status: 'active' });
    setEditId(door.id);
  };

  const handleDelete = async (id: string) => {
    await deleteDoor(id);
    setDoors(doors.filter(d => d.id !== id));
  };

  return (
    <div>
      <h2>Door Management</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" value={form.name} onChange={handleChange} placeholder="Door Name" required />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" required />
        <button type="submit">{editId ? 'Update' : 'Add'} Door</button>
      </form>
      <ul>
        {doors.map(door => (
          <li key={door.id}>
            {door.name} ({door.location})
            <button onClick={() => handleEdit(door)}>Edit</button>
            <button onClick={() => handleDelete(door.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoorManager;
