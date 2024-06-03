import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Grid, Container } from '@mui/material';
import CocktailCard from './CocktailCard.jsx'; // Asegúrate de ajustar la ruta según tu estructura de carpetas

const CocktailList = () => {
  const [cocktails, setCocktails] = useState([]);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a');
        setCocktails(response.data.drinks);
      } catch (error) {
        console.error("Error fetching cocktails:", error);
      }
    };

    fetchCocktails();
  }, []);

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

export default CocktailList;
