import { useSortable } from "@dnd-kit/sortable";
import DeleteIcon from "../icons/DeleteIcon";
import { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";

interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
}

const ColumnContainer = (props: Props) => {
  const { column, deleteColumn } = props;

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
          {column.title}
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
      <div className="flex flex-grow">Content</div>

      {/* footer of the container */}
      <div className="">Footer</div>
    </div>
  );
};

export default ColumnContainer;
