// (Major Appwrite Configuration) Appwrite Database, file upload and custom queries
import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "../conf/conf.js";

export class Service {
	client = new Client();
	databases;
	bucket; // storage

	constructor() {
		this.client
			.setEndpoint(conf.appwriteUrl)
			.setProject(conf.appwriteProjectId);

		this.databases = new Databases(this.client);
		this.bucket = new Storage(this.client);
	}

	// Blog-Post methods

	async createPost({ title, slug, content, featuredImage, status, userId }) {
		try {
			return await this.databases.createDocument(
				conf.appwriteDatabaseId,
				conf.appwriteTableId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
					userId,
				}
			);
		} catch (error) {
			console.log("Appwrite service :: createPost :: error", error);
			throw error;
		}
	}

	async updatePost(slug, { title, content, featuredImage, status }) {
		try {
			return await this.databases.updateDocument(
				conf.appwriteDatabaseId,
				conf.appwriteTableId,
				slug,
				{
					title,
					content,
					featuredImage,
					status,
				}
			);
		} catch (error) {
			console.log("Appwrite service :: updatePost :: error", error);
			throw error;
		}
	}

	async deletePost(slug) {
		try {
			await this.databases.deleteDocument(
				conf.appwriteDatabaseId,
				conf.appwriteTableId,
				slug
			);

			return true;
		} catch (error) {
			console.log("Appwrite service :: deletePost :: error", error);

			return false;
		}
	}

	async getPost(slug) {
		try {
			return await this.databases.getDocument(
				conf.appwriteDatabaseId,
				conf.appwriteTableId,
				slug
			);
		} catch (error) {
			console.log("Appwrite service :: getPost :: error", error);
			return false;
		}
	}

	async getPosts(queries = [Query.equal("status", "active")]) {
		try {
			return await this.databases.listDocuments(
				conf.appwriteDatabaseId,
				conf.appwriteTableId,
				queries
			);
		} catch (error) {
			console.log("Appwrite service :: getPosts :: error", error);
			return false;
		}
	}

	// file upload methods
	async uploadFile(file) {
		try {
			return await this.bucket.createFile(
				conf.appwriteBucketId,
				ID.unique(),
				file
			);
		} catch (error) {
			console.log("Appwrite method :: uploadFile :: error", error);
			// return false;
			throw error;
		}
	}

	async deleteFile(fileId) {
		try {
			await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
			return true;
		} catch (error) {
			console.log("Appwrite service :: deleteFile :: error", error);
			return false;
		}
	}

	async getFileView(fileId) {
		// Using this method as only this is allowed in the free tier of appwrite
		try {
			if (!fileId || fileId.trim() === "") {
				console.warn("No fileId provided for file view");
				return null;
			}

			// return this.bucket.getFileView(conf.appwriteBucketId, fileId);

			console.log(`Fetching file view for fileId: ${fileId}`);

			const result = this.bucket.getFileView(
				conf.appwriteBucketId,
				fileId.trim()
			);

			return result;
		} catch (error) {
			console.log("Appwrite service :: getFileView :: error", error);
			console.error("Failed fileId:", fileId);
			return null;
		}
	}

	async getFilePreview(
		fileId,
		width = 800,
		height = 300,
		gravity = "center",
		quality = 100
	) {
		// this method is not returning a promise, so no need for async-await
		// return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
		try {
			if (!fileId || fileId.trim() === "") {
				console.log("No fileId provided for preview");
				return null;
			}

			console.log(`Fetching preview for fileId: ${fileId}`);

			const result = await this.bucket.getFilePreview(
				conf.appwriteBucketId,
				fileId.trim(),
				width,
				height,
				gravity,
				quality
			);

			// return this.bucket.getFilePreview(
			// 	conf.appwriteBucketId,
			// 	fileId,
			// 	width,
			// 	height,
			// 	gravity,
			// 	quality
			// );

			console.log("Preview result successful");
			return result;
		} catch (error) {
			console.error("getFilePreview failed, trying getFileView: ", error);

			if (
				error.code === 403 ||
				error.type === "storage_image_transformations_blocked"
			) {
				console.log(
					"Image transformations blocked, using getFileView instead"
				);
				return this.getFileView(fileId);
			}

			console.error("Both preview and view failed:", error);
			return null;
		}
	}
}

const service = new Service();

export default service;
