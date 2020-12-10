import React, { useState, useEffect } from "react";
import axios from "axios";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
	const { onLoadIngredient } = props;
	const [filter, setFilter] = useState("");

	useEffect(() => {
		const query =
			filter.length === 0 ? "" : `?orderBy="title"&equalTo="${filter}"`;
		axios
			.get(
				"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json" +
					query
			)
			.then((response) => {
				const loadedIngredients = [];
				for (const key in response.data) {
					loadedIngredients.push({
						id: key,
						title: response.data[key].title,
						amount: response.data[key].amount,
					});
				}
				onLoadIngredient(loadedIngredients);
			});
		// .catch((err) => {
		// 	console.log(err.response.data);
		// });
	}, [filter, onLoadIngredient]);

	return (
		<section className="search">
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					<input
						type="text"
						value={filter}
						onChange={(event) => setFilter(event.target.value)}
					/>
				</div>
			</Card>
		</section>
	);
});

export default Search;
