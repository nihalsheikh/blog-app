import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import previewImage from "../assets/previewImage.png";

export default function Post() {
	const navigate = useNavigate();
	const { slug } = useParams();

	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [imageError, setImageError] = useState(false);
	const [imageUrl, setImageUrl] = useState(previewImage);
	const [imageLoading, setImageLoading] = useState(true);

	const userData = useSelector((state) => state.auth.userData);
	const isAuthor = post && userData ? post.userId === userData.$id : false;

	useEffect(() => {
		const fetchPost = async () => {
			if (slug) {
				try {
					setLoading(true);
					setError(null);

					// console.log("Fetching post for slug:", slug);
					const postData = await appwriteService.getPost(slug);

					if (postData) {
						// console.log("Post fetched successfully:", postData);
						setPost(postData);
					} else {
						setError("Post Not Found");
						navigate("/");
					}
				} catch (error) {
					console.error("Error fetching post:", error);
					setError("Failed to load post");
					navigate("/");
				} finally {
					setLoading(false);
				}
			} else {
				navigate("/");
			}
		};

		fetchPost();
	}, [slug, navigate]);

	useEffect(() => {
		const fetchImage = async () => {
			if (post && post.featuredImage) {
				try {
					setImageLoading(true);
					setImageError(false);

					// console.log("Fetching full image for post:",post.featuredImage);

					// Method 1: Try getFileView with proper await
					try {
						// console.log("Trying getFileView...");
						const viewResult = await appwriteService.getFileView(
							post.featuredImage
						);

						if (viewResult) {
							// Extract URL from the result
							const url =
								viewResult.href ||
								viewResult.toString() ||
								viewResult;
							// console.log("Full image URL from getFileView:",url);
							setImageUrl(url);
							setImageLoading(false);
							return;
						}
					} catch (viewError) {
						console.error("getFileView failed:", viewError);
					}

					// Method 2: Try getFilePreview as fallback (will likely fail on free plan)
					try {
						// console.log("Trying getFilePreview as fallback...");
						const previewResult =
							await appwriteService.getFilePreview(
								post.featuredImage,
								800,
								600,
								"center",
								90
							);

						if (previewResult) {
							const url =
								previewResult.href ||
								previewResult.toString() ||
								previewResult;
							// console.log("Full image URL from getFilePreview:",url);
							setImageUrl(url);
						} else {
							// console.log("Both methods failed, using fallback");
							setImageUrl(previewImage);
							setImageError(true);
						}
					} catch (previewError) {
						console.error(
							"getFilePreview also failed:",
							previewError
						);
						setImageUrl(previewImage);
						setImageError(true);
					}
				} catch (error) {
					console.error("Error getting full image:", error);
					setImageUrl(previewImage);
					setImageError(true);
				} finally {
					setImageLoading(false);
				}
			} else if (post) {
				// Post exists but no featured image
				setImageLoading(false);
				setImageError(true);
				setImageUrl(previewImage);
			}
		};

		fetchImage();
	}, [post]);

	const deletePost = async () => {
		if (!post) return;

		try {
			const status = await appwriteService.deletePost(post.$id);

			if (status) {
				if (post.featuredImage) {
					await appwriteService.deleteFile(post.featuredImage);
				}
				navigate("/");
			}
		} catch (error) {
			// console.log("Error deleting post: ", error);
			console.error("Error deleting post: ", error);
			alert("Failed to delete post. Please try again.");
		}
	};

	if (loading) {
		return (
			<div className="py-8">
				<Container>
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="text-lg animate-pulse">
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
					<div className="flex justify-center items-center min-h-[400px]">
						<div className="text-lg text-red-600 text-center">
							<p>{error}</p>
							<button
								onClick={() => navigate("/")}
								className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
							>
								Go Home
							</button>
						</div>
					</div>
				</Container>
			</div>
		);
	}

	return post ? (
		<div className="py-8">
			<Container>
				<div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
					{imageLoading && (
						<div className="w-full h-96 bg-gray-100 rounded-xl flex items-center justify-center">
							<div className="animate-pulse text-gray-500">
								Loading full image...
							</div>
						</div>
					)}

					{!imageLoading && (
						<img
							src={imageUrl}
							alt={post.title || "Blog Post Image"}
							className="rounded-xl max-w-full h-auto max-h-96 object-contain"
							onError={(e) => {
								// console.log("Full image failed to load, using fallback");
								// console.log("Failed URL was:", e.target.src);
								if (e.target.src !== previewImage) {
									setImageError(true);
									e.target.src = previewImage;
								}
							}} // deleted onLoad method here
						/>
					)}

					{isAuthor && (
						<div className="absolute right-6 top-6">
							<Link to={`/edit-post/${post.$id}`}>
								<Button
									bgColor="bg-green-500"
									className="mr-3 cursor-pointer hover:bg-green-600"
								>
									Edit
								</Button>
							</Link>

							<Button
								bgColor="bg-red-500"
								onClick={deletePost}
								className="cursor-pointer hover:bg-red-600"
							>
								Delete
							</Button>
						</div>
					)}
				</div>

				<div className="w-full mb-6">
					<h1 className="text-2xl font-bold">{post.title}</h1>
					{post.createdAt && (
						<p className="text-sm text-gray-500 mt-2">
							Published:{" "}
							{new Date(post.createdAt).toLocaleDateString()}
						</p>
					)}
				</div>

				<div className="browser-css">
					{post.content ? (
						parse(post.content)
					) : (
						<p className="text-gray-500 italic">
							No Content Available
						</p>
					)}
				</div>
			</Container>
		</div>
	) : null;
}
