import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AppBar, Toolbar, Typography, Button, IconButton, Grid, Container, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogContent, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

import './index.css';

const NavBar = () => (
  <AppBar position="static" className="bg-blue-500">
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
        {/* Icono del menú */}
      </IconButton>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Cocktails
      </Typography>
      <Button color="inherit">Home</Button>
      <Button color="inherit">About</Button>
      <Button color="inherit">Contact</Button>
    </Toolbar>
  </AppBar>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white py-4 mt-8">
    <div className="container mx-auto text-center">
      <p>&copy; 2024 TheCocktailDB. All rights reserved.</p>
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

      // Obtener todos los ingredientes
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
    <Card>
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

const CocktailList = ({ cocktails }) => {
  return (
    <Container>
      <Grid container spacing={4}>
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
  const [page, setPage] = useState(1);
  const [cocktails, setCocktails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultsCount, setResultsCount] = useState(0);

  const fetchCocktails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}&p=${page}`);

// Aplicar el filtro si se selecciona alguno
const filteredCocktails = response.data.drinks.filter(cocktail => {
  if (filter === "") return true; // Si no hay filtro, mostrar todos los cócteles
  return cocktail.strAlcoholic === filter; // Filtrar por tipo de cóctel (alcohólico / no alcohólico)
});

// Actualizar el estado de los cócteles con los resultados filtrados
setCocktails(prevCocktails => [...prevCocktails, ...filteredCocktails]);
      const newCocktails = response.data.drinks.filter(newCocktail => !cocktails.some(existingCocktail => existingCocktail.idDrink === newCocktail.idDrink));
      setCocktails(prevCocktails => [...prevCocktails, ...newCocktails]);
      setResultsCount(response.data.drinks.length);
    } catch (error) {
      console.error("Error fetching cocktails:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, page, cocktails]);

  useEffect(() => {
    fetchCocktails();
  }, [fetchCocktails]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1); // Resetear la página al realizar una nueva búsqueda
    setCocktails([]); // Limpiar los resultados anteriores al realizar una nueva búsqueda
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      <NavBar />
      <div className="flex-grow">
        <h1 className="text-center text-4xl font-bold mt-8 mb-4">Lista de Cócteles</h1>
        <div className="flex justify-between">
          <TextField label="Buscar por nombre" variant="outlined" value={searchTerm} onChange={handleSearchChange} />
          <Typography variant="subtitle1" component="div">
            Resultados: {resultsCount}
          </Typography>
          <FormControl variant="outlined">
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
        {!loading && cocktails.length > 0 && (
          <div className="text-center mt-4">
            <Button variant="contained" color="primary" onClick={handleLoadMore}>Cargar más</Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default App;
