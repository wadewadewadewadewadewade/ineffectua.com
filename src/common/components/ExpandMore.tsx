import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { IconButtonProps } from '@mui/material';

export const ExpandMore = styled((props: { expand: boolean } & IconButtonProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default ExpandMore;
