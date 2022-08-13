class Task {
    constructor(
        id,
        categoryId,
        creatorId,
        name,
        dueDate,
        priority,
        isCompleted,
        subTask,
    ) {
        this.id = id
        this.categoryId = categoryId
        this.creatorId = creatorId
        this.name = name
        this.dueDate = dueDate
        this.priority = priority
        this.isCompleted = isCompleted
        this.subTask = subTask
    }
}

module.exports = Task;


