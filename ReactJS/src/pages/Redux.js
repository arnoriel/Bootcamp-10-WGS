import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, reset } from '../store';

const ReduxPage = () => {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Redux Click Counter</h1>
      <p>You clicked me {count} times</p>
      <button onClick={() => dispatch(increment())} style={{ marginRight: '10px' }}>
        Increase
      </button>
      <button onClick={() => dispatch(decrement())} style={{ marginRight: '10px' }}>
        Decrease
      </button>
      <button onClick={() => dispatch(reset())}>
        Reset
      </button>
    </div>
  );
};

export default ReduxPage;
