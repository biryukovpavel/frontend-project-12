import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useFormik } from 'formik';
import { useAuth } from 'hooks';
import React, { useEffect, useRef } from 'react';
import {
  Card, Col, Container, Row, Image, Form, Button,
} from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'routes';
import * as yup from 'yup';
import { useRollbar } from '@rollbar/react';
import avatarImage from '../assets/avatar_1.jpg';

yup.setLocale({
  mixed: {
    required: 'errors.required',
  },
  string: {
    min: 'errors.minUsername',
    max: 'errors.maxUsername',
  },
});

const SignupPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inputEl = useRef(null);
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .trim()
      .min(3)
      .max(20)
      .required(),
    password: yup.string()
      .trim()
      .min(6, 'errors.minPassword')
      .required(),
    passwordConfirmation: yup.string()
      .trim()
      .required()
      .oneOf([yup.ref('password'), null], 'errors.passwordMustEquals'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async ({ username, password }, action) => {
      try {
        const response = await axios.post(routes.signupPath(), { username, password });
        auth.logIn(response.data);
        const { from } = location.state ?? { from: { pathname: '/' } };
        navigate(from);
      } catch (e) {
        rollbar.error(e);
        if (e.isAxiosError && e.response.status === 409) {
          inputEl.current.select();
          action.setStatus({
            signupFailedMessage: 'errors.existsUser',
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
                    alt={t('signupPage.signup')}
                  />
                </Col>
                <Col xs={12} md={6} className="offset-md-1">
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">{t('signupPage.signup')}</h1>
                    <Form.Group className="form-floating mb-4" controlId="username">
                      <Form.Control
                        required
                        ref={inputEl}
                        onChange={handleChange}
                        size="lg"
                        autoComplete="username"
                        placeholder={t('signupPage.username')}
                        value={formik.values.username}
                        disabled={formik.isSubmitting}
                        isInvalid={formik.errors.username || formik.status}
                      />
                      <Form.Label>{t('signupPage.username')}</Form.Label>
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
                        placeholder={t('signupPage.password')}
                        value={formik.values.password}
                        disabled={formik.isSubmitting}
                        isInvalid={formik.errors.password || formik.status}
                      />
                      <Form.Label>{t('signupPage.password')}</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {t(formik.errors.password)}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4" controlId="passwordConfirmation">
                      <Form.Control
                        required
                        onChange={handleChange}
                        type="password"
                        size="lg"
                        autoComplete="current-password"
                        placeholder={t('signupPage.passwordConfirmation')}
                        value={formik.values.passwordConfirmation}
                        disabled={formik.isSubmitting}
                        isInvalid={formik.errors.passwordConfirmation || formik.status}
                      />
                      <Form.Label>{t('signupPage.passwordConfirmation')}</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.status
                          ? t(formik.status.signupFailedMessage)
                          : t(formik.errors.passwordConfirmation)}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="outline-primary"
                        size="lg"
                        disabled={formik.status || formik.isSubmitting}
                      >
                        <FontAwesomeIcon icon={faUserPlus} />
                        {' '}
                        {t('signupPage.submit')}
                      </Button>
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

export default SignupPage;
