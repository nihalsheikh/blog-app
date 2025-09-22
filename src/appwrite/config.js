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

	getFilePreview(
		fileId,
		width = 400,
		height = 300,
		gravity = "center",
		quality = 100
	) {
		// this method is not returning a promise, so no need for async-await
		// return this.bucket.getFilePreview(conf.appwriteBucketId, fileId);
		try {
			if (!fileId) {
				console.log("No fileId provided for preview");
				return null;
			}

			return this.bucket.getFilePreview(
				conf.appwriteBucketId,
				fileId,
				width,
				height,
				gravity,
				quality
			);
		} catch (error) {
			console.log("Appwrite service :: getFilePreview :: error", error);
			return null;
		}
	}

	getFileView(fileId) {
		try {
			if (!fileId) {
				console.warn("No fileId provided for file view");
				return null;
			}

			return this.bucket.getFileView(conf.appwriteBucketId, fileId);
		} catch (error) {
			console.log("Appwrite service :: getFileView :: error", error);
			return null;
		}
	}
}

const service = new Service();

export default service;
