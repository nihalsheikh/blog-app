// Post-Card Component: To be displayed on the all post page
import React, { useEffect, useState } from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import previewImage from "../assets/previewImage.png";

function Card({ $id, title, featuredImage }) {
	const [imageSrc, setImageSrc] = useState(previewImage);
	const [imageLoading, setImageLoading] = useState(true);
	const [imageError, setImageError] = useState(false);

	useEffect(() => {
		const fetchImage = async () => {
			if (!featuredImage) {
				setImageSrc(previewImage);
				setImageLoading(false);
				setImageError(true);
				return;
			}

			try {
				setImageLoading(true);
				setImageError(false);

				console.log("Fetching image for card: ", featuredImage);

				let imageResult = null;

				// const imageResult = await appwriteService.getFilePreview(
				// 	featuredImage,
				// 	400,
				// 	250
				// );

				try {
					imageResult = await appwriteService.getFileView(
						featuredImage
					);
					console.log("getFileView successful for Card");
				} catch (viewError) {
					console.log(
						"getFileView failed, trying getFilePreview:",
						viewError
					);

					// Fallback to preview if view fails (though preview will likely fail too on free plan)
					imageResult = await appwriteService.getFilePreview(
						featuredImage,
						400,
						250
					);
				}

				if (imageResult) {
					const url =
						imageResult.href ||
						imageResult.toString() ||
						imageResult;
					console.log("Card image URL generated: ", url);
					setImageSrc(url);
				} else {
					console.log("No image result, using fallback image");
					setImageSrc(previewImage);
					setImageError(true);
				}
			} catch (error) {
				console.error("Error getting image in card:", error);
				setImageSrc(previewImage);
				setImageError(true);
			} finally {
				setImageLoading(false);
			}
		};

		fetchImage();
	}, [featuredImage]);

	// const getImageSrc = () => {
	// 	if (!featuredImage) return previewImage;

	// 	try {
	// 		const imageUrl = appwriteService.getFilePreview(
	// 			featuredImage,
	// 			400,
	// 			250
	// 		);
	// 		return imageUrl;
	// 	} catch (error) {
	// 		console.error("Error getting image preview: ", error);
	// 		return previewImage;
	// 	}
	// };

	return (
		<Link to={`/post/${$id}`}>
			<div className="w-full bg-gray-100 rounded-xl p-4 hover:shadow-lg transition-shadow duration-300">
				<div className="w-full justify-center mb-4 relative">
					{imageLoading && (
						<div className="w-full h-48 bg-gray-200 rounded-xl flex items-center justify-center">
							<div className="animate-pulse text-gray-500">
								Loading...
							</div>
						</div>
					)}

					{!imageLoading && (
						<img
							src={imageSrc}
							alt={title || "Blog Post"}
							className="rounded-xl w-full h-48 object-cover"
							onError={(e) => {
								console.log(
									"Image failed to load in Card, using fallback"
								);
								if (e.target.src !== previewImage) {
									e.target.src = previewImage;
									setImageError(true);
								}
							}}
							onLoad={() => {
								if (imageSrc !== previewImage && !imageError) {
									console.log(
										"Card image loaded successfully"
									);
								}
							}}
						/>
					)}
				</div>
				<h2 className="text-xl font-bold">
					{title || "Untitled Post"}
				</h2>
			</div>
		</Link>
	);
}

export default Card;
