// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.10 <0.9.0;

contract Todo {
    event AddTodo(address recipient, uint taskId);
    event DeleteTask(uint taskId, bool isDeleted);
    event UpdateTodo(uint todoId, string text);
    event CompletedTodo(uint todoId, bool isCompleted);

    struct TodoStruct {
        uint id;
        address username;
        string description;
        bool isDeleted;
        bool isCompleted;
    }

    TodoStruct[] private todos;
    mapping(uint256 => address) todoToOwner;

    function addTodo(
        string memory todoText,
        bool idDeleted,
        bool isCompleted
    ) external {
        uint todoId = todos.length;
        todos.push(
            TodoStruct({
                id: todoId,
                username: msg.sender,
                description: todoText,
                isDeleted: idDeleted,
                isCompleted: isCompleted
            })
        );
        todoToOwner[todoId] = msg.sender;
        emit AddTodo(msg.sender, todoId);
    }

    function getTodos() external view returns (TodoStruct[] memory) {
        return todos;
    }

    function deleteTodo(uint todoId, bool isDeleted) external {
        if (todoToOwner[todoId] == msg.sender) {
            todos[todoId].isDeleted = isDeleted;
            emit DeleteTask(todoId, isDeleted);
        }
    }

    function completedTodo(uint todoId, bool isCompleted) external {
        if (todoToOwner[todoId] == msg.sender) {
            todos[todoId].isCompleted = isCompleted;
            emit CompletedTodo(todoId, isCompleted);
        }
    }

    function updateTodo(uint todoId, string calldata text) external {
        if (todoToOwner[todoId] == msg.sender) {
            todos[todoId].description = text;
            emit UpdateTodo(todoId, text);
        }
    }
}
