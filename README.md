# Effortless File Storing Solution

Effortlessly store files of any size with your team or community. Our innovative solution handles the complex file management behind the scenes, ensuring a seamless and cost-free experience for both you and your users.

## Features

- **Large File Upload:** Users can upload files of any size without worrying about the file size limit.
- **Efficient File Handling:** The application automatically divides the uploaded files into smaller chunks, allowing for seamless delivery to the server.
- **Secure File Transmission:** Each uploaded file is assigned a unique hash, ensuring the integrity and security of the file during transfer.
- **Intuitive User Interface:** The clean and user-friendly interface makes the file upload and retrieval process straightforward and hassle-free.
- **Cost-Effective:** The application is free to use for both the project owner and the users, eliminating the need for storage costs.

## Getting Started

To get started with the application, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/satwikmishra1107/discord-file-upload.git


2. **Install the required dependencies:**

   - For the frontend:
     ```bash
     cd discord-file-upload/client
     npm install
     ```

   - For the backend:
     ```bash
     cd discord-file-upload/server
     npm install
     ```

3. **Set up the environment variables:**

   - Create a `.env` file in the server directory and add the following variables:
     ```plaintext
     PORT=8000
     FIREBASE_API_KEY=your-firebase-api-key
     FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
     FIREBASE_PROJECT_ID=your-firebase-project-id
     FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
     FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
     FIREBASE_APP_ID=your-firebase-app-id
     ```

4. **Start the development servers:**

   - For the frontend:
     ```bash
     cd discord-file-upload/client
     npm start
     ```

   - For the backend:
     ```bash
     cd discord-file-upload/server
     npm start
     ```

5. **Access the application in your browser:**

   - The frontend will be available at [http://localhost:3000](http://localhost:3000)
   - The backend will be running at [http://localhost:8000](http://localhost:8000)
   
## Technologies Used

- **Frontend:** React.js, Material-UI
- **Backend:** Node.js, Express.js
- **Database:** Firebase Firestore
- **File Handling:** Multer, Axios

## Contributing

We welcome contributions from the community. If you'd like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them
4. Submit a pull request

## License

This project is kept open source and free to use and contribute to.

## Contact

If you have any questions or feedback, feel free to reach out to us:

- Email: satwikmishra1107@gmail.com
- GitHub: [satwikmishra1107/discord-file-upload](https://github.com/satwikmishra1107/discord-file-upload)

Thank you for using our file storing solution!
