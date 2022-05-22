import React from 'react'
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

function Loading() {
  //https://mui.com/material-ui/react-skeleton/#animations
  return (
    <Box sx={{ width: '100%',height: 100 }}>
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={false} />
      
    </Box>
    
  )
}

export default Loading