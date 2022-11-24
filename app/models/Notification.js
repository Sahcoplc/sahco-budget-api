import { EntitySchema } from "typeorm";

const Notification = new EntitySchema({
    name: "Notification",
    tableName: "activities",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        userId: {
            type: "int",
            unique: false,
            nullable: true,
        },
        message: {
            type: "text",
            nullable: true
        },
        isRead: {
            type: "boolean",
            unique: false,
        },
        created_time: {
            createDate: true
        },
        updated_time: {
            updateDate: true,
        }
    },
    // relations: {
    //     user: {
    //         target: "Users",
    //         type: "one-to-many",
    //         joinColumn: true,
    //         cascade: true
    //     },
    // },
    // relationIds: {
    //     userId: {
    //         relationName: 'user'
    //     }
    // }
})

export default Notification;