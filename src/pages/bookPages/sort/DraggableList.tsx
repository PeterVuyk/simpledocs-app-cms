import React from 'react';
import {
  DragDropContext,
  Droppable,
  OnDragEndResponder,
} from 'react-beautiful-dnd';
import DraggableListItem from './DraggableListItem';
import { Page } from '../../../model/Page';

export type DraggableListProps = {
  submitting: boolean;
  pages: Page[];
  onDragEnd: OnDragEndResponder;
};

const DraggableList = React.memo(
  ({ pages, submitting, onDragEnd }: DraggableListProps) => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable isDropDisabled={submitting} droppableId="droppable-list">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {pages.map((page, index) => (
                <DraggableListItem
                  submitting={submitting}
                  page={page}
                  index={index}
                  key={page.id}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
);

export default DraggableList;
