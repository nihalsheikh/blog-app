import React, { useEffect, useState } from "react";
import service from "../appwrite/config";
import { Container, Card } from "../components";

function AllPosts() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {}, []);

	service
		.getPost([])
		.then((posts) => {
			if (posts) {
				setPosts(posts.documents);
			}
		})
		.catch((error) => console.log(error));

	return (
		<div className="w-full py-8">
			<Container>
				<div className="flex flex-wrap">
					{posts.map((post) => (
						<div key={post.$id} className="p-2 w-1/4">
							<Card post={post} />
						</div>
					))}
				</div>
			</Container>
		</div>
	);
}

export default AllPosts;
