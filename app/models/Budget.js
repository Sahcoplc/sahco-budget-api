import connectDb from "../db/connect.js";

class Budget {
    constructor(budget){
        this.account_type = budget.account_type;
        this.account_category = budget.account_category;
        this.january = budget.january;
        this.february = budget.february;
        this.march = budget.march;
    }
}