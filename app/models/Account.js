import { model, Schema } from "mongoose";
import paginator from "mongoose-paginate-v2";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const schema = new Schema(
    {
        accountCategory: { type: String, required: true },
        accountType: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        operator: { id: String, name: String },
    },
    { timestamps: true }
)

schema.plugin(paginator);
schema.plugin(mongooseAggregatePaginate);
export default model("Account", schema);