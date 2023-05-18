import { useFormik } from "formik";
import { useApi } from "hooks";
import React, { useEffect, useRef } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import * as yup from 'yup';
import { toast } from 'react-toastify';

const getChannelNames = (state) => {
  const { channels } = state.channels;
  return channels.map((channel) => channel.name.trim());
};

const getChannelById = (channelId) => (state) => {
  const { channels } = state.channels;
  return channels.find((channel) => channel.id === channelId);
};

const Rename = ({ isShow, handleClose }) => {
  const inputEl = useRef(null);
  const channels = useSelector(getChannelNames);
  const channelId = useSelector((state) => state.modal.channelId);
  const channel = useSelector(getChannelById(channelId));
  const api = useApi();
  const { t } = useTranslation();

  yup.setLocale({
    mixed: {
      required: 'errors.required',
      notOneOf: 'errors.existsChannel',
    },
  });

  const getValidationSchema = (channels) =>
    yup.object().shape({
      name: yup.string().trim()
        .required()
        .notOneOf(channels),
    });

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: getValidationSchema(channels),
    onSubmit: async ({ name }) => {
      try {
        const channel = {
          id: channelId,
          name,
        };
        await api.renameChannel(channel);
        toast.success(t('channels.renamed'));
        handleClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  useEffect(() => {
    if (!formik.isSubmitting) {
      inputEl.current.select();
    }
  }, [formik.isSubmitting]);

  return (
    <Modal show={isShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group className='form-floating mb-3' controlId='name'>
            <Form.Control
              required
              ref={inputEl}
              placeholder={t('modals.channelName')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              disabled={formik.isSubmitting}
              isInvalid={(formik.errors.name && formik.touched.name) || formik.status}
            />
            <Form.Label>{t('modals.channelName')}</Form.Label>
            <Form.Control.Feedback type='invalid'>
              {t(formik.errors.name)}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose} disabled={formik.isSubmitting}>
            {t('modals.cancel')}
          </Button>
          <Button variant='primary' type='submit' disabled={!(formik.isValid && formik.dirty) || formik.status || formik.isSubmitting}>
            {t('modals.submit')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
};

export default Rename;
