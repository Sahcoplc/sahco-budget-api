import { EntitySchema } from "typeorm";

const User = new EntitySchema({
    name: "Users",
    tableName: "users",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        username: {
            type: "varchar",
            unique: true,
            nullable: true,
        },
        staff_name: {
            type: "varchar",
            nullable: false,
        },
        staff_email: {
            type: "varchar",
            length: 200,
            unique: true,
        },
        staff_id: {
            type: "varchar",
            unique: true,
        },
        gender: {
            type: "enum",
            enumName: '',
            enum: ['MALE', 'FEMALE'] 
        },
        department: {
            type: "varchar",
        },
        pass_word: {
            type: "text",
        },
        avatar: {
            type: "text",
            nullable: true
        },
        role: {
            type: "enum",
            enumName: 'USER',
            enum: ['USER', 'ADMIN'] 
        },
        otp: {
            type: "int",
            nullable: true
        },
        otpExpiresIn: {
            type: "datetime",
            nullable: true
        },
        last_loginAt: {
            type: "datetime",
            nullable: true
        },
        created_time: {
            createDate: true
        },
        updated_time: {
            updateDate: true,
        }
    }
})

export default User;