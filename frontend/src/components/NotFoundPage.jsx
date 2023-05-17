import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  const { t } = useTranslation();
  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="text-center">
        <h1 className="display-1 fw-bold">404</h1>
        <p className="fs-3"> <span className="text-danger">Opps!</span> {t('notFoundPage.pageNotFound')}</p>
        <p className="lead">
          {t('notFoundPage.body')}
        </p>
        <Link to='/' className="btn btn-outline-primary btn-lg">
          <FontAwesomeIcon icon={faHouse} /> {t('notFoundPage.toMainPage')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
