import React from 'react';
import { render, fireEvent, screen} from '@testing-library/react';
import Todo from '../Todos/Todo';

describe('Todo Component', () => {
  const todo = {
    text: 'Sample Todo',
    done: false,
  };

  it('renders todo correctly', () => {
    const { getByText } = render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}} />);
    
    const todoTextElement = screen.getByText(/Sample Todo/i);
    expect(todoTextElement).toBeInTheDocument();

    const notDoneInfoElement = screen.getByText(/This todo is not done/i);
    expect(notDoneInfoElement).toBeInTheDocument();
  });

  it('calls deleteTodo function when delete button is clicked', () => {
    const deleteTodoMock = jest.fn();
    const { getByText } = render(<Todo todo={todo} deleteTodo={deleteTodoMock} completeTodo={() => {}} />);
    
    const deleteButton = screen.getByText(/Delete/i);
    fireEvent.click(deleteButton);

    expect(deleteTodoMock).toHaveBeenCalledWith(todo);
  });

  it('calls completeTodo function when set as done button is clicked', () => {
    const completeTodoMock = jest.fn();
    const { getByText } = render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={completeTodoMock} />);
    
    const setAsDoneButton = screen.getByText(/Set as done/i);
    fireEvent.click(setAsDoneButton);

    expect(completeTodoMock).toHaveBeenCalledWith(todo);
  });

  it('renders done info when todo is marked as done', () => {
    const doneTodo = {
      text: 'Done Todo',
      done: true,
    };

    const { getByText } = render(<Todo todo={doneTodo} deleteTodo={() => {}} completeTodo={() => {}} />);
    
    const doneInfoElement = screen.getByText(/This todo is done/i);
    expect(doneInfoElement).toBeInTheDocument();
  });
});