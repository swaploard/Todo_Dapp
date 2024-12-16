const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Todo Contract", function () {
  let TaskContract;
  let taskContract;
  let owner;

  const NUM_TOTAL_TASKS = 5;
  let totalTasks;

  beforeEach(async function () {
    TaskContract = await ethers.getContractFactory("Todo");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();
    totalTasks = [];
    console.log("owner", owner);
    for (let i = 0; i < NUM_TOTAL_TASKS; i++) {
      let task = {
        taskText: "Task number: " + i,
        isDeleted: false,
        isCompleted: false,
      };
      await taskContract.addTodo(
        task.taskText,
        task.isDeleted,
        task.isCompleted
      );
      totalTasks.push(task);
    }
  });

  describe("Add Task", function () {
    it("should emit AddTask event", async function () {
      let task = {
        taskText: "New Task",
        isDeleted: false,
        isCompleted: false,
      };
      console.log("address", owner.address, NUM_TOTAL_TASKS);
      await expect(
        taskContract.addTodo(task.taskText, task.isDeleted, task.isCompleted)
      )
        .to.emit(taskContract, "AddTodo")
        .withArgs(owner.address, NUM_TOTAL_TASKS);
    });
  });

  describe("Get All Tasks", function () {
    it("should return the correct number of total tasks", async function () {
      const tasksFromChain = await taskContract.getTodos();
      expect(tasksFromChain.length).to.equal(NUM_TOTAL_TASKS);
    });
  });

  describe("Delete Task", function () {
    it("should emit delete task event", async function () {
      const TASK_ID = 0;
      const TASK_DELETED = true;

      await expect(taskContract.deleteTodo(TASK_ID, TASK_DELETED))
        .to.emit(taskContract, "DeleteTask")
        .withArgs(TASK_ID, TASK_DELETED);
    });
  });

  describe("Update Todo", function () {
    it("should emit update Todo event", async function () {
      const TASK_ID = 0;
      const TASK_TEXT = "Updated Todo";

      await expect(taskContract.updateTodo(TASK_ID, TASK_TEXT))
        .to.emit(taskContract, "UpdateTodo")
        .withArgs(TASK_ID, TASK_TEXT);
    });
  });

  describe("Complete Todo", function () {
    it("should emit complete Todo event", async function () {
      const TASK_ID = 0;
      const TASK_COMPLETED = true;

      await expect(taskContract.completedTodo(TASK_ID, TASK_COMPLETED))
        .to.emit(taskContract, "CompletedTodo")
        .withArgs(TASK_ID, TASK_COMPLETED);
    });
  });
});
