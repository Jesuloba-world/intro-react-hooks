import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
	const [userIngredients, setUserIngredients] = useState([]);

	const filteredIngredientHandler = useCallback((filteredIngredients) => {
		setUserIngredients(filteredIngredients);
	}, []);

	useEffect(() => {
		console.log("RENDERING INGREDIENTS", userIngredients);
	}, [userIngredients]);

	const addIngredientHandler = (ingredient) => {
		axios
			.post(
				"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json",
				ingredient
			)
			.then((response) => {
				return response.data.name;
			})
			.then((name) => {
				setUserIngredients((prevIngredients) => [
					...prevIngredients,
					{ id: name, ...ingredient },
				]);
			});
	};

	const removeIngredientHandler = (ingredientId) => {
		axios
			.delete(
				`https://intro-hooks-default-rtdb.firebaseio.com/ingredient/${ingredientId}.json`
			)
			.then((response) => {
				setUserIngredients((prevIngredients) =>
					prevIngredients.filter(
						(ingredient) => ingredient.id !== ingredientId
					)
				);
			});
	};

	return (
		<div className="App">
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search onLoadIngredient={filteredIngredientHandler} />
				<IngredientList
					ingredients={userIngredients}
					onRemoveItem={removeIngredientHandler}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
