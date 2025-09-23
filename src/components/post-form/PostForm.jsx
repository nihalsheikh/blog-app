import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState(null);
	const [uploadProgress, setUploadProgress] = useState("");

	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		getValues,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: post?.title || "",
			slug: post?.$id || "",
			content: post?.content || "",
			status: post?.status || "active",
		},
	});

	const navigate = useNavigate();
	const userData = useSelector((state) => state.auth.userData);

	const submit = async (data) => {
		try {
			setIsSubmitting(true);
			setSubmitError(null);
			setUploadProgress("Starting...");

			if (post) {
				// Update existing post
				setUploadProgress("Processing image...");
				const file = data.image[0]
					? await appwriteService.uploadFile(data.image[0])
					: null;

				if (file) {
					setUploadProgress("Cleaning up old image...");
					appwriteService.deleteFile(post.featuredImage);
				}

				setUploadProgress("Updating post...");
				const dbPost = await appwriteService.updatePost(post.$id, {
					...data,
					featuredImage: file ? file.$id : undefined,
				});

				if (dbPost) {
					setUploadProgress("Success! Redirecting...");
					setTimeout(() => navigate(`/post/${dbPost.$id}`), 1000);
				}
			} else {
				// Create new post
				setUploadProgress("Uploading image...");
				const file = await appwriteService.uploadFile(data.image[0]);

				if (file) {
					const fileId = file.$id;
					data.featuredImage = fileId;

					setUploadProgress("Creating post...");
					const dbPost = await appwriteService.createPost({
						...data,
						userId: userData.$id,
					});

					if (dbPost) {
						setUploadProgress("Success! Redirecting...");
						setTimeout(() => navigate(`/post/${dbPost.$id}`), 1000);
					}
				} else {
					throw new Error("Failed to upload image");
				}
			}
		} catch (error) {
			console.error("Error submitting form:", error);
			setSubmitError(
				error.message || "Failed to submit. Please try again."
			);
			setUploadProgress("");
		} finally {
			setIsSubmitting(false);
		}
	};

	const slugTransform = useCallback((value) => {
		if (value && typeof value === "string")
			return value
				.trim()
				.toLowerCase()
				.replace(/[^a-zA-Z\d\s]+/g, "-")
				.replace(/\s/g, "-");

		return "";
	}, []);

	React.useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "title") {
				setValue("slug", slugTransform(value.title), {
					shouldValidate: true,
				});
			}
		});

		return () => subscription.unsubscribe();
	}, [watch, slugTransform, setValue]);

	// return (
	// 	<form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
	// 		<div className="w-2/3 px-2">
	// 			<Input
	// 				label="Title"
	// 				placeholder="Title"
	// 				className="mb-4"
	// 				{...register("title", { required: true })}
	// 			/>

	// 			<Input
	// 				label="Slug"
	// 				placeholder="Slug"
	// 				className="mb-4"
	// 				{...register("slug", { required: true })}
	// 				onInput={(e) => {
	// 					setValue("slug", slugTransform(e.currentTarget.value), {
	// 						shouldValidate: true,
	// 					});
	// 				}}
	// 			/>

	// 			<RTE
	// 				label="Content"
	// 				name="content"
	// 				control={control}
	// 				defaultValue={getValues("content")}
	// 			/>
	// 		</div>

	// 		<div className="w-1/3 px-2">
	// 			<Input
	// 				label="Featured Image"
	// 				type="file"
	// 				className="mb-4"
	// 				accept="image/png, image/jpg, image/jpeg, image/gif"
	// 				{...register("image", { required: !post })}
	// 			/>

	// 			{post && (
	// 				<div className="w-full mb-4">
	// 					<img
	// 						src={appwriteService.getFilePreview(
	// 							post.featuredImage
	// 						)}
	// 						alt={post.title}
	// 						className="rounded-lg"
	// 					/>
	// 				</div>
	// 			)}

	// 			<Select
	// 				options={["active", "inactive"]}
	// 				label="Status"
	// 				className="mb-4"
	// 				{...register("status", { required: true })}
	// 			/>

	// 			<Button
	// 				type="submit"
	// 				bgColor={post ? "bg-green-500" : undefined}
	// 				className="w-full cursor-pointer"
	// 			>
	// 				{post ? "Update" : "Submit"}
	// 			</Button>
	// 		</div>
	// 	</form>
	// );

	return (
		<div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-lg">
			<div className="mb-6">
				<h2 className="text-2xl font-bold text-gray-800 mb-2">
					{post ? "Edit Post" : "Create New Post"}
				</h2>
				<p className="text-gray-600">
					{post
						? "Update your existing post"
						: "Share your thoughts with the community"}
				</p>
			</div>

			<form
				onSubmit={handleSubmit(submit)}
				className="flex flex-wrap gap-6"
			>
				{/* Left Column - Main Content */}
				<div className="flex-1 min-w-0 space-y-6">
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-semibold text-gray-700 mb-4">
							Post Details
						</h3>

						<Input
							label="Title"
							placeholder="Enter a compelling title..."
							className="mb-4"
							{...register("title", {
								required: "Title is required",
								minLength: {
									value: 5,
									message:
										"Title must be at least 5 characters",
								},
							})}
						/>
						{errors.title && (
							<p className="text-red-500 text-sm mt-1 mb-3">
								{errors.title.message}
							</p>
						)}

						<Input
							label="Slug"
							placeholder="post-url-slug"
							className="mb-4"
							{...register("slug", {
								required: "Slug is required",
								pattern: {
									value: /^[a-z0-9-]+$/,
									message:
										"Slug can only contain lowercase letters, numbers, and hyphens",
								},
							})}
							onInput={(e) => {
								setValue(
									"slug",
									slugTransform(e.currentTarget.value),
									{
										shouldValidate: true,
									}
								);
							}}
						/>
						{errors.slug && (
							<p className="text-red-500 text-sm mt-1">
								{errors.slug.message}
							</p>
						)}
					</div>

					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-semibold text-gray-700 mb-4">
							Content
						</h3>
						<RTE
							label="Write your content here..."
							name="content"
							control={control}
							defaultValue={getValues("content")}
						/>
					</div>
				</div>

				{/* Right Column - Sidebar */}
				<div className="w-80 space-y-6">
					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-semibold text-gray-700 mb-4">
							Featured Image
						</h3>

						<Input
							label="Upload Image"
							type="file"
							className="mb-4"
							accept="image/png, image/jpg, image/jpeg, image/gif"
							{...register("image", {
								required: !post
									? "Featured image is required"
									: false,
							})}
						/>
						{errors.image && (
							<p className="text-red-500 text-sm mt-1 mb-3">
								{errors.image.message}
							</p>
						)}

						{post && (
							<div className="w-full mb-4">
								<p className="text-sm text-gray-600 mb-2">
									Current Image:
								</p>
								<div className="relative group">
									<img
										src={
											appwriteService.getFilePreview
												? appwriteService.getFilePreview(
														post.featuredImage
												  )
												: "/fallback-image.png"
										}
										alt={post.title}
										className="rounded-lg w-full h-48 object-cover shadow-md transition-transform group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 rounded-lg transition-all"></div>
								</div>
							</div>
						)}
					</div>

					<div className="bg-gray-50 p-6 rounded-lg">
						<h3 className="text-lg font-semibold text-gray-700 mb-4">
							Publishing Options
						</h3>

						<Select
							options={["active", "inactive"]}
							label="Status"
							className="mb-6"
							{...register("status", {
								required: "Status is required",
							})}
						/>
						{errors.status && (
							<p className="text-red-500 text-sm mt-1 mb-3">
								{errors.status.message}
							</p>
						)}

						{/* Submit Button with Loading States */}
						<div className="space-y-3">
							{submitError && (
								<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
									<div className="flex items-center">
										<svg
											className="w-5 h-5 mr-2"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
												clipRule="evenodd"
											/>
										</svg>
										{submitError}
									</div>
								</div>
							)}

							{uploadProgress && (
								<div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
									<div className="flex items-center">
										<svg
											className="animate-spin w-5 h-5 mr-2"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										{uploadProgress}
									</div>
								</div>
							)}

							<Button
								type="submit"
								disabled={isSubmitting}
								className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform ${
									isSubmitting
										? "bg-gray-400 cursor-not-allowed scale-95"
										: post
										? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:scale-105 shadow-lg hover:shadow-xl"
										: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:scale-105 shadow-lg hover:shadow-xl"
								} text-white`}
							>
								{isSubmitting ? (
									<div className="flex items-center justify-center">
										<svg
											className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
											fill="none"
											viewBox="0 0 24 24"
										>
											<circle
												className="opacity-25"
												cx="12"
												cy="12"
												r="10"
												stroke="currentColor"
												strokeWidth="4"
											></circle>
											<path
												className="opacity-75"
												fill="currentColor"
												d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
											></path>
										</svg>
										{post ? "Updating..." : "Publishing..."}
									</div>
								) : (
									<div className="flex items-center justify-center">
										<svg
											className="w-5 h-5 mr-2"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth="2"
												d={
													post
														? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
														: "M12 6v6m0 0v6m0-6h6m-6 0H6"
												}
											/>
										</svg>
										{post ? "Update Post" : "Publish Post"}
									</div>
								)}
							</Button>

							<button
								type="button"
								onClick={() => navigate(-1)}
								disabled={isSubmitting}
								className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	);
}
