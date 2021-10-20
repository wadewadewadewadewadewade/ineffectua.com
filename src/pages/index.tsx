import React from 'react';
import { GetServerSideProps } from 'next';
import { Typography } from '@mui/material';

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      fallback: 'blocking',
      revalidate: 1,
    },
  };
};

export default function Home() {
  return <Typography>Welcome!</Typography>;
}
