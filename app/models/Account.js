import { EntitySchema } from "typeorm";

const Account = new EntitySchema({
    name: "Account", // Will use table name `category` as default behaviour.
    tableName: "account", // Optional: Provide `tableName` property to override the default behaviour for table name.
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true,
        },
        account_category: {
            type: "varchar",
        },
        account_type: {
            type: "varchar",
            nullable: true
        },
        start_date: {
            type: "datetime",
            nullable: true
        },
        end_date: {
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

export default Account;