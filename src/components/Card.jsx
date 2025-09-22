// Post-Card Component: To be displayed on the all post page
import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import previewImage from "../assets/previewImage.png";

function Card({ $id, title, featuredImage }) {
	const getImageSrc = () => {
		if (!featuredImage) return previewImage;

		try {
			const imageUrl = appwriteService.getFilePreview(
				featuredImage,
				400,
				250
			);
			return imageUrl;
		} catch (error) {
			console.error("Error getting image preview: ", error);
			return previewImage;
		}
	};

	return (
		<Link to={`/post/${$id}`}>
			<div className="w-full bg-gray-100 rounded-xl p-4">
				<div className="w-full justify-center mb-4">
					<img
						src={getImageSrc()}
						alt={title || "Blog Post"}
						className="rounded-xl"
						onError={(e) => {
							e.target.src = previewImage;
						}}
						loading="lazy"
					/>
				</div>
				<h2 className="text-xl font-bold">
					{title || "Untitled Post"}
				</h2>
			</div>
		</Link>
	);
}

export default Card;
