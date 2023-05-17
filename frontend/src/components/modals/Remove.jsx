import { useFormik } from "formik";
import { useApi } from "hooks";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

const Remove = ({ isShow, handleClose }) => {
  const api = useApi();
  const { t } = useTranslation();
  const channelId = useSelector((state) => state.modal.channelId);

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: async () => {
      try {
        await api.removeChannel(channelId);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Modal show={isShow} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={formik.handleSubmit}>
        <Modal.Body>
          <Form.Group className='form-floating mb-3' controlId='name'>
            <p>{t('modals.removeBodyText')}</p>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose} disabled={formik.isSubmitting}>
            {t('modals.cancel')}
          </Button>
          <Button variant='danger' type='submit' disabled={formik.isSubmitting}>
            {t('modals.remove')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default Remove;
