import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3"> <span className="text-danger">Opps!</span> Страница не найдена.</p>
        <p className="lead">
          Страница, которую вы искали, не существует
        </p>
        <Link to='/' className="btn btn-outline-primary btn-lg">
          <FontAwesomeIcon icon={faHouse} /> На главную страницу
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
