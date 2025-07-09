import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listUsers, createUser, updateUser, deleteUser } from '../actions/userActions';
import { listRoles } from '../actions/roleActions';
import { USER_CREATE_RESET, USER_UPDATE_RESET } from '../constants/userConstants';
import Modal from '../components/Modal';
import UserForm from '../components/UserForm';

const UsersPage = () => {
  const dispatch = useDispatch();

  const { loading, error, users } = useSelector((state) => state.userList);
  const { loading: loadingCreate, error: errorCreate, success: successCreate } = useSelector((state) => state.userCreate);
  const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = useSelector((state) => state.userUpdate);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    dispatch(listUsers());
    dispatch(listRoles()); // Also fetch roles for the form dropdown
  }, [dispatch]);

  // Effect to handle successful user creation or update
  useEffect(() => {
    // If a create or update operation was successful, close the modal
    if (successCreate || successUpdate) {
      handleModalClose();
      // Reset the create/update state to prevent this from running again
      if (successCreate) dispatch({ type: USER_CREATE_RESET });
      if (successUpdate) dispatch({ type: USER_UPDATE_RESET });
    }
  }, [dispatch, successCreate, successUpdate]);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id));
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleFormSubmit = (formData) => {
    if (selectedUser) {
      dispatch(updateUser(selectedUser.userId, formData));
    } else {
      dispatch(createUser(formData));
    }
  };

  const renderErrors = (errors) => {
    if (typeof errors === 'string') {
      return <p className="error-message">{errors}</p>;
    }
    if (typeof errors === 'object' && errors !== null) {
      return Object.entries(errors).map(([field, messages]) => (
        <p key={field} className="error-message">
          {Array.isArray(messages) ? messages.join(', ') : messages}
        </p>
      ));
    }
    return null;
  };

  return (
    <section>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn" onClick={handleAddUser}>Add User</button>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleModalClose} title={selectedUser ? 'Edit User' : 'Add User'}>
        <UserForm
          onSubmit={handleFormSubmit}
          onCancel={handleModalClose}
          initialData={selectedUser}
          loading={loadingCreate || loadingUpdate}
        />
        {(errorCreate || errorUpdate) && renderErrors(errorCreate || errorUpdate)}
      </Modal>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>UserID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.userId}>
                <td>{user.userId}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.roleName}</td>
                <td>
                  <span className={`status ${user.isActive ? 'active' : 'inactive'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <a href="#!" className="action-link" onClick={() => handleEdit(user)}>Edit</a>
                  {' | '}
                  <a href="#!" className="action-link delete" onClick={() => handleDelete(user.userId)}>Delete</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default UsersPage;
