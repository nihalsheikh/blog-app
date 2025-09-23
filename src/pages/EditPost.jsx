import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container, PostForm } from "../components";
import appwriteService from "../appwrite/config";

function EditPost() {
	const [post, setPosts] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { slug } = useParams();
	const navigate = useNavigate();

	// useEffect(() => {
	// 	if (slug) {
	// 		appwriteService
	// 			.getPost(slug)
	// 			.then((post) => {
	// 				if (post) {
	// 					setPosts(post);
	// 				}
	// 			})
	// 	} else {
	// 		navigate("/");
	// 	}
	// }, [slug, navigate]);

	useEffect(() => {
		const fetchPost = async () => {
			if (slug) {
				try {
					setLoading(true);
					setError(null);

					console.log("Fetching post for editing:", slug);
					const post = await appwriteService.getPost(slug);

					if (post) {
						console.log("Post fetched for editing:", post);
						setPosts(post);
					} else {
						setError("Post not found");
						setTimeout(() => navigate("/"), 2000);
					}
				} catch (error) {
					console.error("Error fetching post for edit:", error);
					setError("Failed to load post");
					setTimeout(() => navigate("/"), 2000);
				} finally {
					setLoading(false);
				}
			} else {
				navigate("/");
			}
		};

		fetchPost();
	}, [slug, navigate]);

	if (loading) {
		return (
			<div className="py-8">
				<Container>
					<div className="flex justify-center items-center min-h-[200px]">
						<div className="animate-pulse text-gray-600 text-xl">
							Loading post...
						</div>
					</div>
				</Container>
			</div>
		);
	}

	if (error) {
		return (
			<div className="py-8">
				<Container>
					<div className="flex justify-center items-center min-h-[200px]">
						<div className="text-red-500 text-xl text-center">
							<p>{error}</p>
							<p className="text-sm mt-2">
								Redirecting to homepage...
							</p>
						</div>
					</div>
				</Container>
			</div>
		);
	}

	return post ? (
		<div className="py-8">
			<Container>
				<PostForm post={post} />
			</Container>
		</div>
	) : null;
}

export default EditPost;
