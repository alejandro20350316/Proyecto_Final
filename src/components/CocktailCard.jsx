import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
import axios from 'axios';

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

      for (let i = 1; i <= 15; i++) {
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

export default CocktailCard;
