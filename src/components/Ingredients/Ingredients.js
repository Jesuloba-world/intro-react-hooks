import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

const Ingredients = () => {
	const [ingredients, setIngredients] = useState([]);

	const filteredIngredientHandler = useCallback((filteredIngredients) => {
		setIngredients(filteredIngredients);
	}, []);

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
				setIngredients((prevIngredients) => [
					...prevIngredients,
					{ id: name, ...ingredient },
				]);
			});
	};

	return (
		<div className="App">
			<IngredientForm onAddIngredient={addIngredientHandler} />

			<section>
				<Search onLoadIngredient={filteredIngredientHandler} />
				<IngredientList
					ingredients={ingredients}
					onRemoveItem={() => {}}
				/>
			</section>
		</div>
	);
};

export default Ingredients;
