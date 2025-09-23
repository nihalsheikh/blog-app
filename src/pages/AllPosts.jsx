import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, Card } from "../components";

function AllPosts() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				setError(null);

				const response = await appwriteService.getPosts([]);

				if (response && response.documents) {
					setPosts(response.documents);
				} else {
					setPosts([]);
				}
			} catch (error) {
				console.error("Error fetching posts:", error);
				setError("Failed to load posts. Please try again.");
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	// appwriteService.getPosts([]).then((posts) => {
	// 	if (posts) {
	// 		setPosts(posts.documents);
	// 	}
	// });

	if (loading) {
		return (
			<div className="w-full py-8">
				<Container>
					<div className="flex justify-center items-center min-h-[200px]">
						<div className="animate-pulse text-gray-600 text-xl">
							Loading posts...
						</div>
					</div>
				</Container>
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full py-8">
				<Container>
					<div className="flex justify-center items-center min-h-[200px]">
						<div className="text-xl text-red-600 text-center">
							<p>{error}</p>
							<button
								onClick={() => window.location.reload()}
								className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Retry
							</button>
						</div>
					</div>
				</Container>
			</div>
		);
	}

	// return (
	// 	<div className="w-full py-8">
	// 		<Container>
	// 			<div className="flex flex-wrap">
	// 				{posts.map((post) => (
	// 					<div key={post.$id} className="p-2 w-1/4">
	// 						<Card {...post} />
	// 					</div>
	// 				))}
	// 			</div>
	// 		</Container>
	// 	</div>
	// );

	if (posts.length === 0) {
		return (
			<div className="w-full py-8">
				<Container>
					<div className="flex justify-center items-center min-h-[200px]">
						<div className="text-gray-500 text-xl text-center">
							<p>No posts available</p>
							<p className="text-sm mt-2">
								Check back later for new content
							</p>
						</div>
					</div>
				</Container>
			</div>
		);
	}

	return (
		<div className="w-full py-8">
			<Container>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{posts.map((post) => (
						<div key={post.$id} className="p-2">
							<Card {...post} />
						</div>
					))}
				</div>
			</Container>
		</div>
	);
}

export default AllPosts;
