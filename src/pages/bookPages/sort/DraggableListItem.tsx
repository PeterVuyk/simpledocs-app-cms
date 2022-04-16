import React, { FC } from 'react';
import { ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { Page } from '../../../model/Page';
import ChapterDivisions, {
  ChapterDivision,
} from '../../../model/books/ChapterDivisions';
import {
  CONTENT_TYPE_CALCULATIONS,
  CONTENT_TYPE_DECISION_TREE,
  CONTENT_TYPE_HTML,
  CONTENT_TYPE_MARKDOWN,
  ContentType,
} from '../../../model/ContentType';

interface Props {
  page: Page;
  index: number;
  submitting: boolean;
}

const DraggableListItem: FC<Props> = ({ submitting, page, index }) => {
  const getContentTypeText = (contentType: ContentType) => {
    switch (contentType) {
      case CONTENT_TYPE_DECISION_TREE:
        return 'beslisboom';
      case CONTENT_TYPE_CALCULATIONS:
        return 'berekening';
      case CONTENT_TYPE_HTML:
        return 'html';
      case CONTENT_TYPE_MARKDOWN:
        return 'markdown';
      default:
        return 'onbekend';
    }
  };

  return (
    <Draggable
      key={`${page.title.toString()} + ${page.markedForDeletion?.toString()}`}
      isDragDisabled={submitting}
      draggableId={`${page.title.toString()} + ${page.markedForDeletion?.toString()}`}
      index={index}
    >
      {(provided, snapshot) => (
        <ListItem
          divider
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={[snapshot.isDragging && { background: '#ddd' }]}
        >
          <ListItemAvatar>
            <DragHandleIcon />
          </ListItemAvatar>
          <ListItemAvatar>
            <img
              style={{ width: 45 }}
              src={`${page.iconFile}`}
              alt={page.chapter}
            />
          </ListItemAvatar>
          <ListItemText
            primary={`${page.chapter}: ${page.title}`}
            secondary={`${
              ChapterDivisions[page.chapterDivision as ChapterDivision]
            } (${getContentTypeText(page.contentType)})`}
          />
        </ListItem>
      )}
    </Draggable>
  );
};

export default DraggableListItem;
