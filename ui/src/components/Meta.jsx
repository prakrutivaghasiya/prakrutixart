import React from 'react';
import { Helmet } from 'react-helmet-async';

const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name='keywords' content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
    title: 'Welcome to ArtShop',
    description: 'Get digital print for all the designs from @prakrutixart creations as well as order customized products.',
    keywords: 'art, mandala, digital art, procreate, ipad, buy art, buy prints, digital prints, customized products'
};

export default Meta