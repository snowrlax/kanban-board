import { useMemo, useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // sensors are active unless you drag the item 3px
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div className="flex flex-col m-auto min-h-screen w-full items-center overflow-x-auto overflow-y-hidden px-12 py-7">
      <div className="flex items-center justify-center gap-2">
        <a
          href="#"
          className="italic font-extrabold text-3xl text-gray-500 hover:text-rose-400"
        >
          #
        </a>
        <h1 className="text-3xl italic font-extrabold underline underline-offset-4 text-rose-100">
          Kanban Board.
        </h1>
      </div>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  createTask={createTask}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  tasks={tasks.filter((task) => task.columnId === col.id)}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => {
              createNewColumn();
            }}
            className="h-fit w-72 max-w-72 cursor-pointer rounded-lg bg-mainBackgroundColor p-4 outline-rose-400 outline-offset-2 hover:outline-dashed hover:outline-2 text-center flex gap-2 justify-center"
          >
            <PlusIcon />
            Add Task
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                createTask={createTask}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createNewColumn() {
    const newColumn: Column = {
      id: gemerateId(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  }

  function gemerateId() {
    return Math.floor(Math.random() * 10001);
  }

  function deleteColumn(id: Id) {
    setColumns(columns.filter((col) => col.id !== id));
    const newTasks = tasks.filter((t) => t.columnId != id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) {
        return col;
      }

      return { ...col, title };
    });

    setColumns(newColumns);
  }

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: gemerateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) {
        return task;
      }

      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function onDragOver(event: DragOverEvent) {
    console.log("drag over", event);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // i'm dropping a task over another task
    const isActiveTask = active.data.current?.type == "Task";
    const isOverTask = over.data.current?.type == "Task";

    // only invoke onDragOver when task is dragged
    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      // swap the tasks
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);
        const overTaskIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeTaskIndex].columnId = tasks[overTaskIndex].columnId;

        return arrayMove(tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === "Column";

    // i'm dropping a task over a column
    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeTaskIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeTaskIndex].columnId = overId;

        return arrayMove(tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  }

  function onDragStart(event: DragStartEvent) {
    console.log("drag start", event);
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    console.log("drag end", event);

    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }
};

export default KanbanBoard;
