import { Card, Col, Container, Row, Image, Form, Button } from "react-bootstrap";
import avatarImage from "../assets/avatar.jpg";
import React, { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import * as yup from 'yup';
import { useFormik } from "formik";
import axios from "axios";
import routes from "../routes.js";
import { useAuth } from "../hooks/index.jsx";

const LoginPage = () => {
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const inputEl = useRef(null);

  const SignupSchema = yup.object().shape({
    username: yup.string()
      .min(2, 'Минимум 2 буквы')
      .max(50, 'Максимум 50 букв')
      .required('Обязательное поле'),
    password: yup.string()
      .min(4, 'Минимум 4 символов')
      .required('Обязательное поле'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: async (values, action) => {
      try {
        await axios.post('/api/v1/signup', { username: 'user', password: '123456' });
      } catch (error) {
        console.log('user alredy exists')
      }
      try {
        const response = await axios.post(routes.loginPath(), values);
        auth.logIn(response.data);
        const { from } = location.state ?? { from: { pathname: '/' } };
        navigate(from);
      } catch (e) {
        if (e.isAxiosError && e.response.status === 401) {
          inputEl.current.select();
          action.setStatus({
            authFailedMessage: 'Неверные имя пользователя или пароль',
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
                    alt="LogIn"
                  />
                </Col>
                <Col xs={12} md={6} className="offset-md-1">
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Войти</h1>
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
                        isInvalid={(formik.errors.password && formik.touched.password) || formik.status}
                      />
                      <Form.Label>Пароль</Form.Label>
                      <Form.Control.Feedback type="invalid">
                        {formik.status ? formik.status.authFailedMessage : formik.errors.password}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <div className="d-grid gap-2">
                      <Button
                        type="submit"
                        variant="outline-primary"
                        size="lg"
                        disabled={!(formik.isValid && formik.dirty) || formik.status}
                      >
                        <FontAwesomeIcon icon={faRightToBracket} /> Войти
                      </Button>
                    </div>
                    <div className="text-center mt-4 pt-2">
                      <p>
                        Нет аккаунта? <Link to="/signup">Регистрация</Link>
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
