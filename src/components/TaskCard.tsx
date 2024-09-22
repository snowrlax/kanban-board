import { useState } from "react";
import { Id, Task } from "../types";
import DeleteIcon from "../icons/DeleteIcon";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: props) => {
  const [mouseOver, setMouseOver] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-12 relative items-center bg-mainBackgroundColor/80 rounded-md w-full p-2 border border-red-400 opacity-50"
      ></div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="max-h-12 relative flex items-center bg-mainBackgroundColor/80 rounded-md w-full p-2 border border-red-400"
      >
        <input
          type="text"
          className="bg-columnBackgroundColor rounded-md w-[80%] text-white border-rounded outline-none px-2 overflow-x-hidden overflow-y-auto whitespace-pre-wrap"
          value={task.content}
          autoFocus
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              toggleEditMode();
            }
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
        />
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={() => {
        setMouseOver(true);
      }}
      onMouseLeave={() => {
        setMouseOver(false);
      }}
      onDoubleClick={toggleEditMode}
      className="max-h-12 relative flex items-center bg-mainBackgroundColor/80 rounded-md w-full p-2 hover:border border-red-400"
    >
      {!editMode && task.content}
      {editMode && (
        <input
          type="text"
          className="bg-columnBackgroundColor rounded-md w-[80%] text-white border-rounded outline-none px-2 overflow-x-hidden overflow-y-auto"
          value={task.content}
          autoFocus
          onBlur={() => setEditMode(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditMode(false);
            }
          }}
        />
      )}
      {mouseOver && (
        <button
          onClick={() => {
            deleteTask(task.id);
          }}
          className="absolute stroke-white right-4 opacity-60 hover:opacity-100"
        >
          <DeleteIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
