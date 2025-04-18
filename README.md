# SiteCraft

SiteCraft is a full-stack web application featuring a Spring Boot backend and a Next.js frontend.


## Prerequisites

Before you begin, ensure you have the following installed:

-   Java JDK 17 or higher
-   Node.js 20 or higher
-   npm or yarn
-   PostgreSQL database

## Getting Started

Follow these steps to set up and run the project locally.

### 1. Backend Setup (Spring Boot)

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```
2.  **Configure Database:**
    -   Open the `backend/src/main/resources/application.properties` file ([backend/src/main/resources/application.properties](backend/src/main/resources/application.properties)).
    -   Add your PostgreSQL database connection details:
        ```properties
        spring.datasource.url=jdbc:postgresql://localhost:5432/your_database_name
        spring.datasource.username=your_username
        spring.datasource.password=your_password
        spring.jpa.hibernate.ddl-auto=update # Use 'update' for development, 'validate' or 'none' for production
        ```
3.  **Run the Backend:** (or use intellij)
    -   Use the Maven wrapper to start the Spring Boot application:
        ```sh
        # Windows
        ./mvnw.cmd spring-boot:run

        # macOS/Linux
        ./mvnw spring-boot:run
        ```
    -   The backend API will be available at `http://localhost:8080`.

### 2. Frontend Setup (Next.js)

1.  **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```
2.  **Install Dependencies:**
    ```sh
    npm install
    ```
3.  **Run the Frontend:**
    ```sh
    npm run dev
    ```
    -   The frontend development server will start at `http://localhost:3000`.

## Accessing the Application

-   Open your web browser and go to `http://localhost:3000` to view the frontend application.
-   The frontend will interact with the backend API running at `http://localhost:8080`.
