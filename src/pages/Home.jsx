import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Container, Card } from "../components";

function Home() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// useEffect(() => {
	// 	appwriteService.getPosts().then((posts) => {
	// 		if (posts) {
	// 			setPosts(posts.documents);
	// 		}
	// 	});
	// }, []);

	useEffect(() => {
		const fetchpost = async () => {
			try {
				setLoading(true);
				setError(null);

				// console.log("Fetching posts for homepage...");
				const response = await appwriteService.getPosts();

				if (response && response.documents) {
					// console.log("Homepage posts fetched:",response.documents.length);
					setPosts(response.documents);
				} else {
					// console.log("No posts found for homepage");
					setPosts([]);
				}
			} catch (error) {
				console.error("Error fetching posts for homepage:", error);
				setError("Failed to load posts. Please try again.");
				setPosts([]);
			} finally {
				setLoading(false);
			}
		};

		fetchpost();
	}, []);

	if (loading) {
		return (
			<div className="w-full py-8">
				<Container>
					<div className="text-center">
						<h1 className="text-2xl font-bold hover:text-gray-500 mb-8">
							Welcome to Our Blog
						</h1>
						<div className="flex justify-center items-center min-h-[200px]">
							<div className="animate-pulse text-gray-600 text-xl">
								Loading latest posts...
							</div>
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
					<div className="text-center">
						<h1 className="text-2xl font-bold hover:text-gray-500 mb-8">
							Welcome to Our Blog
						</h1>
						<div className="flex justify-center items-center min-h-[200px]">
							<div className="text-red-500 text-xl text-center">
								<p>{error}</p>
								<button
									onClick={() => window.location.reload()}
									className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
								>
									Retry
								</button>
							</div>
						</div>
					</div>
				</Container>
			</div>
		);
	}

	if (posts.length === 0) {
		return (
			<div className="w-full py-8 mt-4 text-center">
				<Container>
					<div className="text-center">
						<h1 className="text-2xl font-bold hover:text-gray-500 mb-8">
							Welcome to Our Blog
						</h1>
						<div className="flex flex-wrap justify-center items-center min-h-[200px]">
							<p className="text-gray-500 text-xl">
								No blog posts yet.
							</p>
							<p className="text-sm text-gray-400 mt-2">
								Be the first to create a post!
							</p>
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

	return (
		<div className="w-full py-8">
			<Container>
				<div className="text-center mb-8">
					<h1 className="text-2xl font-bold hover:text-gray-500">
						Welcome to Our Blog
					</h1>
					<p className="text-gray-600 mt-2">
						Latest posts from our community
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

export default Home;
