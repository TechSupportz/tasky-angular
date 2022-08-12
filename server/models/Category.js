class Category {
    constructor(id, creatorId, name, type, members) {
        this.id = id
        this.creatorId = creatorId
        this.name = name
        this.type = type
        this.members = members
    }
}

// class CategoryMember {
//     constructor(username, userId) {
//         this.username = username
//         this.userId = userId
//     }
// }

module.exports = Category
