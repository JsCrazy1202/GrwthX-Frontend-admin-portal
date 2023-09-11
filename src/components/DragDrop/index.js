import React, { useState } from 'react';
import styled from 'styled-components';
// import { columnsFromBackend } from './KanbanData';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
// import TaskCard from './TaskCard';
import { useEffect } from 'react';
import { makeId } from 'utils/helpers';
import UserCard from './UserCard';

const Container = styled.div`
    display: grid;
    grid-template-columns: 30% 69%;
    width: 100%;
    height: 100%;
    padding: 10px 15px;
    column-gap: 10px;
`;

const UserListContainer = styled.div`
    height: 450px;
    border-radius: 5px;
    box-shadow: inset 0 0 10px #d9d9d9;
    padding: 15px;
    overflow-y: auto;
`;

const TaskList = styled.div`
    min-height: 100px;
    display: flex;
    flex-direction: column;
    width: 31.8%;
    border-radius: 5px;
    padding: 15px 15px;
    background: #d9d9d9;
`;

const TaskColumnStyles = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 2%;
    padding: 15px;
    border-radius: 5px;
    box-shadow: inset 0 0 10px #d9d9d9;
    height: 450px;
    overflow-y: auto;
`;

const Title = styled.span`
    background: white;
    padding: 4px 10px;
    border-radius: 5px;
    align-self: flex-start;
    font-family: Livvic;
    width: 100%;
    text-align: center;
`;

const DragDrop = ({ students, groupCount, onDropChange }) => {
    const [columns, setColumns] = useState([]);
    useEffect(() => {
        const users = students.map((item)=>{
            return {...item, id: makeId(5)}
        })
        let groups = {
            [makeId(10)]: {
                title: `User`,
                items: [
                    ...users
                ]
            }
        };
        for (let i = 0; i < parseInt(groupCount); i++) {
            groups = {
                ...groups,
                [makeId(10)]: {
                    title: `Group-${i + 1}`,
                    items: []
                }
            };
        }
        setColumns(groups);
    }, [groupCount, students]);

    const onDragEnd = (result, columns, setColumns) => {
        if (!result.destination) return;
        const { source, destination } = result;
        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
            onDropChange({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            })
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
            onDropChange({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            })
        }
    };
    
    return (
        <DragDropContext onDragEnd={(result) => onDragEnd(result, columns, setColumns)}>
            <Container>
                {Object.entries(columns).map(([columnId, column], index) => {
                    if (column.title === 'User')
                        return (
                            <Droppable key={columnId} droppableId={columnId}>                                
                                {(provided, snapshot) => (
                                    <UserListContainer ref={provided.innerRef} {...provided.droppableProps}>
                                        <Title>{"All Students"}</Title>
                                        {column.items.map((item, index) => (
                                            <UserCard key={index} item={item} index={index} />
                                        ))}
                                    </UserListContainer>
                                )}
                            </Droppable>
                        );
                })}

                <TaskColumnStyles>
                    {Object.entries(columns).map(([columnId, column], index) => {
                        if (column.title !== 'User')
                            return (
                                <Droppable key={columnId} droppableId={columnId} >
                                    {(provided, snapshot) => (
                                        <TaskList ref={provided.innerRef} {...provided.droppableProps}>
                                            <Title>{column.title}</Title>
                                            {column.items.map((item, index) => (
                                                <UserCard key={index} item={item} index={index} />
                                            ))}
                                            {provided.placeholder}
                                        </TaskList>
                                    )}
                                </Droppable>
                            );
                    })}
                </TaskColumnStyles>
            </Container>
        </DragDropContext>
    );
};

export default DragDrop;
