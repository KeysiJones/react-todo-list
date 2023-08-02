'use client';

import { useEffect, useState } from 'react';

type TodoItemProps = {
  id: number;
  completed: boolean;
  title: string;
  onCheck?: (checked: boolean) => void;
  onDelete?: () => void;
};

export default function Home() {
  const [newTodo, setNewTodo] = useState('');
  const [TodoListItems, setTodoListItems] = useState<TodoItemProps[]>([]);
  const onDeleteTodoItem = (id: number) => {
    const newTodoList = TodoListItems.filter(
      (item) => item.id !== id
    );

    setTodoListItems(newTodoList);
    localStorage.setItem('todoList', JSON.stringify(newTodoList));
  }
  
  const onCheckTodoItem = (checked: boolean, id: number) => {
    const newTodoList = TodoListItems.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          completed: checked,
        };
      }

      return item;
    });

    setTodoListItems(newTodoList);
    localStorage.setItem('todoList', JSON.stringify(newTodoList));
  }

  useEffect(() => {
    const storedTodoList = localStorage.getItem('todoList');
    if (storedTodoList) {
      setTodoListItems(JSON.parse(storedTodoList));
    }
  }, []);

  return (
    <main className='bg-[whitesmoke] min-h-screen py-20 px-2'>
      <div className='flex flex-col justify-between mx-auto border-2 border-gray-300 rounded-lg min-h-[600px] sm:max-w-[450px] max-w-[350px] bg-gray-100'>
        <div className='pb-4 '>
          <h1 className='py-2 text-center text-black border-b-2 border-gray-300'>Lista de tarefas</h1>
          {TodoListItems.map(({ title, completed, id }) => (
            <TodoItem
              key={id}
              id={id}
              completed={completed}
              title={title}
              onCheck={(checked) => onCheckTodoItem(checked, id)}
              onDelete={() => onDeleteTodoItem(id)}
            />
          ))}
        </div>
        <input
          type='text'
          placeholder='Adicione uma tarefa, ex: Lavar a louça'
          className='w-full px-2 py-1 text-gray-700 bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300'
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const newTodoList: TodoItemProps[] = [
                ...TodoListItems,
                {
                  id: TodoListItems.length + 1,
                  title: (e.target as HTMLInputElement).value,
                  completed: false,
                },
              ];

              setTodoListItems(newTodoList);
              localStorage.setItem('todoList', JSON.stringify(newTodoList));
              setNewTodo('');
            }
          }}
        />
      </div>
    </main>
  );
}

const TodoItem = ({ completed, title, onCheck, onDelete }: TodoItemProps) => {
  const [checked, setChecked] = useState(completed);

  return (
    <div className='mx-4 mt-2'>
      <label className='flex justify-between text-gray-600'>
        <div>
          <input
            type='checkbox'
            checked={checked}
            onChange={(event) => {
              setChecked(event.target.checked);
              onCheck && onCheck(event?.target?.checked);
            }}
          />
          <span className={`ml-2 ${checked ? 'line-through' : ''}`}>
            {title}
          </span>
        </div>
        <button onClick={() => onDelete && onDelete()}>🗑</button>
      </label>
    </div>
  );
};
