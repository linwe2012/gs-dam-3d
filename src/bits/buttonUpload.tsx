import React, { useContext } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { profile } from './store';

// The `withStyles()` higher-order component is injecting a `classes`
// prop that is used by the `Button` component.
const StyledButton = withStyles({
  root: {
    background: 'linear-gradient(45deg, #56ab2f 30%, #3D8F28 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 30,
    width: 100,
    padding: '0 10px',
    margin:'0 5px',
  },
  label: {
    textTransform: 'capitalize',
  },
})(Button);


export default function UploadButton() {
  const pro = useContext(profile)

  return <StyledButton>UPLOAD</StyledButton>;
}