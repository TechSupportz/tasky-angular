class SubTask {
    constructor(id, creatorId, name, dueDate, priority, isCompleted) {
        this.id = id
        this.creatorId = creatorId
        this.name = name
        this.dueDate = dueDate
        this.priority = priority
        this.isCompleted = isCompleted
    }
}

module.exports = SubTask;
