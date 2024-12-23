// Pages/ErrorPage.jsx
import React from "react";
import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div style={{ textAlign: "center", padding: "50px" }}>
            <h1>Oops! Something went wrong.</h1>
            <p>
                <strong>Status:</strong> {error?.status || "Unknown"}
            </p>
            <p>
                <strong>Message:</strong> {error?.statusText || error?.message || "An unexpected error occurred."}
            </p>
            <a href="/">Go Back to Home</a>
        </div>
    );
};

export default ErrorPage;
