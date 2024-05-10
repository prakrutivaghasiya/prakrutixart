import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useUpdateUserMutation, useGetUserDetailsQuery } from '../../slices/usersApiSlice';
import FormContainer from '../../components/FormContainer';

const UserEditScreen = () => {
    const {id: userId} = useParams();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);

    const navigate = useNavigate();

    const {data: user, isLoading, error, refetch} = useGetUserDetailsQuery(userId);
    const [updateUser, {isLoading: loadingUpdate}] = useUpdateUserMutation();

    useEffect(() => { 
        if(user) {
           setName(user.name); 
           setEmail(user.email); 
           setIsAdmin(user.isAdmin);
        }
    }, [user]);

    const submitHandler = async(e) => {
        e.preventDefault();

        try {
            await updateUser({_id: userId, name, email, isAdmin});
            toast.success('User Updated');
            refetch();
            navigate('/admin/userlist/');
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    
    }

  return (
    <>
        <Link to='/admin/userlist' className='btn btn-light my-3'>Go Back</Link>
        <FormContainer>
            <h1>Edit User</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name' className='my-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='email' className='my-2'>
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='isAdmin' className='my-2'>
                        <Form.Check
                            type='checkbox'
                            label='Is Admin'
                            checked={isAdmin}
                            onChange={(e) => setIsAdmin(e.target.checked)}
                        >
                        </Form.Check>
                    </Form.Group>
                    <Button
                        type='submit'
                        variant='primary'
                        className='my-2'
                    >
                        Update
                    </Button>
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default UserEditScreen;