import {
  Card, Col, Container, Row, Image, Form, Button,
} from 'react-bootstrap';
import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import * as yup from 'yup';
import { useFormik } from 'formik';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import routes from '../routes.js';
import { useAuth } from '../hooks/index.jsx';
import avatarImage from '../assets/avatar.jpg';

yup.setLocale({
  mixed: {
    required: 'errors.required',
  },
});

const LoginPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inputEl = useRef(null);
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .required(),
    password: yup.string()
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, action) => {
      try {
        const response = await axios.post(routes.loginPath(), values);
        auth.logIn(response.data);
        const { from } = location.state ?? { from: { pathname: '/' } };
        navigate(from);
      } catch (e) {
        rollbar.error(e);
        if (e.isAxiosError && e.response.status === 401) {
          inputEl.current.select();
          action.setStatus({
            authFailedMessage: 'errors.authFailed',
          });
          return;
        }
        throw e;
      }
    },
  });

  const handleChange = (e) => {
    formik.setStatus(undefined);
    formik.handleChange(e);
  };

  useEffect(() => {
    inputEl.current.focus();
  }, []);

  return (
    <Container fluid className="h-100">
      <Row className="d-flex align-items-center justify-content-center h-100">
        <Col xs={12} md={8} xl={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-5">
              <Row>
                <Col xs={12} md={5} className="d-flex align-items-center justify-content-center">
                  <Image
                    roundedCircle
                    src={avatarImage}
                    alt={t('loginPage.login')}
                  />
                </Col>
                <Col xs={12} md={6} className="offset-md-1">
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">{t('loginPage.login')}</h1>
                    <Form.Group className="form-floating mb-4" controlId="username">
                      <Form.Control
                        required
                        ref={inputEl}
                        onChange={handleChange}
                        size="lg"
                        autoComplete="username"
                        placeholder={t('loginPage.username')}
                        value={formik.values.username}
                        isInvalid={formik.errors.username || formik.status}
                      />
                      <Form.Label>{t('loginPage.username')}</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {t(formik.errors.username)}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4" controlId="password">
                      <Form.Control
                        required
                        onChange={handleChange}
                        type="password"
                        size="lg"
                        autoComplete="current-password"
                        placeholder={t('loginPage.password')}
                        value={formik.values.password}
                        isInvalid={formik.errors.password || formik.status}
                      />
                      <Form.Label>{t('loginPage.password')}</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.status
                          ? t(formik.status.authFailedMessage)
                          : t(formik.errors.password)}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="outline-primary"
                        size="lg"
                        disabled={formik.status || formik.isSubmitting}
                      >
                        <FontAwesomeIcon icon={faRightToBracket} />
                        {' '}
                        {t('loginPage.submit')}
                      </Button>
                    </div>
                    <div className="text-center mt-4 pt-2">
                      <p>
                        {t('loginPage.noAccount')}
                        {' '}
                        <Link to="/signup">{t('loginPage.signup')}</Link>
                      </p>
                    </div>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;
