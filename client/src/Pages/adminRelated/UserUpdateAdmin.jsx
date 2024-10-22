import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../../utils/axiosInstant';
import { useParams, Link } from 'react-router-dom';

function UserUpdateAdmin() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState({
    message: '',
    status: '',
  });
  const { userid } = useParams();

  const [updateData, setUpdateData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    role: '',
  });

  // Function to fetch the user data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`api/admin/sendSingleUser/${userid}`);
      const userData = response.data;

      // Populate form data with the fetched user information
      setUsers(userData);
      setUpdateData({
        firstname: userData.firstname,
        lastname: userData.lastname,
        username: userData.username,
        email: userData.email,
        role: userData.role,
      });
    } catch (error) {
      setError('Failed to fetch user');
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.patch(`api/admin/updateUser/${userid}`, updateData);
      setResponse({
        message: 'Profile updated successfully!',
        status: true,
      });
    } catch (error) {
      setResponse({
        message: error.response?.data?.msg || 'Failed to update profile',
        status: false,
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  
  return (
    <>
      {response.status === true ? (
        // Success state: hide form and show success message with a navigation button
        <div className="w-full max-w-md mx-auto p-6 bg-green-100 text-green-800 shadow-lg rounded-md space-y-6 my-10">
          <h2 className="text-2xl text-center font-bold mb-4">Profile Updated Successfully!</h2>
          <Link to="/adminDashboard" className="text-center block p-2 bg-green-800 text-white rounded-md">
            Go to Dashboard
          </Link>
        </div>
      ) : (
        // Form state: display form with error message if any
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto p-6 bg-white shadow-lg rounded-md space-y-6 my-10"
        >
          {response.message && (
            <span
              style={{
                backgroundColor: response.status === false ? '#FF8164' : 'green',
                color: 'black',
                fontWeight: 'bold',
                display: 'block',
                padding: '10px',
                borderRadius: '5px',
                textDecoration: 'underline',
              }}
            >
              {response.message}
            </span>
          )}

          <h2 className="text-2xl text-center font-bold mb-4">Update User Profile</h2>

          <div className="mb-4">
            <label htmlFor="firstname">First name</label>
            <input
              onChange={handleChange}
              type="text"
              name="firstname"
              value={updateData.firstname}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="lastname">Last name</label>
            <input
              onChange={handleChange}
              type="text"
              name="lastname"
              value={updateData.lastname}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="username">User Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="username"
              value={updateData.username}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email">User Email</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              value={updateData.email}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="role">Role</label>
            <select
              name="role"
              id="role"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={updateData.role}
              onChange={handleChange}
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="0">Admin</option>
              <option value="3">Sub-admin</option>
              <option value="1">User</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-orange-800 text-white rounded-md hover:bg-orange-700"
          >
            Update Profile
          </button>
        </form>
      )}
    </>
  );
}

export default UserUpdateAdmin;
