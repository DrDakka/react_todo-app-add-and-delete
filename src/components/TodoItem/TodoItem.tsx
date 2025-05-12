/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useState } from 'react';
import { EditableField, Todo } from '../../types/Todo';

type Props = {
  todo: Todo;
  loading: boolean;
  del: (id: number) => Promise<void>;
  patch: (data: EditableField, id: number) => Promise<void>;
};

export const TodoItem: React.FC<Props> = ({ todo, loading, del, patch }) => {
  const { id, title, completed } = todo;
  const [editFlag, setEditFlag] = useState<boolean>(false);
  const [query, setQuery] = useState('');

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    del(id);
  };

  const handleCheckbox = async () => {
    await patch({ completed: !completed }, id);
  };

  const handleSubmit = async () => {
    if (query === '') {
      del(id);

      return;
    }

    const validate = title === query;

    if (validate) {
      setEditFlag(false);

      return;
    }

    await patch({ title: query }, id);
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setEditFlag(false);
      setQuery('');
    }
  };

  return (
    <div data-cy="Todo" className={`todo${completed ? ' completed' : ''}`}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onClick={handleCheckbox}
        />
      </label>

      {editFlag === false ? (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => {
              setQuery(title);
              setEditFlag(true);
            }}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handleDelete}
          >
            ×
          </button>
        </>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={query}
            onChange={event => setQuery(event?.target.value)}
            onKeyUp={onKeyUp}
            onBlur={() => {
              handleSubmit();
              setEditFlag(false);
              setQuery('');
            }}
            autoFocus
          />
        </form>
      )}
      <div
        data-cy="TodoLoader"
        className={`modal overlay${loading ? ' is-active' : ''}`}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
