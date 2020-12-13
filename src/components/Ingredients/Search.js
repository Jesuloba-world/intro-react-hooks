import React, { useState, useEffect, useRef } from "react";
import useHttp from "../../hooks/http";
import ErrorModal from "../UI/ErrorModal";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
	const { onLoadIngredient } = props;
	const [filter, setFilter] = useState("");
	const inputRef = useRef();
	const { isLoading, data, error, sendRequest, clear } = useHttp();

	useEffect(() => {
		const timer = setTimeout(() => {
			if (filter === inputRef.current.value) {
				const query =
					filter.length === 0
						? ""
						: `?orderBy="title"&equalTo="${filter}"`;

				sendRequest(
					"https://intro-hooks-default-rtdb.firebaseio.com/ingredient.json" +
						query,
					"get"
				);
			}
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, [filter, inputRef, sendRequest]);

	useEffect(() => {
		if (!isLoading && !error && data) {
			const loadedIngredients = [];
			for (const key in data) {
				loadedIngredients.push({
					id: key,
					title: data[key].title,
					amount: data[key].amount,
				});
			}
			onLoadIngredient(loadedIngredients);
		}
	}, [data, isLoading, error, onLoadIngredient]);

	return (
		<section className="search">
			{error && <ErrorModal onClose={clear}>{error}</ErrorModal>}
			<Card>
				<div className="search-input">
					<label>Filter by Title</label>
					{isLoading && <span>Loading...</span>}
					<input
						ref={inputRef}
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
