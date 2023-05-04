import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import useAuth from 'hooks';
import React, { useEffect } from 'react';
import { Button, Col, Container, Form, InputGroup, Nav, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import routes from 'routes';
import { setInitialState } from 'slices/channelsSlice';

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
  const { channels, currentChannelId } = useSelector((state) => state.channels);
  const channel = useSelector(getCurrentChannel);
  const messages = useSelector(getMessages);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const requestData = async () => {
      try {
        const { data } = await axios.get(routes.dataPath(), {headers: auth.getAuthHeader()});
        dispatch(setInitialState(data));
      } catch (error) {
        if (error.response.status === 401) {
          auth.logOut();
          navigate('/login');
        }
        console.log(error);
      }
    };

    requestData();
  }, [dispatch, auth, navigate]);

  return (
    <Container className='h-100 my-4 overflow-hidden rounded shadow'>
      <Row className='h-100 bg-white flex-md-row'>
        <Col  xs={4} md={2} className='border-end px-0 bg-light flex-column h-100 d-flex'>
          <div className='d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4'>
            <b>Каналы</b>
          </div>
          <Nav variant='pills' className='flex-column px-2 mb-3 overflow-auto h-100 d-block'>
            {channels.map((channel) => (
              <Nav.Item key={channel.id}>
                <Button
                  type='button'
                  variant={channel.id === currentChannelId ? 'secondary' :''}
                  className='w-100 text-start rounded-0'
                >
                  <span className='me-1'>#</span>
                  {channel.name}
                </Button>
              </Nav.Item>
            ))}
          </Nav>
        </Col>

        <Col className='p-0 h-100 d-flex flex-column'>
          <div className='bg-light mb-4 p-3 shadow-sm small'>
            <p className='m-0'><b># {channel?.name}</b></p>
            <span className='text-muted'>{messages.length} сообщений</span>
          </div>
          <div className='overflow-auto px-5'>
          </div>
          <div className='mt-auto px-5 py-3'>
            <Form className='py-1 border rounded-2'>
              <InputGroup>
                <Form.Control className='border-0'>

                </Form.Control>
                <Button type='submit' variant=''>
                  <FontAwesomeIcon size='xl' icon={faPaperPlane} style={{color: '#1368fb'}}></FontAwesomeIcon>
                </Button>
              </InputGroup>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatPage;
