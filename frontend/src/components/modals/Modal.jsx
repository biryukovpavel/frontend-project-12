import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { closeModal } from "slices/modalSlice.jsx";
import Add from "./Add.jsx";
import Remove from "./Remove.jsx";
import Rename from "./Rename.jsx";

const modals = {
  adding: Add,
  removing: Remove,
  renaming: Rename,
};
const getModal = (type) => modals[type];

const Modal = () => {
  const { type, isShow } = useSelector((state) => state.modal);
  const dispatch = useDispatch();
  const Modal = getModal(type);
  if (!Modal) {
    return null;
  }

  const handleClose = () => dispatch(closeModal());
  return (
    <Modal isShow={isShow} handleClose={handleClose} />
  );
};

export default Modal;
