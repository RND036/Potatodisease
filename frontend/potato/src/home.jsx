import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { makeStyles } from '@mui/styles';
import { styled } from '@mui/material/styles';
import DropzoneAreaModern from './DropzoneAreaModern.jsx';

const useStyles = makeStyles(() => ({
  appbar: {
    marginBottom: 24,
    backgroundColor: '#212121',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  title: {
    flexGrow: 1,
    fontWeight: 600,
    fontSize: '1.25rem',
  },
  mainContainer: {
    padding: '2rem',
    
    minHeight: '100vh',
    
  },
  cardRoot: {
    padding: 20,
    borderRadius: 16,
    background: '#fff',
    boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
  },
  cardEmpty: {
    minHeight: 280,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed #ccc',
    backgroundColor: '#fafafa',
  },
  media: {
    height: 300,
    borderRadius: 8,
    objectFit: 'cover',
  },
  tableContainer: {
    marginTop: 16,
  },
  tableHead: {
    backgroundColor: '#ececec',
  },
  tableCell1: {
    fontWeight: 'bold',
    fontSize: '1rem',
  },
  loader: {
    marginRight: 12,
  },
  buttonGrid: {
    textAlign: 'center',
    marginTop: 24,
  },
}));

const ColorButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  backgroundColor: '#1976d2',
  padding: '10px 24px',
  borderRadius: 10,
  fontWeight: 600,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#1565c0',
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  let confidence = 0;

  const sendFile = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      try {
        const res = await axios.post(import.meta.env.VITE_API_URL, formData);
        if (res.status === 200) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Upload failed:', err);
      } finally {
        setIsloading(false);
      }
    }
  };

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;
    setIsloading(true);
    sendFile();
  }, [preview]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <>
      <AppBar position="static" className={classes.appbar}>
        <Toolbar>
          <Typography className={classes.title} variant="h6">
            🌱 SmartScan: Potato Disease Classifier
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" className={classes.mainContainer}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Card className={`${classes.cardRoot} ${!image ? classes.cardEmpty : ''}`}>
              {image && (
                <CardActionArea>
                  <CardMedia
                    component="img"
                    className={classes.media}
                    image={preview}
                    title="Uploaded Image"
                  />
                </CardActionArea>
              )}

              {!image && (
                <CardContent style={{ textAlign: 'center' }}>
                  <Typography variant="h6" color="textSecondary" gutterBottom>
                    Upload your leaf image
                  </Typography>
                  <DropzoneAreaModern onChange={onSelectFile} />
                </CardContent>
              )}

              {data && (
                <CardContent>
                  <Typography variant="h6" align="center" gutterBottom>
                    🧬 Analysis Result
                  </Typography>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table size="small">
                      <TableHead className={classes.tableHead}>
                        <TableRow>
                          <TableCell className={classes.tableCell1}>Label</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{data.class}</TableCell>
                          <TableCell align="right">{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}

              {isLoading && (
                <CardContent style={{ textAlign: 'center' }}>
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <CircularProgress className={classes.loader} color="primary" />
                    <Typography variant="h6">Analyzing image...</Typography>
                  </Box>
                </CardContent>
              )}
            </Card>
          </Grid>
    {data && (
      <Grid
        item
        xs={12}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 24,
          width: '100%',
        }}
      >
        <ColorButton
          variant="contained"
          onClick={clearData}
          startIcon={<ClearIcon />}
        >
          Clear & Try Again
        </ColorButton>
      </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};
