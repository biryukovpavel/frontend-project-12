import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useFormik } from 'formik';
import { useApi, useAuth } from 'hooks';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, InputGroup } from 'react-bootstrap';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';
import { useRollbar } from '@rollbar/react';

yup.setLocale({
  mixed: {
    required: 'errors.required',
  },
});

const NewMessage = ({ channel }) => {
  const inputEl = useRef(null);
  const { currentUser: { username } } = useAuth();
  const api = useApi();
  const { t } = useTranslation();
  const rollbar = useRollbar();

  const validationSchema = yup.object().shape({
    body: yup.string().trim()
      .required(),
  });

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema,
    onSubmit: async ({ body }, action) => {
      try {
        const message = {
          body: leoProfanity.clean(body),
          channelId: channel.id,
          username,
        };
        await api.sendMessage(message);
        action.resetForm();
      } catch (error) {
        rollbar.error(error);
        console.log(error);
      }
    },
  });

  const isValid = formik.isValid && formik.dirty;

  useEffect(() => {
    inputEl.current.focus();
  }, [channel]);

  useEffect(() => {
    if (!formik.isSubmitting) {
      inputEl.current.focus();
    }
  }, [formik.isSubmitting]);

  return (
    <Form className="border rounded-2" onSubmit={formik.handleSubmit}>
      <InputGroup>
        <Form.Control
          id="body"
          ref={inputEl}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          aria-label={t('chatPage.newMessage')}
          placeholder={t('chatPage.enterMessage')}
          value={formik.values.body}
          disabled={formik.isSubmitting}
          className="border-1 py-2"
        />
        <Button type="submit" className="border-0" variant="" disabled={!isValid || formik.isSubmitting}>
          <FontAwesomeIcon size="xl" icon={faPaperPlane} style={{ color: '#1368fb' }} />
        </Button>
      </InputGroup>
    </Form>
  );
};

export default NewMessage;
