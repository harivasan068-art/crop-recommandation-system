import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Badge from '../ui/Badge';
import { Calendar, Folder } from 'lucide-react';
import { formatDate, getStatusVariant } from '../../utils/helpers';

const COLUMNS = [
  { id: 'Pending', title: 'Pending', color: 'warning' },
  { id: 'In Progress', title: 'In Progress', color: 'primary' },
  { id: 'Completed', title: 'Completed', color: 'success' },
];

const KanbanCard = ({ task, isDragging }) => (
  <div className={`kanban-card ${isDragging ? 'dragging' : ''}`}>
    <div className="kanban-card-title">{task.taskName}</div>
    <div className="kanban-card-meta">
      <Badge variant={getStatusVariant(task.priority)}>{task.priority}</Badge>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <Calendar size={12} />
        {formatDate(task.dueDate)}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
        <Folder size={12} />
        {task.project?.projectName || '—'}
      </span>
    </div>
  </div>
);

const SortableTask = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { task, type: 'task' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard task={task} isDragging={isDragging} />
    </div>
  );
};

const DroppableColumn = ({ column, tasks }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', status: column.id },
  });

  return (
    <div
      ref={setNodeRef}
      className="kanban-column"
      style={{ background: isOver ? 'var(--color-primary-light)' : undefined }}
    >
      <div className="kanban-column-header">
        <span className="kanban-column-title">
          <Badge variant={column.color}>{column.title}</Badge>
        </span>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="kanban-cards">
          {tasks.map((task) => (
            <SortableTask key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = ({ tasks, onStatusChange }) => {
  const [activeTask, setActiveTask] = useState(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const getColumnTasks = (status) => tasks.filter((t) => t.status === status);

  const handleDragStart = (event) => {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    let newStatus = task.status;
    if (COLUMNS.some((c) => c.id === over.id)) {
      newStatus = over.id;
    } else {
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus !== task.status) {
      onStatusChange(taskId, newStatus);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="kanban-board">
        {COLUMNS.map((column) => (
          <DroppableColumn
            key={column.id}
            column={column}
            tasks={getColumnTasks(column.id)}
          />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
