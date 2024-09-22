import { SortableContext, useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id, Task } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TaskCard from "./TaskCard";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
  tasks: Task[];
}

const ColumnContainer = (props: Props) => {
  const {
    column,
    deleteColumn,
    updateColumn,
    createTask,
    tasks,
    deleteTask,
    updateTask,
  } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColor/50 outline-rose-500 outline-2 offset-2 outline-dashed w-72 h-96 max-h-96 rounded-md flex flex-col"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-columnBackgroundColor w-72 h-96 max-h-96 rounded-md flex flex-col"
    >
      {/* title of the container */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md cursor-grab rounded-md rounded-b-none p-3 font-bold border-columnBackgroundColor border-4 flex items-center justify-between"
      >
        <div className="flex gap-3">
          <div
            className="
            bg-columnBackgroundColor
            flex
            justify-center
            items-center
            w-6
            rounded-full
            text-sm
        "
          >
            0
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              type="text"
              className="bg-columnBackgroundColor rounded-md w-[80%] text-white border-rounded outline-none px-2"
              value={column.title}
              onChange={(e) => {
                updateColumn(column.id, e.target.value);
              }}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setEditMode(false);
                }
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="stroke-gray-400 hover:stroke-rose-500 rounded px-1 py-2"
        >
          <DeleteIcon />
        </button>
      </div>

      {/* column task container  */}
      <div className="flex flex-col gap-2 pt-1 flex-grow px-1">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>

      {/* footer of the container */}
      <div className="flex justify-center items-center py-2">
        <button
          onClick={() => {
            createTask(column.id);
          }}
          className="flex justify-center gap-2 items-center bg-mainBackgroundColor text-white hover:bg-columnBackgroundColor outline-rose-400 hover:outline-dashed offset-2 rounded-full h-full w-[95%] p-2"
        >
          <PlusIcon /> Add Task
        </button>
      </div>
    </div>
  );
};

export default ColumnContainer;
