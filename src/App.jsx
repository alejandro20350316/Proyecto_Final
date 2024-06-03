import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, IconButton, Grid, Container, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import './index.css';

const NavBar = () => (
  <AppBar position="static" className="bg-blue-200">
    <Toolbar>
<IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
  <img src='src/assets/coctel.png' height={70} width={70} alt="Menú" /></IconButton>


      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Cocktails
      </Typography>
      <Button color="inherit">Home</Button>
      <Button color="inherit">
        <a href="https://www.thecocktaildb.com/api.php" style={{ color: 'inherit', textDecoration: 'none' }}>API</a>
      </Button>
      <Button color="inherit">
      <img src='src/assets/yo.jpg' height={70} width={70} alt="Yo" /></Button>
    </Toolbar>
  </AppBar>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white py-4 mt-8">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 TheCocktailDB DISEÑO FRONTEND - Elabora: Alejandro Rojas ISC- 8A.</p>
    </div>
  </footer>
);

const CocktailCard = ({ cocktail }) => {
  const [open, setOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
    fetchIngredients(cocktail.idDrink);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchIngredients = async (id) => {
    try {
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
      const cocktailDetails = response.data.drinks[0];
      const ingredientsList = [];

      for (let i = 1; i <= Object.keys(cocktailDetails).length; i++) {
        if (cocktailDetails[`strIngredient${i}`]) {
          ingredientsList.push(`${cocktailDetails[`strIngredient${i}`]} - ${cocktailDetails[`strMeasure${i}`] || ''}`);
        }
      }

      setIngredients(ingredientsList);
    } catch (error) {
      console.error("Error fetching ingredients:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
      <CardMedia
        component="img"
        height="140"
        image={cocktail.strDrinkThumb}
        alt={cocktail.strDrink}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {cocktail.strDrink}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {cocktail.strAlcoholic}
        </Typography>
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Ver Ingredientes
        </Button>
      </CardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Ingredientes de {cocktail.strDrink}</DialogTitle>
        <DialogContent>
          <ul>
            {ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
//se realiza un mapeo de todos los componentes cocktail existente 

const CocktailList = ({ cocktails }) => {
  if (cocktails.length === 0) {
    return (
      <Typography variant="h6" sx={{ marginTop: '50px', marginBottom: '50px', textAlign: 'center' }}>
        No hay resultados
      </Typography>
    );
  }
  return (
    <Container>
      <Grid container spacing={4} justifyContent="center">
        {cocktails.map((cocktail) => (
          <Grid item key={cocktail.idDrink} xs={12} sm={6} md={4}>
            <CocktailCard cocktail={cocktail} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('');
  const [cocktails, setCocktails] = useState([]);
  const [allCocktails, setAllCocktails] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCocktails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`);
      setAllCocktails(response.data.drinks);
      setCocktails(response.data.drinks);
    } catch (error) {
      console.error("Error fetching cocktails:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    fetchCocktails();
  }, [fetchCocktails]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const filteredCocktails = allCocktails.filter(cocktail => cocktail.strDrink.toLowerCase().includes(searchTerm.toLowerCase()));
    setCocktails(filteredCocktails);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    const filteredCocktails = allCocktails.filter(cocktail => {
      if (event.target.value === "") return true;
      return cocktail.strAlcoholic === event.target.value;
    });
    setCocktails(filteredCocktails);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <NavBar />
      <div className="flex-grow flex flex-col items-center">
        <h1 className="text-center text-4xl font-bold mt-8 mb-4">Lista de Cócteles</h1>
        <div className="flex flex-col md:flex-row justify-center items-center " style={{ width: '80%' }}>
          <TextField 
            label="Buscar por nombre" 
            variant="outlined" 
            value={searchTerm} 
            onChange={handleSearchChange} 
            sx={{ height: '50px', width: '30%', backgroundColor: 'lightblue' }} 
          />
          <Button variant="contained" color="primary" onClick={handleSearch} sx={{ height:'50px' }}>
            Buscar
          </Button>
          <FormControl variant="outlined" sx={{ minWidth: 120 }}>
            <InputLabel id="filter-label">Filtrar</InputLabel>
            <Select
              labelId="filter-label"
              value={filter}
              onChange={handleFilterChange}
              label="Filtrar"
            >
              <MenuItem value="">Sin filtro</MenuItem>
              <MenuItem value="Alcoholic">Alcohólico</MenuItem>
              <MenuItem value="Non_Alcoholic">No alcohólico</MenuItem>
            </Select>
          </FormControl>
        </div>
        <CocktailList cocktails={cocktails} />
        {loading && <p>Cargando...</p>}
      </div>
      <Footer />
    </div>
  );
};

export default App;
