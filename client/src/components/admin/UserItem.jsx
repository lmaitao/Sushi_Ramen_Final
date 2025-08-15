import { useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-hot-toast';

const UserItem = ({ user, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    role: user.role
  });

  const handleUpdate = async () => {
    try {
      await API.put(`/admin/users/${user.id}`, formData);
      toast.success('Usuario actualizado');
      onUpdate();
      setEditing(false);
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  return (
    <tr>
      <td>{user.id}</td>
      <td>
        {editing ? (
          <input
            type="text"
            className="form-control form-control-sm"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        ) : (
          user.name
        )}
      </td>
      <td>
        {editing ? (
          <input
            type="email"
            className="form-control form-control-sm"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        ) : (
          user.email
        )}
      </td>
      <td>
        {editing ? (
          <select
            className="form-select form-select-sm"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
        ) : (
          <span className={`badge ${
            user.role === 'admin' ? 'bg-danger' : 'bg-primary'
          }`}>
            {user.role}
          </span>
        )}
      </td>
      <td>
        {editing ? (
          <>
            <button
              onClick={handleUpdate}
              className="btn btn-sm btn-success me-2"
            >
              Guardar
            </button>
            <button
              onClick={() => setEditing(false)}
              className="btn btn-sm btn-secondary"
            >
              Cancelar
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="btn btn-sm btn-outline-primary"
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
};

export default UserItem;