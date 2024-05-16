import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaRegTrashAlt, FaCheck, FaEdit } from 'react-icons/fa';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import {useGetUsersQuery, useDeleteUserMutation} from '../../slices/usersApiSlice';
import { toast } from 'react-toastify';
import Meta from '../../components/Meta';

const UserListScreen = () => {
  const {data: users, refetch, isLoading, error} = useGetUsersQuery();
  const [deleteUser, {isLoading: loadingDelete}] = useDeleteUserMutation();

  const deleteHandler = async (user) => {
    if(window.confirm('Are you sure you want to delete this user? This cannot be undone.')){
      if (user.isAdmin) {
        toast.error('Cannot delete Admin User');
      } else {
        try {
            await deleteUser(user._id);
            refetch();
            toast.success('User successfully deleted');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
      }
    }
  }

  return (
    <>
    <Meta title="All Users - ArtShop | Admin" />
    <h1>Users</h1>
    {loadingDelete && <Loader />}
    {isLoading ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
      <Table bordered hover responsive className='table-sm'>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>EMAIL</th>
            <th>ISADMIN</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>{user.name}</td>
              <td><a href={`mailto: ${user.email}`}>{user.email}</a></td>
              <td>{user.isAdmin ? (
                <FaCheck style={{color: 'green'}} />
                ) : (
                    <FaTimes style={{color: 'red'}}/>
                )}
              </td>
              <td>
                <LinkContainer to={`/admin/users/${user._id}/edit`}>
                  <Button variant='light' className='btn-sm mx-2'>
                    <FaEdit />
                  </Button>
                </LinkContainer>
                <Button 
                    variant='light' 
                    className='btn-sm mx-2'
                    onClick={() => deleteHandler(user)}
                >
                    <FaRegTrashAlt style={{color: 'red'}} />
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    )}
    </>
  )
}

export default UserListScreen;