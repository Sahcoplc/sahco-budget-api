import { EntitySchema } from "typeorm";

const Budget = new EntitySchema({
    name: "Budgets",
    tableName: "budgets",
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        creatorId: {
            type: "int",
            unique: false,
            nullable: true,
        },
        accountId: {
            type: "int",
            unique: false,
            nullable: true
        },
        account_type: {
            type: "varchar",
            nullable: true
        },
        department: {
            type: "varchar",
        },
        year: {
            type: "int",
        },
        january: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        february: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        march: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        april: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        may: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        june: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        july: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        august: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        sept: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        october: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        nov: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        december: {
            type: "decimal",
            precision: 13,
            scale: 2
        },
        estimated_budget: {
            type: "decimal",
            precision: 15,
            scale: 2
        },
        actual_budget: {
            type: "decimal",
            precision: 15,
            scale: 2
        },
        status: {
            type: "varchar"
        },
        approved_by: {
            type: "varchar",
            nullable: true
        },
        dept_approver: {
            type: "varchar",
            nullable: true
        },
        created_time: {
            createDate: true
        },
        updated_time: {
            updateDate: true,
        }
    },
    relations: {
        user: {
            target: "Users",
            type: "one-to-many",
            joinColumn: true,
            cascade: true
        },
        account: {
            target: "Account",
            type: "many-to-one",
            joinColumn: true,
            cascade: true
        }
    }
})

export default Budget;