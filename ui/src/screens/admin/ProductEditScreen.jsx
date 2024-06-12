import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice';
import FormContainer from '../../components/FormContainer';
import Meta from '../../components/Meta';

const ProductEditScreen = () => {
    const {id: productId} = useParams();

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [image, setImage] = useState('');
    const [brand, setBrand] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [countInStock, setCountInStock] = useState('');

    const navigate = useNavigate();

    const {data: product, isLoading, error} = useGetProductDetailsQuery(productId);
    const [updateProduct, {isLoading: loadingUpdate}] = useUpdateProductMutation();
    const [uploadProductImage, {isLoading: loadingUpload}] = useUploadProductImageMutation();

    useEffect(() => { 
        if(product) {
           setName(product.name); 
           setPrice(product.price); 
           setImage(product.image); 
           setBrand(product.brand); 
           setDescription(product.description); 
           setCategory(product.category); 
           setCountInStock(product.countInStock); 
        }
    }, [product]);

    const uploadFileHandler = async (e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image);
        } catch (error) {
            toast.error(error?.data?.message || error.error);
        }
    };

    const submitHandler = async(e) => {
        e.preventDefault();

        const updatedProduct = {
            _id: productId,
            name,
            price,
            image,
            brand,
            category,
            description,
            countInStock,
        };

        const result = await updateProduct(updatedProduct);

        if(result.error){
            toast.error(result.error);
        } else {
            toast.success('Product Updated');
            // navigate('/admin/productlist');
            navigate(-1);
        }
    }

    const cancelHandler = () => {
        navigate(-1);
    }

  return (
    <>
        <Meta title="Edit Product - ArtShop | Admin" />
        <FormContainer>
            <h1>Edit Product</h1>
            {loadingUpdate && <Loader />}
            {isLoading ? <Loader /> : error ? <Message variant='danger'>{error?.data?.message || error.error}</Message> : (
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
                    <Form.Group controlId='price' className='my-2'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Enter Price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='image' className='my-2'>
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Upload Image'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                        ></Form.Control>
                        <Form.Control
                            type='file'
                            label='Choose File'
                            className='my-1'
                            onChange={uploadFileHandler}
                        ></Form.Control>
                        {loadingUpload && <Loader />}
                        <img 
                            src={image} 
                            alt='image' 
                            style={{
                                height: '150px',
                                width: '150px',
                                objectFit: 'cover',
                                border: '0.5px solid #c9c9c9',
                                borderRadius: '10px'
                            }}
                        />
                    </Form.Group>
                    <Form.Group controlId='brand' className='my-2'>
                        <Form.Label>brand</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='countInStock' className='my-2'>
                        <Form.Label>Count InStock</Form.Label>
                        <Form.Control
                            type='number'
                            placeholder='Enter Count InStock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='category' className='my-2'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <Form.Group controlId='description' className='my-2'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type='text'
                            placeholder='Enter Description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></Form.Control>
                    </Form.Group>
                    <div className='my-2'>
                        <Button
                            type='submit'
                            variant='primary'
                            className='me-2'
                        >
                            Update
                        </Button>
                        <Button
                            type='button'
                            variant='primary'
                            className='ms-2'
                            onClick={cancelHandler}
                        >
                            Cancel
                        </Button>
                    </div>
                </Form>
            )}
        </FormContainer>
    </>
  )
}

export default ProductEditScreen