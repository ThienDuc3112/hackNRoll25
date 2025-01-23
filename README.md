# RBuild - Professional Resume Builder

RBuild is an intuitive and user-friendly platform for creating ATS-friendly professional resumes in minutes. With a drag-and-drop interface, powerful templates, and a robust backend, RBuild ensures you can build stunning resumes to land your dream job effortlessly.

---

## Features
- **Drag & Drop Builder**: Simplifies the resume creation process with an intuitive drag-and-drop interface.
- **Smart Sections**: Pre-built flexible sections to streamline the workflow.
- **More...**

---

## Tech Stack
### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/)
- **Key Features**:
  - Modern UI and UX design
  - Responsive and mobile-friendly
  - Integration with backend APIs for seamless data exchange

### Backend
- **Language**: [Go](https://golang.org/)
- **Framework**: [Chi](https://github.com/go-chi/chi)
- **Key Features**:
  - Lightweight and fast routing
  - RESTful API endpoints for managing resume data
  - Secure and scalable architecture

---

## Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v22 or later)
- [Go](https://golang.org/) (v1.22 or later)
- [Docker](https://www.docker.com/)

### Frontend
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:10101](http://localhost:10101) to view the app in your browser.

### Backend
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the backend server:
   ```bash
   go run ./cmd/api/main.go
   ```
3. The API will be available at [http://localhost:13112](http://localhost:13112).

---

## API Endpoints
### Resume Endpoints
- **GET** `/api/resumes` - Fetch all resumes
- **POST** `/api/resumes` - Create a new resume
- **PUT** `/api/resumes/{id}` - Update an existing resume
- **DELETE** `/api/resumes/{id}` - Delete a resume

---

## Contributing
Contributions are welcome! To contribute:
1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## License
RBuild is licensed under the [GNU Affero General Public License (AGPL)](LICENSE).

---

## Acknowledgements
- [Next.js](https://nextjs.org/)
- [Golang](https://golang.org/)
- [Chi Router](https://github.com/go-chi/chi)
- [Material-UI](https://mui.com/)

---

## Contact
For any inquiries or feedback, please contact us at [ntduc4@gmail.com](mailto:ntduc4@gmail.com).