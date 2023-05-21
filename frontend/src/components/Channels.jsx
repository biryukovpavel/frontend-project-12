import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, ButtonGroup, Dropdown, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from 'react-i18next';
import { setCurrentChannel } from "slices/channelsSlice";
import { showModal } from "slices/modalSlice";

const Channels = () => {
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleChoseChannel = (channelId) => {
    dispatch(setCurrentChannel({ channelId }));
  };

  const handleShowModal = (type) => {
    dispatch(showModal({ type }))
  };

  const handleRemoveChannel = (channelId) => {
    dispatch(showModal({ type: 'removing', channelId }))
  };

  const handleRenameChannel = (channelId) => {
    dispatch(showModal({ type: 'renaming', channelId }))
  };

  return (
    <>
      <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
        <b>{t('channels.channels')}</b>
        <Button
          type="button"
          variant=""
          className="p-0 text-primary"
          onClick={() => handleShowModal('adding')}
        >
          <FontAwesomeIcon icon={faPlus} size="lg"></FontAwesomeIcon>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <Nav variant='pills' className='flex-column px-2 mb-3 overflow-auto h-100 d-block'>
        {channels.map((channel) => (
          <Nav.Item key={channel.id}>
            {channel.removable
              ? (
                <Dropdown as={ButtonGroup} className='w-100'>
                <Button
                  type='button'
                  variant={channel.id === currentChannelId ? 'secondary' : ''}
                  className='w-100 text-start rounded-0 text-truncate'
                  onClick={() => handleChoseChannel(channel.id)}
                >
                  <span className='me-1'>#</span>
                  {channel.name}
                </Button>
          
                <Dropdown.Toggle split variant={channel.id === currentChannelId ? 'secondary' : ''}>
                  <span className="visually-hidden">{t('channels.control')}</span>
                </Dropdown.Toggle>
          
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleRemoveChannel(channel.id)}>{t('channels.remove')}</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleRenameChannel(channel.id)}>{t('channels.rename')}</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              )
              : (
                <Button
                  type='button'
                  variant={channel.id === currentChannelId ? 'secondary' : ''}
                  className='w-100 text-start rounded-0'
                  onClick={() => handleChoseChannel(channel.id)}
                >
                  <span className='me-1'>#</span>
                  {channel.name}
                </Button>
              )}
          </Nav.Item>
        ))}
      </Nav>
    </>
  );
};

export default Channels;
