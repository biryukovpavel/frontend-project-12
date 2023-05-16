import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useFormik } from "formik";
import { useAuth } from "hooks";
import React, { useEffect, useRef } from "react";
import { Card, Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "routes";
import * as yup from 'yup';
import avatarImage from '../assets/avatar_1.jpg';

const SignupPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inputEl = useRef(null);

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .trim()
      .min(3, 'Минимум 3 буквы')
      .max(20, 'Максимум 20 букв')
      .required('Обязательное поле'),
    password: yup.string()
      .trim()
      .min(6, 'Минимум 6 символов')
      .required('Обязательное поле'),
    passwordConfirmation: yup.string()
      .trim()
      .required('Обязательное поле')
      .oneOf([yup.ref('password'), null], 'Пароли должны совпадать'),
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
        if (e.isAxiosError && e.response.status === 409) {
          inputEl.current.select();
          action.setStatus({
            signupFailedMessage: 'Такой пользователь уже существует',
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
                    alt="SignUp"
                  />
                </Col>
                <Col xs={12} md={6} className="offset-md-1">
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <Form.Group className="form-floating mb-4" controlId="username">
                      <Form.Control
                        required
                        ref={inputEl}
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        size="lg"
                        autoComplete="username"
                        placeholder="Ваш ник"
                        value={formik.values.username}
                        disabled={formik.isSubmitting}
                        isInvalid={(formik.errors.username && formik.touched.username) || formik.status}
                      />
                      <Form.Label>Ваш ник</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.username}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4" controlId="password">
                      <Form.Control
                        required
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        type="password"
                        size="lg"
                        autoComplete="current-password"
                        placeholder="Пароль"
                        value={formik.values.password}
                        disabled={formik.isSubmitting}
                        isInvalid={(formik.errors.password && formik.touched.password) || formik.status}
                      />
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="form-floating mb-4" controlId="passwordConfirmation">
                      <Form.Control
                        required
                        onChange={handleChange}
                        onBlur={formik.handleBlur}
                        type="password"
                        size="lg"
                        autoComplete="current-password"
                        placeholder="Подтвердите пароль"
                        value={formik.values.passwordConfirmation}
                        disabled={formik.isSubmitting}
                        isInvalid={(formik.errors.passwordConfirmation && formik.touched.passwordConfirmation) || formik.status}
                      />
                      <Form.Label>Подтвердите пароль</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.status ? formik.status.signupFailedMessage : formik.errors.passwordConfirmation}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="outline-primary"
                        size="lg"
                        disabled={!(formik.isValid && formik.dirty) || formik.status || formik.isSubmitting}
                      >
                        <FontAwesomeIcon icon={faUserPlus} /> Зарегистрироваться
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
