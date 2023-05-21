import axios from 'axios';
import { useAuth } from 'hooks';
import React, { useEffect, useRef } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import routes from 'routes';
import { toast } from 'react-toastify';
import { setInitialState } from 'slices/channelsSlice';
import NewMessage from './NewMessage.jsx';
import Channels from './Channels.jsx';
import Modal from './modals/Modal.jsx';
import { useRollbar } from '@rollbar/react';

const getCurrentChannel = (state) => {
  const { channels, currentChannelId } = state.channels;
  return channels.find((channel) => channel.id === currentChannelId);
};

const getMessages = (state) => {
  const { currentChannelId } = state.channels;
  const { messages } = state.messages;
  const channelMessages = messages.filter((message) => message.channelId === currentChannelId);

  return channelMessages;
};

const ChatPage = () => {
  const auth = useAuth();
  const channel = useSelector(getCurrentChannel);
  const messages = useSelector(getMessages);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const messagesEl = useRef(null);
  const { t } = useTranslation();
  const rollbar = useRollbar();

  useEffect(() => {
    const requestData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), { headers: auth.getAuthHeader() });
        dispatch(setInitialState(data));
      } catch (error) {
        rollbar.error(error);
        if (!error.isAxiosError) {
          toast.error(t('errors.unknown'));
          return;
        }
        if (error.response.status === 401) {
          auth.logOut();
          navigate('/login');
        } else {
          toast.error(t('errors.network'));
        }
      }
    };

    requestData();
  }, [dispatch, auth, navigate, t, rollbar]);

  useEffect(() => {
    const lastItem = messagesEl.current.lastElementChild;
    lastItem?.scrollIntoView();
  }, [messages.length]);

  return (
    <Container className='h-100 my-4 overflow-hidden rounded shadow'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col xs={4} md={2} className='border-end px-0 bg-light flex-column h-100 d-flex'>
          <Channels />
        </Col>

        <Col xs={8} md={10} className='p-0 h-100 d-flex flex-column'>
          <div className='bg-light mb-4 p-3 shadow-sm small'>
            <p className='m-0 text-truncate'><b># {channel?.name}</b></p>
            <span className='text-muted'>{messages.length} {t('chatPage.messagesCount', { count: messages.length })}</span>
          </div>
          <div ref={messagesEl} className='overflow-auto px-5'>
            {messages.map(({ id, username, body }) => (
              <div key={id} className='text-break'>
                <b>{username}</b>: {body}
              </div>
            ))}
          </div>
          <div className='mt-auto px-3 py-3'>
            <NewMessage channel={channel} />
          </div>
        </Col>
        <Modal />
      </Row>
    </Container>
  );
};

export default ChatPage;
